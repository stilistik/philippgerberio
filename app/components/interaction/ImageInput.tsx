import React from "react";
import { InputProps } from "./Input";

export const ImageInput = (props: InputProps) => {
  const [url, setUrl] = React.useState<string | null>(
    (props.defaultValue as string) ?? null
  );

  function handleChange(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((fileUrl) => {
        setUrl(fileUrl);
      });
  }

  return (
    <div>
      <input {...props} type="hidden" value={String(url)} />
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="image-input"
        type="file"
        onChange={handleChange}
      />
      <br />
      <label htmlFor="image-input">
        <div
          className="w-40 h-40 border rounded-xl cursor-pointer flex items-center justify-center"
          style={{
            backgroundPosition: "center center",
            backgroundImage: `url(${url})`,
            backgroundSize: "cover",
          }}
        >
          {url ? "" : "Image"}
        </div>
      </label>
    </div>
  );
};
