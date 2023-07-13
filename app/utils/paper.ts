import React from "react";
import { PaperScope } from "paper";

export function usePaper(
  { resolution }: { resolution: "full" | "half" | "quarter" } = {
    resolution: "half",
  }
) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const [paper, setPaper] = React.useState<paper.PaperScope | null>(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const paper = new PaperScope();
    paper.setup(canvas);

    if (resolution === "half") {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    } else if (resolution === "quarter") {
      canvas.width = window.innerWidth * 0.5;
      canvas.height = window.innerHeight * 0.5;
    }

    paper.settings.applyMatrix = false;
    setPaper(paper);
  }, []);

  return { ref, paper };
}
