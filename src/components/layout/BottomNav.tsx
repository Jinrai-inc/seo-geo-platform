"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Search, TrendingUp, PenTool, Bot } from "lucide-react";

const navItems = [
  { href: "/", icon: BarChart3, label: "概要" },
  { href: "/keywords", icon: Search, label: "KW" },
  { href: "/rankings", icon: TrendingUp, label: "順位" },
  { href: "/articles", icon: PenTool, label: "記事" },
  { href: "/geo", icon: Bot, label: "GEO" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0D14]/95 backdrop-blur-md border-t border-white/[0.06] z-40 safe-area-pb">
      <div className="flex items-center justify-around py-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? "text-indigo-300" : "text-text-dim"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
