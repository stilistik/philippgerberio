import React from "react";
import { Link } from "@remix-run/react";
import { ImageIcon } from "~/icons/Image";

interface ImageInputProps {
  name: string;
  value: string;
}

export const ImageInput = ({ name, value }: ImageInputProps) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  function handleClick() {
    if (!inputRef.current) return;
    inputRef.current.focus();
    inputRef.current.select();
  }

  return (
    <div className="flex gap-3 col-span-full">
      <Link to="resources?q=thumbnail" className="w-full">
        <button
          onClick={handleClick}
          className="w-full h-[500px] border rounded-xl cursor-pointer flex items-center justify-center"
          style={{
            backgroundPosition: "center center",
            backgroundImage: `url(${value})`,
            backgroundSize: "cover",
          }}
        >
          {value ? null : <ImageIcon />}
        </button>
      </Link>
      <input type="hidden" value={value} name={name} />
    </div>
  );
};
