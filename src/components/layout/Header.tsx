"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Bell, User } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0A0D14]/90 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-40">
        <button onClick={() => setMenuOpen(true)} className="text-text-dim hover:text-text p-1">
          <Menu size={22} />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-purple flex items-center justify-center text-white text-xs font-bold">
            S
          </div>
          <span className="text-base font-bold tracking-tight text-text">S&G</span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="text-text-dim hover:text-text p-1">
            <Bell size={18} />
          </button>
          <button className="w-7 h-7 rounded-full bg-accent/12 flex items-center justify-center">
            <User size={14} className="text-indigo-300" />
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
