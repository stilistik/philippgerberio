import { Project } from "@prisma/client";
import React from "react";
import { SubHeader } from "../layout/SubHeader";

interface ProjectProps {
  project: Project;
}

export const ProjectElement: React.FC<ProjectProps> = ({
  project,
  children,
}) => {
  return (
    <div className="border rounded-2xl shadow-2xl overflow-hidden">
      <div
        className="h-80 border-b"
        style={{
          backgroundImage: `url(${project.thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      />
      <div className="p-3">
        <SubHeader>{project.title}</SubHeader>
        <p>{project.description}</p>
        {children}
      </div>
    </div>
  );
};
