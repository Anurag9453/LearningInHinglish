import { getSupabase } from "./supabase";

export type ModuleRow = {
  slug: string;
  title: string;
  description: string;
  gradient: string | null;
  icon: string | null;
  image_url?: string | null;
  sort_order: number;
};

export type HomeContent = {
  brandName?: string;
  navLoginText?: string;
  heroTitle?: string;
  heroHighlightWord?: string;
  heroSubtitle?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  coursesHeading?: string;
  coursesDescription?: string;
  footerText?: string;
};

export type HeaderContent = {
  brandName?: string;
  logoLetter?: string;
  dashboardLabel?: string;
  logoutLabel?: string;
};

export type DashboardContent = {
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  totalXpLabel?: string;
  coursesCompletedLabel?: string;
  unitsCompletedLabel?: string;
  coursesHeading?: string;
  coursesDescription?: string;
};

export type AuthContent = {
  loginTitle?: string;
  loginSubtitle?: string;
  signupTitle?: string;
  signupSubtitle?: string;
};

const siteContentCache = new Map<string, unknown>();

export type UnitRow = {
  module_slug: string;
  unit_slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
};

export type ProfileRow = {
  id: string;
  xp: number;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  auth_provider: string | null;
  phone_number?: string | null;
};

export type MeResponse = {
  user: unknown;
  profile: ProfileRow | null;
};

async function getAccessToken(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session?.access_token ?? null;
}

export async function fetchMe(): Promise<MeResponse | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const res = await fetch("/api/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;
  return (await res.json()) as MeResponse;
}

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user?.id ?? null;
}

export async function fetchModules(): Promise<ModuleRow[]> {
  try {
    const res = await fetch("/api/catalog/modules", { method: "GET" });
    if (res.ok) {
      const json = (await res.json()) as { modules: ModuleRow[] };
      return json.modules ?? [];
    }
  } catch {
    // ignore, fall back to direct supabase
  }

  const supabase = getSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("modules")
    .select("slug,title,description,gradient,icon,image_url,sort_order")
    .order("sort_order", { ascending: true });

  return (data ?? []) as ModuleRow[];
}

export async function fetchModule(
  moduleSlug: string
): Promise<ModuleRow | null> {
  try {
    const res = await fetch(
      `/api/catalog/modules/${encodeURIComponent(moduleSlug)}`,
      {
        method: "GET",
      }
    );
    if (res.ok) {
      const json = (await res.json()) as { module: ModuleRow | null };
      return json.module ?? null;
    }
  } catch {
    // ignore, fall back to direct supabase
  }

  const supabase = getSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("modules")
    .select("slug,title,description,gradient,icon,image_url,sort_order")
    .eq("slug", moduleSlug)
    .maybeSingle();

  return (data ?? null) as ModuleRow | null;
}

export async function fetchHomePayload(): Promise<{
  content: HomeContent | null;
  header: HeaderContent | null;
  modules: ModuleRow[];
}> {
  try {
    const res = await fetch("/api/catalog/home", { method: "GET" });
    if (res.ok) {
      const json = (await res.json()) as {
        content: HomeContent | null;
        header?: HeaderContent | null;
        modules: ModuleRow[];
      };

      if (json.content != null) siteContentCache.set("home", json.content);
      if (json.header != null) siteContentCache.set("header", json.header);

      return {
        content: (json.content ?? null) as HomeContent | null,
        header: (json.header ?? null) as HeaderContent | null,
        modules: json.modules ?? [],
      };
    }
  } catch {
    // ignore, fall back
  }

  // Fallback: modules from backend; no content.
  const modules = await fetchModules();
  return { content: null, header: null, modules };
}

export async function fetchSiteContent<T = unknown>(
  key: string
): Promise<T | null> {
  if (siteContentCache.has(key)) {
    return (siteContentCache.get(key) ?? null) as T | null;
  }

  try {
    const res = await fetch(`/api/catalog/content/${encodeURIComponent(key)}`);
    if (res.ok) {
      const json = (await res.json()) as { content: T | null };
      if (json.content != null)
        siteContentCache.set(key, json.content as unknown);
      return (json.content ?? null) as T | null;
    }
  } catch {
    // ignore, fall back
  }

  const supabase = getSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  const value = (data?.value ?? null) as T | null;
  if (value != null) siteContentCache.set(key, value as unknown);
  return value;
}

export async function fetchUnits(moduleSlug: string): Promise<UnitRow[]> {
  try {
    const res = await fetch(
      `/api/catalog/units/${encodeURIComponent(moduleSlug)}`,
      {
        method: "GET",
      }
    );
    if (res.ok) {
      const json = (await res.json()) as { units: UnitRow[] };
      return json.units ?? [];
    }
  } catch {
    // ignore, fall back to direct supabase
  }

  const supabase = getSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("units")
    .select("module_slug,unit_slug,title,description,icon,sort_order")
    .eq("module_slug", moduleSlug)
    .order("sort_order", { ascending: true });

  return (data ?? []) as UnitRow[];
}

export async function fetchMyXp(): Promise<number> {
  try {
    const me = await fetchMe();
    if (me?.profile) return Number(me.profile.xp ?? 0);
  } catch {
    // ignore
  }

  const supabase = getSupabase();
  if (!supabase) return 0;

  const userId = await getCurrentUserId();
  if (!userId) return 0;

  const { data } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", userId)
    .maybeSingle();

  return Number(data?.xp ?? 0);
}

export async function tickDailyStreak(): Promise<
  | {
      ok: true;
      xp: number;
      delta: number;
      awardedXp: boolean;
      streak: { current: number; best: number; lastActive: string };
    }
  | { ok: false }
> {
  const token = await getAccessToken();
  if (!token) return { ok: false };

  try {
    const res = await fetch("/api/streak/tick", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return { ok: false };
    return (await res.json()) as {
      ok: true;
      xp: number;
      delta: number;
      awardedXp: boolean;
      streak: { current: number; best: number; lastActive: string };
    };
  } catch {
    return { ok: false };
  }
}

export async function fetchMyBadges(): Promise<{
  badges: Array<{
    badge_key: string;
    title: string;
    description: string;
    icon: string | null;
  }>;
  earned: Array<{ badge_key: string; awarded_at: string }>;
} | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch("/api/badges/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as {
      badges: Array<{
        badge_key: string;
        title: string;
        description: string;
        icon: string | null;
      }>;
      earned: Array<{ badge_key: string; awarded_at: string }>;
    };
  } catch {
    return null;
  }
}

export async function fetchMyStats(): Promise<{
  xp: number;
  unitsCompleted: number;
  coursesCompleted: number;
}> {
  const supabase = getSupabase();
  if (!supabase) return { xp: 0, unitsCompleted: 0, coursesCompleted: 0 };

  const userId = await getCurrentUserId();
  if (!userId) return { xp: 0, unitsCompleted: 0, coursesCompleted: 0 };

  const [xpRes, unitsRes, coursesRes] = await Promise.all([
    supabase.from("profiles").select("xp").eq("id", userId).maybeSingle(),
    supabase
      .from("unit_progress")
      .select("unit_slug", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("module_progress")
      .select("module_slug", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("quiz_passed_at", "is", null),
  ]);

  return {
    xp: Number(xpRes.data?.xp ?? 0),
    unitsCompleted: Number(unitsRes.count ?? 0),
    coursesCompleted: Number(coursesRes.count ?? 0),
  };
}

export async function fetchMyProfile(): Promise<ProfileRow | null> {
  // Prefer server route (auth verified + RLS) when possible
  try {
    const me = await fetchMe();
    if (me?.profile) return me.profile;
  } catch {
    // ignore
  }

  const supabase = getSupabase();
  if (!supabase) return null;

  const userId = await getCurrentUserId();
  if (!userId) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id,xp,email,full_name,avatar_url,auth_provider,phone_number")
    .eq("id", userId)
    .maybeSingle();

  return (data ?? null) as ProfileRow | null;
}

export async function markUnitCompleted(
  moduleSlug: string,
  unitSlug: string
): Promise<void> {
  const token = await getAccessToken();
  if (!token) return;

  try {
    await fetch("/api/progress/unit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ moduleSlug, unitSlug }),
    });
  } catch {
    // ignore
  }
}

export async function fetchCompletedUnits(
  moduleSlug: string
): Promise<Set<string>> {
  const supabase = getSupabase();
  if (!supabase) return new Set();

  const userId = await getCurrentUserId();
  if (!userId) return new Set();

  const { data } = await supabase
    .from("unit_progress")
    .select("unit_slug")
    .eq("user_id", userId)
    .eq("module_slug", moduleSlug);

  return new Set(
    ((data ?? []) as Array<{ unit_slug: string }>).map((r) => r.unit_slug)
  );
}

export async function awardXpOnce(params: {
  eventKey: string;
  delta: number;
  moduleSlug?: string;
  unitSlug?: string;
}): Promise<{ awarded: boolean }> {
  const token = await getAccessToken();
  if (!token) return { awarded: false };

  try {
    const res = await fetch("/api/xp/award", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        eventKey: params.eventKey,
        moduleSlug: params.moduleSlug,
        unitSlug: params.unitSlug,
      }),
    });

    if (!res.ok) return { awarded: false };
    const json = (await res.json()) as { awarded?: boolean };
    return { awarded: Boolean(json.awarded) };
  } catch {
    return { awarded: false };
  }
}

export async function markModuleQuizPassed(moduleSlug: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) return;

  try {
    await fetch("/api/progress/module", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ moduleSlug }),
    });
  } catch {
    // ignore
  }
}
