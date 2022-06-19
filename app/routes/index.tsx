import clx from "classnames";
import { Button } from "~/components/interaction/Button";
import { Link } from "@remix-run/react";
import { useIsMobile, useScrollPosition } from "~/utils/hooks";
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

  React.useEffect(() => {
    const w = getWidth();
    const breakPoint =
      w < 420 ? "xs" : w < 640 ? "sm" : w < 768 ? "md" : w < 1024 ? "lg" : "xl";
    setBp(breakPoint);
  }, []);
  return bp;
}

const TitleSection = () => {
  const { ref, percent, scrollY } = useScrollPosition();
  const breakPoint = useBreakPoint();
  const ballSize = 500;
  const initialBallScrollY = 800;

  const {
    topOffset,
    yBallScrollFactor,
    ballTranslationFactor,
    ballScaleMin,
    ballScaleFactor,
  } = FACTORS[breakPoint];

  const hasScrolled = scrollY > 0;
  const yPercent = Math.max(
    0,
    initialBallScrollY - scrollY * yBallScrollFactor
  );

  return (
    <section ref={ref} className="w-full h-[300vh]">
      <div className="sticky top-56 sm:pt-10">
        <div className="flex flex-col items-center bg-white overflow-x-hidden">
          <div
            className="absolute top-0 rounded-full bg-black flex items-center justify-center"
            style={{
              width: ballSize,
              height: ballSize,
              transform: `translate(${
                40 - percent * getWidth() * ballTranslationFactor
              }vw, ${-yPercent - topOffset}px) scale(${
                0.1 + Math.min(ballScaleMin, percent * ballScaleFactor)
              })`,
            }}
          >
            <div
              style={{
                width: "80%",
                height: "80%",
                transform: `scale(${Math.max(0, 1 - percent * 8)})`,
              }}
              className="bg-white rounded-full origin-right"
            />
          </div>
          <div
            className="bg-white mix-blend-difference origin-bottom rounded-full w-[90%] sm:w-[60%] h-[5px] sm:h-[8px]"
            style={{
              transform: `scale(${1 - percent})`,
            }}
          />
          <h2
            className="text-2xl sm:text-[3.5rem] sm:py-6 text-white font-thin text-center mix-blend-screen origin-bottom"
            style={{
              transform: `translateX(${-lerp(percent, 0.7, 1) * 50}vw)`,
              opacity: 1 - lerp(percent, 0.8, 1),
            }}
          >
            My name is Philipp
          </h2>
          <h1
            className="relative text-8xl md:text-[15rem] lg:text-[20rem] leading-[10rem] sm:leading-[15rem] font-black text-white bg-black text-center mix-blend-difference origin-top"
            style={{
              transform: `translateX(${lerp(percent, 0.7, 1) * 50}vw)`,
              opacity: 1 - lerp(percent, 0.8, 1),
            }}
          >
            Hello
          </h1>
          <h2
            className="text-2xl sm:text-[3.5rem] sm:py-6 text-white font-thin text-center mix-blend-screen origin-bottom"
            style={{
              transform: `translateX(${-lerp(percent, 0.7, 1) * 50}vw)`,
              opacity: 1 - lerp(percent, 0.8, 1),
            }}
          >
            It's nice to meet you.
          </h2>
          <div
            className="bg-white mix-blend-difference origin-bottom rounded-full w-[90%] sm:w-[60%] h-[5px] sm:h-[8px]"
            style={{
              transform: `scale(${1 - percent})`,
            }}
          />
          <div className="mix-blend-difference text-white mt-12 sm:mt-16 scale-50 origin-center sm:scale-100">
            <svg
              width={50}
              className={clx("", {
                "animate-bounce": !hasScrolled,
              })}
              style={{
                transform: `scale(${1 - percent})`,
              }}
            >
              <path fill="currentColor" d={`M0,0 L50,0 L25,25, L0,0`} />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

const PictureSection = () => {
  return (
    <>
      <DesktopPictureSection />
      <MobilePictureSection />
    </>
  );
};

const MobilePictureSection = () => {
  const { ref, percent } = useScrollPosition();
  return (
    <section ref={ref} className="block sm:hidden w-full h-[300vh]">
      <div className="sticky top-0 overflow-x-hidden">
        <div
          style={{
            width: "100vw",
            height: "60vh",
            backgroundImage: `url(me.jpeg)`,
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
            transform: `translate(${lerp(percent, 0.9, 1.0) * 100}vw, 0)`,
          }}
        />
        <div
          className="flex flex-col gap-10 items-center p-10 justify-center"
          style={{
            width: "100vw",
            height: "40vh",
            transform: `translate(${-lerp(percent, 0.9, 1.0) * 100}vw, 0)`,
          }}
        >
          <h2
            className="text-xl"
            style={{
              opacity: 0 + lerp(percent, 0, 0.3),
            }}
          >
            That's me ↑
          </h2>
          <h2
            className="text-xl"
            style={{
              opacity: 0 + lerp(percent, 0.3, 0.6),
            }}
          >
            I like technology and art
          </h2>
          <h2
            className="text-xl text-center"
            style={{
              opacity: 0 + lerp(percent, 0.6, 0.9),
            }}
          >
            I am a software engineer by profession and passion
          </h2>
        </div>
      </div>
    </section>
  );
};

const DesktopPictureSection = () => {
  const { ref, percent } = useScrollPosition();
  return (
    <section ref={ref} className="hidden sm:block w-full h-[300vh]">
      <div className="sticky top-0 px-60">
        <div
          className="absolute top-0 left-0 flex flex-col gap-10 items-center p-10 justify-center"
          style={{
            width: "50vw",
            height: "100vh",
            transform: `translate(${-lerp(percent, 0.9, 1.0) * 50}vw, 0)`,
          }}
        >
          <h2
            className="text-[3rem]"
            style={{
              opacity: 0 + lerp(percent, 0, 0.3),
            }}
          >
            That's me {"->"}
          </h2>
          <h2
            className="text-[3rem]"
            style={{
              opacity: 0 + lerp(percent, 0.3, 0.6),
            }}
          >
            I like technology and art
          </h2>
          <h2
            className="text-[3rem] text-center"
            style={{
              opacity: 0 + lerp(percent, 0.6, 0.9),
            }}
          >
            I am a software engineer by profession and passion
          </h2>
        </div>
        <div
          className="absolute top-0 right-0 h-screen"
          style={{
            width: "50vw",
            backgroundImage: `url(me.jpeg)`,
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
            transform: `translate(${lerp(percent, 0.9, 1.0) * 50}vw, 0)`,
          }}
        />
      </div>
    </section>
  );
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const COUNT = 50;
const randoms = Array(COUNT)
  .fill(undefined)
  .map(() => (Math.random() - 0.5) * 2);

interface BeamsProps {
  center: [number, number];
  percent: number;
  start: number;
  end: number;
}

const Beams = ({ center, percent, start, end }: BeamsProps) => {
  return (
    <g>
      {Array(COUNT)
        .fill(undefined)
        .map((_, i) => {
          const p = lerp(percent, start, end);
          const rf = randoms[i];
          const angle = rf * Math.PI * 2;

          const crf = clamp(Math.abs(rf) * 3, 1, 3);
          const d = crf * 8000 * p;

          const x1 = center[0] + crf * 2000 * p * Math.cos(angle);
          const y1 = center[1] + crf * 2000 * p * Math.sin(angle);
          const x2 = center[0] + Math.cos(angle) * d;
          const y2 = center[1] + Math.sin(angle) * d;

          return (
            <line
              key={i}
              x1={x1}
              x2={x2}
              y1={y1}
              y2={y2}
              strokeWidth={10 * p}
              stroke="black"
              strokeLinecap="round"
            />
          );
        })}
    </g>
  );
};

const FinalSection = () => {
  const { ref, percent } = useScrollPosition();
  const [center, setCenter] = React.useState<[number, number]>([0, 0]);

  React.useEffect(() => {
    const width = getWidth();
    const height = getHeight();
    const center: [number, number] = [width / 2, height / 2];
    setCenter(center);
  }, []);

  return (
    <section ref={ref} className="w-full h-[400vh]">
      <div className="sticky top-0 gap-10 bg-white w-screen h-screen overflow-hidden">
        <svg width="100vw" height="100vh">
          <Beams percent={percent} center={center} start={0} end={0.4} />
          <Beams percent={percent} center={center} start={0.2} end={0.6} />
          <Beams percent={percent} center={center} start={0.4} end={0.8} />
          <circle
            cx="50%"
            cy="50%"
            r={clamp(percent * 200, 3, 200)}
            fill="black"
          ></circle>
        </svg>
        <div
          className="absolute top-1/2 left-1/2 flex flex-col items-center gap-10 origin-center"
          style={{
            opacity: lerp(percent, 0.8, 1),
            transform: `translate(-50%, -50%) scale(${lerp(percent, 0.8, 1)})`,
          }}
        >
          <Link to="/projects">
            <Button size="large" className="bg-black border-white">
              See the projects
            </Button>
          </Link>
          <Link to="/posts">
            <Button size="large" className="bg-black border-white">
              Read the blog
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default function Index() {
  return (
    <div className="bg-white">
      <TitleSection />
      <PictureSection />
      <FinalSection />
    </div>
  );
}
