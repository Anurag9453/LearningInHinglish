import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 300;

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error("Supabase env vars missing");
  }

  return createClient(url, anonKey);
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ moduleSlug: string }> }
) {
  const { moduleSlug } = await context.params;
  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from("units")
    .select("module_slug,unit_slug,title,description,icon,sort_order")
    .eq("module_slug", moduleSlug)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const res = NextResponse.json({ units: data ?? [] });
  res.headers.set(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=86400"
  );
  return res;
}
