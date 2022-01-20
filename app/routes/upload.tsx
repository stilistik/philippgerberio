import { NodeOnDiskFile } from "@remix-run/node";
import { ActionFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { parseFormData } from "~/utils/file.server";
import { badRequest } from "~/utils/routing.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await parseFormData(request);
  const file: any = data.get("file");

  if (!(file instanceof NodeOnDiskFile)) {
    return badRequest("Form not submitted correctly.");
  }

  const resource = await db.resource.create({
    data: {
      name: file.name,
      url: `/uploads/${file.name}`,
      mimetype: file.type,
    },
  });

  return resource.url;
};

export const loader = () => {
  return redirect("/");
};
