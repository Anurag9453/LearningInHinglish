import { NextRequest, NextResponse } from "next/server";
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
  _request: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  const supabase = getServerSupabase();
  const { key } = await context.params;

  const { data, error } = await supabase
    .from("site_content")
    .select("key,value")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    // Content is optional; don't fail the request.
    const res = NextResponse.json({ content: null });
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=86400"
    );
    return res;
  }

  const res = NextResponse.json({
    content: (data?.value ?? null) as unknown,
  });

  res.headers.set(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=86400"
  );

  return res;
}
