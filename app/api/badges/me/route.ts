import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getBearerToken(req: Request): string | null {
  const header =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (!header) return null;
  const m = /^Bearer\s+(.+)$/i.exec(header);
  return m?.[1]?.trim() ?? null;
}

function getServerSupabaseWithJwt(jwt: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error("Supabase env vars missing");
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  });
}

export async function GET(req: Request) {
  const jwt = getBearerToken(req);
  if (!jwt) {
    return NextResponse.json({ error: "Missing auth" }, { status: 401 });
  }

  const supabase = getServerSupabaseWithJwt(jwt);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(jwt);

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: earned, error: earnedErr } = await supabase
    .from("user_badges")
    .select("badge_key,awarded_at")
    .eq("user_id", user.id)
    .order("awarded_at", { ascending: false });

  if (earnedErr) {
    return NextResponse.json({ error: earnedErr.message }, { status: 400 });
  }

  const { data: allBadges } = await supabase
    .from("badges")
    .select("badge_key,title,description,icon,sort_order")
    .order("sort_order", { ascending: true });

  return NextResponse.json({ badges: allBadges ?? [], earned: earned ?? [] });
}
