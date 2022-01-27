import React from "react";
import clx from "classnames";

const useScrollPosition = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [percent, setPercent] = React.useState<number>(0);
  const [scrollY, setScrollY] = React.useState<number>(0);

  React.useEffect(() => {
    function scrollListener() {
      const bbox = ref.current?.getBoundingClientRect();
      if (bbox) {
        const percent = Math.min(
          1,
          Math.max(0, -bbox.y) / (bbox.height - window.innerHeight)
        );
        setPercent(percent);
        setScrollY(window.scrollY);
      }
    }

    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return { ref, percent, scrollY };
};

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

function useWindowDimensions() {
  const [dim, setDim] = React.useState({ width: 1200, height: 800 });
  React.useLayoutEffect(() => {
    setDim({ width: window.innerWidth, height: window.innerHeight });
  }, []);
  return dim;
}

const Spacer = () => <div className="h-[20vh]"></div>;

const TitleSection = () => {
  const { ref, percent, scrollY } = useScrollPosition();

  const hasScrolled = scrollY > 0;
  const yPercent = Math.max(0, 800 - scrollY * 3.5);

  const d = Math.max(0, percent - 0.5);
  return (
    <section ref={ref} className="w-full h-[300vh]">
      <div className="sticky top-56 pt-10">
        <div className="flex flex-col items-center bg-white">
          <div
            className="absolute top-0 rounded-full bg-black flex items-center justify-center"
            style={{
              width: 500,
              height: 500,
              transform: `translate(${
                40 - percent * (500000 / getWidth())
              }vw, ${-yPercent}px) scale(${0.1 + Math.min(10, percent * 12)})`,
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
            className="bg-white mix-blend-difference origin-bottom rounded-full"
            style={{
              transform: `scale(${1 - percent})`,
              width: 1000,
              height: 8,
            }}
          />
          <h2
            className="text-[3.5rem] text-white font-thin text-center mix-blend-screen origin-bottom"
            style={{
              transform: `translateX(${-lerp(percent, 0.7, 1) * 50}vw)`,
              opacity: 1 - lerp(percent, 0.8, 1),
            }}
          >
            My name is Philipp
          </h2>
          <h1
            className="relative text-[20rem] leading-[15rem] font-black text-white bg-black text-center mix-blend-difference origin-top"
            style={{
              transform: `translateX(${lerp(percent, 0.7, 1) * 50}vw)`,
              opacity: 1 - lerp(percent, 0.8, 1),
            }}
          >
            Hello
          </h1>
          <h2
            className="text-[3.5rem] text-white font-thin text-center mix-blend-screen origin-bottom"
            style={{
              transform: `translateX(${-lerp(percent, 0.7, 1) * 50}vw)`,
              opacity: 1 - lerp(percent, 0.8, 1),
            }}
          >
            It's nice to meet you.
          </h2>
          <div
            className="bg-white mix-blend-difference origin-bottom rounded-full"
            style={{
              transform: `scale(${1 - percent})`,
              width: 1000,
              height: 8,
            }}
          />
          <svg
            width={50}
            className={clx("mix-blend-difference text-white  mt-16", {
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
    </section>
  );
};

const PictureSection = () => {
  const { ref, percent } = useScrollPosition();
  return (
    <section ref={ref} className="w-full h-[300vh]">
      <div className="sticky top-0 px-60 ">
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

const technologies = [
  "React",
  "Remix",
  "NextJS",
  "Vue",
  "Node",
  "Postgres",
  "DynamoDB",
  "JavaScript",
  "TypeScript",
  "Python",
  "Docker",
  "C#",
  "C++",
  "SQL",
];

const TechnologySection = () => {
  const { ref, percent } = useScrollPosition();
  const { width, height } = useWindowDimensions();
  return (
    <section ref={ref} className="w-full h-[300vh]">
      <div className="sticky top-0 p-20 gap-10 bg-white">
        <div
          className="absolute top-0 rounded-full bg-black flex items-center justify-center shadow-2xl"
          style={{
            width: 500,
            height: 500,
            marginLeft: -250,
            transform: `translate(${10 + percent * 150}vw, ${
              percent * 80
            }%) scale(${0.1 + lerp(percent, 0, 0.5) * 3})`,
          }}
        />
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, i) => {
            const t_in = 0.6;
            const inc_in = t_in / technologies.length;
            const inc_out = 0.4 / technologies.length;

            return (
              <span
                className={clx(
                  "relative px-8 py-3 font-thin text-7xl lg:text-8xl 2xl:text-9xl mix-blend-difference bg-black text-white border-white border-4"
                )}
                style={{
                  opacity:
                    lerp(percent, i * inc_in, (i + 1) * inc_in) -
                    lerp(percent, t_in + i * inc_out, t_in + (i + 1) * inc_out),
                  transform: `translate(${
                    10 -
                    lerp(percent, i * inc_in, (i + 1) * inc_in) * 10 -
                    lerp(
                      percent,
                      t_in + i * inc_out,
                      t_in + (i + 1) * inc_out
                    ) *
                      10
                  }%, 0)`,
                }}
              >
                {tech}
              </span>
            );
          })}
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
      <TechnologySection />
    </div>
  );
}
