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
        forest: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        gold: {
          DEFAULT: "#d97706",
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // community = alias for forest (used by admin portal)
        community: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#4ade80",
          300: "#22c55e",
          400: "#16a34a",
          500: "#15803d",
          600: "#166534",
          700: "#14532d",
          800: "#052e16",
          900: "#021a0c",
        },
        dark: {
          950: "#020712",
          900: "#040c14",
          800: "#06101a",
          700: "#081520",
          600: "#0a1c2a",
        },
        neon: {
          blue:   "#00d4ff",
          purple: "#7b2fff",
        },
      },
      fontFamily: {
        sans:    ["'Inter'", "sans-serif"],
        display: ["'Space Grotesk'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "fade-in-up":  "fadeInUp 0.6s ease forwards",
        "float":       "float 6s ease-in-out infinite",
        "pulse-slow":  "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "card":  "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.08)",
        "btn":   "0 2px 8px rgba(22,101,52,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
