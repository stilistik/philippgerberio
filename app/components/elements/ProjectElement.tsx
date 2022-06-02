import React from "react";
import { Project } from "@prisma/client";
import { SubHeader } from "../layout/SubHeader";
import { ImageIcon } from "~/icons/Image";
import clx from "classnames";
import { useIsMobile, useScrollPosition } from "~/utils/hooks";

interface ProjectProps {
  project: Project;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ProjectElement: React.FC<ProjectProps> = ({
  project,
  onMouseEnter,
  onMouseLeave,
  children,
}) => {
  const [hovered, setHovered] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const { ref, bbox } = useScrollPosition();

  React.useEffect(() => {
    if (bbox && isMobile) {
      if (bbox.y > 0 && bbox.y < window.innerHeight / 2) {
        setHovered(true);
        setPosition({ x: 25, y: 25 });
      } else {
        setHovered(false);
      }
    }
  }, [bbox, isMobile]);

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
      {project.thumbnail ? (
        <div className="rounded-md" style={{ background: "#333" }}>
          <img
            src={project.thumbnail}
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
        <SubHeader>{project.title}</SubHeader>
        <p className="text-2xl mix-blend-difference text-gray-200">
          {project.description}
        </p>
        {children}
      </div>
    </div>
  );
};
