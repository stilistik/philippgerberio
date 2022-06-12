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
  className?: string;
}

export const ContentEditableField = React.forwardRef<
  ContentEditableFieldRef,
  EditableTextFieldProps
>(({ name, placeholder, element: Element, defaultValue, className }, ref) => {
  const editorRef = React.useRef<
    HTMLHeadElement & HTMLParagraphElement & HTMLSpanElement
  >(null);
  const inputRef = React.useRef<any>(null);
  const touchedRef = React.useRef(false);

  React.useImperativeHandle(ref, () => ({
    editor: editorRef.current,
    setContent,
    appendContent,
  }));

  React.useEffect(() => {
    if (!touchedRef.current) {
      if (defaultValue) {
        setContent(defaultValue);
      } else if (placeholder) {
        setContent(placeholder);
      }
    }
  }, [defaultValue, placeholder]);

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
    touchedRef.current = true;
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
        className={className}
      />
      <input ref={inputRef} type="hidden" name={name} />
    </>
  );
});
