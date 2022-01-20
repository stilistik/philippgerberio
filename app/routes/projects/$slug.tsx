import { Project } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { parsemd } from "~/utils/md.server";
import { MainHeader } from "~/components/layout/MainHeader";
import { SubHeader } from "~/components/layout/SubHeader";

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
    <>
      <MainHeader>{project.title}</MainHeader>

      <img
        src={project.thumbnail || ""}
        className="w-full rounded-2xl border shadow-2xl mb-20"
      />

      <SubHeader>{project.description}</SubHeader>

      <article
        className="markdown"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
