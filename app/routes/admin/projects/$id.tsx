import { Project } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/components/interaction/Button";
import { Checkbox } from "~/components/interaction/Checkbox";
import { ContentEditableField } from "~/components/interaction/ContentEditableField";
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
  const fullText = formData.get("fullText");
  const description = formData.get("description");
  const thumbnail = formData.get("thumbnail");
  const published = Boolean(formData.get("published"));

  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof fullText !== "string" ||
    typeof description !== "string" ||
    typeof thumbnail !== "string" ||
    typeof published !== "boolean"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const slug = title.replace(" ", "-").toLowerCase();

  await db.project.update({
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

  return redirect(`/admin/projects/${id}/preview`);
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Expected params.id");
  return db.project.findUnique({ where: { id: params.id } });
};

export default function EditProject() {
  const project = useLoaderData<Project>();
  const searchParams = useSearchParams();

  const thumbnail = searchParams[0].get("thumbnail") ?? "";

  return (
    <>
      <div className="fixed bottom-10 right-10 flex flex-col gap-5">
        <Form action="delete" method="post">
          <input type="hidden" name="id" value={project.id} />
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
      <Form method="post">
        <header>
          <input type="hidden" name="id" value={project.id} />
          <ContentEditableField
            element="h1"
            name="title"
            placeholder="Project title"
            defaultValue={project.title ?? ""}
          />
          <ContentEditableField
            element="h3"
            name="description"
            placeholder="Project description"
            defaultValue={project.description ?? ""}
          />
          <ImageInput name="thumbnail" value={thumbnail} />
        </header>
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
        <Checkbox
          label="Published"
          name="published"
          id="published"
          defaultChecked={project.published}
        />
        <div>
          <Button type="submit">Save & View</Button>
        </div>
      </Form>
      <Outlet />
    </>
  );
}
