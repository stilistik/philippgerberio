import React from "react";
import { createNoise2D } from "simplex-noise";
import { useIsMobile, useScrollPosition } from "~/utils/hooks";
import { PaperScope, Path, Point, Group, Color, PointText } from "paper";
import { colors } from "../utils/colors";

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

function random(max?: number, min?: number) {
  if (typeof max !== "number") {
    return Math.random();
  } else if (typeof min !== "number") {
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

function randomInt(max?: number, min?: number) {
  if (!max) return 0;
  return random(max + 1, min) | 0;
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

    paper.view.onFrame = function (e: any) {
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
  //   const MIN_DRAW_WIDTH = 0.5;
  //   const MAX_DRAW_WIDTH = isMobile ? 2.4 : 3.7;

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
    flood: paper.Path | null;
  }>({ lines: [], flood: null });

  React.useEffect(() => {
    const { lines, flood } = stateRef.current;
    lines.forEach((line) => {
      const s = lerp(percent, 0, 0.3);
      line.strokeWidth = s * line.data.maxStroke;
    });

    if (percent >= 1 && !flood) {
      stateRef.current.flood = new Path.Rectangle({
        from: paper?.view.bounds.topLeft,
        to: paper?.view.bounds.bottomRight,
        fillColor: "white",
      });
    } else {
      if (flood) {
        flood.remove();
      }
    }
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
      line.data.maxStroke = Math.random() * 500;
      lines.push(line);
    }

    stateRef.current = { ...stateRef.current, lines };
  }, [paper]);

  return (
    <canvas ref={ref} className="w-screen h-screen fixed top-0 left-0 -z-10" />
  );
};

class Lightning {
  public path: paper.Path;
  public speed = 0.025;

  private startPoint: paper.Point;
  private endPoint: paper.Point;
  private step: number;
  private amplitude = 1;
  private off = 0;
  private _simplexNoise = createNoise2D();

  // child stuff
  private parent: Lightning | null = null;
  private children: Lightning[];
  private childCount: number;
  private startStep = 0;
  private endStep = 0;

  constructor({
    startPoint,
    endPoint,
    childCount,
  }: {
    startPoint?: paper.Point;
    endPoint?: paper.Point;
    childCount?: number;
  } = {}) {
    this.startPoint = startPoint ?? new Point(0, 0);
    this.endPoint = endPoint ?? new Point(0, 0);
    this.childCount = childCount ?? 0;
    this.step = 45;
    this.path = new Path({
      strokeColor: "black",
      strokeWidth: 3,
      shadowBlur: 5,
      shadowColor: "black",
      segments: [],
    });

    this.children = [];
    for (let i = 0; i < this.childCount; i++) {
      const child = new Lightning();
      child.setAsChild(this);
      this.children.push(child);
    }
  }

  public setAsChild(lightning: Lightning) {
    if (!(lightning instanceof Lightning)) return;
    this.parent = lightning;

    const setTimer = () => {
      this.updateStepsByParent();
      setTimeout(setTimer, randomInt(1500));
    };

    setTimeout(setTimer, randomInt(1500));
  }

  private updateStepsByParent() {
    if (!this.parent) return;
    var parentStep = this.parent.step;
    this.startStep = randomInt(parentStep - 2);
    this.endStep =
      this.startStep + randomInt(parentStep - this.startStep - 2) + 2;
    this.step = this.endStep - this.startStep;
  }

  public length() {
    return this.endPoint.subtract(this.startPoint).length;
  }

  public setOpacity(o: number) {
    this.path.opacity = o;
    this.children.forEach((c) => (c.path.opacity = o));
  }

  public update() {
    const startPoint = this.startPoint;
    const endPoint = this.endPoint;

    if (this.parent) {
      if (this.endStep > this.parent.step) {
        this.updateStepsByParent();
      }

      startPoint.set(this.parent.path.segments[this.startStep].point);
      endPoint.set(this.parent.path.segments[this.endStep].point);
    }

    const length = this.length();
    const normal = endPoint
      .subtract(startPoint)
      .normalize()
      .multiply(length / this.step);
    const radian = toRadians(normal.angle);
    const sinv = Math.sin(radian);
    const cosv = Math.cos(radian);

    const off = (this.off += random(this.speed, this.speed * 0.2));
    let waveWidth = (this.parent ? length * 1.5 : length) * this.amplitude;
    if (waveWidth > 750) waveWidth = 750;

    this.path.segments = [];

    for (let i = 0, len = this.step + 1; i < len; i++) {
      const n = i / 60;
      const av = waveWidth * this.noise(n - off) * 0.5;
      const ax = sinv * av;
      const ay = cosv * av;

      const bv = waveWidth * this.noise(n + off) * 0.5;
      const bx = sinv * bv;
      const by = cosv * bv;

      const m = Math.sin(Math.PI * (i / (len - 1)));

      const x = startPoint.x + normal.x * i + (ax - bx) * m;
      const y = startPoint.y + normal.y * i - (ay - by) * m;

      this.path.add(new Point(x, y));
    }

    this.children.forEach((child) => {
      child.speed = this.speed * 1.35;
      child.path.strokeWidth = Math.max(
        this.path.strokeWidth * Math.random() * 1,
        0.5
      );
      child.update();
    });
  }

  private noise(v: number) {
    var octaves = 6,
      fallout = 0.5,
      amp = 1,
      f = 1,
      sum = 0,
      i;

    for (i = 0; i < octaves; ++i) {
      amp *= fallout;
      sum += amp * (this._simplexNoise(v * f, 0) + 1) * 0.5;
      f *= 2;
    }

    return sum;
  }
}

// Particles Around the Parent
class Particle {
  private path: paper.Path;
  private angle: number;
  private distance: number;
  private speed: number;
  private position: paper.Point;

  constructor(x: number, y: number, distance: number) {
    this.angle = Math.random() * 2 * Math.PI;
    const opacity = (Math.random() * 5 + 2) / 10;
    this.distance = (1 / opacity) * distance;
    this.speed = this.distance * 0.00006;
    const color = new Color("black");
    color.lightness = 1 - opacity * 1.5;
    this.path = new Path.Circle({
      radius: Math.random(),
      fillColor: color,

      center: new Point(
        x + this.distance * Math.cos(this.angle),
        y + this.distance * Math.sin(this.angle)
      ),
    });
    this.position = new Point(x, y);
  }

  public update() {
    this.angle += this.speed;
    this.path.position = this.position.add(
      new Point(
        this.distance * Math.cos(this.angle),
        this.distance * Math.sin(this.angle)
      )
    );
  }

  public getItem() {
    return this.path;
  }
}

class BlackHole {
  private group: paper.Group;
  private particles: Particle[];

  constructor(center: paper.Point, mobile?: boolean) {
    const radius = 30;
    const count = mobile ? 4000 : 8000;
    this.group = new Group();
    this.group.pivot = this.group.view.center;
    const path = new Path.Circle({
      center,
      radius: radius + 13,
      fillColor: "black",
      shadowColor: "black",
      shadowBlur: 100,
    });
    this.group.addChild(path);
    this.particles = [];

    for (let i = 0; i < count; i++) {
      const p = new Particle(center.x, center.y, radius);
      this.particles.push(p);
      this.group.addChild(p.getItem());
    }

    this.group.scaling = new Point(0, 0);
  }

  public update(percent: number) {
    this.particles.forEach((p) => p.update());
    const s = percent * 30;
    this.group.scaling = new Point(s, s);
    this.group.position = this.group.view.center;
  }
}

const Lightnings = ({ percent }: { percent: number }) => {
  const { ref, paper } = usePaper({ resolution: "full" });
  const isMobile = useIsMobile();
  const stateRef = React.useRef<{
    lightnings: Lightning[];
    blackhole: BlackHole | null;
  }>({
    lightnings: [],
    blackhole: null,
  });

  React.useEffect(() => {
    const { lightnings, blackhole } = stateRef.current;
    const start = 0.3;
    lightnings.forEach((l) => {
      if (percent < start || percent === 1) {
        l.setOpacity(0);
      } else {
        l.setOpacity(1);
      }
      l.update();
    });
    blackhole?.update(lerp(percent, start, 1));
  }, [percent]);

  React.useEffect(() => {
    if (!paper) return;
    paper.activate();

    const l1 = new Lightning({
      startPoint: isMobile
        ? paper.view.bounds.topCenter
        : paper.view.bounds.leftCenter,
      endPoint: paper.view.bounds.center,
      childCount: 10,
    });
    const l2 = new Lightning({
      startPoint: isMobile
        ? paper.view.bounds.bottomCenter
        : paper.view.bounds.rightCenter,
      endPoint: paper.view.bounds.center,
      childCount: 10,
    });

    const bh = new BlackHole(paper.view.center, isMobile);

    stateRef.current = {
      ...stateRef.current,
      lightnings: [l1, l2],
      blackhole: bh,
    };
  }, [paper]);

  return (
    <canvas ref={ref} className="w-screen h-screen fixed top-0 left-0 -z-10" />
  );
};

const PgBall = ({ percent }: { percent: number }) => {
  const isMobile = useIsMobile();
  const { ref, paper } = usePaper({ resolution: "full" });
  const stateRef = React.useRef<{
    warpRays: paper.Path[];
    stars: paper.Path[];
  }>({ warpRays: [], stars: [] });

  React.useEffect(() => {
    paper?.activate();
    const { warpRays, stars } = stateRef.current;
    const p = lerp(percent, 0.5, 1);
    const growFactor = 1000;
    const mask = new Path.Circle({
      radius: lerp(percent, 0.3, 1) * 1300,
      center: paper?.view.center,
      strokeWidth: 2,
    });

    warpRays.forEach((path) => {
      const { pos } = path.data;
      const radialVector = pos.normalize();
      const newEndPoint = pos.add(radialVector.multiply(p * growFactor));
      const newStartPoint = pos.add(
        radialVector.multiply(lerp(p, 0.5, 1) * growFactor)
      );
      path.segments[0].point = newStartPoint;
      path.segments[1].point = newEndPoint.add([0.1, 0.1]); // add small offset to get at least a dot on mobile
      if (
        mask.contains(newStartPoint.add(paper?.view.center)) ||
        mask.contains(newEndPoint.add(paper?.view.center))
      ) {
        path.visible = true;
      } else {
        path.visible = false;
      }
    });

    if (p > 0.6 && !stars[0]?.visible) {
      stars.forEach((star) => {
        star.visible = true;
      });
    }

    if (p < 0.6 && stars[0]?.visible) {
      stars.forEach((star) => {
        star.visible = false;
      });
    }

    return () => {
      mask.remove();
    };
  }, [percent]);

  React.useEffect(() => {
    if (!paper) return;
    paper.activate();

    const warpCount = 60;
    const warpRays = [];

    for (let i = 0; i < warpCount; ++i) {
      const extent = 300;
      const angle = Math.random() * 2 * Math.PI;
      const d = random(0.2, 1) * extent;
      const pos = new Point(Math.sin(angle) * d, Math.cos(angle) * d);
      const color = new Color(colors[Math.floor(random() * colors.length)]);
      const path = new Path({
        strokeColor: color,
        strokeWidth: random(0.5, 3),
        shadowColor: "white",
        shadowBlur: 6,
        strokeCap: "round",
        position: paper.view.center,
        visible: false,
        data: {
          pos,
        },
      });
      path.add(pos, pos);
      warpRays.push(path);
    }

    const starCount = isMobile ? 300 : 1000;
    const stars = [];
    for (let i = 0; i < starCount; ++i) {
      const color = new Color(colors[Math.floor(random() * colors.length)]);
      const path = new Path.Circle({
        fillColor: color,
        radius: random(0.5, 1.5),
        shadowColor: "white",
        shadowBlur: 6,
        position: [random() * getWidth(), random() * getHeight()],
        visible: false,
      });
      stars.push(path);
    }

    stateRef.current = { ...stateRef.current, warpRays, stars };
  }, [paper]);

  return (
    <>
      <div className="fixed top-0 w-screen h-screen flex items-center justify-center">
        <div
          className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full "
          style={{
            transform: `scale(${lerp(percent, 0.8, 1)})`,
            boxShadow: `0 0 100px rgba(255,255,255,0.3)`,
          }}
        >
          <div
            className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] flex items-center justify-center rounded-full"
            style={{
              boxShadow: `inset -25px -25px 40px rgba(0,0,0,.5)`,
              backgroundImage: `linear-gradient(-45deg, #000 0%, #343434 100%)`,
            }}
          >
            <h1 className="text-white text-[7rem] md:text-[10rem] font-medium -mt-8">
              pg
            </h1>
          </div>
        </div>
      </div>
      <canvas
        ref={ref}
        className="w-screen h-screen fixed top-0 left-0 -z-10"
      />
    </>
  );
};

const EndSection = () => {
  const { ref, percent } = useScrollPosition();
  return (
    <section ref={ref} className="w-full h-[1200vh] -mt-[100vh]">
      <Rays percent={percent} />
      <Lightnings percent={percent} />
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
