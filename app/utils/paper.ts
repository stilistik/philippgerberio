import React from "react";
import { PaperScope } from "paper";
import { getHeight, getWidth } from "./math";

interface ExtendedCanvas extends HTMLCanvasElement {
  resize: "true" | undefined;
}

export function usePaper(
  { resolution }: { resolution: "full" | "half" | "quarter" } = {
    resolution: "half",
  }
) {
  const ref = React.useRef<ExtendedCanvas | null>(null);
  const [paper, setPaper] = React.useState<paper.PaperScope | null>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    canvas.resize = "true";
    const paper = new PaperScope();
    paper.setup(canvas);

    if (resolution === "half") {
      canvas.width = getWidth();
      canvas.height = getHeight();
    } else if (resolution === "quarter") {
      canvas.width = window.innerWidth * 0.5;
      canvas.height = window.innerHeight * 0.5;
    }

    window.onresize = () => {
      canvas.width = getWidth();
      canvas.height = getHeight();
      canvas.style.height = getHeight() + "px";
      canvas.style.width = getWidth() + "px";
    };

    paper.settings.applyMatrix = false;
    setPaper(paper);
  }, []);

  return { ref, paper };
}
