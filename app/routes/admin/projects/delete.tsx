import { ActionFunction, LoaderFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { requireLoggedInUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  await requireLoggedInUser(request, "/admin/login");

  const data = await request.formData();
  const id = data.get("id");

  if (typeof id !== "string") {
    return badRequest("Form not submitted correctly");
  }

  await db.project.delete({
    where: { id },
  });

  return redirect("/admin/projects");
};

export const loader: LoaderFunction = async () => {
  return redirect("/admin/projects");
};
