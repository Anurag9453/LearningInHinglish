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

function isSlug(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const t = v.trim();
  if (!t) return false;
  return /^[a-z0-9-]+$/i.test(t);
}

export async function POST(req: Request) {
  const jwt = getBearerToken(req);
  if (!jwt) {
    return NextResponse.json({ error: "Missing auth" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = body as { moduleSlug?: unknown; unitSlug?: unknown };
  if (!isSlug(payload.moduleSlug) || !isSlug(payload.unitSlug)) {
    return NextResponse.json(
      { error: "Invalid moduleSlug/unitSlug" },
      { status: 400 }
    );
  }

  const supabase = getServerSupabaseWithJwt(jwt);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(jwt);

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("unit_progress").upsert(
    {
      module_slug: payload.moduleSlug.trim(),
      unit_slug: payload.unitSlug.trim(),
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,module_slug,unit_slug" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Award XP once per unit completion (deduped by xp_events unique index)
  const xpInsert = await supabase.from("xp_events").insert({
    event_key: "unit:completed",
    module_slug: payload.moduleSlug.trim(),
    unit_slug: payload.unitSlug.trim(),
  });

  const awardedXp = !xpInsert.error;
  const xpDeltaRes = await supabase
    .from("xp_rules")
    .select("delta")
    .eq("event_key", "unit:completed")
    .maybeSingle();

  // Badges (best-effort)
  try {
    const totalUnits = await supabase
      .from("unit_progress")
      .select("unit_slug", { count: "exact", head: true });

    const completed = Number(totalUnits.count ?? 0);
    if (completed >= 1) {
      await supabase.from("user_badges").insert({ badge_key: "first_unit" });
    }
    if (completed >= 3) {
      await supabase.from("user_badges").insert({ badge_key: "three_units" });
    }
  } catch {
    // ignore
  }

  return NextResponse.json({
    ok: true,
    awardedXp,
    delta: Number(xpDeltaRes.data?.delta ?? 0),
  });
}
