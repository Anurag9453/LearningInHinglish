import { NextResponse } from "next/server";
import { requireJson, requireUser } from "../../_utils/auth";
import { rateLimit } from "../../_utils/rateLimit";

function isSlug(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const t = v.trim();
  if (!t) return false;
  return /^[a-z0-9-]+$/i.test(t);
}

export async function POST(req: Request) {
  const limited = rateLimit(req, {
    keyPrefix: "api:progress-unit",
    limit: 30,
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

  const payload = body as { moduleSlug?: unknown; unitSlug?: unknown };
  if (!isSlug(payload.moduleSlug) || !isSlug(payload.unitSlug)) {
    return NextResponse.json(
      { error: "Invalid moduleSlug/unitSlug" },
      { status: 400 }
    );
  }

  const { supabase } = auth;

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
