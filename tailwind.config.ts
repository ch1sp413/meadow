import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        meadow: {
          bark: "#33291f",
          soil: "#73543d",
          moss: "#5d7746",
          leaf: "#8fa56d",
          clay: "#c9774d",
          reed: "#e4d2ab",
          mist: "#f6f4ed",
          ink: "#232018"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(38, 33, 24, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
