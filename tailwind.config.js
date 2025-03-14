import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  content: ["./src/*.html", "./src/**/*.jsx"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          // See https://ics.media/entry/200317/
          "Hiragino Kaku Gothic ProN",
          "Hiragino Sans",
          "BIZ UDPGothic",
          "Meiryo",
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
};

export default config;
