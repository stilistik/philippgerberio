import React from "react";
import {
  ContentEditableField,
  ContentEditableFieldRef,
} from "../interaction/ContentEditableField";
import { EditorTools } from "./EditorTools";

interface EditorProps {
  name: string;
  defaultValue: string;
}

export const Editor = React.forwardRef<ContentEditableFieldRef, EditorProps>(
  ({ name, defaultValue }, ref) => {
    return (
      <>
        <EditorTools />
        <ContentEditableField
          ref={ref}
          element="main"
          name={name}
          defaultValue={defaultValue}
          placeholder="<h1>Enter Text</h1><div><p>This is a paragraph</p></div>"
        />
      </>
    );
  }
);
