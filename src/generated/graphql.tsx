import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: any;
  Cursor: any;
  Date: any;
  Datetime: any;
  JSON: any;
  Time: any;
  UUID: any;
};

/** Boolean expression comparing fields on type "BigInt" */
export type BigIntFilter = {
  eq?: InputMaybe<Scalars['BigInt']>;
  gt?: InputMaybe<Scalars['BigInt']>;
  gte?: InputMaybe<Scalars['BigInt']>;
  lt?: InputMaybe<Scalars['BigInt']>;
  lte?: InputMaybe<Scalars['BigInt']>;
  neq?: InputMaybe<Scalars['BigInt']>;
};

/** Boolean expression comparing fields on type "Boolean" */
export type BooleanFilter = {
  eq?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['Boolean']>;
  gte?: InputMaybe<Scalars['Boolean']>;
  lt?: InputMaybe<Scalars['Boolean']>;
  lte?: InputMaybe<Scalars['Boolean']>;
  neq?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression comparing fields on type "Date" */
export type DateFilter = {
  eq?: InputMaybe<Scalars['Date']>;
  gt?: InputMaybe<Scalars['Date']>;
  gte?: InputMaybe<Scalars['Date']>;
  lt?: InputMaybe<Scalars['Date']>;
  lte?: InputMaybe<Scalars['Date']>;
  neq?: InputMaybe<Scalars['Date']>;
};

/** Boolean expression comparing fields on type "Datetime" */
export type DatetimeFilter = {
  eq?: InputMaybe<Scalars['Datetime']>;
  gt?: InputMaybe<Scalars['Datetime']>;
  gte?: InputMaybe<Scalars['Datetime']>;
  lt?: InputMaybe<Scalars['Datetime']>;
  lte?: InputMaybe<Scalars['Datetime']>;
  neq?: InputMaybe<Scalars['Datetime']>;
};

/** Boolean expression comparing fields on type "Float" */
export type FloatFilter = {
  eq?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  neq?: InputMaybe<Scalars['Float']>;
};

/** Boolean expression comparing fields on type "Int" */
export type IntFilter = {
  eq?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  neq?: InputMaybe<Scalars['Int']>;
};

/** Boolean expression comparing fields on type "JSON" */
export type JsonFilter = {
  eq?: InputMaybe<Scalars['JSON']>;
  neq?: InputMaybe<Scalars['JSON']>;
};

/** The root type for creating and mutating data */
export type Mutation = {
  __typename?: 'Mutation';
  /** Deletes zero or more records from the collection */
  deleteFromTodoCollection: TodoDeleteResponse;
  /** Adds one or more `TodoInsertResponse` records to the collection */
  insertIntoTodoCollection?: Maybe<TodoInsertResponse>;
  /** Updates zero or more records in the collection */
  updateTodoCollection: TodoUpdateResponse;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromTodoCollectionArgs = {
  atMost?: Scalars['Int'];
  filter?: InputMaybe<TodoFilter>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoTodoCollectionArgs = {
  objects: Array<TodoInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationUpdateTodoCollectionArgs = {
  atMost?: Scalars['Int'];
  filter?: InputMaybe<TodoFilter>;
  set: TodoUpdateInput;
};

/** Defines a per-field sorting order */
export enum OrderByDirection {
  AscNullsFirst = 'AscNullsFirst',
  AscNullsLast = 'AscNullsLast',
  DescNullsFirst = 'DescNullsFirst',
  DescNullsLast = 'DescNullsLast'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

/** The root type for querying data */
export type Query = {
  __typename?: 'Query';
  /** A pagable collection of type `Todo` */
  todoCollection?: Maybe<TodoConnection>;
};


/** The root type for querying data */
export type QueryTodoCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  filter?: InputMaybe<TodoFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TodoOrderBy>>;
};

/** Boolean expression comparing fields on type "String" */
export type StringFilter = {
  eq?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  neq?: InputMaybe<Scalars['String']>;
};

/** Boolean expression comparing fields on type "Time" */
export type TimeFilter = {
  eq?: InputMaybe<Scalars['Time']>;
  gt?: InputMaybe<Scalars['Time']>;
  gte?: InputMaybe<Scalars['Time']>;
  lt?: InputMaybe<Scalars['Time']>;
  lte?: InputMaybe<Scalars['Time']>;
  neq?: InputMaybe<Scalars['Time']>;
};

export type Todo = {
  __typename?: 'Todo';
  created_at: Scalars['Datetime'];
  description: Scalars['String'];
  id: Scalars['BigInt'];
  title: Scalars['String'];
};

export type TodoConnection = {
  __typename?: 'TodoConnection';
  edges: Array<TodoEdge>;
  pageInfo: PageInfo;
};

export type TodoDeleteResponse = {
  __typename?: 'TodoDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int'];
  /** Array of records impacted by the mutation */
  records: Array<Todo>;
};

export type TodoEdge = {
  __typename?: 'TodoEdge';
  cursor: Scalars['String'];
  node?: Maybe<Todo>;
};

export type TodoFilter = {
  created_at?: InputMaybe<DatetimeFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<BigIntFilter>;
  title?: InputMaybe<StringFilter>;
};

export type TodoInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']>;
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type TodoInsertResponse = {
  __typename?: 'TodoInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int'];
  /** Array of records impacted by the mutation */
  records: Array<Todo>;
};

export type TodoOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  description?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  title?: InputMaybe<OrderByDirection>;
};

export type TodoUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']>;
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type TodoUpdateResponse = {
  __typename?: 'TodoUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int'];
  /** Array of records impacted by the mutation */
  records: Array<Todo>;
};

/** Boolean expression comparing fields on type "UUID" */
export type UuidFilter = {
  eq?: InputMaybe<Scalars['UUID']>;
  neq?: InputMaybe<Scalars['UUID']>;
};

export type TodoFragment = { __typename: 'Todo', id: any, title: string, description: string, created_at: any };

export type InsertTodoMutationVariables = Exact<{
  value: TodoInsertInput;
}>;


export type InsertTodoMutation = { __typename?: 'Mutation', insertIntoTodoCollection?: { __typename?: 'TodoInsertResponse', records: Array<{ __typename: 'Todo', id: any, title: string, description: string, created_at: any }> } | null };

export type QueryTodoQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryTodoQuery = { __typename?: 'Query', todoCollection?: { __typename?: 'TodoConnection', edges: Array<{ __typename?: 'TodoEdge', node?: { __typename: 'Todo', id: any, title: string, description: string, created_at: any } | null }> } | null };

export type DeleteTodoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['BigInt']>;
}>;


export type DeleteTodoMutation = { __typename?: 'Mutation', deleteFromTodoCollection: { __typename?: 'TodoDeleteResponse', records: Array<{ __typename: 'Todo', id: any, title: string, description: string, created_at: any }> } };

export const TodoFragmentDoc = gql`
    fragment todo on Todo {
  __typename
  id
  title
  description
  created_at
}
    `;
export const InsertTodoDocument = gql`
    mutation insertTodo($value: TodoInsertInput!) {
  insertIntoTodoCollection(objects: [$value]) {
    records {
      ...todo
    }
  }
}
    ${TodoFragmentDoc}`;
export type InsertTodoMutationFn = Apollo.MutationFunction<InsertTodoMutation, InsertTodoMutationVariables>;

/**
 * __useInsertTodoMutation__
 *
 * To run a mutation, you first call `useInsertTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertTodoMutation, { data, loading, error }] = useInsertTodoMutation({
 *   variables: {
 *      value: // value for 'value'
 *   },
 * });
 */
export function useInsertTodoMutation(baseOptions?: Apollo.MutationHookOptions<InsertTodoMutation, InsertTodoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertTodoMutation, InsertTodoMutationVariables>(InsertTodoDocument, options);
      }
export type InsertTodoMutationHookResult = ReturnType<typeof useInsertTodoMutation>;
export type InsertTodoMutationResult = Apollo.MutationResult<InsertTodoMutation>;
export type InsertTodoMutationOptions = Apollo.BaseMutationOptions<InsertTodoMutation, InsertTodoMutationVariables>;
export const QueryTodoDocument = gql`
    query queryTodo {
  todoCollection {
    edges {
      node {
        ...todo
      }
    }
  }
}
    ${TodoFragmentDoc}`;

/**
 * __useQueryTodoQuery__
 *
 * To run a query within a React component, call `useQueryTodoQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryTodoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryTodoQuery({
 *   variables: {
 *   },
 * });
 */
export function useQueryTodoQuery(baseOptions?: Apollo.QueryHookOptions<QueryTodoQuery, QueryTodoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QueryTodoQuery, QueryTodoQueryVariables>(QueryTodoDocument, options);
      }
export function useQueryTodoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QueryTodoQuery, QueryTodoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QueryTodoQuery, QueryTodoQueryVariables>(QueryTodoDocument, options);
        }
export type QueryTodoQueryHookResult = ReturnType<typeof useQueryTodoQuery>;
export type QueryTodoLazyQueryHookResult = ReturnType<typeof useQueryTodoLazyQuery>;
export type QueryTodoQueryResult = Apollo.QueryResult<QueryTodoQuery, QueryTodoQueryVariables>;
export const DeleteTodoDocument = gql`
    mutation deleteTodo($id: BigInt) {
  deleteFromTodoCollection(filter: {id: {eq: $id}}) {
    records {
      ...todo
    }
  }
}
    ${TodoFragmentDoc}`;
export type DeleteTodoMutationFn = Apollo.MutationFunction<DeleteTodoMutation, DeleteTodoMutationVariables>;

/**
 * __useDeleteTodoMutation__
 *
 * To run a mutation, you first call `useDeleteTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTodoMutation, { data, loading, error }] = useDeleteTodoMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTodoMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTodoMutation, DeleteTodoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTodoMutation, DeleteTodoMutationVariables>(DeleteTodoDocument, options);
      }
export type DeleteTodoMutationHookResult = ReturnType<typeof useDeleteTodoMutation>;
export type DeleteTodoMutationResult = Apollo.MutationResult<DeleteTodoMutation>;
export type DeleteTodoMutationOptions = Apollo.BaseMutationOptions<DeleteTodoMutation, DeleteTodoMutationVariables>;