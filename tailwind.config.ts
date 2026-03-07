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
        brand: {
          50: "#fff1ef",
          100: "#ffe2de",
          500: "#FF3B30",
          600: "#e6352b",
          700: "#c92d24"
        },
        accent: {
          500: "#FF6A00",
          600: "#e85f00"
        }
      }
    }
  },
  plugins: []
};

export default config;
