const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        ...fontFamily,
        sans: ["Inter"],
      },
    },
  },
  variants: {},
  plugins: [],
};
