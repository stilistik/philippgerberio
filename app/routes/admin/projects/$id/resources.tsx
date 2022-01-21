import { Resource } from "@prisma/client";
import { NodeOnDiskFile } from "@remix-run/node";
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  useLoaderData,
  useSubmit,
} from "remix";
import invariant from "tiny-invariant";
import { Button } from "~/components/interaction/Button";
import { ResourceBrowser } from "~/components/interaction/ResourceBrowser";
import { CloseIcon } from "~/icons/Close";
import { UploadIcon } from "~/icons/Upload";
import { db } from "~/utils/db.server";
import { deletefile, parseFormData } from "~/utils/file.server";
import { requireLoggedInUser } from "~/utils/session.server";

async function handlePostRequest(request: Request, projectId: string) {
  const data = await parseFormData(request);
  const file = data.get("file") as NodeOnDiskFile;

  return db.resource.create({
    data: {
      name: file.name,
      url: `/uploads/${file.name}`,
      mimetype: file.type,
      projectId,
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

export const action: ActionFunction = async ({ request, params }) => {
  await requireLoggedInUser(request);

  invariant(params.id, "Expected params.id");

  switch (request.method) {
    case "POST":
      return handlePostRequest(request, params.id);
    case "DELETE":
      return handleDeleteRequest(request);
    default:
      throw new Error("Unsupported request method");
  }
};

export const loader: LoaderFunction = ({ params }) => {
  invariant(params.id, "Expected params.id");
  return db.resource.findMany({ where: { projectId: params.id } });
};

export default function Resources() {
  const resources = useLoaderData<Resource[]>();
  const submit = useSubmit();

  const handleChange = (e: any) => {
    submit(e.currentTarget, { replace: true });
  };
  return (
    <div className="fixed top-0 right-0 bg-white shadow-2xl h-screen w-96 flex flex-col">
      <div className="flex justify-between p-3 bg-gray-100">
        <Form
          method="post"
          encType="multipart/form-data"
          onChange={handleChange}
        >
          <input
            accept="*"
            style={{ display: "none" }}
            id="upload-input"
            type="file"
            name="file"
          />
          <label htmlFor="upload-input">
            <div
              role="button"
              className="button-base button-small button-variant-default cursor-pointer"
            >
              <UploadIcon />
            </div>
          </label>
        </Form>
        <Link to="../">
          <Button size="small">
            <CloseIcon />
          </Button>
        </Link>
      </div>
      <ResourceBrowser resources={resources} onDelete={handleChange} />
    </div>
  );
}
