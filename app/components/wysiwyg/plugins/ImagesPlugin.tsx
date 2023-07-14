import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement } from "@lexical/utils";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalEditor,
} from "lexical";
import { useEffect, useState } from "react";
import { $createImageNode, ImageNode, ImagePayload } from "../nodes/ImageNode";
import Button from "../ui/Button";
import { DialogActions } from "../ui/Dialog";
import TextInput from "../ui/TextInput";
import { Resource } from "@prisma/client";
import { ResourceDisplay } from "~/components/interaction/ResourceBrowser";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

export function InsertImageUriDialogBody({
  resources,
  onClick,
}: {
  resources: Resource[];
  onClick: (payload: InsertImagePayload) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {resources.map((r) => (
        <button key={r.id} onClick={() => onClick({ altText: "", src: r.url })}>
          <ResourceDisplay resource={r} />
        </button>
      ))}
    </div>
  );
}

export function InsertImageDialog({
  activeEditor,
  resources,
  onClose,
}: {
  activeEditor: LexicalEditor;
  resources: Resource[];
  onClose: () => void;
}): JSX.Element {
  const onClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    onClose();
  };
  return <InsertImageUriDialogBody onClick={onClick} resources={resources} />;
}

export default function ImagesPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    editor.registerCommand<InsertImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload);
        $insertNodes([imageNode]);
        if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
          $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
