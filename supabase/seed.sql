drop extension if exists pg_graphql;
create extension if not exists pg_graphql;
select graphql.rebuild_schema();