import React from "react";
import { registerCodeHighlighting } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
}
