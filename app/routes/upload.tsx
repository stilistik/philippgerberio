import { ActionFunction, redirect } from "remix";
import { parseFormData } from "~/utils/file.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await parseFormData(request);
  const file: any = data.get("file");
  return `/uploads/${file.name}`;
};

export const loader = () => {
  return redirect("/");
};
