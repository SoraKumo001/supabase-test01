import { useEffect, useRef, useState } from "react";
import { Todo } from "../../../generated/graphql";
import { classNames } from "../../../libs/className";
import Editor from "@monaco-editor/react";
import styled from "./index.module.scss";
import IconEdit from "@mui/icons-material/Edit";
import IconSave from "@mui/icons-material/Save";
import IconStop from "@mui/icons-material/StopCircle";
import { editor } from "monaco-editor";
import { Markdown } from "../../Markdown";
import { useSystemSelector } from "../../../hooks/useSystemSelector";

interface Props {
  todo?: Todo;
  editable?: boolean;
  onUpload: (
    path: string,
    blob: Blob,
    uploaded: (name?: string) => void
  ) => void;
  onUpdate: (
    id: number,
    title: string,
    description: string,
    visible: boolean
  ) => void;
  onDelete?: (id: number, error: () => void) => void;
}

const EditorOptions: editor.IStandaloneEditorConstructionOptions = {
  lineNumbers: "off",
  folding: false,
  selectOnLineNumbers: false,
  minimap: { enabled: false },
  glyphMargin: false,
  scrollBeyondLastLine: false,
  lineDecorationsWidth: 0,
};
const thems: editor.IStandaloneThemeData = {
  base: "vs",
  inherit: true,
  colors: {
    "editor.foreground": "#000000",
    "editor.background": "#00000000",
    "editorCursor.foreground": "#8B0000",
    "editor.lineHighlightBackground": "#00000000",
    "editorLineNumber.foreground": "#008800",
    "editor.selectionBackground": "#88000030",
    "editor.inactiveSelectionBackground": "#88000015",
  },
  rules: [],
};

export const TodoItem = ({
  todo,
  onDelete,
  onUpdate,
  onUpload,
  editable = false,
}: Props) => {
  const userId = useSystemSelector((v) => v.auth?.user?.sub);
  const refEditor = useRef<editor.IStandaloneCodeEditor>();
  const { id, title, user, description, published, created_at, updated_at } =
    todo || {
      published: true,
    };
  const [isDelete, setDelete] = useState<boolean>();
  const [value, setValue] = useState(() => ({
    title: title || "",
    description: description || "",
    published,
  }));
  const [isEdit, setEdit] = useState(editable);
  useEffect(() => {
    if (todo)
      setValue({
        title: title || "",
        description: description || "",
        published,
      });
  }, [todo]);
  const isOwner = user?.id === userId;
  const handleCancel = () => {
    setValue({ title: title || "", description: description || "", published });
    setEdit(false);
  };
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
        if (id) setEdit(false);
        else setValue({ title: "", description: "", published: true });
      }}
      onDragOver={(e) => {
        if (isEdit) {
          e.dataTransfer.dropEffect = "move";
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      onPaste={() => {
        navigator.clipboard.read().then((items) => {
          items.forEach(async (item) => {
            onUpload(id, await item.getType("image/png"), (id) => {
              if (id && refEditor.current)
                refEditor.current.trigger("keyboard", "type", {
                  text: `![](!${id})`,
                });
            });
          });
        });
      }}
      onDrop={(e) => {
        const length = e.dataTransfer.files.length;
        if (length) {
          e.stopPropagation();
          e.preventDefault();
          for (let i = 0; i < length; i++) {
            onUpload(id, e.dataTransfer.files[i], (id) => {
              if (id && refEditor.current)
                refEditor.current.trigger("keyboard", "type", {
                  text: `![](!${id})`,
                });
            });
          }
        }
      }}
    >
      {isOwner && (
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
      {isEdit ? (
        <input
          className={styled.title}
          value={value.title}
          onChange={(e) => setValue((v) => ({ ...v, title: e.target.value }))}
          placeholder="Title"
        />
      ) : (
        <div className={styled.title}>{title}</div>
      )}
      {isEdit ? (
        <Editor
          theme={"custom"}
          className={styled.description}
          defaultLanguage="markdown"
          value={value.description}
          options={EditorOptions}
          onChange={(value) =>
            setValue((v) => ({ ...v, description: value || "" }))
          }
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("custom", thems);
          }}
          onMount={(e) => {
            refEditor.current = e;
          }}
        />
      ) : (
        <Markdown className={styled.description}>{description || ""}</Markdown>
      )}
      <div className={styled.name}>{user?.email}</div>
      {created_at && (
        <div className={styled.date}>
          Created:
          {new Date(created_at).toLocaleString()}
        </div>
      )}
      {updated_at && (
        <div className={styled.date}>
          Updated:
          {new Date(updated_at).toLocaleString()}
        </div>
      )}
      {isOwner && (
        <div className={styled.footer}>
          <div>
            {isEdit ? (
              <>
                <button className={styled.reset}>
                  <IconSave className={styled.button} />
                </button>
                <IconStop className={styled.button} onClick={handleCancel} />
              </>
            ) : (
              <IconEdit
                className={styled.button}
                onClick={() => setEdit(true)}
              />
            )}
          </div>
          <label className={styled.label}>
            <input
              type="checkbox"
              checked={value.published}
              disabled={!isEdit}
              onChange={(e) =>
                setValue((v) => ({ ...v, published: e.target.checked }))
              }
            />
            <div>published</div>
          </label>
        </div>
      )}
    </form>
  );
};
