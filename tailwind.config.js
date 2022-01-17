const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        ...fontFamily,
        sans: ["Inter"],
      },
      transitionTimingFunction: {
        bezier: "cubic-bezier(0.59,0.06,0.5,0.94)",
      },
    },
  },
  variants: {},
  plugins: [],
};
