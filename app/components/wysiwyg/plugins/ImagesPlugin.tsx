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
import { useEffect, useRef, useState } from "react";
import { $createImageNode, ImageNode, ImagePayload } from "../nodes/ImageNode";
import Button from "../ui/Button";
import { DialogActions, DialogButtonsList } from "../ui/Dialog";
import TextInput from "../ui/TextInput";
import FileInput from "../ui/FileInput";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

export function InsertImageUriDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");

  const isDisabled = src === "";

  return (
    <>
      <TextInput label="Image URL" onChange={setSrc} value={src} />
      <TextInput label="Alt Text" onChange={setAltText} value={altText} />
      <DialogActions>
        <Button disabled={isDisabled} onClick={() => onClick({ altText, src })}>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}

export function InsertImageDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const onClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    onClose();
  };
  return <InsertImageUriDialogBody onClick={onClick} />;
}

export default function ImagesPlugin({
  captionsEnabled,
}: {
  captionsEnabled?: boolean;
}): JSX.Element | null {
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
  }, [captionsEnabled, editor]);

  return null;
}
