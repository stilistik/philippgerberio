import { Project } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { parsemd } from "~/utils/md.server";

interface LoaderData {
  project: Project;
  html: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  const project = await db.project.findUnique({ where: { slug: params.slug } });
  if (!project) {
    return badRequest({ slug: params.slug, error: "Project not found" });
  }
  const html = parsemd(project.fullText || "");
  return { project, html };
};

export default function Project() {
  const { project, html } = useLoaderData<LoaderData>();
  return (
    <main>
      <h1>{project.title}</h1>
      <img src={project.thumbnail || ""} alt="the project thumbnail image" />
      <h5>{project.description}</h5>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
