import { ActionFunction, LoaderFunction, redirect } from "remix";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { requireLoggedInUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  await requireLoggedInUser(request, "/admin/login");

  invariant(params.slug, "Expected params.slug");

  await db.project.delete({
    where: { slug: params.slug },
  });

  return redirect("/admin/projects");
};

export const loader: LoaderFunction = async () => {
  return redirect("/admin/projects");
};
