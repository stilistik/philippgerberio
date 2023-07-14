import React from "react";

export interface ContentEditableFieldRef {
  editor: HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | null;
  setContent: (html: string) => void;
  insertContent: (html: string) => void;
  update: () => void;
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
    insertContent,
    update,
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

  const insertContent = React.useCallback((html: string) => {
    document.execCommand("insertHTML", false, html);
    update();
  }, []);

  const setContent = React.useCallback((html: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
      update();
    }
  }, []);

  function update() {
    if (inputRef.current && editorRef.current) {
      inputRef.current.value = editorRef.current.innerHTML;
    }
  }

  function handleChange(e: React.FormEvent) {
    const value = e.currentTarget.innerHTML ?? placeholder;
    inputRef.current.value = value;
    touchedRef.current = true;
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
        className={"content-editable " + className}
      />
      <input ref={inputRef} type="hidden" name={name} />
    </>
  );
});
