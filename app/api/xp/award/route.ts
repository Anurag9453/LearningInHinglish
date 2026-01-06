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

function isSafeKey(key: unknown): key is string {
  if (typeof key !== "string") return false;
  const trimmed = key.trim();
  if (trimmed.length < 3 || trimmed.length > 120) return false;
  return /^[a-z0-9:._-]+$/i.test(trimmed);
}

function isOptionalSlug(v: unknown): v is string {
  if (v == null) return false;
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

  const payload = body as {
    eventKey?: unknown;
    moduleSlug?: unknown;
    unitSlug?: unknown;
  };

  if (!isSafeKey(payload.eventKey)) {
    return NextResponse.json({ error: "Invalid eventKey" }, { status: 400 });
  }

  const supabase = getServerSupabaseWithJwt(jwt);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(jwt);

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Insert only the event key + slugs.
  // Delta is enforced by DB trigger (xp_rules) and user_id is enforced by RLS.
  const { error } = await supabase.from("xp_events").insert({
    event_key: payload.eventKey.trim(),
    module_slug: isOptionalSlug(payload.moduleSlug) ? payload.moduleSlug : null,
    unit_slug: isOptionalSlug(payload.unitSlug) ? payload.unitSlug : null,
  });

  if (!error) {
    return NextResponse.json({ awarded: true });
  }

  // Duplicate event_key => already awarded
  if (typeof (error as unknown as { code?: string }).code === "string") {
    if ((error as unknown as { code?: string }).code === "23505") {
      return NextResponse.json({ awarded: false });
    }
  }

  return NextResponse.json({ error: error.message }, { status: 400 });
}
