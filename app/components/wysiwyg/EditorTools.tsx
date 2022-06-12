import React from "react";
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
