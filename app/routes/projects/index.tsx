import { Project } from "@prisma/client";
import React from "react";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { ProjectElement } from "~/components/elements/ProjectElement";
import { PageLayout } from "~/components/main/PageLayout";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  return db.project.findMany({ where: { published: true } });
};

export default function Projects() {
  const projects = useLoaderData<Project[]>();
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    document.body.style.cursor = "none";
    function onMouseMove(e: MouseEvent) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    document.addEventListener("mousemove", onMouseMove);
  }, []);

  function onProjectEnter() {
    setShow(false);
  }

  function onProjectLeave() {
    setShow(true);
  }

  return (
    <>
      <div
        className="fixed rounded-full border-4 border-black transition-transform duration-500 z-10 pointer-events-none"
        style={{
          height: 50,
          width: 50,
          top: position?.y,
          left: position?.x,
          transform: `translate(-50%, -50%) scale(${show ? 1 : 0})`,
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((project) => {
          return (
            <Link to={`/projects/${project.slug}`} key={project.id}>
              <ProjectElement
                project={project}
                onMouseEnter={onProjectEnter}
                onMouseLeave={onProjectLeave}
              />
            </Link>
          );
        })}
      </div>
    </>
  );
}
