import { NextResponse } from "next/server";

type Bucket = { count: number; resetAtMs: number };

const buckets = new Map<string, Bucket>();

function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const cfIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  return "unknown";
}

export function rateLimit(
  req: Request,
  opts: { keyPrefix: string; limit: number; windowMs: number }
): NextResponse | null {
  const ip = getClientIp(req);
  const now = Date.now();

  const key = `${opts.keyPrefix}:${ip}`;

  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAtMs) {
    buckets.set(key, { count: 1, resetAtMs: now + opts.windowMs });
    return null;
  }

  bucket.count += 1;

  if (bucket.count > opts.limit) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((bucket.resetAtMs - now) / 1000)
    );

    const res = NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
    res.headers.set("Retry-After", String(retryAfterSec));
    return res;
  }

  return null;
}
