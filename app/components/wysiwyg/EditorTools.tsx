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

export const EditorTools = () => {
  return (
    <div className="sticky top-0 flex gap-10 border-b bg-white p-3 px-6 z-10">
      <Undo />
      <Redo />
      <Bold />
      <Italic />
      <Underline />
      <H1 />
      <H2 />
      <H3 />
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

function createTool({ command, icon, args }: CreateToolArgs) {
  return function Tool() {
    const [_, forceUpdate] = React.useReducer(() => ({}), {});

    function handleClick(e: any) {
      e.preventDefault();
      document.execCommand(command, false, args);
      forceUpdate();
    }

    return <IconButton onClick={handleClick}>{icon}</IconButton>;
  };
}

const Undo = createTool({ command: "undo", icon: <UndoIcon /> });
const Redo = createTool({ command: "redo", icon: <RedoIcon /> });
const Bold = createTool({ command: "bold", icon: <BoldIcon /> });
const Italic = createTool({ command: "italic", icon: <ItalicIcon /> });
const Underline = createTool({ command: "underline", icon: <UnderlineIcon /> });

const H1 = createTool({ command: "formatBlock", icon: <H1Icon />, args: "H1" });
const H2 = createTool({ command: "formatBlock", icon: <H2Icon />, args: "H2" });
const H3 = createTool({ command: "formatBlock", icon: <H3Icon />, args: "H3" });

const Code = createTool({
  command: "formatBlock",
  icon: <CodeIcon />,
  args: "PRE",
});

const Quote = createTool({
  command: "formatBlock",
  icon: <QuoteIcon />,
  args: "blockquote",
});

const Image = () => {
  return (
    <Link to="resources?q=image">
      <IconButton>
        <ImageIcon />
      </IconButton>
    </Link>
  );
};
