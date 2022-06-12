import React from "react";
import { ContentEditableField } from "../interaction/ContentEditableField";
import { EditorTools } from "./EditorTools";

interface EditorProps {
  name: string;
  defaultValue: string;
}

export const Editor = React.forwardRef<any, EditorProps>(
  ({ name, defaultValue }, ref) => {
    return (
      <>
        <EditorTools />
        <ContentEditableField
          ref={ref}
          element="main"
          name={name}
          defaultValue={defaultValue}
          placeholder=""
        />
      </>
    );
  }
);
