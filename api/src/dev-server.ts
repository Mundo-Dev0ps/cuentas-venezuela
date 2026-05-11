// Node entrypoint for `npm run dev` inside docker compose.
// Uses postgres-js (TCP) so it can hit the local Postgres container.
// Prod Workers runtime uses src/index.ts with the Neon HTTP driver.

import { serve } from "@hono/node-server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { MiddlewareHandler } from "hono";
import { schema } from "./db/client.js";
import { createApp, type Env, type Variables } from "./app.js";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

// Hoist `process.env` into c.env so route code reads bindings uniformly.
const env: Env = {
  DATABASE_URL: url,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
  KOFI_VERIFICATION_TOKEN: process.env.KOFI_VERIFICATION_TOKEN,
  API_LOG_LEVEL: process.env.API_LOG_LEVEL,
};

const pgClient = postgres(url, { max: 5 });
const db = drizzle(pgClient, { schema });

const injectDb: MiddlewareHandler<{ Bindings: Env; Variables: Variables }> =
  async (c, next) => {
    // Workers' c.env comes from bindings; in Node we patch it manually so
    // route code that reads `c.env.X` works the same way.
    Object.assign(c.env, env);
    c.set("db", db);
    await next();
  };

const app = createApp(injectDb);

const port = Number(process.env.PORT ?? 8000);
serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, (info) => {
  console.log(`api listening on http://0.0.0.0:${info.port}`);
});
