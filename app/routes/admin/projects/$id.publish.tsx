import { ActionFunction, LoaderFunction, redirect } from "remix";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { requireLoggedInUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  await requireLoggedInUser(request, "/admin/login");

  const data = await request.formData();

  invariant(params.id, "Expected id to be defined");

  const project = await db.project.findUnique({ where: { id: params.id } });
  if (project) {
    await db.project.update({
      where: { id: params.id },
      data: {
        published: !project.published,
      },
    });
  }

  return redirect("/admin/projects/" + params.id);
};

export const loader: LoaderFunction = async () => {
  return redirect("/admin/projects");
};
