"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "ログインに失敗しました");
        return;
      }

      window.location.href = "/keywords";
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080C] flex items-center justify-center p-4 bg-gradient-radial">
      <div className="w-full max-w-[420px] animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple flex items-center justify-center text-white text-lg font-bold shadow-glow">
              S
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">
            S&G Platform
          </h1>
          <p className="text-text-dim mt-1.5 text-sm">アカウントにログイン</p>
        </div>
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7 shadow-elevated">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-warn/10 border border-warn/20 rounded-xl px-4 py-2.5 text-warn text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm text-text-mid mb-1.5 font-medium">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-text text-sm placeholder:text-text-dim"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-mid mb-1.5 font-medium">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-text text-sm placeholder:text-text-dim"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              ログイン
            </Button>
          </form>

          <div className="mt-5 p-3.5 bg-white/[0.03] border border-white/[0.05] rounded-xl">
            <p className="text-[11px] text-text-dim mb-1.5 font-medium uppercase tracking-wider">テストアカウント</p>
            <div className="text-xs text-text-mid space-y-0.5">
              <p>ID: <span className="text-indigo-300 font-mono">enterprise@test.sg-platform.jp</span></p>
              <p>PW: <span className="text-indigo-300 font-mono">Enterprise2024!</span></p>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-text-dim">
            アカウントがない場合は{" "}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              サインアップ
            </Link>
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-text-dim">
          <Link href="/terms" className="hover:text-text-mid transition-colors">利用規約</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-text-mid transition-colors">プライバシーポリシー</Link>
          <span>|</span>
          <Link href="/commerce" className="hover:text-text-mid transition-colors">特商法表記</Link>
        </div>
      </div>
    </div>
  );
}
