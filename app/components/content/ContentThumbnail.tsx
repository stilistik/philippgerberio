import React from "react";
import { Post, Project } from "@prisma/client";
import { SubHeader } from "../layout/SubHeader";
import { ImageIcon } from "~/icons/Image";
import { useIsMobile, useMobileAutoHoverOnScroll } from "~/utils/hooks";
import clx from "classnames";

interface ContentThumbnailProps {
  content: Post | Project;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ContentThumbnail = ({
  content,
  onMouseEnter,
  onMouseLeave,
}: ContentThumbnailProps) => {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = React.useState(false);
  const [position, setPosition] = React.useState(
    isMobile ? { x: 25, y: 25 } : { x: 0, y: 0 }
  );
  const ref = useMobileAutoHoverOnScroll(hovered, setHovered);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const bbox = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - bbox.x) / bbox.width) * 100;
    const y = ((e.clientY - bbox.y) / bbox.height) * 100;
    setPosition({ x, y });
    setHovered(true);
  }

  return (
    <div
      ref={ref}
      className="project-element"
      onMouseEnter={onMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
    >
      <div
        className={clx("project-border project-border-top", {
          "scale-100": hovered,
        })}
      />
      <div
        className={clx("project-border project-border-left", {
          "scale-100": hovered,
        })}
      />
      <div
        className={clx("project-border project-border-bottom", {
          "scale-100": hovered,
        })}
      />
      <div
        className={clx("project-border project-border-right", {
          "scale-100": hovered,
        })}
      />
      <div
        className="bg-black absolute rounded-full transform-gpu transition-transform origin-center duration-1000"
        style={{
          top: position?.y + "%",
          left: position?.x + "%",
          width: "100%",
          height: "100%",
          transform: `translate(-50%, -50%) scale(${hovered ? 1.6 : 0})`,
        }}
      />
      {content.thumbnail ? (
        <div className="rounded-md" style={{ background: "#333" }}>
          <img
            src={content.thumbnail}
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
        <SubHeader>{content.title}</SubHeader>
        <p className="text-2xl mix-blend-difference text-gray-200">
          {content.description}
        </p>
      </div>
    </div>
  );
};