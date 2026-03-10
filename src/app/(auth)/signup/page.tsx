"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
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
        body: JSON.stringify({
          action: "signup",
          companyName,
          lastName,
          firstName,
          phone,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "逋ｻ骭ｲ縺ｫ螟ｱ謨励＠縺ｾ縺励◆");
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
          <p className="text-text-mid mt-2">繧｢繧ｫ繧ｦ繝ｳ繝井ｽ懈・</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-warn/10 border border-warn/30 rounded-lg px-3 py-2 text-warn text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm text-text-mid mb-1">莨夂､ｾ蜷・/label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-bg-soft border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                placeholder="譬ｪ蠑丈ｼ夂､ｾ縲・・
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-text-mid mb-1">蟋・/label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-soft border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  placeholder="螻ｱ逕ｰ"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-text-mid mb-1">蜷・/label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-soft border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  placeholder="螟ｪ驛・
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-mid mb-1">髮ｻ隧ｱ逡ｪ蜿ｷ</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-bg-soft border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                placeholder="03-1234-5678"
                required
              />
            </div>
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
                placeholder="8譁・ｭ嶺ｻ･荳・
                minLength={8}
                required
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              繧｢繧ｫ繧ｦ繝ｳ繝井ｽ懈・
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-dim">
            譌｢縺ｫ繧｢繧ｫ繧ｦ繝ｳ繝医ｒ縺頑戟縺｡縺ｮ蝣ｴ蜷医・{" "}
            <Link href="/login" className="text-accent hover:underline">
              繝ｭ繧ｰ繧､繝ｳ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
