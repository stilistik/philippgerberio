import { ActionFunction, Form, Link, redirect } from "remix";
import { Button } from "~/components/interaction/Button";
import { Input } from "~/components/interaction/Input";
import { MarkdownField } from "~/components/interaction/MarkdownField";
import { TextArea } from "~/components/interaction/TextArea";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { requireLoggedInUser } from "~/utils/session.server";
import { ImageInput } from "~/components/interaction/ImageInput";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireLoggedInUser(request, "/admin/login");
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const fullText = formData.get("fullText");
  const description = formData.get("description");
  const thumbnail = formData.get("thumbnail");

  if (
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

  await db.project.create({
    data: {
      title,
      slug,
      description,
      fullText,
      thumbnail,
      authorId: userId,
    },
  });

  return redirect("/projects/" + slug);
};

export default function NewProject() {
  return (
    <>
      <div className="fixed bottom-10 right-10">
        <Link to="resources">
          <Button>Resources</Button>
        </Link>
      </div>
      <Form method="post" className="flex flex-col gap-5 w-full">
        <div>
          <label htmlFor="title">Project Title</label>
          <Input type="text" id="title" name="title" className="w-full" />
        </div>
        <div>
          <label htmlFor="slug">Project Slug</label>
          <Input type="text" id="slug" name="slug" className="w-full" />
        </div>
        <div>
          <label htmlFor="thumbnail">Thumbnail</label>
          <ImageInput id="thumbnail" name="thumbnail" className="w-full" />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <TextArea
            id="description"
            rows={5}
            name="description"
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="fullText">Full Text</label>
          <MarkdownField
            id="fullText"
            rows={10}
            name="fullText"
            className="w-full"
          />
        </div>
        <div>
          <Button type="submit">Create Project</Button>
        </div>
      </Form>
    </>
  );
}
