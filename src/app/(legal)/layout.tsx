import React from "react";
import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#06080C] bg-gradient-radial">
      <header className="border-b border-white/[0.06] sticky top-0 z-40 bg-[#06080C]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#A855F7] flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-[#F1F5F9]">
              S&G <span className="text-[#64748B] font-normal text-sm">Platform</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/terms" className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">利用規約</Link>
            <Link href="/privacy" className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">プライバシー</Link>
            <Link href="/commerce" className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">特商法表記</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-12">
        {children}
      </main>
      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-[#64748B]">
          &copy; {new Date().getFullYear()} S&G Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
