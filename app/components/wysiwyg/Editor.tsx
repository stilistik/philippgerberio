import React from "react";
import {
  ContentEditableField,
  ContentEditableFieldRef,
} from "../interaction/ContentEditableField";
import { EditorTools } from "./EditorTools";
import hljs from "highlight.js";
import { useEventListener } from "~/utils/hooks";

interface EditorContextValue {
  focus: () => void;
}

const EditorContext = React.createContext<EditorContextValue | undefined>(
  undefined
);

export const useEditorContext = () => {
  return React.useContext(EditorContext);
};

function useHighlight() {
  if (typeof document !== "undefined") {
    function highlight() {
      document.querySelectorAll("pre").forEach((el: any) => {
        console.log(el);
        hljs.highlightElement(el);
      });
    }
    React.useEffect(() => highlight(), []);
  }
}

function useChangeImageWidthOnClick(
  editorRef: React.RefObject<ContentEditableFieldRef>
) {
  if (typeof document !== "undefined") {
    const classes = [
      "",
      "col-span-full",
      "col-span-full lg:col-span-6 lg:col-start-1",
      "col-span-full lg:col-span-6 lg:col-start-7",
    ];

    useEventListener(document, "mousedown", (e) => {
      const el = e.target as HTMLElement;
      if (!el.classList.contains("prose-image")) return;
      const img = e.target as HTMLImageElement;
      const parent = img.parentElement;
      if (["P", "DIV"].includes(parent?.tagName ?? "")) {
        const index = classes.indexOf(parent?.className ?? "");
        const newIndex = (index + 1) % classes.length;
        if (parent) parent.className = classes[newIndex];
      }
      editorRef.current?.update();
    });
  }
}

interface EditorProps {
  name: string;
  defaultValue: string;
}

export const Editor = React.forwardRef<ContentEditableFieldRef, EditorProps>(
  ({ name, defaultValue }, ref) => {
    const editorRef = React.useRef<ContentEditableFieldRef>(null);

    React.useImperativeHandle(ref, () => editorRef.current as any);

    useHighlight();
    useChangeImageWidthOnClick(editorRef);

    function focus() {
      if (editorRef.current?.editor) {
        editorRef.current?.editor.focus();
      }
    }

    return (
      <EditorContext.Provider value={{ focus }}>
        <EditorTools />
        <ContentEditableField
          ref={editorRef}
          element="main"
          name={name}
          defaultValue={defaultValue}
          placeholder="<h1>Enter Text</h1><div><p>This is a paragraph</p></div>"
        />
      </EditorContext.Provider>
    );
  }
);
