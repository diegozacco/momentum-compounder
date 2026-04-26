import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mc: {
          bg: "#0a0b0f",
          surface: "#12131a",
          "surface-2": "#1a1b25",
          "surface-3": "#22232f",
          border: "#2a2b3a",
          "border-hover": "#3a3b4f",
          text: "#e8e9f0",
          "text-muted": "#7a7b8f",
          "text-dim": "#4a4b5f",
          accent: "#00d4aa",
          "accent-dim": "rgba(0,212,170,0.12)",
          "accent-glow": "rgba(0,212,170,0.25)",
          red: "#ff4757",
          "red-dim": "rgba(255,71,87,0.12)",
          amber: "#ffa502",
          "amber-dim": "rgba(255,165,2,0.12)",
          blue: "#3742fa",
          purple: "#8b5cf6",
        },
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-8px)" },
          "40%, 80%": { transform: "translateX(8px)" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
