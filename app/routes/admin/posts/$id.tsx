import { Post } from "@prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { Button } from "~/components/interaction/Button";
import { Checkbox } from "~/components/interaction/Checkbox";
import {
  ContentEditableField,
  ContentEditableFieldRef,
} from "~/components/interaction/ContentEditableField";
import { ImageInput } from "~/components/interaction/ImageInput";
import { Editor } from "~/components/wysiwyg/Editor";
import { AirplayIcon } from "~/icons/Airplay";
import { CheckCircleIcon } from "~/icons/CheckCircle";
import { CheckCircleBlankIcon } from "~/icons/CheckCircleBlank";
import { DeleteIcon } from "~/icons/Delete";
import { FolderOpenIcon } from "~/icons/FolderOpen";
import { SaveIcon } from "~/icons/Save";
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
  const published = formData.get("published") === "true" ? true : false;

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

type ResourcePasteTarget = "text" | "thumbnail";

export default function EditPost() {
  const post = useLoaderData<Post>();
  const editorRef = React.useRef<ContentEditableFieldRef>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const publishRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const submit = useSubmit();
  const [thumbnail, setThumbnail] = React.useState("");
  const [resourceTarget, setResourceTarget] =
    React.useState<ResourcePasteTarget>("text");

  function handleImageSelected(url: string) {
    switch (resourceTarget) {
      case "text": {
        if (editorRef.current) {
          editorRef.current.insertContent(
            `<img class="prose-image" src=${url} />`
          );
        }
        break;
      }
      case "thumbnail": {
        setThumbnail(url);
        setResourceTarget("text");
      }
    }
  }

  function handleClickThumbnail(e: React.MouseEvent) {
    e.preventDefault();
    navigate("resources");
    setResourceTarget("thumbnail");
  }

  function handlePublish(e: React.MouseEvent) {
    e.preventDefault();

    if (publishRef.current) {
      publishRef.current.value = String(!post.published);
      console.log(publishRef.current.checked);
      submit(formRef.current);
    }
  }

  function handleSubmit() {
    submit(formRef.current);
  }

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
      <Form method="post" ref={formRef}>
        <header>
          <input type="hidden" name="id" value={post.id} />
          <input
            ref={publishRef}
            type="hidden"
            name="published"
            defaultValue={String(post.published)}
          />
          <ContentEditableField
            element="h1"
            name="title"
            placeholder="Post title"
            defaultValue={post.title ?? ""}
          />
          <ContentEditableField
            element="h3"
            name="description"
            placeholder="Post description"
            defaultValue={post.description ?? ""}
          />
          <ImageInput
            name="thumbnail"
            value={thumbnail || post.thumbnail || ""}
            onClick={handleClickThumbnail}
          />
        </header>
        <Editor
          ref={editorRef}
          name="fullText"
          defaultValue={post.fullText ?? ""}
        />
      </Form>
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
        <Button onClick={handlePublish} variant="round">
          {post.published ? <CheckCircleIcon /> : <CheckCircleBlankIcon />}
        </Button>
        <Button onClick={handleSubmit} variant="round">
          <SaveIcon />
        </Button>
      </div>
      <div className="fixed z-20">
        <Outlet context={{ onImageSelected: handleImageSelected }} />
      </div>
    </>
  );
}
