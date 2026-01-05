/**
 * Get the application URL for OAuth redirects
 * Uses NEXT_PUBLIC_APP_URL if set, otherwise falls back to window.location.origin
 */
export function getAppUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or current origin
    return process.env.NEXT_PUBLIC_APP_URL || window.location.origin
  }
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

/**
 * Get the redirect URL for OAuth callbacks
 */
export function getRedirectUrl(path: string = '/dashboard'): string {
  const baseUrl = getAppUrl()
  return `${baseUrl}${path}`
}
