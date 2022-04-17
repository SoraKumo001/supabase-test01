import { useMemo, useState } from "react";
import { TodoList } from "../TodoList";
import {
  useDeleteTodoMutation,
  useInsertTodoMutation,
  useQueryTodoQuery,
} from "../../generated/graphql";
import styled from "./index.module.scss";
import { useLoading } from "../../hooks/useLoading";
import { useNotification } from "../../hooks/useNotification";

export const TodoContainer = () => {
  const { data, refetch, loading: queryLoading } = useQueryTodoQuery();
  const [error, setError] = useState<string>();
  const [insertTodo, { loading: insertLoading }] = useInsertTodoMutation();
  const [deleteTodo, { loading: deleteLoading }] = useDeleteTodoMutation();
  const todoList = useMemo(() => {
    return data?.todoCollection?.edges
      .map((v) => v.node!)
      .sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
  }, [data]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    const form = e.target as HTMLFormElement & {
      title: HTMLInputElement;
      description: HTMLFormElement;
    };
    const title = form.title.value;
    const description = form.description.value;
    setError(undefined);
    insertTodo({
      variables: { value: { title, description } },
      update: () => {
        (e.target as HTMLFormElement).reset();
        refetch();
      },
    }).catch((v) => {
      setError(String(v));
    });
    e.preventDefault();
  };
  const handleDelete = (id: number, onError: () => void) => {
    setError(undefined);
    deleteTodo({
      variables: { id },
      update: (_, v) => {
        if (v.data?.deleteFromTodoCollection.affectedCount !== 1) {
          setError("Could not delete.");
          onError();
        }
        refetch();
      },
    }).catch((v) => {
      setError(String(v));
      onError();
    });
  };
  useLoading([queryLoading, insertLoading, deleteLoading]);
  useNotification(error);
  return (
    <div className={styled.root}>
      <form onSubmit={handleSubmit}>
        <button>Insert</button>
        <div>
          <input className={styled.title} id="title" placeholder="Title" />
        </div>
        <textarea
          className={styled.description}
          id="description"
          placeholder="Description"
        />
      </form>
      <TodoList todoList={todoList} onDelete={handleDelete} />
    </div>
  );
};
