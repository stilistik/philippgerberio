import { Project } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ProjectElement } from "~/components/elements/ProjectElement";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  return db.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
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
