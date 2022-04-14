import { Todo } from "../../generated/graphql";
import { TodoItem } from "../TodoItem";
import styled from "./index.module.scss";
interface Props {
  todoList?: Todo[];
  onDelete: (id: number) => void;
}
export const TodoList = ({ todoList, onDelete }: Props) => {
  return (
    <div className={styled.root}>
      {todoList?.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
      ))}
    </div>
  );
};
