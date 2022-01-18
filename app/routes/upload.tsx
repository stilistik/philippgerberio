import { ActionFunction, redirect } from "remix";
import { uploadHandler } from "~/utils/upload.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await (request as any).formData(uploadHandler);
  return data.get("file");
};

export const loader = () => {
  return redirect("/");
};
