import hljs from "highlight.js";
import { marked } from "marked";

export function parsemd(input: string): string {
  return marked(input, {
    highlight: (md) => {
      return hljs.highlightAuto(md).value;
    },
  });
}
