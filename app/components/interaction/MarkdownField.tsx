import React from "react";
import { TextArea } from "./TextArea";
import { v4 as uuid } from "uuid";

interface MarkdownFieldProps
  extends React.HTMLAttributes<HTMLTextAreaElement>,
    React.HTMLProps<HTMLTextAreaElement> {}

export const MarkdownField: React.FC<MarkdownFieldProps> = (props) => {
  const inputRef = React.useRef<HTMLTextAreaElement>();

  React.useEffect(() => {
    window.addEventListener(
      "dragover",
      function (e) {
        e.preventDefault();
      },
      false
    );
    window.addEventListener(
      "drop",
      function (e) {
        e.preventDefault();
      },
      false
    );
  }, []);

  function handleDragOver(e: any) {
    props.onDragOver?.(e);
  }

  function handleDropFile(e: any) {
    const file = e.dataTransfer.files[0];
    if (!file || !inputRef.current) return;

    const placeholder = uuid();

    const formData = new FormData();
    formData.append("file", file);

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((fileUrl) => {
        const input = inputRef.current;
        if (!input) return;
        input.value = input.value.replace(placeholder, fileUrl);
      });

    if (
      inputRef.current.selectionStart ||
      inputRef.current.selectionStart === 0
    ) {
      var startPos = inputRef.current.selectionStart;
      var endPos = inputRef.current.selectionEnd;
      inputRef.current.value =
        inputRef.current.value.substring(0, startPos) +
        `![img](${placeholder})` +
        inputRef.current.value.substring(endPos, inputRef.current.value.length);
    }

    props.onDrop?.(e);
  }

  return (
    <TextArea
      ref={inputRef as any}
      {...props}
      onDrop={handleDropFile}
      onDragOver={handleDragOver}
    />
  );
};
