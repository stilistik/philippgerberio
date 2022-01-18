import { Project } from "@prisma/client";
import { marked } from "marked";
import { LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { PageLayout } from "~/components/PageLayout";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import hljs from "highlight.js";
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
  const html = parsemd(project.fullText);

  return { project, html };
};

export default function Project() {
  const { project, html } = useLoaderData<LoaderData>();
  return (
    <PageLayout>
      <h1 className="font-black text-6xl text-red-400">{project.title}</h1>
      <article
        className="markdown"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </PageLayout>
  );
}
