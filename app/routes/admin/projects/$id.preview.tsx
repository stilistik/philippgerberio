import { Project } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { parsemd } from "~/utils/md.server";

interface LoaderData {
  project: Project;
  html: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "expected params.id");
  const project = await db.project.findUnique({ where: { id: params.id } });
  if (!project) {
    return badRequest({ id: params.id, error: "Project not found" });
  }
  const html = parsemd(project.fullText || "");
  return { project, html };
};

export default function Project() {
  const { project, html } = useLoaderData<LoaderData>();
  return (
    <>
      <header>
        <h1>{project.title}</h1>
        <h3>{project.description}</h3>
        <img src={project.thumbnail || ""} alt="the project thumbnail image" />
      </header>
      <main dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
