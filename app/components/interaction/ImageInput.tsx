import React from "react";
import { Link } from "@remix-run/react";
import { ImageIcon } from "~/icons/Image";
import { Input, InputProps } from "./Input";

export const ImageInput = (props: InputProps) => {
  const [url, setUrl] = React.useState(props.defaultValue);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  function handleChange(e: any) {
    setUrl(e.target.value);
  }

  function handleClick() {
    if (!inputRef.current) return;
    inputRef.current.focus();
    inputRef.current.select();
  }

  return (
    <div className="flex gap-3">
      <Link to="resources">
        <button
          onClick={handleClick}
          className="w-40 h-40 border rounded-xl cursor-pointer flex items-center justify-center"
          style={{
            backgroundPosition: "center center",
            backgroundImage: `url(${url})`,
            backgroundSize: "cover",
          }}
        >
          {url ? null : <ImageIcon />}
        </button>
      </Link>
      <div className="w-full">
        <Input ref={inputRef} {...props} onChange={handleChange} />
      </div>
    </div>
  );
};
