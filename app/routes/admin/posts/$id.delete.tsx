import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";
import { deletefile } from "~/utils/file.server";
import { requireLoggedInUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  await requireLoggedInUser(request, "/admin/login");

  invariant(params.id, "Expected params.id");

  const resourcesToDelete = await db.resource.findMany({
    where: { postId: params.id },
  });

  resourcesToDelete.forEach((res) => {
    deletefile(res.url);
  });

  await db.resource.deleteMany({ where: { postId: params.id } });

  await db.post.delete({
    where: { id: params.id },
  });

  return redirect("/admin/posts");
};

export const loader: LoaderFunction = async () => {
  return redirect("/admin/posts");
};
