import type { LexicalEditor, NodeKey } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import clx from "classnames";
import { $isImageNode } from "./ImageNode";
import { IconButton } from "~/components/interaction/IconButton";
import { MinusIcon } from "~/icons/Minus";
import { PlusIcon } from "~/icons/Plus";
import {
  DECREASE_IMAGE_SIZE_COMMAND,
  INCREASE_IMAGE_SIZE_COMMAND,
} from "../plugins/ImagesPlugin";
import { $isCustomParagraphNode } from "./CustomParagraphNode";

const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

function LazyImage({
  altText,
  imageRef,
  src,
}: {
  src: string;
  altText: string;
  imageRef: { current: null | HTMLImageElement };
}): JSX.Element {
  useSuspenseImage(src);
  return (
    <img
      src={src}
      alt={altText}
      ref={imageRef}
      width="100%"
      draggable="false"
    />
  );
}

const SIZE_CLASSES = [
  "col-span-8 col-start-3",
  "col-span-10 col-start-2",
  "col-span-full",
];

export default function ImageComponent({
  src,
  altText,
  nodeKey,
}: {
  src: string;
  altText: string;
  nodeKey: NodeKey;
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();

  const activeEditorRef = useRef<LexicalEditor | null>(null);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  const onIncreaseSize = useCallback(() => {
    if (isSelected && $isNodeSelection($getSelection())) {
      const node = $getNodeByKey(nodeKey);
      const parent = node?.getParent();
      if ($isCustomParagraphNode(parent)) {
        const index = Math.min(
          SIZE_CLASSES.indexOf(parent.__className || SIZE_CLASSES[1]) + 1,
          SIZE_CLASSES.length - 1
        );
        parent.setClassName(SIZE_CLASSES[index]);
      }
    }
    return true;
  }, [isSelected, nodeKey]);

  const onDecreaseSize = useCallback(() => {
    if (isSelected && $isNodeSelection($getSelection())) {
      const node = $getNodeByKey(nodeKey);
      const parent = node?.getParent();
      if ($isCustomParagraphNode(parent)) {
        const index = Math.max(
          SIZE_CLASSES.indexOf(parent.__className || SIZE_CLASSES[1]) - 1,
          0
        );
        parent.setClassName(SIZE_CLASSES[index]);
      }
    }
    return true;
  }, [isSelected, nodeKey]);

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;

          if (isSelected) {
            console.log("click selected");
          }

          if (event.target === imageRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        INCREASE_IMAGE_SIZE_COMMAND,
        onIncreaseSize,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DECREASE_IMAGE_SIZE_COMMAND,
        onDecreaseSize,
        COMMAND_PRIORITY_LOW
      )
    );
    return () => {
      isMounted = false;
      unregister();
    };
  }, [
    clearSelection,
    editor,
    isSelected,
    nodeKey,
    onDelete,
    onIncreaseSize,
    onDecreaseSize,
    setSelected,
  ]);

  return (
    <Suspense fallback={null}>
      <div
        className={clx("relative w-full rounded-lg", {
          "outline outline-4 outline-blue-400": isSelected,
        })}
      >
        <LazyImage src={src} altText={altText} imageRef={imageRef} />
        {isSelected ? (
          <div className="absolute bottom-0 right-5 flex gap-5 bg-white px-3 rounded-lg">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                editor.dispatchCommand(DECREASE_IMAGE_SIZE_COMMAND, undefined);
              }}
            >
              <MinusIcon />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                editor.dispatchCommand(INCREASE_IMAGE_SIZE_COMMAND, undefined);
              }}
            >
              <PlusIcon />
            </IconButton>
          </div>
        ) : null}
      </div>
    </Suspense>
  );
}
