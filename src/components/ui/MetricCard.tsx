import React from "react";
import { Card } from "./Card";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number | string;
  changeLabel?: string;
  color?: string;
}

export function MetricCard({ icon, label, value, change, changeLabel, color = "accent" }: MetricCardProps) {
  const numChange = typeof change === "number" ? change : null;
  const isPositive = numChange !== null && numChange > 0;
  const isNegative = numChange !== null && numChange < 0;

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-${color} to-transparent`} />
      <div className="flex items-center gap-2 text-text-dim text-sm mb-3">
        <span className={`text-${color}`}>{icon}</span>
        <span>{label}</span>
      </div>
      <div>
        <span className="text-2xl font-bold font-mono text-text tracking-tight">{value}</span>
      </div>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-sm">
          {typeof change === "string" ? (
            <span className="text-text-dim">{change}</span>
          ) : (
            <span className={`font-medium ${isPositive ? "text-green" : isNegative ? "text-warn" : "text-text-dim"}`}>
              {isPositive ? "+" : ""}{change}
            </span>
          )}
          {changeLabel && <span className="text-text-dim">{changeLabel}</span>}
        </div>
      )}
    </Card>
  );
}
