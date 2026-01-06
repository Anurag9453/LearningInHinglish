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

export async function GET() {
  const supabase = getServerSupabase();

  const [modulesRes, contentRes] = await Promise.all([
    supabase
      .from("modules")
      .select("slug,title,description,gradient,icon,image_url,sort_order")
      .order("sort_order", { ascending: true }),
    supabase
      .from("site_content")
      .select("key,value")
      .eq("key", "home")
      .maybeSingle(),
  ]);

  if (modulesRes.error) {
    return NextResponse.json(
      { error: modulesRes.error.message },
      { status: 500 }
    );
  }

  if (contentRes.error) {
    // Content is optional; don't fail the page if it's missing.
    const res = NextResponse.json({
      content: null,
      modules: modulesRes.data ?? [],
    });
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=86400"
    );
    return res;
  }

  const res = NextResponse.json({
    content: (contentRes.data?.value ?? null) as unknown,
    modules: modulesRes.data ?? [],
  });

  res.headers.set(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=86400"
  );

  return res;
}
