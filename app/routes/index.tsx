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

const Spacer = () => <div className="h-[20vh]"></div>;

const TitleSection = () => {
  const { ref, percent, scrollY } = useScrollPosition();

  const hasScrolled = scrollY > 0;
  const yPercent = Math.max(0, 800 - scrollY * 3.5);

  const d = Math.max(0, percent - 0.5);
  return (
    <section ref={ref} className="w-full h-[300vh]">
      <div className="sticky top-56 pt-20">
        <div className="flex flex-col items-center bg-white">
          <div
            className="absolute top-0 rounded-full shadow-2xl bg-black flex items-center justify-center"
            style={{
              width: 500,
              height: 500,
              transform: `translate(${
                40 - percent * 300
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
            className="bg-white mix-blend-difference origin-bottom rounded-full mb-4"
            style={{
              transform: `scale(${1 - percent})`,
              width: 800,
              height: 8,
            }}
          />
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
            className="text-[3.5rem] font-black text-red-400 text-center mix-blend-difference origin-bottom"
            style={{
              transform: `translateX(${-lerp(percent, 0.7, 1) * 50}vw)`,
              opacity: 1 - lerp(percent, 0.8, 1),
            }}
          >
            I'm Philipp, nice to meet you.
          </h2>
          <div
            className="bg-white mix-blend-difference origin-bottom rounded-full"
            style={{
              transform: `scale(${1 - percent})`,
              width: 800,
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
  console.log(percent);

  return (
    <section ref={ref} className="w-full h-[300vh]">
      <div className="sticky top-0 flex gap-10 px-60 pt-56 items-center">
        <h2 className="text-[3rem] font-medium text-gray-400">
          That's me when i was catching Pokemon out in the wilderness of
          Alabastia.
        </h2>
        <img
          src="me.jpeg"
          alt="Picture of myself"
          className="rounded-full shadow-2xl"
        />
      </div>
    </section>
  );
};

export default function Index() {
  return (
    <div className="bg-white">
      <TitleSection />
      <PictureSection />
    </div>
  );
}
