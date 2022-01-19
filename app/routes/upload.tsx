import {
  ActionFunction,
  redirect,
  unstable_parseMultipartFormData,
} from "remix";
import { uploadHandler } from "~/utils/upload.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await unstable_parseMultipartFormData(request, uploadHandler);
  const file: any = data.get("file");
  return `uploads/${file.name}`;
};

export const loader = () => {
  return redirect("/");
};
