import React from "react";
import { useEffect, useState } from "react";
import { getWidth } from "./math";

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
  return getWidth() < 640;
}

export const useScrollPosition = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = React.useState<number>(0);
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
        setValue(percent);
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

  return { ref, value, scrollY, bbox };
};

export function useMobileAutoHoverOnScroll(
  hovered: boolean,
  setHovered: React.Dispatch<React.SetStateAction<boolean>>
) {
  const isMobile = useIsMobile();
  const { ref, bbox } = useScrollPosition();

  React.useEffect(() => {
    if (bbox && isMobile) {
      if (bbox.y > 0 && bbox.y < window.innerHeight / 2) {
        if (!hovered) setHovered(true);
      } else {
        if (hovered) setHovered(false);
      }
    }
  }, [hovered, bbox, isMobile]);

  return ref;
}

type KeyEvents = "keydown" | "keyup" | "keypressed";
type MouseEvents = "click" | "mousedown" | "mouseup" | "mousemove";
type WheelEvents = "wheel";
type Events = KeyEvents | MouseEvents | WheelEvents;

export function useEventListener<K extends Events>(
  target: HTMLElement | Document,
  eventName: K,
  callback: (
    e: K extends MouseEvents
      ? MouseEvent
      : K extends KeyEvents
      ? KeyboardEvent
      : K extends WheelEvents
      ? WheelEvent
      : never
  ) => void
) {
  React.useEffect(() => {
    target.addEventListener(eventName, callback as any);
    return () => {
      target.removeEventListener(eventName, callback as any);
    };
  }, [callback]);
}

export function useOnResize(fn: () => void) {
  React.useEffect(() => fn(), []);
  React.useEffect(() => {
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [fn]);
}

export function useValueRef<T extends unknown>(value: T) {
  const ref = React.useRef<T>(value);
  ref.current = value;
  return ref;
}
