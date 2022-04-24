import { useMemo, useState } from "react";
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
import { useTableTrigger, useUpload } from "../../../hooks/useLogin";
import IconAdd from "@mui/icons-material/AddCardOutlined";
import { useSystemSelector } from "../../../hooks/useSystemSelector";

export const TodoContainer = () => {
  const auth = useSystemSelector((v) => v.auth);
  const { data, refetch, loading: queryLoading } = useQueryTodoQuery();
  const [error, setError] = useState<string>();
  const [insertTodo, { loading: insertLoading }] = useInsertTodoMutation();
  const [updateTodo, { loading: updateLoading }] = useUpdateTodoMutation();
  const [deleteTodo, { loading: deleteLoading }] = useDeleteTodoMutation();
  const { upload } = useUpload();
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
        },
      }).catch((v) => {
        setError(String(v));
      });
    } else {
      insertTodo({
        variables: { value: { title, description, published } },
        update: () => {},
      }).catch((v) => {
        setError(String(v));
      });
    }
  };
  const handleUpload = async (
    path: string,
    blob: Blob,
    uploaded: (id?: string) => void
  ) => {
    upload(path, blob).then(uploaded);
  };
  useLoading([queryLoading, insertLoading, deleteLoading, updateLoading]);
  useNotification(error);
  return (
    <div className={styled.root}>
      {auth?.user && (
        <div
          className={styled.add}
          onClick={() => handleUpdate(undefined, "", "", false)}
        >
          <IconAdd />
          Add
        </div>
      )}
      <TodoList
        todoList={todoList}
        onUpload={handleUpload}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};
