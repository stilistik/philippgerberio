import { Resource } from "@prisma/client";
import { decode } from "blurhash";
import React from "react";

export const FrontImage = ({ resource }: { resource: Resource }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!resource) {
      return;
    }

    const img = new Image();
    img.onload = () => {
      setLoaded(true);
    };
    img.src = resource.url;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (resource.blurHash && canvas && ctx) {
      const pixels = decode(resource.blurHash, canvas.width, canvas.height);
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
    }
  }, [resource?.id]);

  return (
    <div className="relative col-span-full h-[300px] md:h-[600px] rounded-lg shadow-lg overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${resource.url})`,
          opacity: loaded ? 1 : 0,
          transition: "all 0.5s ease-in-out",
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full -z-10"
      />
    </div>
  );
};
