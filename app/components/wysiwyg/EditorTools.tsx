import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import React from "react";

export const EditorTools: React.FC = ({ children }) => {
  return (
    <div className="flex gap-10 border-b border-gray-400">
      <Undo />
      <Redo />
      <Bold />
      <Italic />
      <Underline />
      <H1 />
      <H2 />
      <H3 />
      <Code />
      <Image />
    </div>
  );
};

const Undo = () => {
  function handleClick(e: any) {
    e.preventDefault();
    document.execCommand("undo");
  }
  return <button onClick={handleClick}>Undo</button>;
};

const Redo = () => {
  function handleClick(e: any) {
    e.preventDefault();
    document.execCommand("redo");
  }
  return <button onClick={handleClick}>Redo</button>;
};

const Bold = () => {
  function handleClick(e: any) {
    e.preventDefault();
    document.execCommand("bold");
  }
  return <button onClick={handleClick}>B</button>;
};

const Italic = () => {
  function handleClick(e: any) {
    e.preventDefault();
    document.execCommand("italic");
  }
  return <button onClick={handleClick}>I</button>;
};

const Underline = () => {
  function handleClick(e: any) {
    e.preventDefault();
    document.execCommand("underline");
  }
  return <button onClick={handleClick}>U</button>;
};

const H1 = () => {
  function handleClick(e: any) {
    e.preventDefault();
    document.execCommand("formatBlock", false, "H1");
  }
  return <button onClick={handleClick}>h1</button>;
};

const H2 = () => {
  function handleClick(e: any) {
    e.preventDefault();
    document.execCommand("formatBlock", false, "H2");
  }
  return <button onClick={handleClick}>h2</button>;
};

const H3 = () => {
  function handleClick(e: any) {
    e.preventDefault();
    document.execCommand("formatBlock", false, "H3");
  }
  return <button onClick={handleClick}>h3</button>;
};

const Code = () => {
  function handleClick(e: any) {
    e.preventDefault();
    document.execCommand("formatBlock", false, "PRE");
  }
  return <button onClick={handleClick}>Code</button>;
};

const Image = () => {
  return <Link to="resources?q=image">Image</Link>;
};
