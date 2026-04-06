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
        background: "var(--background)",
        foreground: "var(--foreground)",
        bg: "#06080C",
        "bg-soft": "#0C1017",
        card: "rgba(255,255,255,0.04)",
        "card-alt": "rgba(255,255,255,0.07)",
        accent: "#6366F1",
        "accent-soft": "rgba(99,102,241,0.12)",
        warn: "#EF4444",
        "warn-soft": "rgba(239,68,68,0.12)",
        blue: "#3B82F6",
        "blue-soft": "rgba(59,130,246,0.12)",
        orange: "#F59E0B",
        "orange-soft": "rgba(245,158,11,0.12)",
        purple: "#A855F7",
        "purple-soft": "rgba(168,85,247,0.12)",
        green: "#10B981",
        "green-soft": "rgba(16,185,129,0.12)",
        text: "#F1F5F9",
        "text-mid": "#94A3B8",
        "text-dim": "#64748B",
        border: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans JP", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px -4px rgba(99,102,241,0.25)",
        "glow-sm": "0 0 12px -2px rgba(99,102,241,0.2)",
        card: "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
        elevated: "0 4px 24px -4px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
