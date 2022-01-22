import React from "react";
import { Link } from "remix";
import { Button } from "~/components/interaction/Button";
import { MainHeader } from "~/components/layout/MainHeader";
import { SubHeader } from "~/components/layout/SubHeader";

const useScrollPosition = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [percent, setPercent] = React.useState<number>(0);

  React.useEffect(() => {
    function scrollListener() {
      const bbox = ref.current?.getBoundingClientRect();
      if (bbox) {
        console.log(bbox.height, bbox.y);

        const percent = Math.min(
          1,
          Math.max(0, -bbox.y) / (bbox.height - window.innerHeight)
        );
        setPercent(percent);
      }
    }

    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return { ref, percent };
};

const Spacer = () => <div className="h-[20vh]"></div>;

const TitleSection = () => {
  const { ref, percent } = useScrollPosition();
  return (
    <section ref={ref} className="w-full h-[200vh]">
      <div className="sticky top-56 pt-20">
        <div
          className="absolute top-0 left-0 rounded-full shadow-2xl -z-10 bg-gray-200"
          style={{
            width: 500,
            height: 500,
            transform: `translate(${140 - percent * 300 * 1.2}vw,0) scale(${
              percent * 10
            })`,
          }}
        />
        <h1
          className="relative text-[20rem] leading-[15rem] font-black text-center text-gray"
          style={{
            transform: `translate(${percent * 100}%, 0)`,
            mixBlendMode: "difference",
          }}
        >
          Hello
        </h1>
        <h2
          className="text-[5rem] font-black text-gray-400 text-center"
          style={{
            transform: `translate(-${percent * 100}%, 0)`,
            mixBlendMode: "difference",
          }}
        >
          I'm Philipp, nice to meet you.
        </h2>
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
