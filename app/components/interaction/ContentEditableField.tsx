import React from "react";

export interface ContentEditableFieldRef {
  editor: HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | null;
  setContent: (html: string) => void;
  appendContent: (html: string) => void;
}

interface EditableTextFieldProps {
  name: string;
  placeholder: string;
  element: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "main";
  defaultValue: string;
}

export const ContentEditableField = React.forwardRef<
  ContentEditableFieldRef,
  EditableTextFieldProps
>(({ name, placeholder, element: Element, defaultValue }, ref) => {
  const editorRef = React.useRef<
    HTMLHeadElement & HTMLParagraphElement & HTMLSpanElement
  >(null);
  const inputRef = React.useRef<any>(null);

  React.useImperativeHandle(ref, () => ({
    editor: editorRef.current,
    setContent,
    appendContent,
  }));

  React.useEffect(() => {
    setContent(defaultValue);
  }, [defaultValue]);

  const appendContent = React.useCallback((html: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML += html;
      inputRef.current.value = editorRef.current.innerHTML;
    }
  }, []);

  const setContent = React.useCallback((html: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
      inputRef.current.value = html;
    }
  }, []);

  function handleChange(e: React.FormEvent) {
    const value = e.currentTarget.innerHTML ?? placeholder;
    inputRef.current.value = value;
    console.log(value);
  }

  function handleBlur(e: React.FormEvent) {
    if (!e.currentTarget.innerHTML && editorRef.current) {
      editorRef.current.innerHTML = placeholder;
    }
  }

  return (
    <>
      <Element
        ref={editorRef}
        contentEditable
        onInput={handleChange}
        onBlur={handleBlur}
      />
      <input ref={inputRef} type="hidden" name={name} />
    </>
  );
});
