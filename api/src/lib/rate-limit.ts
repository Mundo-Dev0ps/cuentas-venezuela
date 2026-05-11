import type { MiddlewareHandler } from "hono";

interface Bucket {
  count: number;
  resetAt: number;
}

interface Options {
  /** Max requests per IP in `windowMs`. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /** Custom key extractor. Default: x-forwarded-for first IP, fallback to remote. */
  keyOf?: (c: Parameters<MiddlewareHandler>[0]) => string;
}

/**
 * In-memory sliding-window rate limiter. Good for a single Node process behind
 * a CDN that already deduplicates abusive traffic. Replace with a Redis or
 * Cloudflare Workers KV implementation when running behind multiple replicas.
 */
export function rateLimit(opts: Options): MiddlewareHandler {
  const buckets = new Map<string, Bucket>();
  return async (c, next) => {
    const key =
      opts.keyOf?.(c) ??
      (c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
        c.req.header("cf-connecting-ip") ||
        c.req.header("x-real-ip") ||
        "unknown");
    const now = Date.now();
    const b = buckets.get(key);
    if (!b || b.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
      return next();
    }
    if (b.count >= opts.limit) {
      const retryAfter = Math.ceil((b.resetAt - now) / 1000);
      c.header("Retry-After", String(retryAfter));
      return c.json({ error: "rate limited" }, 429);
    }
    b.count++;
    return next();
  };
}
