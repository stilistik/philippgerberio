import React from "react";
import {
  ContentEditableField,
  ContentEditableFieldRef,
} from "../interaction/ContentEditableField";
import { EditorTools } from "./EditorTools";
import hljs from "highlight.js";

interface EditorContextValue {
  focus: () => void;
}

const EditorContext = React.createContext<EditorContextValue | undefined>(
  undefined
);

export const useEditorContext = () => {
  return React.useContext(EditorContext);
};

interface EditorProps {
  name: string;
  defaultValue: string;
}

export const Editor = React.forwardRef<ContentEditableFieldRef, EditorProps>(
  ({ name, defaultValue }, ref) => {
    const editorRef = React.useRef<ContentEditableFieldRef>(null);

    React.useImperativeHandle(ref, () => editorRef.current as any);

    React.useEffect(() => {
      document.querySelectorAll("pre").forEach((el: any) => {
        console.log(el);
        hljs.highlightElement(el);
      });
    }, []);

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
