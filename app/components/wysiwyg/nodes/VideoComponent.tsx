import type {
  GridSelection,
  NodeKey,
  NodeSelection,
  RangeSelection,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import { Suspense, useCallback, useEffect, useState } from "react";
import { $isVideoNode } from "./VideoNode";

function LazyVideo({
  className,
  src,
  width,
  height,
  controls,
}: {
  src: string;
  height: "inherit" | number;
  width: "inherit" | number;
  className: string | null;
  controls: boolean;
}): JSX.Element {
  return (
    <video
      className={className || undefined}
      width={width}
      height={height}
      draggable="false"
      controls={controls}
    >
      <source src={src} />
    </video>
  );
}

export default function VideoComponent({
  src,
  nodeKey,
  width,
  height,
  controls,
}: {
  src: string;
  width: "inherit" | number;
  height: "inherit" | number;
  controls: boolean;
  nodeKey: NodeKey;
}): JSX.Element {
  const [isSelected] = useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isVideoNode(node)) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    );
    return () => {
      isMounted = false;
      unregister();
    };
  }, [editor, onDelete]);

  return (
    <Suspense fallback={null}>
      <LazyVideo
        src={src}
        width={width}
        height={height}
        controls={controls}
        className=""
      />
    </Suspense>
  );
}
