import React from "react";
import { Project } from "@prisma/client";
import { SubHeader } from "../layout/SubHeader";
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={clx(
          "relative after:absolute after:-top-[10px] after:-left-[10px] after:w-[calc(100%+20px)] after:h-[calc(100%+20px)] after:border-4 after:rounded-xl after:border-gray-600 after:scale-75 after:opacity-0 after:-z-10 after:transition-all after:ease-in-out after:duration-300",
          { "after:scale-100 after:opacity-100": hovered }
        )}
      >
        <img
          src={project.thumbnail}
          width="100%"
          className="rounded-md border shadow-xl"
        />
      </div>
      <div className="my-5">
        <SubHeader className={clx("text-gray-600 relative font-semibold")}>
          {project.title}
        </SubHeader>
        <p className="text-2xl text-gray-400 ">{project.description}</p>
        {children}
      </div>
    </div>
  );
};
