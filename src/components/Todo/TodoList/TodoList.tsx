import { Todo } from "../../../generated/graphql";
import { TodoItem } from "../TodoItem";
import styled from "./index.module.scss";
interface Props {
  todoList?: Todo[];
  onUpload: (
    path: string,
    blob: Blob,
    uploaded: (name?: string) => void
  ) => void;
  onDelete: (id: number, error: () => void) => void;
  onUpdate: (
    id: number,
    title: string,
    description: string,
    visible: boolean
  ) => void;
}
export const TodoList = ({ todoList, onUpload, onUpdate, onDelete }: Props) => {
  const list = todoList?.reduce(
    (result, todo) => ({
      ...result,
      [todo.user!.id]: [...(result[todo.user!.id] || []), todo],
    }),
    {} as { [key: string]: Todo[] }
  );

  return (
    <div className={styled.root}>
      {list &&
        Object.entries(list).map(([key, group]) => (
          <div key={key}>
            <hr />
            <div>{group[0].user!.email}</div>
            <div className={styled.todoList}>
              {group.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpload={onUpload}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};
