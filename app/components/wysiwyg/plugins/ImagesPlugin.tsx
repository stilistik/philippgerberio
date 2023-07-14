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
import { useEffect } from "react";
import { $createImageNode, ImageNode, ImagePayload } from "../nodes/ImageNode";
import { Resource } from "@prisma/client";
import { ResourceDisplay } from "~/components/interaction/ResourceBrowser";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

export const INCREASE_IMAGE_SIZE_COMMAND: LexicalCommand<undefined> =
  createCommand("INCREASE_IMAGE_SIZE");

export const DECREASE_IMAGE_SIZE_COMMAND: LexicalCommand<undefined> =
  createCommand("DECREASE_IMAGE_SIZE");

export function InsertImageUriDialogBody({
  resources,
  onClick,
}: {
  resources: Resource[];
  onClick: (payload: InsertImagePayload) => void;
}) {
  const images = resources.filter((r) => r.mimetype.includes("image"));
  return (
    <div className="flex gap-2 flex-wrap">
      {images.map((r) => (
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
