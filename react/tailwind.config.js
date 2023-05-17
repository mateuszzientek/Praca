module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      pc: "1658px",
    },

    extend: {
      rotate: {
        17: "17deg",
        20: "20deg",
      },
      height: {
        432: "25rem", //size blazera w lg
      },
    },
    fontFamily: {
      lato: ["Lato"],
      roboto: ["Roboto"],
    },
  },
  plugins: [],
};
