import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Calm, quiet, reliable palette for adult learners (no childish cartoon colors)
        ink: "#1f2933",
        muted: "#67737d",
        line: "#e3e8ec",
        bg: "#f6f7f9",
        surface: "#ffffff",
        brand: "#2f6f6b",      // calm teal-green
        brandSoft: "#e6f0ef",
        accent: "#3a6ea5",     // calm blue for German
        warn: "#b06a2c",       // ochre for weak
        danger: "#a6432f",
        good: "#2f7d4f",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "sans-serif",
        ],
        de: [
          "Georgia",
          "Times New Roman",
          "Songti SC",
          "serif",
        ],
      },
      fontSize: {
        de: ["1.35rem", { lineHeight: "1.6" }],
      },
    },
  },
  plugins: [],
};

export default config;
