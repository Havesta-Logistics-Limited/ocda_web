/**
 * Simple in-memory rate limiter for API routes.
 * Tracks requests per IP with a sliding window.
 * For production, replace with Redis-backed solution.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    store.forEach((entry, key) => {
      if (entry.resetAt < now) store.delete(key)
    })
  }, 5 * 60 * 1000)
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Check rate limit for a given key (usually IP address).
 * @param key   Identifier (IP, email, etc.)
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

/**
 * Strict rate limiter for login attempts: 5 attempts per 15 minutes per key.
 */
export function checkLoginRateLimit(key: string): RateLimitResult {
  return checkRateLimit(`login:${key}`, 5, 15 * 60_000)
}

/**
 * Rate limiter for content API writes: 30 per minute per key.
 */
export function checkApiWriteRateLimit(key: string): RateLimitResult {
  return checkRateLimit(`api-write:${key}`, 30, 60_000)
}
