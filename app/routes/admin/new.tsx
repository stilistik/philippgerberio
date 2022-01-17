import { ActionFunction, Form, redirect } from "remix";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { TextArea } from "~/components/TextArea";
import { createPost } from "~/post";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const fullText = formData.get("fullText");
  const description = formData.get("description");

  const errors: Record<string, boolean> = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!fullText) errors.fullText = true;
  if (!description) errors.description = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  await createPost({ title, slug, description, fullText, authorId: 1 });

  return redirect("/posts/" + slug);
};

export default function NewPost() {
  return (
    <Form method="post" className="flex flex-col gap-5 w-full">
      <p>
        <label htmlFor="title">Post Title:</label>
        <Input type="text" id="title" name="title" className="w-full" />
      </p>
      <p>
        <label htmlFor="slug">Post Slug:</label>
        <Input type="text" id="slug" name="slug" className="w-full" />
      </p>
      <p>
        <label htmlFor="description">Description:</label>
        <TextArea
          id="description"
          rows={5}
          name="description"
          className="w-full"
        />
      </p>
      <p>
        <label htmlFor="fullText">Full Text:</label>
        <TextArea id="fullText" rows={10} name="fullText" className="w-full" />
      </p>
      <p>
        <Button type="submit">Create Post</Button>
      </p>
    </Form>
  );
}
