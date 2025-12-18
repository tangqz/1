
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "win11-wallpaper": "url('/wallpaper.jpg')",
        "win11-gradient": "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      },
      colors: {
        "mica": "rgba(255, 255, 255, 0.6)",
        "glass": "rgba(255, 255, 255, 0.7)",
        "glass-border": "rgba(255, 255, 255, 0.5)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      }
    },
  },
  plugins: [],
};
export default config;
