import React from "react";
import clx from "classnames";
import { Button } from "~/components/interaction/Button";
import { Link } from "remix";

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

const technologies = [
  { name: "React", size: 12 },
  { name: "JavaScript", size: 8 },
  { name: "TypeScript", size: 6 },
  { name: "Vue", size: 6 },
  { name: "Node", size: 7 },
  { name: "Python", size: 7 },
  { name: "Remix", size: 7 },
  { name: "Docker", size: 7 },
  { name: "NextJS", size: 6 },
  { name: "Postgres", size: 6 },
  { name: "C#", size: 6 },
  { name: "SQL", size: 6 },
  { name: "DynamoDB", size: 3 },
  { name: "C++", size: 1 },
  { name: "Java", size: 1 },
  { name: "Unity 3D", size: 1 },
];

const TechnologySection = () => {
  const { ref, percent } = useScrollPosition();
  const wordRefs = React.useRef<HTMLDivElement[]>([]);

  React.useLayoutEffect(() => {
    const boundingBoxes: DOMRect[] = [];

    const baseIncrement = 20;
    const incrementSteps = 50;
    const angularSteps = 50;

    function isIntersecting(a: DOMRect) {
      if (
        a.x < 0 ||
        a.x + a.width > window.innerWidth ||
        a.y < 0 ||
        a.y + a.height > window.innerHeight
      ) {
        return true;
      }
      for (const b of boundingBoxes) {
        if (
          a.x <= b.x + b.width &&
          a.x + a.width >= b.x &&
          a.y <= b.y + b.height &&
          a.y + a.height >= b.y
        ) {
          return true;
        }
      }
      return false;
    }

    function positionElement(div: HTMLDivElement) {
      const currentX = Number(div.style.left.replace("px", ""));
      const currentY = Number(div.style.top.replace("px", ""));
      for (let i = 0; i < incrementSteps; ++i) {
        const r = baseIncrement * i;
        for (let a = 0; a < angularSteps; ++a) {
          const angle = ((2 * Math.PI) / angularSteps) * a;
          const dx = Math.sin(angle) * r;
          const dy = Math.cos(angle) * r;
          console.log(dx, dy);

          div.style.top = `${currentY + dy}px`;
          div.style.left = `${currentX + dx}px`;

          const bbox = div.getBoundingClientRect();
          const intersects = isIntersecting(bbox);
          if (!intersects) return bbox;
        }
      }
      return null;
    }

    wordRefs.current.forEach((div, idx) => {
      const tech = technologies.find((el) => el.name === div.id);
      if (!tech) return;

      div.style.top = window.innerHeight / 2 + "px";
      div.style.left = window.innerWidth / 2 + "px";
      div.style.fontSize = `${tech.size}em`;
      div.style.transform = `translate(-50%, -50%)`;

      if ((idx + 1) % 2 === 0) {
        div.style.transform += " rotate(-90deg)";
      }

      const bbox = positionElement(div);
      if (bbox) boundingBoxes.push(bbox);
    });
  }, []);

  return (
    <section ref={ref} className="w-full h-[300vh]">
      <div className="sticky top-0 p-20 gap-10 bg-white h-screen w-screen overflow-hidden flex items-center">
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
        <div className="flex flex-wrap gap-2 justify-center items-baseline">
          {technologies.map(({ size, name }, i) => {
            const t_in = 0.6;
            const inc_in = t_in / technologies.length;
            const inc_out = 0.4 / technologies.length;

            return (
              <div
                key={name}
                id={name}
                ref={(ref) => {
                  if (ref) wordRefs.current.push(ref);
                }}
                className="absolute mix-blend-difference text-white p-3"
              >
                <span
                  className="p-2 border-4 border-white leading-none"
                  style={{
                    opacity:
                      lerp(percent, i * inc_in, (i + 1) * inc_in) -
                      lerp(
                        percent,
                        t_in + i * inc_out,
                        t_in + (i + 1) * inc_out
                      ),
                    transform: `scale(${
                      1 -
                      lerp(percent, i * inc_in, (i + 1) * inc_in) * 0.2 -
                      lerp(
                        percent,
                        t_in + i * inc_out,
                        t_in + (i + 1) * inc_out
                      ) *
                        0.2
                    }`,
                  }}
                >
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FinalSection = () => {
  const { ref, percent } = useScrollPosition();
  return (
    <section ref={ref} className="w-full h-[300vh]">
      <div className="sticky top-0 p-20 gap-10 bg-white">
        <div className="flex gap-10">
          <Link to="/projects">
            <Button size="large">See the projects</Button>
          </Link>
          <Link to="/posts">
            <Button size="large">Read the blog</Button>
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
      <TechnologySection />
      <FinalSection />
    </div>
  );
}
