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

function toDateStringUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function POST(req: Request) {
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

  const today = toDateStringUTC(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterday = toDateStringUTC(yesterdayDate);

  const { data: streakRow } = await supabase
    .from("user_streaks")
    .select("user_id,current_streak,best_streak,last_active")
    .eq("user_id", user.id)
    .maybeSingle();

  const lastActive = (streakRow?.last_active ?? null) as string | null;
  let currentStreak = Number(streakRow?.current_streak ?? 0);
  let bestStreak = Number(streakRow?.best_streak ?? 0);

  if (lastActive === today) {
    // no-op
  } else if (lastActive === yesterday) {
    currentStreak = currentStreak + 1;
  } else {
    currentStreak = 1;
  }

  if (currentStreak > bestStreak) bestStreak = currentStreak;

  await supabase.from("user_streaks").upsert(
    {
      user_id: user.id,
      current_streak: currentStreak,
      best_streak: bestStreak,
      last_active: today,
    },
    { onConflict: "user_id" }
  );

  // Award daily streak XP once per day
  const xpInsert = await supabase.from("xp_events").insert({
    event_key: "streak:daily",
    event_date: today,
  });

  // Badge: 7-day streak
  if (currentStreak >= 7) {
    await supabase.from("user_badges").insert({ badge_key: "streak_7" });
  }

  const xpDeltaRes = await supabase
    .from("xp_rules")
    .select("delta")
    .eq("event_key", "streak:daily")
    .maybeSingle();

  // Return latest xp
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json({
    ok: true,
    streak: { current: currentStreak, best: bestStreak, lastActive: today },
    awardedXp: !xpInsert.error,
    delta: Number(xpDeltaRes.data?.delta ?? 0),
    xp: Number(profile?.xp ?? 0),
  });
}
