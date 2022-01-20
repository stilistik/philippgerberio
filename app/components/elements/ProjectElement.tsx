import React from "react";
import { Project } from "@prisma/client";
import { SubHeader } from "../layout/SubHeader";
import { ImageIcon } from "~/icons/Image";

interface ProjectProps {
  project: Project;
}

export const ProjectElement: React.FC<ProjectProps> = ({
  project,
  children,
}) => {
  return (
    <div className="project-element">
      {project.thumbnail ? (
        <img
          src={project.thumbnail}
          width="100%"
          className="rounded-md border shadow-xl"
        />
      ) : (
        <div className="rounded-md border shadow-xl w-full h-60 flex items-center justify-center">
          <ImageIcon />
        </div>
      )}
      <div className="my-5">
        <SubHeader>{project.title}</SubHeader>
        <p className="text-2xl text-gray-400 ">{project.description}</p>
        {children}
      </div>
    </div>
  );
};
