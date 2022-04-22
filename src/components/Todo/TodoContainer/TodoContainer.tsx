import { useEffect, useMemo, useState } from "react";
import { TodoList } from "../TodoList";
import {
  Todo,
  useDeleteTodoMutation,
  useInsertTodoMutation,
  useQueryTodoQuery,
  useUpdateTodoMutation,
} from "../../../generated/graphql";
import styled from "./index.module.scss";
import { useLoading } from "../../../hooks/useLoading";
import { useNotification } from "../../../hooks/useNotification";
import { TodoItem } from "../TodoItem";
import { useTableTrigger } from "../../../hooks/useLogin";

export const TodoContainer = () => {
  const {
    data,
    refetch,
    loading: queryLoading,
    client,
    fetchMore,
  } = useQueryTodoQuery();
  const [error, setError] = useState<string>();
  const [insertTodo, { loading: insertLoading }] = useInsertTodoMutation();
  const [updateTodo, { loading: updateLoading }] = useUpdateTodoMutation();
  const [deleteTodo, { loading: deleteLoading }] = useDeleteTodoMutation();
  const todoList = useMemo(() => {
    return data?.todoCollection?.edges
      .map((v) => v.node!)
      .sort((a, b) => (a.created_at > b.created_at ? -1 : 1)) as
      | Todo[]
      | undefined;
  }, [data]);
  const handleDelete = (id: number, onError: () => void) => {
    setError(undefined);
    deleteTodo({
      variables: { id },
      update: (_, v) => {
        if (v.data?.deleteFromTodoCollection.affectedCount !== 1) {
          setError("Could not delete.");
          onError();
        }
        //refetch();
      },
    }).catch((v) => {
      setError(String(v));
      onError();
    });
  };
  useTableTrigger("Todo", () => {
    refetch();
  });
  const handleUpdate = (
    id: number | undefined,
    title: string,
    description: string,
    published: boolean
  ) => {
    setError(undefined);
    if (id) {
      updateTodo({
        variables: { id, title, description, published },
        update: (_, v) => {
          if (v.data?.updateTodoCollection.affectedCount !== 1) {
            setError("Could not update.");
          }
          // refetch();
        },
      }).catch((v) => {
        setError(String(v));
      });
    } else {
      insertTodo({
        variables: { value: { title, description, published } },
        update: () => {
          //  refetch();
        },
      }).catch((v) => {
        setError(String(v));
      });
    }
  };
  useLoading([queryLoading, insertLoading, deleteLoading, updateLoading]);
  useNotification(error);
  return (
    <div className={styled.root}>
      <TodoItem onUpdate={handleUpdate} />
      <TodoList
        todoList={todoList}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};
