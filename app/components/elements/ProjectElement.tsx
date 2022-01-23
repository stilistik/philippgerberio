import React from "react";
import { Project } from "@prisma/client";
import { SubHeader } from "../layout/SubHeader";
import { ImageIcon } from "~/icons/Image";
import clx from "classnames";

interface ProjectProps {
  project: Project;
}

export const ProjectElement: React.FC<ProjectProps> = ({
  project,
  children,
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className="project-element"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="project-border project-border-top" />
      <div className="project-border project-border-left" />
      <div className="project-border project-border-bottom" />
      <div
        className="bg-black absolute bottom-1/2 right-0 rounded-full transition-all duration-1000"
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(50%, 50%) scale(${hovered ? 1.6 : 0})`,
        }}
      />
      {project.thumbnail ? (
        <div className="rounded-md bg-black">
          <img
            src={project.thumbnail}
            className={clx(
              "rounded-md mix-blend-lighten transition-all duration-1000",
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
