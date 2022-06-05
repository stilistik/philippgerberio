import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { deletefile } from "~/utils/file.server";
import { requireLoggedInUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  await requireLoggedInUser(request, "/admin/login");

  invariant(params.id, "Expected params.id");

  const resourcesToDelete = await db.resource.findMany({
    where: { projectId: params.id },
  });

  resourcesToDelete.forEach((res) => {
    deletefile(res.url);
  });

  await db.resource.deleteMany({ where: { projectId: params.id } });

  await db.project.delete({
    where: { id: params.id },
  });

  return redirect("/admin/projects");
};

export const loader: LoaderFunction = async () => {
  return redirect("/admin/projects");
};
