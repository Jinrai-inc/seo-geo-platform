import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 shadow-card ${
        hover ? "hover:border-accent/30 hover:shadow-glow-sm transition-all duration-300 cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
