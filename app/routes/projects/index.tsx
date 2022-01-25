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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {projects.map((project) => {
        return (
          <Link to={`/projects/${project.slug}`} key={project.id}>
            <ProjectElement project={project} />
          </Link>
        );
      })}
    </div>
  );
}
