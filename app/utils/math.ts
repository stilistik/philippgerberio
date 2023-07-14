export const CAN_USE_DOM: boolean =
  typeof document !== "undefined" &&
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined";

export function lerp(value: number, start: number, end: number) {
  if (value < start) return 0;
  else if (value > end) return 1;
  else {
    return (value - start) / (end - start);
  }
}

export function getWidth() {
  if (CAN_USE_DOM) {
    return window.innerWidth;
  } else {
    return 1200; // default assumed window size for if js is disabled
  }
}

export function getHeight() {
  if (CAN_USE_DOM) {
    return window.innerHeight;
  } else {
    return 800; // default assumed window size for if js is disabled
  }
}

export function random(max?: number, min?: number) {
  if (typeof max !== "number") {
    return Math.random();
  } else if (typeof min !== "number") {
    min = 0;
  }
  return Math.random() * (max - min) + min;
}
