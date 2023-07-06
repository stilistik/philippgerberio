import { useOnResize, useScrollPosition } from "~/utils/hooks";
import { PaperScope, Path, Point, Size, Raster, Color } from "paper";
import React from "react";

function lerp(percent: number, start: number, end: number) {
  if (percent < start) return 0;
  else if (percent > end) return 1;
  else {
    return (percent - start) / (end - start);
  }
}

function getWidth() {
  if (typeof document !== "undefined") {
    return window.innerWidth;
  } else {
    return 1200; // default assumed window size for if js is disabled
  }
}

function getHeight() {
  if (typeof document !== "undefined") {
    return window.innerHeight;
  } else {
    return 800; // default assumed window size for if js is disabled
  }
}

interface Factors {
  topOffset: number;
  yBallScrollFactor: number;
  ballTranslationFactor: number;
  ballScaleMin: number;
  ballScaleFactor: number;
  leftMarginFactor: number;
}

type BreakPoint = "xs" | "sm" | "md" | "lg" | "xl";

const FACTORS: Record<BreakPoint, Factors> = {
  xs: {
    topOffset: 120,
    yBallScrollFactor: 6.5,
    ballTranslationFactor: 3.5,
    ballScaleMin: 5,
    ballScaleFactor: 18,
    leftMarginFactor: 0.5,
  },
  sm: {
    topOffset: 120,
    yBallScrollFactor: 6.5,
    ballTranslationFactor: 3.5,
    ballScaleMin: 5,
    ballScaleFactor: 18,
    leftMarginFactor: 0,
  },
  md: {
    topOffset: 120,
    yBallScrollFactor: 6.5,
    ballTranslationFactor: 3.5,
    ballScaleMin: 5,
    ballScaleFactor: 18,
    leftMarginFactor: 0,
  },
  lg: {
    topOffset: 0,
    yBallScrollFactor: 6.5,
    ballTranslationFactor: 0.6,
    ballScaleMin: 10,
    ballScaleFactor: 12,
    leftMarginFactor: 0,
  },
  xl: {
    topOffset: 0,
    yBallScrollFactor: 3.5,
    ballTranslationFactor: 0.2,
    ballScaleMin: 10,
    ballScaleFactor: 12,
    leftMarginFactor: 0,
  },
};

function useBreakPoint() {
  const [bp, setBp] = React.useState<BreakPoint>("xs");

  useOnResize(() => {
    const w = getWidth();
    const breakPoint =
      w < 420 ? "xs" : w < 640 ? "sm" : w < 768 ? "md" : w < 1024 ? "lg" : "xl";
    setBp(breakPoint);
  });
  return bp;
}

class Blob {
  private x: number;
  private y: number;
  private radius: number;
  private path: paper.Path;
  private originalPos: paper.Point;
  private translateDirectionX: number;
  private translateDirectionY: number;
  private translationSpeed: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    color1: string,
    color2: string
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.path = new Path({ segments: this.generatePoints() });
    this.path.fillColor = {
      gradient: {
        stops: [color1, color2],
      },
      origin: this.path.bounds.topLeft,
      destination: this.path.bounds.bottomRight,
    };
    this.path.shadowBlur = 100;
    const shadowColor = new Color("white");
    shadowColor.alpha = 0.5;
    this.path.shadowColor = shadowColor;
    this.path.closed = true;
    this.path.smooth();
    this.originalPos = this.path.position.clone();

    this.translateDirectionX = (Math.random() - 0.5) * 2;
    this.translateDirectionY = (Math.random() - 0.5) * 2;
    this.translationSpeed = 3000 + Math.random() * 5000;
  }

  generatePoints() {
    const numPoints = 8;
    const angleStep = (Math.PI * 2) / numPoints;
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep;
      const point = {
        angle: angle,
        x: this.x + this.radius * Math.cos(angle),
        y: this.y + this.radius * Math.sin(angle),
      };
      points.push(point);
    }
    return points;
  }

  wobble(t: number) {
    const wobbleSpeed = 0.4;
    const wobbleIntensity = 0.6;
    const rnd = Math.random();
    this.path.segments.forEach((segment, i) => {
      const dx = rnd * wobbleIntensity * Math.cos(i + t * wobbleSpeed);
      const dy = rnd * wobbleIntensity * Math.cos(-i + t * wobbleSpeed);
      segment.point.x += dx;
      segment.point.y += dy;
    });
  }

  animate(percent: number) {
    this.path.position.x =
      this.originalPos.x +
      this.translateDirectionX * percent * this.translationSpeed;
    this.path.position.y =
      this.originalPos.y +
      this.translateDirectionY * percent * this.translationSpeed;

    const scaling = Math.max(1 - lerp(percent, 0.6, 1), 0.01);
    this.path.scaling = new Point(scaling, scaling);
    this.path.opacity = 1 - lerp(percent, 0.9, 1);
  }

  update(t: number) {
    this.wobble(t);
  }
}

const GREEN_BLUE = [
  "#007a3d",
  "#02894e",
  "#04975f",
  "#08a67a",
  "#0bb494",
  "#0fafaa",
  "#12a9c0",
  "#119ec6",
  "#0f94c3",
  "#0c8ac0",
];

const ORANGE_VIOLET = [
  "#e46205",
  "#d94d16",
  "#cd3726",
  "#c12136",
  "#b50b46",
  "#ac1870",
  "#a3259a",
  "#9a32c4",
  "#9539d9",
  "#903fee",
];

const BLUE_PINK = [
  "#0077b6",
  "#0096c7",
  "#00b4d8",
  "#48cae4",
  "#90e0ef",
  "#a8c6d9",
  "#c0abc3",
  "#d891ad",
  "#e484a2",
  "#f07596",
];

const PALETTES = [GREEN_BLUE, BLUE_PINK, ORANGE_VIOLET];

const colors =
  PALETTES[Math.floor(Math.random() * PALETTES.length) % PALETTES.length];

const Blobs = ({ percent }: { percent: number }) => {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const blobRef = React.useRef<Blob[]>([]);

  React.useEffect(() => {
    blobRef.current.forEach((b) => {
      b.animate(percent);
    });
  }, [percent]);

  React.useEffect(() => {
    if (!ref.current) return;
    const paper = new PaperScope();
    paper.setup(ref.current);
    paper.settings.applyMatrix = false;
    const canvas = ref.current;

    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const numBlobs = 80;
    for (let i = 0; i < numBlobs; i++) {
      const x = Math.random() * 2 * canvas.width;
      const y = Math.random() * 2 * canvas.height;
      const radius = 200 + Math.random() * 400;
      const colorIdx = Math.floor((i / numBlobs) * colors.length);
      const color1 = colors[colorIdx];
      const color2 = colors[(colorIdx + 1) % colors.length];
      const blob = new Blob(x, y, radius, color1, color2);
      blobRef.current.push(blob);
    }

    paper.view.onFrame = function (e) {
      for (let blob of blobRef.current) {
        blob.update(e.time);
      }
    };
  }, []);

  return <canvas ref={ref} className="w-screen h-screen fixed top-0 left-0" />;
};

const Hello = ({ percent }: { percent: number }) => {
  return (
    <>
      <h1
        className="absolute w-full whitespace-nowrap md:text-[10rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-white mt-16 text-center mix-blend-difference origin-top"
        style={{
          transform: `translateX(${-lerp(percent, 0, 0.1) * 100}vw)`,
        }}
      >
        Hello
      </h1>
      <h1
        className="absolute w-full whitespace-nowrap md:text-[10rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-white mt-16 text-center mix-blend-difference origin-top"
        style={{
          transform: `translateX(${100 - lerp(percent, 0.1, 0.3) * 200}vw)`,
        }}
      >
        I'm Philipp
      </h1>
      <h1
        className="absolute w-full whitespace-nowrap md:text-[10rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-white mt-16 text-center mix-blend-difference origin-top"
        style={{
          transform: `translate(${200 - lerp(percent, 0.3, 0.6) * 400}vw)`,
        }}
      >
        Nice to meet you
      </h1>
    </>
  );
};

const TitleSection = () => {
  const { ref, percent } = useScrollPosition();
  return (
    <section ref={ref} className="w-full h-[600vh]">
      <div className="sticky top-56 sm:pt-10">
        <Blobs percent={percent} />
        <Hello percent={percent} />
      </div>
    </section>
  );
};

const Picture = ({ percent }: { percent: number }) => {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const stateRef = React.useRef<{
    path: paper.Path | null;
    points: paper.Point[];
    pointsNoImage: paper.Point[];
  }>({
    path: null,
    points: [],
    pointsNoImage: [],
  });

  const MIN_DRAW_WIDTH = 0.5;

  React.useEffect(() => {
    const { path, points, pointsNoImage } = stateRef.current;
    const w = getWidth();
    if (path && points) {
      if (percent === 0) {
        path.visible = false;
      } else {
        path.visible = true;
        path.segments = [];
        const stepCount = points.length / 2;
        const relevantPercent = lerp(percent, 0, 0.5);
        const visibleSteps = Math.floor(relevantPercent * stepCount);

        for (let i = 0; i < visibleSteps; i++) {
          if (percent < 0.8) {
            path.add(points[i * 2]);
            path.insert(0, points[i * 2 + 1]);
          } else {
            // we are collapsing the image in the spiral
            const d1 = points[i * 2].subtract(pointsNoImage[i * 2]);
            d1.length = d1.length * (1 - lerp(percent, 0.8, 0.95));
            const p1 = pointsNoImage[i * 2].add(d1);

            const d2 = points[i * 2 + 1].subtract(pointsNoImage[i * 2 + 1]);
            d2.length = d2.length * (1 - lerp(percent, 0.8, 0.95));
            const p2 = pointsNoImage[i * 2 + 1].add(d2);
            path.add(p1);
            path.insert(0, p2);
          }
        }
      }
      if (percent > 0.5) {
        const d = w - path.bounds.width / 2 - path.view.center.x;
        path.position.x = path.view.center.x + lerp(percent, 0.5, 0.7) * d;
      }

      if (percent > 0.95) {
        path.opacity = 1 - lerp(percent, 0.95, 1);
      } else {
        path.opacity = 1;
      }
    }
  }, [percent]);

  React.useEffect(() => {
    if (!ref.current) return;
    const paper = new PaperScope();
    paper.setup(ref.current);
    paper.settings.applyMatrix = false;
    const canvas = ref.current;

    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // As the web is asynchronous, we need to wait for the raster to
    // load before we can perform any operation on its pixels.
    const raster = new Raster({
      source: "me-square.png",
    });
    raster.visible = false;
    raster.fitBounds(paper.view.bounds);
    raster.on("load", resetSpiral);

    let position: paper.Point;
    let path: paper.Path;
    let count = 0;
    let grow = false;

    const points: paper.Point[] = [];
    const pointsNoImage: paper.Point[] = [];

    function growSpiral() {
      count++;
      const vector = new Point({
        angle: count * 5,
        length: count / 100,
      });
      const rot = vector.rotate(90, [0, 0]);
      const color = raster.getAverageColor(position.add(vector));

      let value = color ? (1 - color.gray) * 3.7 : 0;
      if (color?.gray > 0.7) {
        value = 0;
      }
      rot.length = Math.max(value, MIN_DRAW_WIDTH);
      points.push(position.add(vector).subtract(rot));
      points.push(position.add(vector).add(rot));

      rot.length = MIN_DRAW_WIDTH;
      pointsNoImage.push(position.add(vector).subtract(rot));
      pointsNoImage.push(position.add(vector).add(rot));

      position = position.add(vector);
    }

    function resetSpiral() {
      grow = true;

      // Transform the raster, so it fills the view:
      if (path) {
        path.remove();
      }

      position = paper.view.center;
      count = 0;
      path = new Path({
        fillColor: "black",
        closed: true,
      });

      const max = Math.max(raster.bounds.width, raster.bounds.height) / 2;

      while (grow) {
        if (
          raster.loaded &&
          paper.view.center.subtract(position).length < max
        ) {
          for (let i = 0, l = 100; i < l; i++) {
            growSpiral();
          }
        } else {
          grow = false;
        }
      }

      stateRef.current = { path, points, pointsNoImage };
    }
  }, []);

  return (
    <canvas ref={ref} className="w-screen h-screen fixed top-0 left-0 -z-10" />
  );
};

const AnimatedSpan = ({
  children,
  percent,
  blur,
  start,
  end,
  color,
}: {
  children: React.ReactNode;
  percent: number;
  blur: number;
  start: number;
  end: number;
  color: string;
}) => {
  const value = lerp(percent, start, end);
  const initialScale = 1.2;
  return (
    <span
      className="text_shadows mr-[3rem]"
      style={{
        display: "inline-block",
        transform: `scale(${
          initialScale - value * Math.abs(1 - initialScale)
        }) translateX(${-100 * lerp(percent, 0.8, 1)}vw)`,
        filter: `blur(${blur - value * blur}px)`,
        opacity: value,
        color: value === 1 ? color : "black",
        transition: `color 1.5s ease-in-out`,
      }}
    >
      {children}
    </span>
  );
};

const Presentation = ({ percent }: { percent: number }) => {
  const blur = 10;
  return (
    <div className="sticky top-0 w-screen h-screen flex items-center">
      <h1 className="w-1/2 md:text-[10rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-black text-center">
        <AnimatedSpan
          blur={blur}
          percent={percent}
          start={0.5}
          end={0.55}
          color={colors[0]}
        >
          I
        </AnimatedSpan>
        <AnimatedSpan
          blur={blur}
          percent={percent}
          start={0.55}
          end={0.6}
          color={colors[2]}
        >
          like
        </AnimatedSpan>
        <AnimatedSpan
          blur={blur}
          percent={percent}
          start={0.6}
          end={0.65}
          color={colors[4]}
        >
          art
        </AnimatedSpan>
        <AnimatedSpan
          blur={blur}
          percent={percent}
          start={0.65}
          end={0.7}
          color={colors[6]}
        >
          &
        </AnimatedSpan>
        <AnimatedSpan
          blur={blur}
          percent={percent}
          start={0.7}
          end={0.75}
          color={colors[8]}
        >
          tech
        </AnimatedSpan>
      </h1>
    </div>
  );
};

const PictureSection = () => {
  const { ref, percent } = useScrollPosition();

  return (
    <section ref={ref} className="w-full h-[600vh] -mt-[200vh]">
      <Picture percent={percent} />
      <Presentation percent={percent} />
    </section>
  );
};

const CubeWall = ({ percent }: { percent: number }) => {
  const ref = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const paper = new PaperScope();
    paper.setup(ref.current);
    paper.settings.applyMatrix = false;
    const canvas = ref.current;

    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  return (
    <canvas ref={ref} className="w-screen h-screen fixed top-0 left-0 -z-10" />
  );
};

const KnowledgeSection = () => {
  const { ref, percent } = useScrollPosition();
  return (
    <section ref={ref} className="w-full h-[600vh] -mt-[200vh]">
      <CubeWall percent={percent} />
    </section>
  );
};

export default function Index() {
  return (
    <>
      <TitleSection />
      <PictureSection />
      <KnowledgeSection />
    </>
  );
}
