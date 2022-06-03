import React from "react";
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery("(max-device-width: 480px)");
}

export const useScrollPosition = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [percent, setPercent] = React.useState<number>(0);
  const [scrollY, setScrollY] = React.useState<number>(0);
  const [bbox, setBbox] = React.useState<DOMRect | null>(null);

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
        setBbox(bbox);
      }
    }

    const bbox = ref.current?.getBoundingClientRect();
    if (bbox) setBbox(bbox);

    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return { ref, percent, scrollY, bbox };
};

export function useMobileAutoHoverOnScroll(
  setHovered: React.Dispatch<React.SetStateAction<boolean>>
) {
  const isMobile = useIsMobile();
  const { ref, bbox } = useScrollPosition();

  React.useEffect(() => {
    if (bbox && isMobile) {
      if (bbox.y > 0 && bbox.y < window.innerHeight / 2) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    }
  }, [bbox, isMobile]);

  return ref;
}
