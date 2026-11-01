import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf8f6",
          100: "#f2e8e5",
          200: "#eaddd7",
          300: "#e0cec7",
          400: "#d2bab0",
          500: "#b99484",
          600: "#a27a69",
          700: "#866152",
          800: "#6e5044",
          900: "#5b433a",
        },
        sage: {
          50: "#f4f7f4",
          100: "#e6ede6",
          200: "#cfdccf",
          300: "#abc3ac",
          400: "#83a585",
          500: "#648a66",
          600: "#4e6f50",
          700: "#3f5941",
          800: "#354737",
          900: "#2d3b2f",
        },
        amberGold: {
          DEFAULT: "#d97706",
          light: "#fef3c7",
        }
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;
