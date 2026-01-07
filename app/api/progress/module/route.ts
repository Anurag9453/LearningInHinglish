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
    keyPrefix: "api:progress-module",
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

  const payload = body as { moduleSlug?: unknown };
  if (!isSlug(payload.moduleSlug)) {
    return NextResponse.json({ error: "Invalid moduleSlug" }, { status: 400 });
  }

  const { supabase } = auth;

  const { error } = await supabase.from("module_progress").upsert(
    {
      module_slug: payload.moduleSlug.trim(),
      quiz_passed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,module_slug" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Award XP once per module completion
  const xpInsert = await supabase.from("xp_events").insert({
    event_key: "module:completed",
    module_slug: payload.moduleSlug.trim(),
  });
  const awardedXp = !xpInsert.error;

  const xpDeltaRes = await supabase
    .from("xp_rules")
    .select("delta")
    .eq("event_key", "module:completed")
    .maybeSingle();

  // Badge: first module
  try {
    const totalModules = await supabase
      .from("module_progress")
      .select("module_slug", { count: "exact", head: true })
      .not("quiz_passed_at", "is", null);

    const completed = Number(totalModules.count ?? 0);
    if (completed >= 1) {
      await supabase.from("user_badges").insert({ badge_key: "first_module" });
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
