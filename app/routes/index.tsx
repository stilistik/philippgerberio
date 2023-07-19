import React from "react";
import { useIsMobile, useScrollPosition, useValueRef } from "~/utils/hooks";
import { Path, Point, Group, PointText } from "paper";
import { colors } from "../utils/colors";
import { Link } from "@remix-run/react";
import { usePaper } from "~/utils/paper";
import { getHeight, getWidth, lerp } from "~/utils/math";
import { Blob } from "~/utils/blobs";
import { ArrowDownIcon } from "~/icons/ArrowDown";
import clx from "classnames";

const Blobs = ({ value }: { value: number }) => {
  const { ref, paper } = usePaper({ resolution: "half" });
  const blobRef = React.useRef<Blob[]>([]);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    blobRef.current.forEach((b) => {
      b.animate(value);
    });
  }, [value]);

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

const CoolArrow = ({
  hasScrolled,
  value,
}: {
  hasScrolled: boolean;
  value: number;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width="50"
      className={clx("", {
        "animate-bounce": !hasScrolled,
      })}
      style={{
        transform: `translateY(${value * 100}vh)`,
      }}
    >
      <polygon points="0,0 50,0 25,50" fill="currentColor" />
      <path
        d="M10,7 L40,7 L25,37 L10,7"
        fill="none"
        stroke="black"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

const Hello = ({ value }: { value: number }) => {
  const isMobile = useIsMobile();
  const f = isMobile ? 3 : 1;
  const hasScrolled = value > 0;
  return (
    <>
      <h1
        className="fixed top-40 md:top-56 lg:top-64 w-screen whitespace-nowrap text-[8rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-white mt-16 text-center mix-blend-difference origin-top"
        style={{
          transform: `translateX(${-lerp(value, 0, 0.1) * 100}vw)`,
        }}
      >
        Hello
      </h1>
      <h1
        className="fixed top-40 md:top-56 lg:top-64 w-screen whitespace-nowrap text-[8rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-white mt-16 text-center mix-blend-difference origin-top"
        style={{
          transform: `translateX(${100 - lerp(value, 0.1, 0.3) * 200 * f}vw)`,
        }}
      >
        I'm Philipp
      </h1>
      <h1
        className="fixed top-40 md:top-56 lg:top-64 w-screen whitespace-nowrap text-[8rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-white mt-16 text-center mix-blend-difference origin-top"
        style={{
          transform: `translate(${200 - lerp(value, 0.3, 0.6) * 400 * f}vw)`,
        }}
      >
        Nice to meet you
      </h1>
      <div className="fixed bottom-32 w-screen flex justify-center mix-blend-difference text-white">
        <CoolArrow hasScrolled={hasScrolled} value={value} />
      </div>
    </>
  );
};

const TitleSection = () => {
  const { ref, value } = useScrollPosition();
  return (
    <section ref={ref} className="w-full h-[600vh]">
      <div className="sticky top-56 sm:pt-10">
        <Blobs value={value} />
        <Hello value={value} />
      </div>
    </section>
  );
};

const Picture = ({ value }: { value: number }) => {
  const isMobile = useIsMobile();
  return (
    <BackgroundVideo
      src={isMobile ? "spiral-mobile.mp4" : "spiral.mp4"}
      value={value}
      style={{
        transform: isMobile
          ? ""
          : `translateX(${lerp(value, 0.5, 0.7) * 20}vw)`,
      }}
    />
  );
};

const BackgroundVideo = React.memo(
  ({
    src,
    className,
    value,
    start = 0,
    end = 1,
    visibleBeforeStart = false,
    visibleAfterEnd = false,
    style,
  }: {
    src: string;
    value: number;
    start?: number;
    end?: number;
    visibleBeforeStart?: boolean;
    visibleAfterEnd?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }) => {
    const ref = React.useRef<HTMLVideoElement>(null);
    const valueRef = useValueRef(lerp(value, start, end));

    // required for ios devices to load the video
    function activate(video: HTMLVideoElement) {
      video.play();
      video.pause();
    }

    React.useEffect(() => {
      const video = ref.current;
      if (!video) return;

      video.src = `videos/${src}`;
      video.load();
      activate(video);

      setInterval(function () {
        if (!video.duration) return;
        video.pause();
        const t = valueRef.current * video.duration;
        video.currentTime = t;
      }, 40);
    }, [src]);

    function getVisible() {
      if (value > start && value < end) {
        return true;
      }
      if (value <= start && visibleBeforeStart) {
        return true;
      }
      if (value >= end && visibleAfterEnd) {
        return true;
      }
      return false;
    }

    return (
      <div
        className={
          "fixed top-0 left-0 right-0 bottom-0 overflow-hidden -z-10 " +
          className
        }
        style={{ display: getVisible() ? "block" : "none", ...style }}
      >
        <video
          key={src}
          ref={ref}
          playsInline
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
    );
  }
);

const AnimatedSpan = ({
  children,
  value,
  blur,
  start,
  end,
  color,
}: {
  children: React.ReactNode;
  value: number;
  blur: number;
  start: number;
  end: number;
  color: string;
}) => {
  const interpolatedValue = lerp(value, start, end);
  const initialScale = 1.2;
  return (
    <span
      className="text_shadows mr-[3rem]"
      style={{
        display: "inline-block",
        transform: `scale(${
          initialScale - interpolatedValue * Math.abs(1 - initialScale)
        }) translateX(${-100 * lerp(value, 0.8, 1)}vw)`,
        filter: `blur(${blur - interpolatedValue * blur}px)`,
        opacity: interpolatedValue,
        color: interpolatedValue === 1 ? color : "black",
        transition: `color 0.7s ease-in-out`,
      }}
    >
      {children}
    </span>
  );
};

const Presentation = ({ value }: { value: number }) => {
  const blur = 10;
  return (
    <div className="sticky top-0 w-screen h-screen flex items-center">
      <h1 className="md:w-1/2 text-[7rem] md:text-[10rem] lg:text-[15rem] leading-[10rem] sm:leading-[15rem] font-black text-black text-center">
        <AnimatedSpan
          blur={blur}
          value={value}
          start={0.5}
          end={0.55}
          color={colors[0]}
        >
          I
        </AnimatedSpan>
        <AnimatedSpan
          blur={blur}
          value={value}
          start={0.55}
          end={0.6}
          color={colors[2]}
        >
          like
        </AnimatedSpan>
        <AnimatedSpan
          blur={blur}
          value={value}
          start={0.6}
          end={0.65}
          color={colors[4]}
        >
          art
        </AnimatedSpan>
        <AnimatedSpan
          blur={blur}
          value={value}
          start={0.65}
          end={0.7}
          color={colors[6]}
        >
          &
        </AnimatedSpan>
        <AnimatedSpan
          blur={blur}
          value={value}
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
  const { ref, value } = useScrollPosition();

  return (
    <section ref={ref} className="w-full h-[600vh] -mt-[200vh]">
      <Picture value={value} />
      <Presentation value={value} />
    </section>
  );
};

const HexagonGrid = ({ value }: { value: number }) => {
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

    const p = lerp(value, 0, 0.5);
    const childCount = boxes.length;
    const visibleCount = Math.floor(p * childCount);

    boxes.forEach((box, i) => {
      box.visible = i < visibleCount;
    });

    if (circle) {
      if (p > 0.5) {
        circle.visible = true;
        circle.position = circle.view.center;
        const s = lerp(value, 0.5, 1) * 20;
        circle.scaling = new Point(s, s);
      } else {
        circle.visible = false;
      }
    }
  }, [value]);

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

const MorphText = ({ value }: { value: number }) => {
  const isMobile = useIsMobile();

  const text1Ref = React.useRef<HTMLSpanElement | null>(null);
  const text2Ref = React.useRef<HTMLSpanElement | null>(null);

  const stateRef = React.useRef({ running: false });

  React.useEffect(() => {
    if (value > 0.55) {
      stateRef.current.running = true;
    } else {
      stateRef.current.running = false;
    }
  }, [value]);

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
          display: value > 0 && value < 1 ? "flex" : "none",
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
  const { ref, value } = useScrollPosition();
  return (
    <section ref={ref} className="w-full h-[600vh] -mt-[100vh]">
      <HexagonGrid value={value} />
      <MorphText value={value} />
    </section>
  );
};

const Rays = ({ value }: { value: number }) => {
  const { ref, paper } = usePaper();
  const stateRef = React.useRef<{
    lines: paper.Path[];
    flood: paper.Path | null;
  }>({ lines: [], flood: null });

  React.useEffect(() => {
    const { lines, flood } = stateRef.current;
    lines.forEach((line) => {
      const s = lerp(value, 0, 0.3);
      line.strokeWidth = s * line.data.maxStroke;
    });

    if (value >= 0.3 && !flood && paper) {
      paper?.activate();
      stateRef.current.flood = new Path.Rectangle({
        from: paper?.view.bounds.topLeft,
        to: paper?.view.bounds.bottomRight,
        fillColor: "white",
      });
    }

    if (value < 0.3 && flood) {
      flood.remove();
      stateRef.current.flood = null;
    }
  }, [value]);

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

const PgBall = ({ value }: { value: number }) => {
  return (
    <>
      <div className="fixed top-0 w-screen h-screen flex items-center justify-center">
        <div
          className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full "
          style={{
            transform: `scale(${lerp(value, 0.8, 1)})`,
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
      <div
        className="fixed bottom-20 left-0 w-full flex justify-center text-white gap-10 overflow-hidden"
        style={{
          opacity: lerp(value, 0.9, 1),
          display: value < 0.9 ? "none" : "flex",
        }}
      >
        <Link
          to="/projects"
          className="font-bold relative after:absolute after:bottom-0 after:left-0 after:w-full after:bg-white after:transform after:transition-all after:ease-in-out after:origin-left after:h-[2px] after:scale-x-0 hover:after:scale-x-100"
        >
          Projects
        </Link>
        <Link
          to="/posts"
          className="font-bold relative after:absolute after:bottom-0 after:left-0 after:w-full after:bg-white after:transform after:transition-all after:ease-in-out after:origin-left after:h-[2px] after:scale-x-0 hover:after:scale-x-100"
        >
          Blog
        </Link>
        <Link
          to="/music"
          className="font-bold relative after:absolute after:bottom-0 after:left-0 after:w-full after:bg-white after:transform after:transition-all after:ease-in-out after:origin-left after:h-[2px] after:scale-x-0 hover:after:scale-x-100"
        >
          Music
        </Link>
      </div>
    </>
  );
};

const EndSection = () => {
  const { ref, value } = useScrollPosition();
  const isMobile = useIsMobile();
  return (
    <section ref={ref} className="w-full h-[1200vh] -mt-[100vh]">
      <Rays value={value} />
      <BackgroundVideo
        src={isMobile ? "lightnings-mobile.mp4" : "lightnings.mp4"}
        value={value}
        start={0.2}
        end={1}
        visibleAfterEnd
      />
      <PgBall value={value} />
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
