import { defineConfig, presetMini, transformerDirectives } from "unocss";

export default defineConfig({
  content: {
    filesystem: ["**/*.{js,ts,jsx,tsx}"],
  },
  presets: [presetMini()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      btn: {
        text: "#fff",
        bg: "#038",
        border: "#038",
        hover: {
          bg: "#002b74",
          border: "#00296d",
        },
        active: {
          bg: "#00296d",
          border: "#002666",
        },
      },
      inp: {
        border: {
          DEFAULT: "#ccc",
          focus: "#52a8eccc",
        },
      },
      link: {
        DEFAULT: "#038",
        hover: "#1a67ea",
      },
    },
  },
});
