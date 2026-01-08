import { NextResponse } from "next/server";
import { requireUser } from "../../_utils/auth";
import { rateLimit } from "../../_utils/rateLimit";

export async function GET(req: Request) {
  const limited = await rateLimit(req, {
    keyPrefix: "api:badges-me",
    limit: 60,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const { supabase, user } = auth;

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
