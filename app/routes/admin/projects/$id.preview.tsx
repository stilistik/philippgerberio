import { Project } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { ContentDisplay } from "~/components/content/ContentDisplay";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "expected params.id");
  const project = await db.project.findUnique({ where: { id: params.id } });
  if (!project) {
    return badRequest({ id: params.id, error: "Project not found" });
  }
  return { project };
};

export default function Project() {
  const project = useLoaderData<Project>();
  return <ContentDisplay content={project} />;
}
