import { useIsMobile, useOnResize, useScrollPosition } from "~/utils/hooks";
import {
  PaperScope,
  Path,
  Point,
  Group,
  Raster,
  Color,
  Size,
  PointText,
  Matrix,
} from "paper";
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

function toRadians(angleInDeg: number) {
  return (Math.PI / 180) * angleInDeg;
}

function usePaper(
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
  private originalSegmentPoints: paper.Point[];
  private velocities: paper.Point[];
  private t = 0;

  constructor(
    x: number,
    y: number,
    radius: number,
    color1: string,
    color2: string,
    isMobile: boolean
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
    } as any;
    this.path.shadowBlur = isMobile ? 20 : 100;
    const shadowColor = new Color("white");
    shadowColor.alpha = 0.5;
    this.path.shadowColor = shadowColor;
    this.path.closed = true;
    this.path.smooth();
    this.originalPos = this.path.position.clone();
    this.originalSegmentPoints = this.path.segments.map((s) => s.point.clone());
    this.velocities = this.path.segments.map(() =>
      new Point(Math.random() * 2 - 1, Math.random() * 2 - 1).normalize()
    );

    this.translateDirectionX = (Math.random() - 0.5) * 2;
    this.translateDirectionY = (Math.random() - 0.5) * 2;
    this.translationSpeed = 1000 + Math.random() * 3000;
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
    const CHANGE_INTERVAL = 1;
    const WOBBLE_AMPLITUDE = 10;
    const WOBLLE_INTENSITY = 0.5;
    const WOBBLE_ATTENUATION = 0.05;
    const MAX_D = this.radius / WOBBLE_AMPLITUDE;
    this.path.segments.forEach((s, i) => {
      if (t - this.t > CHANGE_INTERVAL) {
        this.velocities[i] = this.velocities[i]
          .add(
            new Point(Math.random() * 2 - 1, Math.random() * 2 - 1).multiply(
              WOBBLE_ATTENUATION
            )
          )
          .normalize();
        this.t = t;
      }
      const velocity = this.velocities[i];
      const newPoint = s.point.add(velocity.multiply(WOBLLE_INTENSITY));

      if (this.originalSegmentPoints[i].subtract(newPoint).length > MAX_D) {
        this.velocities[i] = velocity.add(
          this.originalSegmentPoints[i]
            .subtract(newPoint)
            .normalize()
            .multiply(WOBBLE_ATTENUATION)
        );
      }
      s.point = newPoint;
    });
  }

  animate(percent: number) {
    const SPEED = (this.path.position.x =
      this.originalPos.x +
      this.translateDirectionX * percent * this.translationSpeed);
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
  "#23ba76",
  "#26cd82",
  "#34d19b",
  "#42d4b4",
  "#49cfbc",
  "#53c8c8",
  "#5dc0d4",
  "#5fb8d6",
  "#5bb2d7",
  "#56acd7",
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

const ORANGE_VIOLET = [
  "#fb8632",
  "#ed7444",
  "#e06355",
  "#e14e68",
  "#e1397a",
  "#d64099",
  "#cb46b8",
  "#b45fd6",
  "#b069e2",
  "#ab6df2",
];

const PALETTES = [GREEN_BLUE, ORANGE_VIOLET, BLUE_PINK];

const colors =
  PALETTES[Math.floor(Math.random() * PALETTES.length) % PALETTES.length];

const Blobs = ({ percent }: { percent: number }) => {
  const { ref, paper } = usePaper();
  const blobRef = React.useRef<Blob[]>([]);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    blobRef.current.forEach((b) => {
      b.animate(percent);
    });
  }, [percent]);

  React.useEffect(() => {
    if (!paper) return;
    paper.activate();
    const numBlobs = isMobile ? 30 : 80;
    for (let i = 0; i < numBlobs; i++) {
      const x = Math.random() * paper.view.bounds.width;
      const y = Math.random() * paper.view.bounds.height;
      const radius = getHeight() / 6 + (Math.random() * getHeight()) / 6;
      const colorIdx = Math.floor((i / numBlobs) * colors.length);
      const color1 = colors[colorIdx];
      const color2 = colors[(colorIdx + 1) % colors.length];
      const blob = new Blob(x, y, radius, color1, color2, isMobile);
      blobRef.current.push(blob);
    }

    paper.view.onFrame = function (e) {
      for (let blob of blobRef.current) {
        blob.update(e.time);
      }
    };
  }, [paper]);

  return <canvas ref={ref} className="w-screen h-screen fixed top-0 left-0" />;
};

const Hello = ({ percent }: { percent: number }) => {
  return (
    <>
      <h1
        className="fixed top-56 w-screen whitespace-nowrap text-[8rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-white mt-16 text-center mix-blend-difference origin-top"
        style={{
          transform: `translateX(${-lerp(percent, 0, 0.1) * 100}vw)`,
        }}
      >
        Hello
      </h1>
      <h1
        className="fixed top-56 w-screen whitespace-nowrap text-[8rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-white mt-16 text-center mix-blend-difference origin-top"
        style={{
          transform: `translateX(${100 - lerp(percent, 0.1, 0.3) * 200}vw)`,
        }}
      >
        I'm Philipp
      </h1>
      <h1
        className="fixed top-56 w-screen whitespace-nowrap text-[8rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-white mt-16 text-center mix-blend-difference origin-top"
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
  const { ref, paper } = usePaper({ resolution: "full" });
  const isMobile = useIsMobile();
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
  const MAX_DRAW_WIDTH = isMobile ? 2.4 : 3.7;

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
    if (!paper) return;
    paper.activate();

    // As the web is asynchronous, we need to wait for the raster to
    // load before we can perform any operation on its pixels.
    const raster = new Raster({
      source: "me-square.png",
    });
    raster.visible = false;
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
        angle: count * (isMobile ? 6.5 : 5),
        length: count / 100,
      });
      const rot = vector.rotate(90, [0, 0]);
      const color = raster.getAverageColor(position.add(vector));

      let value = color ? (1 - color.gray) * MAX_DRAW_WIDTH : 0;
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
      if (!paper) return;
      raster.fitBounds(paper.view.bounds);

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
  }, [paper]);

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
  const { ref, paper } = usePaper();
  const stateRef = React.useRef<{
    boxes: paper.Item[];
    circle: paper.Path | null;
  }>({ boxes: [], circle: null });

  const RADIUS = 100;
  const SPACER = 10;

  React.useEffect(() => {
    const { boxes, circle } = stateRef.current;

    const p = lerp(percent, 0, 0.5);
    const childCount = boxes.length;
    const visibleCount = Math.floor(p * childCount);
    const step = 1 / childCount;

    boxes.forEach((box, i) => {
      box.visible = i < visibleCount;
    });

    if (circle) {
      if (percent > 0.5) {
        circle.visible = true;
        circle.position = circle.view.center;
        const s = lerp(percent, 0.5, 1) * 20;
        circle.scaling = new Point(s, s);
      } else {
        circle.visible = false;
      }
    }
  }, [percent]);

  React.useEffect(() => {
    if (!paper) return;
    paper.activate();

    function createPiece(t: string) {
      const color1 = colors[Math.floor(Math.random() * colors.length)];
      const color2 = colors[Math.floor(Math.random() * colors.length)];
      const piece = new Group();
      const hexagon = new Path.RegularPolygon({
        center: paper?.view?.center,
        sides: 6,
        radius: RADIUS,
      });
      hexagon.fillColor = {
        gradient: {
          stops: [color1, color2],
        },
        origin: hexagon.bounds.topLeft,
        destination: hexagon.bounds.bottomRight,
      } as any;
      piece.addChild(hexagon);
      const text = new PointText({
        content: t,
        fillColor: "white",
        justification: "center",
        fontSize: 18,
        fontWeight: "bold",
        point: piece.position,
      });
      piece.addChild(text);

      return piece;
    }

    const tech = Array(180).fill("");
    const group = new Group();

    function calculateHexagonVertices(radius: number) {
      let vertices: paper.Point[] = [];
      for (let i = 0; i < 6; i++) {
        let x = radius * Math.cos((2 * Math.PI * i) / 6);
        let y = radius * Math.sin((2 * Math.PI * i) / 6);
        vertices.push(new Point(x, y));
      }
      return vertices;
    }

    function calculatePoints(V: paper.Point[], N: number) {
      const points: paper.Point[] = [];
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j <= N; j++) {
          let x = (1 - j / (N + 1)) * V[i].x + (j / (N + 1)) * V[(i + 1) % 6].x;
          let y = (1 - j / (N + 1)) * V[i].y + (j / (N + 1)) * V[(i + 1) % 6].y;
          points.push(new Point(x, y));
        }
      }
      return points;
    }

    let ring = 0; // The current ring
    let numInRing = 0; // The number of hexagons placed in the current ring
    let inRing = 0; // The index of the current hexagon in the current ring

    const w = Math.sqrt(3) * RADIUS + SPACER;

    const boxes = tech.map((t) => {
      const box = createPiece(t);
      if (inRing >= numInRing) {
        // Move to the next ring
        ring++;
        numInRing = ring * 6;
        inRing = 0;
      }

      const additionalPoints = Math.floor(numInRing / 6) - 1;
      const verts = calculateHexagonVertices(ring * w);
      const pts = calculatePoints(verts, additionalPoints);

      const point = pts[inRing];

      // Compute the x and y position using polar to Cartesian conversion
      box.position = box.view.center.add(point);

      inRing++;
      group.addChild(box);
      box.visible = false;
      return box;
    });

    const circle = new Path.Circle({
      center: paper.view.center,
      fillColor: "black",
      radius: 50,
    });

    circle.scale(0);
    circle.sendToBack();

    stateRef.current = { boxes, circle };
  }, [paper]);

  return (
    <canvas ref={ref} className="w-screen h-screen fixed top-0 left-0 -z-10" />
  );
};

const KnowledgeSection = () => {
  const { ref, percent } = useScrollPosition();
  return (
    <section ref={ref} className="w-full h-[600vh] -mt-[100vh]">
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
