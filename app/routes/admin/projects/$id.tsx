import { Project, Resource } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { EditContent } from "~/components/content/EditContent";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { requireLoggedInUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireLoggedInUser(request, "/admin/login");
  const formData = await request.formData();

  const id = formData.get("id");
  const title = formData.get("title");
  const fullText = formData.get("fullText");
  const description = formData.get("description");
  const thumbnail = formData.get("thumbnail");
  const published = formData.get("published") === "true" ? true : false;

  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof fullText !== "string" ||
    typeof description !== "string" ||
    typeof thumbnail !== "string" ||
    typeof published !== "boolean"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const slug = title.replace(" ", "-").toLowerCase();

  await db.project.update({
    where: { id: id },
    data: {
      title,
      slug,
      description,
      fullText,
      thumbnail,
      published,
      authorId: userId,
    },
  });

  return redirect(`/admin/projects/${id}`);
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Expected params.id");
  const project = await db.project.findUnique({ where: { id: params.id } });

  const resources = await db.resource.findMany({
    where: { projectId: params.id },
  });

  return { project, resources };
};

export default function EditProject() {
  const { project, resources } = useLoaderData<{
    project: Project;
    resources: Resource[];
  }>();

  return <EditContent content={project} resources={resources} />;
}
