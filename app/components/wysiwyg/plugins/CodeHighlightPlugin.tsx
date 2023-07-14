import React from "react";
import { registerCodeHighlighting } from "../nodes/CodeHighlighter";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
}
