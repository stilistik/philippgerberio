import React from "react";
import clx from "classnames";

interface EditableTextFieldProps {
  name: string;
  placeholder: string;
  element: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  defaultValue: string;
}

export const ContentEditableField = ({
  name,
  placeholder,
  element: Element,
  defaultValue,
}: EditableTextFieldProps) => {
  const [value, setValue] = React.useState(defaultValue);
  const [touched, setTouched] = React.useState(false);
  const ref = React.useRef<any>(null);

  // supporess SSR warning about use layout effect by ensuring it only runs on the client
  if (typeof window !== "undefined") {
    React.useLayoutEffect(() => {
      const el = ref.current;
      const target = document.createTextNode("");
      el.appendChild(target);
      // do not move caret if element was not focused
      const isTargetFocused = document.activeElement === el;
      if (target !== null && target.nodeValue !== null && isTargetFocused) {
        var sel = window.getSelection();
        if (sel !== null) {
          var range = document.createRange();
          range.setStart(target, target.nodeValue.length);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
        if (el instanceof HTMLElement) el.focus();
      }
    }, [value]);
  }

  function handleChange(e: React.FormEvent) {
    const value = e.currentTarget.textContent ?? "";
    setValue(value);
    setTouched(true);
  }

  function handleBlur() {
    if (touched && !value) setTouched(false);
  }

  return (
    <>
      <Element
        ref={ref}
        contentEditable
        onInput={handleChange}
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{
          __html: value || (touched ? "" : placeholder),
        }}
      />
      <input type="hidden" name={name} value={value} />
    </>
  );
};
