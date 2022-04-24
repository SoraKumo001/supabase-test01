import styled from "./index.module.scss";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { classNames } from "../../libs/className";
interface Props {
  className?: string;
  children: string;
}
export const Markdown = ({ className, children }: Props) => {
  const handleImage = (src: string) => {
    if (src.charAt(0) === "!") {
      return (
        process.env.NEXT_PUBLIC_SUPABASE_URL +
        "/storage/v1/object/public/storage/" +
        src.slice(1)
      );
    }
    return src;
  };
  return (
    <ReactMarkdown
      className={classNames(styled.root, className)}
      remarkPlugins={[remarkGfm]}
      transformImageUri={handleImage}
    >
      {children}
    </ReactMarkdown>
  );
};
