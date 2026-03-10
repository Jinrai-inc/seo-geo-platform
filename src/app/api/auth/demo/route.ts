import { NextRequest, NextResponse } from "next/server";
import {
  validateCredentials,
  createSessionToken,
  DEMO_ACCOUNTS,
  SESSION_COOKIE_NAME,
  type DemoUser,
} from "@/lib/demo-auth";

// POST /api/auth/demo - 繝ｭ繧ｰ繧､繝ｳ
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "login") {
    const { email, password } = body;
    const user = validateCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: "繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ縺ｾ縺溘・繝代せ繝ｯ繝ｼ繝峨′豁｣縺励￥縺ゅｊ縺ｾ縺帙ｓ" }, { status: 401 });
    }
    const token = createSessionToken(user);
    const res = NextResponse.json({ user });
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7譌･
    });
    return res;
  }

  if (action === "signup") {
    const { email, companyName, lastName, firstName, phone, password } = body;

    // 譌｢蟄倥い繧ｫ繧ｦ繝ｳ繝医メ繧ｧ繝・け
    if (DEMO_ACCOUNTS[email]) {
      return NextResponse.json({ error: "縺薙・繝｡繝ｼ繝ｫ繧｢繝峨Ξ繧ｹ縺ｯ譌｢縺ｫ逋ｻ骭ｲ縺輔ｌ縺ｦ縺・∪縺・ }, { status: 409 });
    }

    // 繝・Δ逕ｨ・壽眠隕冗匳骭ｲ繧偵Γ繝｢繝ｪ縺ｫ霑ｽ蜉・亥・襍ｷ蜍輔〒豸医∴繧具ｼ・    const newUser: DemoUser = {
      id: `demo-${Date.now()}`,
      email,
      companyName,
      lastName,
      firstName,
      phone,
      plan: "STARTER",
    };
    DEMO_ACCOUNTS[email] = { password, user: newUser };

    const token = createSessionToken(newUser);
    const res = NextResponse.json({ user: newUser });
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete(SESSION_COOKIE_NAME);
    return res;
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

// GET /api/auth/demo - 繧ｻ繝・す繝ｧ繝ｳ遒ｺ隱・export async function GET(req: NextRequest) {
  const { parseSessionToken } = await import("@/lib/demo-auth");
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }
  const user = parseSessionToken(token);
  return NextResponse.json({ user });
}
