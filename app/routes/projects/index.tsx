import { Project, Resource } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ContentThumbnail } from "~/components/content/ContentThumbnail";
import { ThumbnailGrid } from "~/components/layout/ThumbnailGrid";
import { db } from "~/utils/db.server";

interface ProjectWithFrontImage extends Project {
  frontImage: Resource;
}

export const loader: LoaderFunction = async () => {
  const projects = await db.project.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return await Promise.all(
    projects.map(async (p) => {
      let frontImage = null;
      if (p?.thumbnail) {
        frontImage = await db.resource.findFirst({
          where: { url: p.thumbnail },
        });
      }
      return { ...p, frontImage };
    })
  );
};

export default function Projects() {
  const projects = useLoaderData<ProjectWithFrontImage[]>();

  return (
    <ThumbnailGrid>
      {projects.length === 0 && <h3>No projects yet</h3>}
      {projects.map((project) => {
        return (
          <Link to={`/projects/${project.slug}`} key={project.id}>
            <ContentThumbnail
              content={project}
              frontImage={project.frontImage}
            />
          </Link>
        );
      })}
    </ThumbnailGrid>
  );
}
