import { NextResponse } from "next/server";
import { requireJson, requireUser } from "../../_utils/auth";
import { rateLimit } from "../../_utils/rateLimit";

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
  const limited = rateLimit(req, {
    keyPrefix: "api:xp-award",
    limit: 20,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const jsonErr = requireJson(req);
  if (jsonErr) return jsonErr;

  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

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

  const { supabase } = auth;

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
