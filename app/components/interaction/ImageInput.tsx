import React from "react";
import { ImageIcon } from "~/icons/Image";
import clx from "classnames";

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
        className={clx(
          "w-full rounded-xl cursor-pointer flex items-center justify-center h-[300px] md:h-[600px] bg-cover bg-center"
        )}
        style={{ backgroundImage: `url(${value})` }}
      >
        {value ? null : <ImageIcon />}
      </button>
      <input type="hidden" value={value} name={name} />
    </div>
  );
};
