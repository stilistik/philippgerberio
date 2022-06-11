import { useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import React from "react";
import { ContentEditableField } from "../interaction/ContentEditableField";
import { EditorTools } from "./EditorTools";

interface EditorProps {
  name: string;
  defaultValue: string;
}

export const Editor = ({ name, defaultValue }: EditorProps) => {
  const ref = React.useRef<any>(null);

  const image = useSearchParams()[0].get("image");
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (image) {
      ref.current.appendContent(`<img src=${image} />`);
      navigate(location.pathname);
    }
  }, [image]);

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
};
