import { Resource } from "@prisma/client";
import { NodeOnDiskFile } from "@remix-run/node";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { Button } from "~/components/interaction/Button";
import { ResourceBrowser } from "~/components/interaction/ResourceBrowser";
import { CloseIcon } from "~/icons/Close";
import { db } from "~/utils/db.server";
import { deletefile, parseFormData } from "~/utils/file.server";
import { requireLoggedInUser } from "~/utils/session.server";

async function handlePostRequest(request: Request) {
  const data = await parseFormData(request);
  const file = data.get("file") as NodeOnDiskFile;

  return db.resource.create({
    data: {
      name: file.name,
      url: `/uploads/${file.name}`,
      mimetype: file.type,
    },
  });
}

async function handleDeleteRequest(request: Request) {
  const data = await request.formData();
  const id = data.get("id") as string;

  const deleted = await db.resource.delete({
    where: { id },
  });

  deletefile(deleted.url);
  return deleted;
}

export const action: ActionFunction = async ({ request }) => {
  await requireLoggedInUser(request);
  switch (request.method) {
    case "POST":
      return handlePostRequest(request);
    case "DELETE":
      return handleDeleteRequest(request);
    default:
      throw new Error("Unsupported request method");
  }
};

export const loader: LoaderFunction = () => {
  return db.resource.findMany();
};

export default function Resources() {
  const resources = useLoaderData<Resource[]>();
  const submit = useSubmit();

  const handleChange = (e: any) => {
    submit(e.currentTarget, { replace: true });
  };
  return (
    <div className="fixed top-0 right-0 bg-white shadow-2xl h-screen">
      <div className="flex justify-between">
        <Form
          method="post"
          encType="multipart/form-data"
          onChange={handleChange}
        >
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-input"
            type="file"
            name="file"
          />
          <br />
          <label htmlFor="upload-input">
            <span>Upload</span>
          </label>
        </Form>
        <Link to="../">
          <Button>
            <CloseIcon />
          </Button>
        </Link>
      </div>
      <ResourceBrowser resources={resources} onDelete={handleChange} />;
    </div>
  );
}
