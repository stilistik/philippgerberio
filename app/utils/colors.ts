const BLUE_PINK = [
  "#0077b6",
  "#0096c7",
  "#00b4d8",
  "#48cae4",
  "#90e0ef",
  "#a8c6d9",
  "#c0abc3",
  "#d891ad",
  "#e484a2",
  "#f07596",
];

const TURQUOISE_ORANGE = [
  "#fa710f",
  "#ea7c21",
  "#d18b3c",
  "#b39d5b",
  "#95af79",
  "#84b98b",
  "#73c39c",
  "#68cba9",
  "#53dcc4",
  "#3eeddf",
];

const YELLOW_RED = [
  "#b85360",
  "#bd6361",
  "#c17361",
  "#c58362",
  "#c99362",
  "#cb9b63",
  "#cda363",
  "#d1b363",
  "#d5c364",
  "#d9d364",
];

const PALETTES = [TURQUOISE_ORANGE, BLUE_PINK, YELLOW_RED];

export const colors = PALETTES[Math.floor(Math.random() * PALETTES.length)];
