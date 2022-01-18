import { ActionFunction, Form, redirect } from "remix";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { TextArea } from "~/components/TextArea";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { requireLoggedInUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireLoggedInUser(request, "/admin/login");

  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const fullText = formData.get("fullText");
  const description = formData.get("description");

  if (
    typeof title !== "string" ||
    typeof slug !== "string" ||
    typeof fullText !== "string" ||
    typeof description !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  await db.project.create({
    data: { title, slug, description, fullText, authorId: userId },
  });

  return redirect("/projects/" + slug);
};

export default function NewProject() {
  return (
    <Form method="post" className="flex flex-col gap-5 w-full">
      <p>
        <label htmlFor="title">Project Title</label>
        <Input type="text" id="title" name="title" className="w-full" />
      </p>
      <p>
        <label htmlFor="slug">Project Slug</label>
        <Input type="text" id="slug" name="slug" className="w-full" />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <TextArea
          id="description"
          rows={5}
          name="description"
          className="w-full"
        />
      </p>
      <p>
        <label htmlFor="fullText">Full Text</label>
        <TextArea id="fullText" rows={10} name="fullText" className="w-full" />
      </p>
      <p>
        <Button type="submit">Create Project</Button>
      </p>
    </Form>
  );
}
