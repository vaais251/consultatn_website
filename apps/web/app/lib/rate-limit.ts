/**
 * In-memory rate limiter using sliding window counters.
 * Keyed by IP + route. No external dependencies (Redis optional for production).
 *
 * Usage:
 *   import { rateLimit } from "@/app/lib/rate-limit";
 *   const limiter = rateLimit({ maxRequests: 5, windowMs: 60_000 });
 *   // In API route:
 *   const limited = limiter.check(ip, "/api/register");
 *   if (limited) return NextResponse.json({ error: ... }, { status: 429 });
 */

interface RateLimitConfig {
    /** Max requests allowed in the window */
    maxRequests: number;
    /** Window duration in milliseconds */
    windowMs: number;
}

interface TokenBucket {
    count: number;
    resetAt: number;
}

const store = new Map<string, TokenBucket>();

// Cleanup stale entries every 5 minutes
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
    if (cleanupTimer) return;
    cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [key, bucket] of store) {
            if (bucket.resetAt < now) {
                store.delete(key);
            }
        }
    }, 5 * 60 * 1000);
    // Don't prevent Node.js from exiting
    if (typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
        cleanupTimer.unref();
    }
}

export function rateLimit(config: RateLimitConfig) {
    ensureCleanup();

    return {
        /**
         * Returns `true` if the request should be rate-limited (rejected).
         * Returns `false` if within limits (allowed).
         */
        check(ip: string, route: string): boolean {
            const key = `${ip}:${route}`;
            const now = Date.now();
            const bucket = store.get(key);

            if (!bucket || bucket.resetAt < now) {
                // New window
                store.set(key, { count: 1, resetAt: now + config.windowMs });
                return false;
            }

            bucket.count++;

            if (bucket.count > config.maxRequests) {
                return true; // RATE LIMITED
            }

            return false; // OK
        },

        /** Get remaining requests for a key */
        remaining(ip: string, route: string): number {
            const key = `${ip}:${route}`;
            const bucket = store.get(key);
            if (!bucket || bucket.resetAt < Date.now()) return config.maxRequests;
            return Math.max(0, config.maxRequests - bucket.count);
        },
    };
}

// ─── Pre-configured limiters ────────────────────────────

export const registerLimiter = rateLimit({ maxRequests: 5, windowMs: 60_000 });
export const loginLimiter = rateLimit({ maxRequests: 10, windowMs: 60_000 });
export const checkoutLimiter = rateLimit({ maxRequests: 10, windowMs: 60_000 });
export const contactLimiter = rateLimit({ maxRequests: 10, windowMs: 60_000 });

/**
 * Extract client IP from request headers.
 * Works with most reverse proxies (Vercel, Nginx, Cloudflare).
 */
export function getClientIp(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return req.headers.get("x-real-ip") || "unknown";
}
