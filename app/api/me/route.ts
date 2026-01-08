import { NextResponse } from "next/server";
import { requireUser } from "../_utils/auth";
import { rateLimit } from "../_utils/rateLimit";

export async function GET(req: Request) {
  const limited = await rateLimit(req, {
    keyPrefix: "api:me",
    limit: 60,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const { supabase, user } = auth;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,xp,email,full_name,avatar_url,auth_provider,phone_number")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    // RLS should allow this for the user, so treat as server error.
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ user, profile: profile ?? null });
}
