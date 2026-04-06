import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SESSION_COOKIE_NAME, parseSessionToken } from "@/lib/demo-auth";

export async function createContext() {
  let user: { id: string; email: string } | null = null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    // Supabase 認証からユーザーを取得
    const cookieStore = cookies();
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component からの呼び出し — 無視
          }
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    if (data.user) {
      user = { id: data.user.id, email: data.user.email ?? "" };
    }
  } else {
    // デモ認証モード
    const cookieStore = cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (sessionToken) {
      const demoUser = parseSessionToken(sessionToken);
      if (demoUser) {
        user = { id: demoUser.id, email: demoUser.email };
      }
    }
  }

  return { prisma, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
