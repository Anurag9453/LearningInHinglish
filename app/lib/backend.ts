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
  heroTitle?: string;
  heroSubtitle?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  coursesHeading?: string;
  coursesDescription?: string;
  footerText?: string;
};

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
  modules: ModuleRow[];
}> {
  try {
    const res = await fetch("/api/catalog/home", { method: "GET" });
    if (res.ok) {
      const json = (await res.json()) as {
        content: HomeContent | null;
        modules: ModuleRow[];
      };
      return {
        content: (json.content ?? null) as HomeContent | null,
        modules: json.modules ?? [],
      };
    }
  } catch {
    // ignore, fall back
  }

  // Fallback: modules from backend; no content.
  const modules = await fetchModules();
  return { content: null, modules };
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

export async function fetchMyProfile(): Promise<ProfileRow | null> {
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
  const supabase = getSupabase();
  if (!supabase) return;

  const userId = await getCurrentUserId();
  if (!userId) return;

  await supabase.from("unit_progress").upsert(
    {
      user_id: userId,
      module_slug: moduleSlug,
      unit_slug: unitSlug,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,module_slug,unit_slug" }
  );
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
  const supabase = getSupabase();
  if (!supabase) return { awarded: false };

  const userId = await getCurrentUserId();
  if (!userId) return { awarded: false };

  const { error } = await supabase.from("xp_events").insert({
    user_id: userId,
    event_key: params.eventKey,
    delta: params.delta,
    module_slug: params.moduleSlug,
    unit_slug: params.unitSlug,
  });

  if (!error) return { awarded: true };

  // Duplicate event_key => already awarded
  if (
    typeof (error as unknown as { code?: string }).code === "string" &&
    (error as unknown as { code?: string }).code === "23505"
  ) {
    return { awarded: false };
  }

  // For any other error, fail quietly for now
  return { awarded: false };
}

export async function markModuleQuizPassed(moduleSlug: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const userId = await getCurrentUserId();
  if (!userId) return;

  await supabase.from("module_progress").upsert(
    {
      user_id: userId,
      module_slug: moduleSlug,
      quiz_passed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,module_slug" }
  );
}
