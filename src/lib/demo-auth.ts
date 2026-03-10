/**
 * 繝・Δ隱崎ｨｼ繧ｷ繧ｹ繝・Β
 * Supabase譛ｪ險ｭ螳壽凾縺ｮ繝・せ繝育畑隱崎ｨｼ
 */

export interface DemoUser {
  id: string;
  email: string;
  companyName: string;
  lastName: string;
  firstName: string;
  phone: string;
  plan: "STARTER" | "BUSINESS" | "AGENCY" | "ENTERPRISE";
}

// 繝・せ繝育畑繧｢繧ｫ繧ｦ繝ｳ繝・export const DEMO_ACCOUNTS: Record<string, { password: string; user: DemoUser }> = {
  "enterprise@test.seogeo.jp": {
    password: "Enterprise2024!",
    user: {
      id: "demo-enterprise-001",
      email: "enterprise@test.seogeo.jp",
      companyName: "譬ｪ蠑丈ｼ夂､ｾ繝・せ繝医お繝ｳ繧ｿ繝ｼ繝励Λ繧､繧ｺ",
      lastName: "逕ｰ荳ｭ",
      firstName: "螟ｪ驛・,
      phone: "03-1234-5678",
      plan: "ENTERPRISE",
    },
  },
};

export const SESSION_COOKIE_NAME = "demo-session";

export function validateCredentials(email: string, password: string): DemoUser | null {
  const account = DEMO_ACCOUNTS[email];
  if (account && account.password === password) {
    return account.user;
  }
  return null;
}

export function createSessionToken(user: DemoUser): string {
  // Base64繧ｨ繝ｳ繧ｳ繝ｼ繝峨・邁｡譏薙そ繝・す繝ｧ繝ｳ・医ョ繝｢逕ｨ・・  return Buffer.from(JSON.stringify(user)).toString("base64");
}

export function parseSessionToken(token: string): DemoUser | null {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}
