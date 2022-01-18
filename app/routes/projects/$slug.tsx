import { Project } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { PageLayout } from "~/components/PageLayout";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return db.project.findUnique({ where: { slug: params.slug } });
};

export default function Project() {
  const project = useLoaderData<Project>();
  return (
    <PageLayout>
      <h1 className="font-black text-6xl text-red-400">{project.title}</h1>
      <article className="markdown">{project.fullText}</article>
    </PageLayout>
  );
}
