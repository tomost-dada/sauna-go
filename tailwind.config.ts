import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#a13920",
          container: "#fe7d5e",
          fixed: "#ffb4a1",
        },
        secondary: {
          DEFAULT: "#005f9b",
          container: "#b1d5ff",
          "fixed-dim": "#8abae0",
        },
        tertiary: "#803f9d",
        surface: {
          DEFAULT: "#f8f9fa",
          "container-lowest": "#ffffff",
          "container-low": "#f0f2f4",
          container: "#e6e8ea",
          "container-high": "#dcdfe1",
          "container-highest": "#d2d5d8",
        },
        "on-surface": {
          DEFAULT: "#2c2f30",
          variant: "#6b6e70",
        },
        "on-secondary-fixed": "#003354",
        "outline-variant": "rgba(44, 47, 48, 0.15)",
      },
      fontFamily: {
        display: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        body: ["var(--font-be-vietnam-pro)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "2rem",
        "3xl": "3rem",
      },
      boxShadow: {
        ambient: "0 20px 40px rgba(44, 47, 48, 0.06)",
        "ambient-sm": "0 8px 24px rgba(44, 47, 48, 0.04)",
        "focus-primary": "0 0 0 4px rgba(254, 125, 94, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
