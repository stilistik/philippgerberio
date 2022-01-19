import {
  ActionFunction,
  Form,
  redirect,
  unstable_parseMultipartFormData,
} from "remix";
import { Button } from "~/components/interaction/Button";
import { Input } from "~/components/interaction/Input";
import { MarkdownField } from "~/components/interaction/MarkdownField";
import { TextArea } from "~/components/interaction/TextArea";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/routing.server";
import { requireLoggedInUser } from "~/utils/session.server";
import { uploadHandler } from "~/utils/file.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireLoggedInUser(request, "/admin/login");

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

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
  function handleChange(e: any) {
    const file = e.currentTarget.files[0];

    const formData = new FormData();
    formData.append("file", file);

    fetch("/upload", {
      method: "POST",
      body: formData,
    }).then((response) => {
      console.log(response);
    });
  }

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      className="flex flex-col gap-5 w-full"
    >
      <p>
        <label htmlFor="title">Project Title</label>
        <Input type="text" id="title" name="title" className="w-full" />
      </p>
      <p>
        <label htmlFor="slug">Project Slug</label>
        <Input type="text" id="slug" name="slug" className="w-full" />
      </p>
      <p>
        <label htmlFor="thumbnail">Thumbnail</label>
        <Input
          type="file"
          id="thumbnail"
          name="thumbnail"
          accept="image/*"
          className="w-full"
          onChange={handleChange}
        />
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
        <MarkdownField
          id="fullText"
          rows={10}
          name="fullText"
          className="w-full"
        />
      </p>
      <p>
        <Button type="submit">Create Project</Button>
      </p>
    </Form>
  );
}
