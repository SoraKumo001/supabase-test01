create or replace function graphql.text_to_comparison_op(text)
    returns graphql.comparison_op
    language sql
    immutable
    as
$$
    select
        case $1
            when 'eq' then '='
            when 'lt' then '<'
            when 'lte' then '<='
            when 'neq' then '<>'
            when 'gte' then '>='
            when 'gt' then '>'
            when 'like' then 'like'
            when 'in' then 'in'
            else graphql.exception('Invalid comaprison operator')
        end::graphql.comparison_op
$$;


insert into graphql._field(parent_type_id, type_id, constant_name, is_not_null, is_array, description)
    select
        gt.id as parent_type_id,
        gt.graphql_type_id type_id,
        ops.constant_name as constant_name,
        false,
        false,
        null::text as description
    from
        graphql.type gt -- IntFilter
        join (
            values
                ('like')
        ) ops(constant_name)
            on true
    where
        gt.meta_kind = 'FilterType'
        and gt.graphql_type_id = graphql.type_id('String');

insert into graphql._field(parent_type_id, type_id, constant_name, is_not_null, is_array, description)
    select
        gt.id as parent_type_id,
        gt.graphql_type_id type_id,
        ops.constant_name as constant_name,
        true,
        true,
        null::text as description
    from
        graphql.type gt -- IntFilter
        join (
            values
                ('in')
        ) ops(constant_name)
            on true
    where
        gt.meta_kind = 'FilterType';

alter type graphql.comparison_op add value 'like';
alter type graphql.comparison_op add value 'in';



create or replace function graphql.where_clause(
    filter_arg jsonb,
    entity regclass,
    alias_name text,
    variables jsonb default '{}',
    variable_definitions jsonb default '{}'
)
    returns text
    language plpgsql
    immutable
    as
$$
declare
    clause_arr text[] = '{}';
    variable_name text;
    variable_ix int;
    variable_value jsonb;
    variable_part jsonb;

    sel jsonb;
    ix smallint;

    field_name text;
    column_name text;
    column_type regtype;

    field_value_obj jsonb;
    op_name text;
    field_value text;

    format_str text;

    -- Collect allowed comparison columns
    column_fields graphql.field[] = array_agg(f)
        from
            graphql.type t
            left join graphql.field f
                on t.name = f.parent_type
        where
            t.entity = $2
            and t.meta_kind = 'Node'
            and f.column_name is not null;
begin


    -- No filter specified
    if filter_arg is null then
        return 'true';


    elsif (filter_arg -> 'value' ->> 'kind') not in ('ObjectValue', 'Variable') then
        return graphql.exception('Invalid filter argument');

    -- Disallow variable order by clause because it is incompatible with prepared statements
    elsif (filter_arg -> 'value' ->> 'kind') = 'Variable' then
        -- Variable is <Table>Filter
        -- "{"id": {"eq": 1}, ...}"

        variable_name = graphql.name_literal(filter_arg -> 'value');

        variable_ix = graphql.arg_index(
            -- name of argument
            variable_name,
            variable_definitions
        );
        field_value = format('$%s', variable_ix);

        -- "{"id": {"eq": 1}}"
        variable_value = variables -> variable_name;

        if jsonb_typeof(variable_value) <> 'object' then
            return graphql.exception('Invalid filter argument');
        end if;

        for field_name, column_name, column_type, variable_part in
            select
                f.name,
                f.column_name,
                f.column_type,
                je.v -- {"eq": 1}
            from
                jsonb_each(variable_value) je(k, v)
                left join unnest(column_fields) f
                    on je.k = f.name
            loop

            -- Sanity checks
            if column_name is null or jsonb_typeof(variable_part) <> 'object' then
                -- Attempting to filter on field that does not exist
                return graphql.exception('Invalid filter field');
            end if;

            op_name = k from jsonb_object_keys(variable_part) x(k) limit 1;

            clause_arr = clause_arr || format(
                '%I.%I %s (%s::jsonb -> '
                    || format('%L ->> %L', field_name, op_name)
                    || ')::%s',
                alias_name,
                column_name,
                graphql.text_to_comparison_op(op_name),
                field_value,
                column_type
            );

        end loop;



    elsif (filter_arg -> 'value' ->> 'kind') = 'ObjectValue' then

        for sel, ix in
            select
                sel_, ix_
            from
                jsonb_array_elements( filter_arg -> 'value' -> 'fields') with ordinality oba(sel_, ix_)
            loop

            -- Must populate in every loop
            format_str = null;
            field_value = null;
            field_name = graphql.name_literal(sel);

            select
                into column_name, column_type
                f.column_name, f.column_type
            from
                unnest(column_fields) f
            where
                f.name = field_name;

            if column_name is null then
                -- Attempting to filter on field that does not exist
                return graphql.exception('Invalid filter field');
            end if;


            if graphql.is_variable(sel -> 'value') then
                variable_name = (sel -> 'value' -> 'name' ->> 'value');
                variable_ix = graphql.arg_index(
                    -- name of argument
                    variable_name,
                    variable_definitions
                );
                variable_value = variables -> variable_name;


                -- Sanity checks: '{"eq": 3}'
                if jsonb_typeof(variable_value) <> 'object' then
                    return graphql.exception('Invalid filter variable value');

                elsif (select count(1) <> 1 from jsonb_object_keys(variable_value)) then
                    return graphql.exception('Invalid filter variable value');

                end if;

                -- "eq"
                op_name = k from jsonb_object_keys(variable_value) x(k) limit 1;
                field_value = format('$%s', variable_ix);

                select
                    '%I.%I %s (%s::jsonb ->> ' || format('%L', op_name) || ')::%s'
                from
                    jsonb_each(variable_value)
                limit
                    1
                into format_str;

            elsif sel -> 'value' ->> 'kind' <> 'ObjectValue' then
                return graphql.exception('Invalid filter');

            else
                    field_value_obj = sel -> 'value' -> 'fields' -> 0;
                    op_name = graphql.name_literal(field_value_obj);

                    if field_value_obj ->> 'kind' <> 'ObjectField' then
                        return graphql.exception('Invalid filter clause-2');
                    elseif field_value_obj -> 'value' ->> 'kind' = 'ListValue' then
                        format_str = '%I.%I %s %s';
                        field_value_obj = field_value_obj -> 'value' -> 'values';
                        if jsonb_array_length(field_value_obj) = 0 then
                          format_str = '1 = 0';
                        else
                          field_value = (select format('(%s)',string_agg(value::text, ','))
                            from (select jsonb_array_elements(field_value_obj) ->> 'value' as value) as a);  
                        end if;
                    elsif (field_value_obj -> 'value' ->> 'kind') = 'Variable' then
                        variable_name = (field_value_obj -> 'value' -> 'name' ->> 'value');
                        if jsonb_typeof(variables -> variable_name) = 'array' then
                          format_str = '%I.%I %s %s';
                          if jsonb_array_length(variables -> variable_name) = 0 then
                            format_str = '1 = 0';
                          else
                            field_value = (select format('(%s)',string_agg(value::text, ','))
                              from (select jsonb_array_elements(variables -> variable_name) as value) as a);
                          end if;                          
                        else
                          format_str = '%I.%I %s %s::%s';
                          field_value = format(
                              '$%s',
                              graphql.arg_index(
                                  -- name of argument
                                  (field_value_obj -> 'value' -> 'name' ->> 'value'),
                                  variable_definitions
                              )
                          );
                        end if;
                    else
                        format_str = '%I.%I %s %L::%s';
                        field_value = graphql.value_literal(field_value_obj);

                    end if;

            end if;

            clause_arr = clause_arr || format(
                format_str,
                alias_name,
                column_name,
                graphql.text_to_comparison_op(op_name),
                field_value,
                column_type
            );

        end loop;
    end if;

    return array_to_string(clause_arr, ' and ');
end;
$$;
