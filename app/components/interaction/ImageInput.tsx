import React from "react";
import { ImageIcon } from "~/icons/Image";

interface ImageInputProps {
  name: string;
  value: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ImageInput = ({ name, value, onClick }: ImageInputProps) => {
  return (
    <div className="flex gap-3 col-span-full">
      <button
        onClick={onClick}
        className="w-full h-[500px] border rounded-xl cursor-pointer flex items-center justify-center"
        style={{
          backgroundPosition: "center center",
          backgroundImage: `url(${value})`,
          backgroundSize: "cover",
        }}
      >
        {value ? null : <ImageIcon />}
      </button>
      <input type="hidden" value={value} name={name} />
    </div>
  );
};
