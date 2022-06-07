import { Post, Project } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/interaction/Button";
import { Checkbox } from "~/components/interaction/Checkbox";
import { ImageInput } from "~/components/interaction/ImageInput";
import { Input } from "~/components/interaction/Input";
import { MarkdownField } from "~/components/interaction/MarkdownField";
import { TextArea } from "~/components/interaction/TextArea";
import { AirplayIcon } from "~/icons/Airplay";
import { DeleteIcon } from "~/icons/Delete";
import { FolderOpenIcon } from "~/icons/FolderOpen";
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
  const published = Boolean(formData.get("published"));

  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof slug !== "string" ||
    typeof fullText !== "string" ||
    typeof description !== "string" ||
    typeof thumbnail !== "string" ||
    typeof published !== "boolean"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  await db.post.update({
    where: { id: id },
    data: {
      title,
      slug,
      description,
      fullText,
      thumbnail,
      published,
      authorId: userId,
    },
  });

  return redirect(`/admin/posts/${id}/preview`);
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Expected params.id");
  return db.post.findUnique({ where: { id: params.id } });
};

export default function EditProject() {
  const post = useLoaderData<Post>();
  return (
    <>
      <div className="fixed bottom-10 right-10 flex flex-col gap-5">
        <Form action="delete" method="post">
          <input type="hidden" name="id" value={post.id} />
          <Button
            type="submit"
            variant="round"
            onClick={(e) => e.stopPropagation()}
          >
            <DeleteIcon />
          </Button>
        </Form>
        <Link to="preview">
          <Button variant="round">
            <AirplayIcon />
          </Button>
        </Link>
        <Link to="resources">
          <Button variant="round">
            <FolderOpenIcon />
          </Button>
        </Link>
      </div>
      <Form method="post" className="flex flex-col gap-5 w-full">
        <input type="hidden" name="id" value={post.id} />
        <div>
          <label htmlFor="title">Post Title</label>
          <Input
            type="text"
            id="title"
            name="title"
            className="w-full"
            defaultValue={post.title || ""}
          />
        </div>
        <div>
          <label htmlFor="slug">Post Slug</label>
          <Input
            type="text"
            id="slug"
            name="slug"
            className="w-full"
            defaultValue={post.slug || ""}
          />
        </div>
        <div>
          <label htmlFor="thumbnail">Thumbnail</label>
          <ImageInput
            id="thumbnail"
            name="thumbnail"
            className="w-full"
            defaultValue={post.thumbnail || ""}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <TextArea
            id="description"
            rows={5}
            name="description"
            className="w-full"
            defaultValue={post.description || ""}
          />
        </div>
        <div>
          <label htmlFor="fullText">Full Text</label>
          <MarkdownField
            id="fullText"
            rows={10}
            name="fullText"
            className="w-full"
            defaultValue={post.fullText || ""}
          />
        </div>
        <Checkbox
          label="Published"
          name="published"
          id="published"
          defaultChecked={post.published}
        />
        <div>
          <Button type="submit">Save & View</Button>
        </div>
      </Form>
      <Outlet />
    </>
  );
}
