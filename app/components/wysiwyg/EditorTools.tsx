import React, { FormEvent } from "react";
import { Link } from "@remix-run/react";
import { BoldIcon } from "~/icons/Bold";
import { ItalicIcon } from "~/icons/Italic";
import { RedoIcon } from "~/icons/Redo";
import { UnderlineIcon } from "~/icons/Underline";
import { UndoIcon } from "~/icons/Undo";
import { IconButton } from "../interaction/IconButton";
import { H1Icon } from "~/icons/H1";
import { H2Icon } from "~/icons/H2";
import { H3Icon } from "~/icons/H3";
import { CodeIcon } from "~/icons/Code";
import { ImageIcon } from "~/icons/Image";
import { QuoteIcon } from "~/icons/Quote";
import { TextIcon } from "~/icons/Text";
import { OrderedListIcon } from "~/icons/OrderedList";
import { UnorderedListIcon } from "~/icons/UnorderedList";
import { useEditorContext } from "./Editor";
import { LinksIcon } from "~/icons/Links";
import { Input } from "../interaction/Input";
import { useEventListener } from "~/utils/hooks";

export const EditorTools = () => {
  return (
    <div className="sticky top-0 flex gap-10 border-b bg-white p-3 px-6 z-10">
      <Undo />
      <Redo />
      <Bold />
      <Italic />
      <Underline />
      <Text />
      <H1 />
      <H2 />
      <H3 />
      <Anchor />
      <OrderedList />
      <UnorderedList />
      <Code />
      <Quote />
      <Image />
    </div>
  );
};

interface CreateToolArgs {
  command: string;
  icon: React.ReactNode;
  args?: string;
}

function createTool(
  icon: React.ReactNode,
  commands: { command: string; args?: string }[]
) {
  return function Tool() {
    const [_, forceUpdate] = React.useReducer(() => ({}), {});
    const editor = useEditorContext();

    function handleClick(e: any) {
      e.preventDefault();
      commands.forEach(({ command, args }) => {
        document.execCommand(command, false, args);
      });
      forceUpdate();
      editor?.focus();
    }

    return <IconButton onClick={handleClick}>{icon}</IconButton>;
  };
}

const Undo = createTool(<UndoIcon />, [{ command: "undo" }]);
const Redo = createTool(<RedoIcon />, [{ command: "redo" }]);
const Bold = createTool(<BoldIcon />, [{ command: "bold" }]);
const Italic = createTool(<ItalicIcon />, [{ command: "italic" }]);
const Underline = createTool(<UnderlineIcon />, [{ command: "underline" }]);

const H1 = createTool(<H1Icon />, [{ command: "formatBlock", args: "h1" }]);
const H2 = createTool(<H2Icon />, [{ command: "formatBlock", args: "h2" }]);
const H3 = createTool(<H3Icon />, [{ command: "formatBlock", args: "h3" }]);
const Text = createTool(<TextIcon />, [{ command: "formatBlock", args: "p" }]);
const Code = createTool(<CodeIcon />, [
  { command: "formatBlock", args: "pre" },
]);
const Quote = createTool(<QuoteIcon />, [
  { command: "formatBlock", args: "blockquote" },
]);

const OrderedList = createTool(<OrderedListIcon />, [
  { command: "insertOrderedList" },
]);
const UnorderedList = createTool(<UnorderedListIcon />, [
  { command: "insertUnorderedList" },
]);

const Image = () => {
  return (
    <Link to="resources?q=image">
      <IconButton>
        <ImageIcon />
      </IconButton>
    </Link>
  );
};

const Anchor = () => {
  const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
  const editor = useEditorContext();
  const [url, setUrl] = React.useState("");
  const [text, setText] = React.useState("");
  const rangeRef = React.useRef<Range | null>(null);

  if (typeof document !== "undefined") {
    useEventListener(document, "keydown", (e) => {
      if (e.key === "Escape") {
        setAnchor(null);
      }
    });
  }

  function handleClick(e: any) {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection && selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange();
      rangeRef.current = range;
    }
    setAnchor(e.currentTarget);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  function handleSubmit() {
    if (url && text) {
      const html = `<a href=${url}>${text}</a>`;
      if (rangeRef.current) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(rangeRef.current);
        editor?.focus();
      }
      document.execCommand("insertHTML", false, html);
    }
    setAnchor(null);
  }

  const bbox = anchor?.getBoundingClientRect();

  return (
    <>
      <IconButton onClick={handleClick}>
        <LinksIcon />
      </IconButton>
      {anchor && (
        <div
          style={{ top: bbox?.bottom, left: bbox?.left }}
          className="z-20 fixed bg-white shadow-lg rounded-lg p-3"
        >
          <Input
            name="url"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Input
            name="text"
            placeholder="Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
    </>
  );
};
