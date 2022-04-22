import { useEffect, useState } from "react";
import { Todo } from "../../../generated/graphql";
import { classNames } from "../../../libs/className";
import styled from "./index.module.scss";
interface Props {
  todo?: Todo;
  onUpdate: (
    id: number,
    title: string,
    description: string,
    visible: boolean
  ) => void;
  onDelete?: (id: number, error: () => void) => void;
}
export const TodoItem = ({ todo, onDelete, onUpdate }: Props) => {
  const { id, title, user, description, published, created_at } = todo || {
    published: true,
  };
  const [isDelete, setDelete] = useState<boolean>();
  const [value, setValue] = useState(() => ({
    title: title || "",
    description: description || "",
    published,
  }));
  useEffect(() => {
    if (todo)
      setValue({
        title: title || "",
        description: description || "",
        published,
      });
  }, [todo]);
  return (
    <form
      className={classNames(
        styled.root,
        isDelete && styled.delete,
        published && styled.published
      )}
      onSubmit={(e) => {
        e.preventDefault();
        onUpdate(id, value.title, value.description, value.published);
        if (!id) {
          setValue({ title: "", description: "", published: true });
        }
      }}
    >
      {id && (
        <div
          className={styled.close}
          onClick={() => {
            setDelete(true);
            onDelete?.(id, () => {
              setDelete(false);
            });
          }}
        >
          ×
        </div>
      )}
      <input
        className={styled.title}
        value={value.title}
        onChange={(e) => setValue((v) => ({ ...v, title: e.target.value }))}
        placeholder="Title"
      />
      <textarea
        value={value.description}
        className={styled.description}
        onChange={(e) =>
          setValue((v) => ({ ...v, description: e.target.value }))
        }
        placeholder="Description"
      />
      <div className={styled.name}>{user?.email}</div>
      {created_at && (
        <div className={styled.date}>
          {new Date(created_at).toLocaleString()}
        </div>
      )}
      <div className={styled.center}>
        <button>{id ? "Update" : "Insert"}</button>
        <label className={styled.center}>
          <input
            type="checkbox"
            checked={value.published}
            onChange={(e) =>
              setValue((v) => ({ ...v, published: e.target.checked }))
            }
          />
          <div>public</div>
        </label>
      </div>
    </form>
  );
};
