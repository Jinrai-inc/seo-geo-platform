"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
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
        setError(data.error || "繝ｭ繧ｰ繧､繝ｳ縺ｫ螟ｱ謨励＠縺ｾ縺励◆");
        return;
      }

      router.push("/keywords");
    } catch {
      setError("騾壻ｿ｡繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-blue bg-clip-text text-transparent">
            SEOﾃ宥EO
          </h1>
          <p className="text-text-mid mt-2">繝ｭ繧ｰ繧､繝ｳ</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-warn/10 border border-warn/30 rounded-lg px-3 py-2 text-warn text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm text-text-mid mb-1">繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-bg-soft border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                placeholder="example@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-mid mb-1">繝代せ繝ｯ繝ｼ繝・/label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-bg-soft border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                placeholder="窶｢窶｢窶｢窶｢窶｢窶｢窶｢窶｢"
                required
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              繝ｭ繧ｰ繧､繝ｳ
            </Button>
          </form>

          {/* 繝・せ繝医い繧ｫ繧ｦ繝ｳ繝域ュ蝣ｱ */}
          <div className="mt-4 p-3 bg-bg-soft border border-border rounded-lg">
            <p className="text-xs text-text-dim mb-2">繝・せ繝育畑繧｢繧ｫ繧ｦ繝ｳ繝茨ｼ医お繝ｳ繧ｿ繝ｼ繝励Λ繧､繧ｺ・・</p>
            <div className="text-xs text-text-mid space-y-1">
              <p>ID: <span className="text-accent font-mono">enterprise@test.seogeo.jp</span></p>
              <p>PW: <span className="text-accent font-mono">Enterprise2024!</span></p>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-text-dim">
            繧｢繧ｫ繧ｦ繝ｳ繝医′縺ｪ縺・ｴ蜷医・{" "}
            <Link href="/signup" className="text-accent hover:underline">
              繧ｵ繧､繝ｳ繧｢繝・・
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
