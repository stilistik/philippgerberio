import { ActionFunction, LoaderFunction, redirect } from "remix";
import { requireLoggedInUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  await requireLoggedInUser(request);

  return redirect("");
};

export const loader: LoaderFunction = () => {
  return redirect("/");
};