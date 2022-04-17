import { useState } from "react";
import { Todo } from "../../generated/graphql";
import styled from "./index.module.scss";
interface Props {
  todo: Todo;
  onDelete: (id: number, error: () => void) => void;
}
export const TodoItem = ({ todo, onDelete }: Props) => {
  const { id, title, user, description, created_at } = todo;
  const [isDelete, setDelete] = useState<boolean>();
  return (
    <div className={styled.root + (isDelete ? " " + styled.delete : "")}>
      <div
        className={styled.close}
        onClick={() => {
          setDelete(true);
          onDelete(id, () => {
            setDelete(false);
          });
        }}
      >
        ×
      </div>
      <div className={styled.title}>{title}</div>
      <div className={styled.name}>{user?.email}</div>
      <div className={styled.description}>{description}</div>
      <div className={styled.date}>{new Date(created_at).toLocaleString()}</div>
    </div>
  );
};
