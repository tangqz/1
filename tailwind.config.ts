
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "win11-wallpaper": "url('/wallpaper.jpg')", // Ensure you have a wallpaper or use a gradient
      },
      colors: {
        "mica": "rgba(255, 255, 255, 0.6)",
      }
    },
  },
  plugins: [],
};
export default config;
