import { Project } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ContentThumbnail } from "~/components/content/ContentThumbnail";
import { ThumbnailGrid } from "~/components/layout/ThumbnailGrid";
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
    <ThumbnailGrid>
      {projects.length === 0 && <h3>No projects yet</h3>}
      {projects.map((project) => {
        return (
          <Link to={`/projects/${project.slug}`} key={project.id}>
            <ContentThumbnail content={project} />
          </Link>
        );
      })}
    </ThumbnailGrid>
  );
}
