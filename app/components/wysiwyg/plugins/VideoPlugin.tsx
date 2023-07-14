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
import { Resource } from "@prisma/client";
import { ResourceDisplay } from "~/components/interaction/ResourceBrowser";
import { $createVideoNode, VideoNode, VideoPayload } from "../nodes/VideoNode";

export type InsertVideoPayload = Readonly<VideoPayload>;

export const INSERT_VIDEO_COMMAND: LexicalCommand<InsertVideoPayload> =
  createCommand("INSERT_VIDEO_COMMAND");

export function InsertImageUriDialogBody({
  resources,
  onClick,
}: {
  resources: Resource[];
  onClick: (payload: InsertVideoPayload) => void;
}) {
  const images = resources.filter((r) => r.mimetype.includes("video"));
  return (
    <div className="flex gap-2 flex-wrap">
      {images.map((r) => (
        <button key={r.id} onClick={() => onClick({ src: r.url })}>
          <ResourceDisplay resource={r} />
        </button>
      ))}
    </div>
  );
}

export function InsertVideoDialog({
  activeEditor,
  resources,
  onClose,
}: {
  activeEditor: LexicalEditor;
  resources: Resource[];
  onClose: () => void;
}): JSX.Element {
  const onClick = (payload: InsertVideoPayload) => {
    activeEditor.dispatchCommand(INSERT_VIDEO_COMMAND, payload);
    onClose();
  };
  return <InsertImageUriDialogBody onClick={onClick} resources={resources} />;
}

export default function VideoPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([VideoNode])) {
      throw new Error("VideoPlugin: VideoNode not registered on editor");
    }

    editor.registerCommand<InsertVideoPayload>(
      INSERT_VIDEO_COMMAND,
      (payload) => {
        const imageNode = $createVideoNode(payload);
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
