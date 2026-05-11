// Cloudflare Workers entrypoint.
// Wrangler bundles this file; postgres-js is intentionally NOT imported.

import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "./db/client.js";
import { createApp, type Env, type Variables } from "./app.js";
import type { MiddlewareHandler } from "hono";

neonConfig.fetchEndpoint = (host) => `https://${host}/sql`;

const injectDb: MiddlewareHandler<{ Bindings: Env; Variables: Variables }> =
  async (c, next) => {
    const sql = neon(c.env.DATABASE_URL);
    // The Neon HTTP driver yields fresh per-request clients (no pool).
    c.set("db", drizzle(sql, { schema }));
    await next();
  };

const app = createApp(injectDb);

export default app;
