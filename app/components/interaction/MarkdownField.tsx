import React from "react";
import { TextArea } from "./TextArea";
import { v4 as uuid } from "uuid";
import clx from "classnames";

interface MarkdownFieldProps
  extends React.HTMLAttributes<HTMLTextAreaElement>,
    React.HTMLProps<HTMLTextAreaElement> {}

export const MarkdownField: React.FC<MarkdownFieldProps> = ({
  className,
  ...rest
}) => {
  const inputRef = React.useRef<HTMLTextAreaElement>();
  const [draggingOver, setDraggingOver] = React.useState(false);

  React.useEffect(() => {
    window.ondragenter = (e) => e.preventDefault();
    window.ondragover = (e) => e.preventDefault();
    window.ondrop = (e) => e.preventDefault();
  });

  function handleDragOver(e: any) {
    setDraggingOver(true);
  }

  function handleDrop(e: any) {
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
  }

  return (
    <TextArea
      ref={inputRef as any}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={clx(className, { "border-2": draggingOver })}
      {...rest}
    />
  );
};
