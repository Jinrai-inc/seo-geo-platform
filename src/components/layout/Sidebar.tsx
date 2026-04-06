"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Search,
  TrendingUp,
  PenTool,
  Bot,
  Link2,
  Stethoscope,
  ClipboardList,
  FileText,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", icon: BarChart3, label: "概要" },
  { href: "/keywords", icon: Search, label: "キーワード" },
  { href: "/rankings", icon: TrendingUp, label: "順位トラッキング" },
  { href: "/gsc", icon: Link2, label: "Search Console" },
  { href: "/geo", icon: Bot, label: "GEO分析" },
  { href: "/articles", icon: PenTool, label: "記事作成" },
  { href: "/audit", icon: Stethoscope, label: "サイト監査" },
  { href: "/regulations", icon: ClipboardList, label: "レギュレーション" },
  { href: "/reports", icon: FileText, label: "レポート" },
  { href: "/settings", icon: Settings, label: "設定" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen bg-[#0A0D14] border-r border-white/[0.06] fixed left-0 top-0">
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple flex items-center justify-center text-white text-sm font-bold shadow-glow-sm">
            S
          </div>
          <span className="text-lg font-bold tracking-tight text-text">
            S&G <span className="text-text-dim font-normal text-sm">Platform</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent/12 text-indigo-300 shadow-glow-sm"
                  : "text-text-dim hover:text-text hover:bg-white/[0.04]"
              }`}
            >
              <item.icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-purple/20 flex items-center justify-center">
            <span className="text-xs font-medium text-indigo-300">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text truncate">ユーザー</p>
            <p className="text-[10px] text-text-dim truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
