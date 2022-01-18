import { marked } from "marked";
import hljs from "highlight.js";

const regexp = /<code>(.*?)<\/code>/g;

export function parsemd(input: string): string {
  let html = marked(input);

  const matches = html.matchAll(regexp);
  for (const match of matches) {
    console.log(match);

    const highlighted = hljs.highlightAuto(match[1]).value;
    html = html.replace(match[0], `<pre><code>${highlighted}</code></pre>`);
  }

  return html;
}
