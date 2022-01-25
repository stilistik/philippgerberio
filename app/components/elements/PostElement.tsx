import React from "react";
import { Post } from "@prisma/client";
import { SubHeader } from "../layout/SubHeader";
import { ImageIcon } from "~/icons/Image";
import clx from "classnames";

interface PostProps {
  post: Post;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const PostElement: React.FC<PostProps> = ({
  post,
  onMouseEnter,
  onMouseLeave,
  children,
}) => {
  const [hovered, setHovered] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const bbox = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - bbox.x) / bbox.width) * 100;
    const y = ((e.clientY - bbox.y) / bbox.height) * 100;
    setPosition({ x, y });
    setHovered(true);
  }

  return (
    <div
      className="project-element"
      onMouseEnter={onMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
    >
      <div className="project-border project-border-top" />
      <div className="project-border project-border-left" />
      <div className="project-border project-border-bottom" />
      <div className="project-border project-border-right" />
      <div
        className="bg-black absolute rounded-full transition-transform origin-center duration-1000"
        style={{
          top: position?.y + "%",
          left: position?.x + "%",
          width: "100%",
          height: "100%",
          transform: `translate(-50%, -50%) scale(${hovered ? 1.6 : 0})`,
        }}
      />
      {post.thumbnail ? (
        <div className="rounded-md" style={{ background: "#333" }}>
          <img
            src={post.thumbnail}
            className={clx(
              "rounded-md mix-blend-exclusion border transition-all duration-1000",
              {
                grayscale: !hovered,
              }
            )}
          />
        </div>
      ) : (
        <div className="rounded-md border shadow-xl w-full h-60 flex items-center justify-center">
          <ImageIcon />
        </div>
      )}
      <div className="mt-5">
        <SubHeader>{post.title}</SubHeader>
        <p className="text-2xl mix-blend-difference text-gray-200">
          {post.description}
        </p>
        {children}
      </div>
    </div>
  );
};
