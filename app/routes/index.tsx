import { useIsMobile, useOnResize, useScrollPosition } from "~/utils/hooks";
import {
  PaperScope,
  Path,
  Point,
  Group,
  Raster,
  Color,
  Size,
  Rectangle,
  PointText,
  Matrix,
} from "paper";
import React from "react";
import { Button } from "~/components/interaction/Button";

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
    this.translationSpeed = 500 + Math.random() * 2000;
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

const TURQUOISE_ORANGE = [
  "#fa710f",
  "#ea7c21",
  "#d18b3c",
  "#b39d5b",
  "#95af79",
  "#84b98b",
  "#73c39c",
  "#68cba9",
  "#53dcc4",
  "#3eeddf",
];

const YELLOW_RED = [
  "#b85360",
  "#bd6361",
  "#c17361",
  "#c58362",
  "#c99362",
  "#cb9b63",
  "#cda363",
  "#d1b363",
  "#d5c364",
  "#d9d364",
];

const PALETTES = [TURQUOISE_ORANGE, BLUE_PINK, YELLOW_RED];

const colors = PALETTES[Math.floor(Math.random() * PALETTES.length)];

const Blobs = ({ percent }: { percent: number }) => {
  const { ref, paper } = usePaper({ resolution: "half" });
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
    const numBlobs = isMobile ? 16 : 24;
    for (let i = 0; i < numBlobs; i++) {
      const x = Math.random() * paper.view.bounds.width;
      const y = Math.random() * paper.view.bounds.height;
      const radius = getHeight() / 6 + (Math.random() * getHeight()) / 3;
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
  const isMobile = useIsMobile();
  const f = isMobile ? 3 : 1;
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
          transform: `translateX(${100 - lerp(percent, 0.1, 0.3) * 200 * f}vw)`,
        }}
      >
        I'm Philipp
      </h1>
      <h1
        className="fixed top-56 w-screen whitespace-nowrap text-[8rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-white mt-16 text-center mix-blend-difference origin-top"
        style={{
          transform: `translate(${200 - lerp(percent, 0.3, 0.6) * 400 * f}vw)`,
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
  const isMobile = useIsMobile();
  const { ref, paper } = usePaper({ resolution: isMobile ? "half" : "full" });
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

      if (percent > 0.5 && !isMobile) {
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

  // function computeVertices() {
  //   const raster = new Raster({
  //     source: "me-square.png",
  //   });
  //   raster.visible = false;
  //   raster.on("load", resetSpiral);

  //   let position: paper.Point;
  //   let path: paper.Path;
  //   let count = 0;
  //   let grow = false;

  //   const points: paper.Point[] = [];
  //   const pointsNoImage: paper.Point[] = [];

  //   function growSpiral() {
  //     count++;
  //     const vector = new Point({
  //       angle: count * (isMobile ? 6.5 : 5),
  //       length: count / 100,
  //     });
  //     const rot = vector.rotate(90, [0, 0]);
  //     const color = raster.getAverageColor(position.add(vector));

  //     let value = color ? (1 - color.gray) * MAX_DRAW_WIDTH : 0;
  //     if (color?.gray > 0.7) {
  //       value = 0;
  //     }
  //     rot.length = Math.max(value, MIN_DRAW_WIDTH);
  //     points.push(position.add(vector).subtract(rot));
  //     points.push(position.add(vector).add(rot));

  //     rot.length = MIN_DRAW_WIDTH;
  //     pointsNoImage.push(position.add(vector).subtract(rot));
  //     pointsNoImage.push(position.add(vector).add(rot));

  //     position = position.add(vector);
  //   }

  //   function resetSpiral() {
  //     if (!paper) return;
  //     raster.fitBounds(paper.view.bounds);

  //     grow = true;

  //     // Transform the raster, so it fills the view:
  //     if (path) {
  //       path.remove();
  //     }

  //     position = paper.view.center;
  //     count = 0;
  //     path = new Path({
  //       fillColor: "black",
  //       closed: true,
  //     });

  //     const max = Math.max(raster.bounds.width, raster.bounds.height) / 2;

  //     while (grow) {
  //       if (
  //         raster.loaded &&
  //         paper.view.center.subtract(position).length < max
  //       ) {
  //         for (let i = 0, l = 100; i < l; i++) {
  //           growSpiral();
  //         }
  //       } else {
  //         grow = false;
  //       }
  //     }

  //     stateRef.current = { path, points, pointsNoImage };
  //   }
  // }

  React.useEffect(() => {
    if (!paper) return;
    paper.activate();

    fetch("vertices_image.json")
      .then((r) => r.json())
      .then((json) => {
        const points = json.map((el: [number, number]) => new Point(el));
        const path = new Path({
          fillColor: "black",
          closed: true,
          segments: points,
        });
        path.position = paper.view.center;
        path.segments = [];
        stateRef.current = { ...stateRef.current, path, points };
      });

    fetch("vertices_blank.json")
      .then((r) => r.json())
      .then((json) => {
        stateRef.current.pointsNoImage = json.map(
          (el: [number, number]) => new Point(el)
        );
      });
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
        transition: `color 0.7s ease-in-out`,
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
      <h1 className="md:w-1/2 text-[7rem] md:text-[10rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-black text-center">
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

const HexagonGrid = ({ percent }: { percent: number }) => {
  const { ref, paper } = usePaper({ resolution: "full" });
  const isMobile = useIsMobile();
  const stateRef = React.useRef<{
    boxes: paper.Item[];
    circle: paper.Path | null;
  }>({ boxes: [], circle: null });

  const RADIUS = isMobile ? 50 : 100;
  const SPACER = isMobile ? 5 : 10;

  React.useEffect(() => {
    const { boxes, circle } = stateRef.current;

    const p = lerp(percent, 0, 0.5);
    const childCount = boxes.length;
    const visibleCount = Math.floor(p * childCount);

    boxes.forEach((box, i) => {
      box.visible = i < visibleCount;
    });

    if (circle) {
      if (p > 0.5) {
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

    function createPiece(t: string, colorless: boolean) {
      const color1 = colors[Math.floor(Math.random() * colors.length)];
      const color2 = colors[Math.floor(Math.random() * colors.length)];
      const piece = new Group();
      const hexagon = new Path.RegularPolygon({
        center: paper?.view?.center,
        sides: 6,
        radius: RADIUS,
      });

      hexagon.fillColor = colorless
        ? "black"
        : ({
            gradient: {
              stops: [color1, color2],
            },
            origin: hexagon.bounds.topLeft,
            destination: hexagon.bounds.bottomRight,
          } as any);
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

    const positions = [paper.view.center];
    const expandedBounds = paper.view.bounds.expand(RADIUS * 2);

    while (ring < 20) {
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
      const position = paper.view.center.add(point);
      if (expandedBounds.contains(position)) {
        positions.push(position);
      }
      inRing++;
    }

    const boxes = positions.map((pos, i) => {
      const box = createPiece("", i < 7);
      box.position = pos;
      group.addChild(box);
      box.visible = false;
      return box;
    });

    const circle = new Path.Circle({
      center: paper.view.center,
      fillColor: "black",
      radius: RADIUS,
    });

    circle.scale(0);
    circle.sendToBack();

    stateRef.current = { boxes, circle };
  }, [paper]);

  return (
    <canvas ref={ref} className="w-screen h-screen fixed top-0 left-0 -z-10" />
  );
};

const TEXTS = [
  "...",
  "React",
  "JavaScript",
  "NodeJS",
  "TypeScript",
  "PostgreSQL",
  "CSS",
  "Tailwind",
  "Docker",
  "NginX",
  "Prisma",
  "Remix",
  "Vue",
  "NextJS",
  "C",
  "C++",
  "C#",
  "Unity",
  "Arduino",
  "Java",
  "Python",
];

const MorphText = ({ percent }: { percent: number }) => {
  const isMobile = useIsMobile();

  const text1Ref = React.useRef<HTMLSpanElement | null>(null);
  const text2Ref = React.useRef<HTMLSpanElement | null>(null);

  const stateRef = React.useRef({ running: false });

  React.useEffect(() => {
    if (percent > 0.55) {
      stateRef.current.running = true;
    } else {
      stateRef.current.running = false;
    }
  }, [percent]);

  React.useEffect(() => {
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;

    if (!text1 || !text2) return;

    const morphTimeMs = 1000;
    const cooldownTimeMs = 250;

    let textIndex = TEXTS.length - 1;
    let morph = 0;
    let cooldown = cooldownTimeMs;

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;

      let fraction = morph / morphTimeMs;

      if (fraction > 1) {
        cooldown = cooldownTimeMs;
        fraction = 1;
      }

      setMorph(fraction);
    }

    // A lot of the magic happens here, this is what applies the blur filter to the text.
    function setMorph(fraction: number) {
      if (isMobile) return;
      if (!text1 || !text2) return;

      text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      fraction = 1 - fraction;
      text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    }

    function doCooldown() {
      if (!text1 || !text2) return;

      morph = 0;

      text2.style.filter = "";
      text2.style.opacity = "100%";

      text1.style.filter = "";
      text1.style.opacity = "0%";
    }

    let lastTime = 0;

    // Animation loop, which is called every frame.
    function animate(t: number) {
      requestAnimationFrame(animate);
      if (t - lastTime < 24) return;
      if (!text1 || !text2) return;
      const dt = t - lastTime;
      lastTime = t;

      let shouldIncrementIndex = cooldown > 0;

      cooldown -= dt;
      const { running } = stateRef.current;

      if (!running) {
        textIndex = 0;
        text1.textContent = TEXTS[0];
        text2.textContent = TEXTS[0];
      }

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          if (running) {
            const i1 = textIndex % TEXTS.length;
            const i2 = (textIndex + 1) % TEXTS.length;
            text1.textContent = TEXTS[i1];
            text2.textContent = TEXTS[i2];
            textIndex++;
          }
        }

        doMorph();
      } else {
        doCooldown();
      }
    }

    // Start the animation.
    animate(30);
  }, []);

  return (
    <>
      <div
        className="fixed w-screen h-screen top-0 left-0 flex items-center text-white font-black select-none text-4xl md:text-7xl"
        style={{
          filter: "url(#threshold) blur(0.6px)",
          display: percent > 0 && percent < 1 ? "flex" : "none",
        }}
      >
        <span
          ref={text1Ref}
          className="absolute w-full inline-block text-center"
        ></span>
        <span
          ref={text2Ref}
          className="absolute w-full inline-block text-center"
        ></span>
      </div>

      {isMobile ? null : (
        <svg id="filters">
          <defs>
            <filter id="threshold">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0
									0 1 0 0 0
									0 0 1 0 0
									0 0 0 255 -140"
              />
            </filter>
          </defs>
        </svg>
      )}
    </>
  );
};

const KnowledgeSection = () => {
  const { ref, percent } = useScrollPosition();
  return (
    <section ref={ref} className="w-full h-[600vh] -mt-[100vh]">
      <HexagonGrid percent={percent} />
      <MorphText percent={percent} />
    </section>
  );
};

const Rays = ({ percent }: { percent: number }) => {
  const { ref, paper } = usePaper();
  const stateRef = React.useRef<{
    lines: paper.Path[];
    leftSpot: paper.Path[];
    rightSpot: paper.Path[];
  }>({ lines: [], leftSpot: [], rightSpot: [] });
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const { lines, leftSpot, rightSpot } = stateRef.current;
    lines.forEach((line) => {
      const s = lerp(percent, 0, 0.5);
      line.strokeWidth = s * line.data.maxStroke;
    });

    const view = lines[0]?.view;
    let lastTime = 0;
    let count = 0;
    const CHANGE_INTERVAL = 0.1;
    if (view && !view.onFrame) {
      view.onFrame = (e) => {
        const delta = e.time - lastTime;
        if (delta > CHANGE_INTERVAL) {
          count++;
          leftSpot.forEach((ray, i) => {
            const index = i + count;
            ray.fillColor = new Color(colors[index % colors.length]);
          });
          rightSpot.forEach((ray, i) => {
            const index = i + count;
            ray.fillColor = new Color(colors[index % colors.length]);
          });
          lastTime = e.time;
        }
      };
    }

    const BASE_SPOT_WIDTH = 50;
    const BASE_SPACING = 10;

    const SPOT_WIDTH = BASE_SPOT_WIDTH + percent * 100;
    const SPACING = BASE_SPACING + percent * 200;

    leftSpot.forEach((ray, i) => {
      const o = isMobile
        ? ray.view.bounds.bottomLeft
        : ray.view.bounds.bottomCenter;
      ray.pivot = o;
      const a = ray.view.bounds.topCenter
        .subtract(new Point(-i * (SPOT_WIDTH + SPACING), 0))
        .subtract(o)
        .multiply(2);
      const b = ray.view.bounds.topCenter
        .subtract(new Point(-i * (SPOT_WIDTH + SPACING) - SPOT_WIDTH, 0))
        .subtract(o)
        .multiply(2);
      ray.segments = [o, o.add(a), o.add(b)] as any;
      if (isMobile) {
        ray.rotation = -90 + percent * 100;
      } else {
        ray.rotation = -130 + percent * 135;
      }
    });

    rightSpot.forEach((ray, i) => {
      const o = isMobile
        ? ray.view.bounds.bottomRight
        : ray.view.bounds.bottomCenter;
      ray.pivot = o;
      const a = ray.view.bounds.topCenter
        .subtract(new Point(i * (SPOT_WIDTH + SPACING), 0))
        .subtract(o)
        .multiply(2);
      const b = ray.view.bounds.topCenter
        .subtract(new Point(i * (SPOT_WIDTH + SPACING) + SPOT_WIDTH, 0))
        .subtract(o)
        .multiply(2);
      ray.segments = [o, o.add(a), o.add(b)] as any;
      if (isMobile) {
        ray.rotation = 90 + percent * -100;
      } else {
        ray.rotation = 130 + percent * -135;
      }
    });
  }, [percent]);

  React.useEffect(() => {
    if (!paper) return;
    paper.activate();

    const numLines = getWidth() / 50;
    const lines: paper.Path[] = [];
    for (let i = 0; i < numLines; ++i) {
      const x = Math.random() * paper.view.bounds.width;
      const line = new Path.Line({
        from: [x, 0],
        to: [x, paper.view.bounds.height],
        strokeWidth: 0,
        strokeColor: "white",
        shadowBlur: 20,
        shadowColor: "white",
      });
      line.data.maxStroke =
        i === Math.floor(numLines / 2) ? getWidth() : Math.random() * 500;
      lines.push(line);
    }

    const leftSpot: paper.Path[] = [];
    const rightSpot: paper.Path[] = [];
    colors.forEach((color, i) => {
      const leftPath = new Path({
        fillColor: color,
        shadowColor: "white",
        shadowBlur: 20,
        closed: true,
      });
      leftSpot.push(leftPath);

      const rightPath = new Path({
        fillColor: color,
        shadowColor: "white",
        shadowBlur: 10,
        closed: true,
      });
      rightSpot.push(rightPath);
    });

    stateRef.current = { ...stateRef.current, lines, leftSpot, rightSpot };
  }, [paper]);

  return (
    <canvas ref={ref} className="w-screen h-screen fixed top-0 left-0 -z-10" />
  );
};

const PgBall = ({ percent }: { percent: number }) => {
  const isMobile = useIsMobile();
  return (
    <>
      <div className="fixed top-0 w-screen h-screen flex items-center justify-center">
        <div
          className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] flex items-center justify-center rounded-full shadow-2xl"
          style={{
            backgroundImage: "linear-gradient(#666, black)",
            transform: `scale(${lerp(percent, 0.5, 1)})`,
          }}
        >
          <h1 className="text-white text-[8rem] md:text-[12rem] font-medium -mt-8">
            pg
          </h1>
        </div>
      </div>
    </>
  );
};

const EndSection = () => {
  const { ref, percent } = useScrollPosition();
  return (
    <section ref={ref} className="w-full h-[600vh] -mt-[100vh]">
      <Rays percent={percent} />
      <PgBall percent={percent} />
    </section>
  );
};

export default function Index() {
  return (
    <>
      <TitleSection />
      <PictureSection />
      <KnowledgeSection />
      <EndSection />
    </>
  );
}
