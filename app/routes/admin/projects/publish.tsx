import { ActionFunction, LoaderFunction, redirect } from "remix";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { requireLoggedInUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  await requireLoggedInUser(request, "/admin/login");

  const data = await request.formData();
  const id = data.get("id") as string;

  invariant(id, "Expected id to be defined");

  const project = await db.project.findUnique({ where: { id } });
  if (project) {
    return db.project.update({
      where: { id },
      data: {
        published: !project.published,
      },
    });
  }

  return null;
};

export const loader: LoaderFunction = async () => {
  return redirect("/admin/projects");
};
