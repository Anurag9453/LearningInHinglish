import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Bucket = { count: number; resetAtMs: number };

const buckets = new Map<string, Bucket>();

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const limiterCache = new Map<string, Ratelimit>();

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
): Promise<NextResponse | null> {
  // Use Upstash when available (recommended for Vercel/serverless).
  if (redis) {
    return rateLimitUpstash(req, opts);
  }

  // Fallback for local dev / no Redis configured.
  return Promise.resolve(rateLimitMemory(req, opts));
}

function windowToSeconds(windowMs: number): number {
  if (!Number.isFinite(windowMs) || windowMs <= 0) return 60;
  return Math.max(1, Math.ceil(windowMs / 1000));
}

async function rateLimitUpstash(
  req: Request,
  opts: { keyPrefix: string; limit: number; windowMs: number }
): Promise<NextResponse | null> {
  const ip = getClientIp(req);
  const key = `${opts.keyPrefix}:${ip}`;

  const seconds = windowToSeconds(opts.windowMs);
  const cacheKey = `${opts.keyPrefix}:${opts.limit}:${seconds}`;

  let limiter = limiterCache.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.fixedWindow(opts.limit, `${seconds} s`),
      prefix: "ratelimit",
    });
    limiterCache.set(cacheKey, limiter);
  }

  const result = await limiter.limit(key);

  if (result.success) return null;

  const now = Date.now();
  const retryAfterSec = Math.max(1, Math.ceil((result.reset - now) / 1000));
  const res = NextResponse.json({ error: "Too many requests" }, { status: 429 });
  res.headers.set("Retry-After", String(retryAfterSec));
  return res;
}

function rateLimitMemory(
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
