import { Project } from "@prisma/client";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import invariant from "tiny-invariant";
import { Button } from "~/components/interaction/Button";
import { Input } from "~/components/interaction/Input";
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

  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof slug !== "string" ||
    typeof fullText !== "string" ||
    typeof description !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  await db.project.update({
    where: { id: id },
    data: { title, slug, description, fullText, authorId: userId },
  });

  return redirect("/projects/" + slug);
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "Expected params.slug");
  return db.project.findUnique({ where: { slug: params.slug } });
};

export default function EditProject() {
  const project = useLoaderData<Project>();
  return (
    <Form method="post" className="flex flex-col gap-5 w-full">
      <input type="hidden" name="id" value={project.id} />
      <p>
        <label htmlFor="title">Project Title</label>
        <Input
          type="text"
          id="title"
          name="title"
          defaultValue={project.title}
          className="w-full"
        />
      </p>
      <p>
        <label htmlFor="slug">Project Slug</label>
        <Input
          type="text"
          id="slug"
          name="slug"
          defaultValue={project.slug}
          className="w-full"
        />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <TextArea
          id="description"
          rows={5}
          name="description"
          defaultValue={project.description}
          className="w-full"
        />
      </p>
      <p>
        <label htmlFor="fullText">Full Text</label>
        <TextArea
          id="fullText"
          rows={10}
          name="fullText"
          defaultValue={project.fullText}
          className="w-full"
        />
      </p>
      <p>
        <Button type="submit">Create Project</Button>
      </p>
    </Form>
  );
}
