import { Project, Resource } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { ContentDisplay } from "~/components/content/ContentDisplay";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  const project = await db.project.findUnique({ where: { slug: params.slug } });
  if (!project) {
    return badRequest({ slug: params.slug, error: "Project not found" });
  }

  let thumbnail = null;
  if (project?.thumbnail) {
    thumbnail = await db.resource.findFirst({
      where: { url: project.thumbnail },
    });
  }

  return { project, thumbnail };
};

export default function Project() {
  const { project, thumbnail } = useLoaderData<{
    project: Project;
    thumbnail: Resource;
  }>();
  return <ContentDisplay content={project} frontImage={thumbnail} />;
}
