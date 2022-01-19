import { ActionFunction, redirect } from "remix";
import { parseFormData } from "~/utils/upload.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await parseFormData(request);
  const file = data.get("file");
  console.log(file);

  return file;
};

export const loader = () => {
  return redirect("/");
};
