import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: "accent" | "blue" | "orange" | "warn" | "purple" | "green" | "dim";
  size?: "sm" | "md";
  className?: string;
}

const colorMap = {
  accent: "bg-accent/12 text-indigo-300 ring-1 ring-accent/20",
  blue: "bg-blue/12 text-blue-300 ring-1 ring-blue/20",
  orange: "bg-orange/12 text-amber-300 ring-1 ring-orange/20",
  warn: "bg-warn/12 text-red-300 ring-1 ring-warn/20",
  purple: "bg-purple/12 text-purple-300 ring-1 ring-purple/20",
  green: "bg-green/12 text-emerald-300 ring-1 ring-green/20",
  dim: "bg-white/[0.06] text-text-dim ring-1 ring-white/[0.06]",
};

const sizeMap = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
};

export function Badge({ children, color = "accent", size = "md", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorMap[color]} ${sizeMap[size]} ${className}`}>
      {children}
    </span>
  );
}
