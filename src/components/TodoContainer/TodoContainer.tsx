import { useMemo } from "react";
import { TodoList } from "../TodoList";
import {
  useDeleteTodoMutation,
  useInsertTodoMutation,
  useQueryTodoQuery,
} from "../../generated/graphql";
import styled from "./index.module.scss";

export const TodoContainer = () => {
  const { data, refetch } = useQueryTodoQuery();
  const [insertTodo] = useInsertTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
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
    insertTodo({
      variables: { value: { title, description } },
      update: () => {
        (e.target as HTMLFormElement).reset();
        refetch();
      },
    });
    e.preventDefault();
  };
  const handleDelete = (id: number) => {
    deleteTodo({
      variables: { id },
      update: () => {
        refetch();
      },
    });
  };
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
