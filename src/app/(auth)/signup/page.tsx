"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const [companyName, setCompanyName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", companyName, lastName, firstName, phone, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "登録に失敗しました");
        return;
      }
      window.location.href = "/keywords";
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-text text-sm placeholder:text-text-dim";

  return (
    <div className="min-h-screen bg-[#06080C] flex items-center justify-center p-4 bg-gradient-radial">
      <div className="w-full max-w-[420px] animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple flex items-center justify-center text-white text-lg font-bold shadow-glow">
              S
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">S&G Platform</h1>
          <p className="text-text-dim mt-1.5 text-sm">アカウント作成</p>
        </div>
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-7 shadow-elevated">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-warn/10 border border-warn/20 rounded-xl px-4 py-2.5 text-warn text-sm">{error}</div>
            )}
            <div>
              <label className="block text-sm text-text-mid mb-1.5 font-medium">会社名</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                className={inputClass} placeholder="株式会社○○" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-text-mid mb-1.5 font-medium">姓</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className={inputClass} placeholder="山田" required />
              </div>
              <div>
                <label className="block text-sm text-text-mid mb-1.5 font-medium">名</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass} placeholder="太郎" required />
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-mid mb-1.5 font-medium">電話番号</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className={inputClass} placeholder="03-1234-5678" required />
            </div>
            <div>
              <label className="block text-sm text-text-mid mb-1.5 font-medium">メールアドレス</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className={inputClass} placeholder="you@company.com" required />
            </div>
            <div>
              <label className="block text-sm text-text-mid mb-1.5 font-medium">パスワード</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className={inputClass} placeholder="8文字以上" minLength={8} required />
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              アカウント作成
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-text-dim">
            既にアカウントをお持ちの場合は{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">ログイン</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
