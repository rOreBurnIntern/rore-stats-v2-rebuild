import type { Config } from "tailwindcss";
import { THEME_COLORS } from "./src/lib/theme";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: THEME_COLORS,
      },
      fontFamily: {
        sans: ["Trebuchet MS", "Segoe UI", "sans-serif"],
        mono: ["Courier New", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
