import React from "react";
import { Post, Project, Resource } from "@prisma/client";
import { Form, Link, Outlet, useNavigate, useSubmit } from "@remix-run/react";
import { Button } from "~/components/interaction/Button";
import {
  ContentEditableField,
  ContentEditableFieldRef,
} from "~/components/interaction/ContentEditableField";
import { ImageInput } from "~/components/interaction/ImageInput";
import { Editor } from "~/components/wysiwyg/Editor";
import { AirplayIcon } from "~/icons/Airplay";
import { DeleteIcon } from "~/icons/Delete";
import { FolderOpenIcon } from "~/icons/FolderOpen";
import { SaveIcon } from "~/icons/Save";
import { CheckCircleIcon } from "~/icons/CheckCircle";
import { CheckCircleBlankIcon } from "~/icons/CheckCircleBlank";

type ResourcePasteTarget = "text" | "thumbnail";

interface EditContentProps {
  content: Project | Post;
}

export function EditContent({ content }: EditContentProps) {
  const editorRef = React.useRef<ContentEditableFieldRef>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const publishRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const submit = useSubmit();
  const [thumbnail, setThumbnail] = React.useState("");
  const [resourceTarget, setResourceTarget] =
    React.useState<ResourcePasteTarget>("text");

  function handleResourceSelected(resource: Resource) {
    switch (resourceTarget) {
      case "text": {
        if (editorRef.current) {
          if (resource.mimetype.includes("image")) {
            editorRef.current.insertContent(
              `<img src=${resource.url} class="prose-image" />`
            );
          } else if (resource.mimetype.includes("video")) {
            editorRef.current.insertContent(
              `<video autoplay controls><source src="${resource.url}" type="${resource.mimetype}"></video>`
            );
          }
        }
        break;
      }
      case "thumbnail": {
        setThumbnail(resource.url);
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
      publishRef.current.value = String(!content.published);
      console.log(publishRef.current.checked);
      submit(formRef.current);
    }
  }

  function handleSubmit() {
    submit(formRef.current);
  }

  return (
    <>
      <Form ref={formRef} method="post">
        <header>
          <input type="hidden" name="id" value={content.id} />
          <input
            ref={publishRef}
            type="hidden"
            name="published"
            defaultValue={String(content.published)}
          />
          <ContentEditableField
            element="h1"
            name="title"
            placeholder="Project title"
            defaultValue={content.title ?? ""}
          />
          <ContentEditableField
            element="h3"
            name="description"
            placeholder="Project description"
            defaultValue={content.description ?? ""}
          />
          <ImageInput
            name="thumbnail"
            value={thumbnail || content.thumbnail || ""}
            onClick={handleClickThumbnail}
          />
        </header>
      </Form>
      <main>
        <Editor />
      </main>

      <div className="fixed bottom-10 right-10 flex flex-col gap-5">
        <Form action="delete" method="post">
          <input type="hidden" name="id" value={content.id} />
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
          {content.published ? <CheckCircleIcon /> : <CheckCircleBlankIcon />}
        </Button>
        <Button onClick={handleSubmit} variant="round">
          <SaveIcon />
        </Button>
      </div>
      <div className="fixed z-20">
        <Outlet context={{ onResourceSelected: handleResourceSelected }} />
      </div>
    </>
  );
}
