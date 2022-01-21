import { Project } from "@prisma/client";
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
} from "remix";
import invariant from "tiny-invariant";
import { Button } from "~/components/interaction/Button";
import { ImageInput } from "~/components/interaction/ImageInput";
import { Input } from "~/components/interaction/Input";
import { MarkdownField } from "~/components/interaction/MarkdownField";
import { TextArea } from "~/components/interaction/TextArea";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { requireLoggedInUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireLoggedInUser(request, "/admin/login");
  const formData = await request.formData();

  const id = formData.get("id");
  const title = formData.get("title");
  const slug = formData.get("slug");
  const fullText = formData.get("fullText");
  const description = formData.get("description");
  const thumbnail = formData.get("thumbnail");

  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof slug !== "string" ||
    typeof fullText !== "string" ||
    typeof description !== "string" ||
    typeof thumbnail !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  await db.project.update({
    where: { id: id },
    data: {
      title,
      slug,
      description,
      fullText,
      thumbnail,
      authorId: userId,
    },
  });

  return redirect("/admin/projects/");
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Expected params.id");
  return db.project.findUnique({ where: { id: params.id } });
};

export default function EditProject() {
  const project = useLoaderData<Project>();
  return (
    <>
      <div className="fixed bottom-10 right-10 flex flex-col gap-5">
        <Link to="preview">
          <Button variant="round" style={{ width: 70, height: 70 }}>
            P
          </Button>
        </Link>
        <Link to="resources">
          <Button variant="round" style={{ width: 70, height: 70 }}>
            R
          </Button>
        </Link>
      </div>
      <Form method="post" className="flex flex-col gap-5 w-full">
        <input type="hidden" name="id" value={project.id} />
        <div>
          <label htmlFor="title">Project Title</label>
          <Input
            type="text"
            id="title"
            name="title"
            className="w-full"
            defaultValue={project.title || ""}
          />
        </div>
        <div>
          <label htmlFor="slug">Project Slug</label>
          <Input
            type="text"
            id="slug"
            name="slug"
            className="w-full"
            defaultValue={project.slug || ""}
          />
        </div>
        <div>
          <label htmlFor="thumbnail">Thumbnail</label>
          <ImageInput
            id="thumbnail"
            name="thumbnail"
            className="w-full"
            defaultValue={project.thumbnail || ""}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <TextArea
            id="description"
            rows={5}
            name="description"
            className="w-full"
            defaultValue={project.description || ""}
          />
        </div>
        <div>
          <label htmlFor="fullText">Full Text</label>
          <MarkdownField
            id="fullText"
            rows={10}
            name="fullText"
            className="w-full"
            defaultValue={project.fullText || ""}
          />
        </div>
        <div>
          <Button type="submit">Update Project</Button>
        </div>
      </Form>
      <Outlet />
    </>
  );
}
