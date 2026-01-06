/**
 * Get the application URL for OAuth redirects
 * Uses NEXT_PUBLIC_APP_URL if set, otherwise falls back to window.location.origin
 */
export function getAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) return configured;

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server-side fallback (useful if this helper ever gets imported server-side)
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

/**
 * Get the redirect URL for OAuth callbacks
 */
export function getRedirectUrl(path: string = "/dashboard"): string {
  const baseUrl = getAppUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
