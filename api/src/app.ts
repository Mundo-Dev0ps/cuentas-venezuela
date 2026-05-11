import { Hono, type MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { schema, type Db } from "./db/client.js";
import { rateLimit } from "./lib/rate-limit.js";

// Drizzle's `db.execute(sql`...`)` returns different shapes per driver:
//   - drizzle-orm/postgres-js: a plain array of rows
//   - drizzle-orm/neon-http:   { rows: [...], rowCount, ... }
// Normalize to a plain row array so route handlers don't care which
// driver the entry file injected.
function rowsOf<R = unknown>(result: unknown): R[] {
  if (Array.isArray(result)) return result as R[];
  if (result && typeof result === "object" && "rows" in result) {
    const rows = (result as { rows: unknown }).rows;
    if (Array.isArray(rows)) return rows as R[];
  }
  return [];
}

// =====================================================================
// Hono bindings + per-request context shape.
// Same routes run under Cloudflare Workers AND Node — each entry file
// (src/index.ts or src/dev-server.ts) supplies the right Db instance via
// a middleware that wraps `createApp()`.
// =====================================================================
export interface Env {
  DATABASE_URL: string;
  CORS_ORIGINS?: string;
  KOFI_VERIFICATION_TOKEN?: string;
  API_LOG_LEVEL?: string;
}

export type Variables = {
  db: Db;
};

export type AppType = Hono<{ Bindings: Env; Variables: Variables }>;

/**
 * Build the routed Hono app. `injectDb` is a middleware that must place
 * a `Db` instance on `c.set("db", ...)` before any route runs.
 */
export function createApp(injectDb: MiddlewareHandler): AppType {
  const app = new Hono<{ Bindings: Env; Variables: Variables }>();

  app.use("*", logger());

  app.use("*", async (c, next) => {
    const list = (c.env.CORS_ORIGINS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return cors({
      origin:
        list.length === 0
          ? (origin) => origin ?? "*"
          : (origin) => (origin && list.includes(origin) ? origin : null),
      credentials: false,
      maxAge: 600,
    })(c, next);
  });

  app.use("*", injectDb);
  registerRoutes(app);
  return app;
}

function registerRoutes(app: AppType): void {

// =====================================================================
// Meta endpoints
// =====================================================================
app.get("/health", (c) =>
  c.json({ status: "ok", service: "api", ts: new Date().toISOString() }),
);

app.get("/", (c) =>
  c.json({
    name: "cuentas-venezuela API",
    version: "0.2.0",
    endpoints: [
      "/health",
      "/v1/sources",
      "/v1/sources/:slug",
      "/v1/datasets",
      "/v1/indicators",
      "/v1/data/stock-region",
      "/v1/data/cotizantes-sector",
      "/v1/data/aporte-tributario",
      "/v1/data/comparativa-nacionalidad",
      "/v1/ve-macro/indicators",
      "/v1/ddhh/freedom-house",
      "/v1/migracion/acnur-ve",
      "/api/obras",
      "/api/obras/:id",
      "/api/reportes",
      "/api/kofi/webhook",
      "/api/supporters",
      "/api/subscribers",
    ],
  }),
);

// =====================================================================
// Source / dataset / indicator catalog (drizzle queries on `public` schema)
// =====================================================================
app.get("/v1/sources", async (c) => {
  const db = c.get("db");
  const items = await db
    .select()
    .from(schema.sources)
    .orderBy(schema.sources.name);
  return c.json({ items });
});

app.get("/v1/sources/:slug", async (c) => {
  const db = c.get("db");
  const slug = c.req.param("slug");
  const [source] = await db
    .select()
    .from(schema.sources)
    .where(eq(schema.sources.slug, slug))
    .limit(1);
  if (!source) return c.json({ error: "not found" }, 404);

  const datasets = await db
    .select()
    .from(schema.datasets)
    .where(eq(schema.datasets.sourceId, source.id))
    .orderBy(schema.datasets.title);

  const datasetIds = datasets.map((d) => d.id);
  const indicators = datasetIds.length
    ? await db
        .select()
        .from(schema.indicators)
        .orderBy(schema.indicators.name)
    : [];
  const filteredIndicators = indicators.filter(
    (i) => i.datasetId !== null && datasetIds.includes(i.datasetId),
  );
  return c.json({ source, datasets, indicators: filteredIndicators });
});

app.get("/v1/datasets", async (c) => {
  const db = c.get("db");
  const sourceSlug = c.req.query("source");
  let rows;
  if (sourceSlug) {
    const [src] = await db
      .select()
      .from(schema.sources)
      .where(eq(schema.sources.slug, sourceSlug))
      .limit(1);
    if (!src) return c.json({ items: [] });
    rows = await db
      .select()
      .from(schema.datasets)
      .where(eq(schema.datasets.sourceId, src.id));
  } else {
    rows = await db.select().from(schema.datasets);
  }
  return c.json({ items: rows });
});

app.get("/v1/indicators/:slug", async (c) => {
  const db = c.get("db");
  const slug = c.req.param("slug");
  const [row] = await db
    .select({
      id: schema.indicators.id,
      slug: schema.indicators.slug,
      name: schema.indicators.name,
      category: schema.indicators.category,
      unit: schema.indicators.unit,
      description: schema.indicators.description,
      datasetSlug: schema.datasets.slug,
      datasetTitle: schema.datasets.title,
      parquetKey: schema.datasets.parquetKey,
      sourceSlug: schema.sources.slug,
      sourceName: schema.sources.name,
      sourceUrl: schema.sources.url,
    })
    .from(schema.indicators)
    .leftJoin(schema.datasets, eq(schema.indicators.datasetId, schema.datasets.id))
    .leftJoin(schema.sources, eq(schema.datasets.sourceId, schema.sources.id))
    .where(eq(schema.indicators.slug, slug))
    .limit(1);
  if (!row) return c.json({ error: "not found" }, 404);

  // NOTE: previous in-process DuckDB preview was removed for the Workers
  // migration. Bulk parquet preview belongs in the client (DuckDB-WASM)
  // or a separate batch job. For now we expose only metadata.
  return c.json({
    indicator: {
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      unit: row.unit,
      description: row.description,
    },
    dataset: row.datasetSlug
      ? {
          slug: row.datasetSlug,
          title: row.datasetTitle,
          parquetKey: row.parquetKey,
        }
      : null,
    source: row.sourceSlug
      ? {
          slug: row.sourceSlug,
          name: row.sourceName,
          url: row.sourceUrl,
        }
      : null,
    preview: [],
    previewError: null,
  });
});

app.get("/v1/indicators", async (c) => {
  const db = c.get("db");
  const rows = await db
    .select({
      id: schema.indicators.id,
      slug: schema.indicators.slug,
      name: schema.indicators.name,
      category: schema.indicators.category,
      unit: schema.indicators.unit,
      description: schema.indicators.description,
      sourceSlug: schema.sources.slug,
      sourceName: schema.sources.name,
    })
    .from(schema.indicators)
    .leftJoin(schema.datasets, eq(schema.indicators.datasetId, schema.datasets.id))
    .leftJoin(schema.sources, eq(schema.datasets.sourceId, schema.sources.id))
    .orderBy(schema.indicators.category, schema.indicators.name);

  const items = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    unit: r.unit,
    description: r.description,
    source:
      r.sourceSlug && r.sourceName
        ? { slug: r.sourceSlug, name: r.sourceName }
        : null,
  }));

  return c.json({ items });
});

// =====================================================================
// Chile fact tables (previously DuckDB on Parquet — now plain Postgres)
// =====================================================================
app.get("/v1/data/stock-region", async (c) => {
  try {
    const rows = await c.get("db").execute(sql`
      SELECT year, region_code, region, stock_legal
      FROM chile.sermig_stock_region
      ORDER BY year, region
    `);
    type R = { year: number; region_code: string; region: string; stock_legal: number | null };
    return c.json({
      items: rowsOf<R>(rows).map((r) => ({
        year: r.year,
        region_code: r.region_code,
        region: r.region,
        stock_legal: r.stock_legal == null ? 0 : Number(r.stock_legal),
      })),
    });
  } catch (e) {
    return c.json({ items: [], error: (e as Error).message }, 200);
  }
});

app.get("/v1/data/cotizantes-sector", async (c) => {
  try {
    const rows = await c.get("db").execute(sql`
      SELECT year, sector, cotizantes
      FROM chile.sp_cotizantes
      ORDER BY year, sector
    `);
    type R = { year: number; sector: string; cotizantes: number | null };
    return c.json({
      items: rowsOf<R>(rows).map((r) => ({
        year: r.year,
        sector: r.sector,
        cotizantes: r.cotizantes == null ? 0 : Number(r.cotizantes),
      })),
    });
  } catch (e) {
    return c.json({ items: [], error: (e as Error).message }, 200);
  }
});

app.get("/v1/data/comparativa-nacionalidad", async (c) => {
  try {
    const rows = await c.get("db").execute(sql`
      SELECT year, nacionalidad, stock_legal
      FROM chile.comparativa
      ORDER BY year, nacionalidad
    `);
    type R = { year: number; nacionalidad: string; stock_legal: number | null };
    return c.json({
      items: rowsOf<R>(rows).map((r) => ({
        year: r.year,
        nacionalidad: r.nacionalidad,
        stock_legal: r.stock_legal == null ? 0 : Number(r.stock_legal),
      })),
    });
  } catch (e) {
    return c.json({ items: [], error: (e as Error).message }, 200);
  }
});

app.get("/v1/data/aporte-tributario", async (c) => {
  try {
    const rows = await c.get("db").execute(sql`
      SELECT year, concepto, monto_clp_millones
      FROM chile.sii_aporte
      ORDER BY year, concepto
    `);
    type R = { year: number; concepto: string; monto_clp_millones: number | null };
    return c.json({
      items: rowsOf<R>(rows).map((r) => ({
        year: r.year,
        concepto: r.concepto,
        monto_clp_millones: r.monto_clp_millones == null ? 0 : Number(r.monto_clp_millones),
      })),
    });
  } catch (e) {
    return c.json({ items: [], error: (e as Error).message }, 200);
  }
});

// =====================================================================
// VE macro / DDHH / Migración endpoints (raw SQL on schema-qualified tables)
// =====================================================================
app.get("/v1/ve-macro/indicators", async (c) => {
  try {
    const country = c.req.query("country");
    const code = c.req.query("code");
    const yearFrom = c.req.query("from");
    const yearTo = c.req.query("to");

    type Row = {
      country_iso3: string;
      indicator_code: string;
      indicator_name: string | null;
      year: number;
      value: number | null;
    };

    const rows = await c.get("db").execute(sql`
      SELECT country_iso3, indicator_code, indicator_name, year, value
      FROM macro_ve.wb_indicators
      WHERE 1=1
        ${country ? sql`AND country_iso3 = ${country}` : sql``}
        ${code ? sql`AND indicator_code = ${code}` : sql``}
        ${yearFrom ? sql`AND year >= ${Number(yearFrom)}` : sql``}
        ${yearTo ? sql`AND year <= ${Number(yearTo)}` : sql``}
      ORDER BY country_iso3, indicator_code, year
    `);

    const items = rowsOf<Row>(rows).map((r) => ({
      country: r.country_iso3,
      code: r.indicator_code,
      name: r.indicator_name,
      year: r.year,
      value: r.value == null ? null : Number(r.value),
    }));
    c.header("Cache-Control", "public, max-age=300, s-maxage=3600");
    return c.json({ items });
  } catch (e) {
    return c.json({ items: [], error: (e as Error).message }, 200);
  }
});

app.get("/v1/migracion/acnur-ve", async (c) => {
  try {
    const year = c.req.query("year");
    const yearFrom = c.req.query("from");
    const yearTo = c.req.query("to");
    const country = c.req.query("country");

    type Row = {
      year: number;
      coa_iso3: string;
      coa_name: string | null;
      refugees: number | null;
      asylum_seekers: number | null;
      others_concern: number | null;
    };

    const rows = await c.get("db").execute(sql`
      SELECT year, coa_iso3, coa_name, refugees, asylum_seekers, others_concern
      FROM migracion.acnur_ve
      WHERE 1=1
        ${year ? sql`AND year = ${Number(year)}` : sql``}
        ${yearFrom ? sql`AND year >= ${Number(yearFrom)}` : sql``}
        ${yearTo ? sql`AND year <= ${Number(yearTo)}` : sql``}
        ${country ? sql`AND coa_iso3 = ${country}` : sql``}
      ORDER BY year DESC,
        (COALESCE(refugees,0) + COALESCE(asylum_seekers,0) + COALESCE(others_concern,0)) DESC
    `);

    const items = rowsOf<Row>(rows).map((r) => ({
      year: r.year,
      country: r.coa_iso3,
      countryName: r.coa_name,
      refugees: r.refugees == null ? null : Number(r.refugees),
      asylumSeekers: r.asylum_seekers == null ? null : Number(r.asylum_seekers),
      othersConcern: r.others_concern == null ? null : Number(r.others_concern),
      total:
        Number(r.refugees ?? 0) +
        Number(r.asylum_seekers ?? 0) +
        Number(r.others_concern ?? 0),
    }));
    c.header("Cache-Control", "public, max-age=300, s-maxage=3600");
    return c.json({ items });
  } catch (e) {
    return c.json({ items: [], error: (e as Error).message }, 200);
  }
});

app.get("/v1/ddhh/freedom-house", async (c) => {
  try {
    const country = c.req.query("country");
    const yearFrom = c.req.query("from");
    const yearTo = c.req.query("to");

    type Row = {
      country_iso3: string;
      year: number;
      status: string | null;
      pr_rating: number | null;
      cl_rating: number | null;
      pr_score: number | null;
      cl_score: number | null;
      total: number | null;
    };

    const rows = await c.get("db").execute(sql`
      SELECT country_iso3, year, status, pr_rating, cl_rating,
             pr_score, cl_score, total
      FROM ddhh.freedom_house
      WHERE 1=1
        ${country ? sql`AND country_iso3 = ${country}` : sql``}
        ${yearFrom ? sql`AND year >= ${Number(yearFrom)}` : sql``}
        ${yearTo ? sql`AND year <= ${Number(yearTo)}` : sql``}
      ORDER BY country_iso3, year
    `);

    const items = rowsOf<Row>(rows).map((r) => ({
      country: r.country_iso3,
      year: r.year,
      status: r.status,
      prRating: r.pr_rating == null ? null : Number(r.pr_rating),
      clRating: r.cl_rating == null ? null : Number(r.cl_rating),
      prScore: r.pr_score,
      clScore: r.cl_score,
      total: r.total,
    }));
    c.header("Cache-Control", "public, max-age=300, s-maxage=3600");
    return c.json({ items });
  } catch (e) {
    return c.json({ items: [], error: (e as Error).message }, 200);
  }
});

// =====================================================================
// Newsletter (UI removed but endpoint still accepts subscriptions)
// =====================================================================
const SubscribeSchema = z.object({
  email: z.string().email().max(254),
  interest: z.string().max(64).optional(),
  website: z.string().max(0).optional().default(""), // honeypot
});

const subscribeLimiter = rateLimit({ limit: 5, windowMs: 10 * 60 * 1000 });

app.post("/api/subscribers", subscribeLimiter, async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "invalid json" }, 400);
  }
  const parsed = SubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid", details: parsed.error.flatten() }, 400);
  }
  if (parsed.data.website && parsed.data.website.length > 0) {
    return c.json({ ok: true }, 201);
  }
  try {
    await c.get("db").execute(sql`
      INSERT INTO subscribers (email, interest)
      VALUES (${parsed.data.email.toLowerCase()},
              ${parsed.data.interest ?? null})
      ON CONFLICT (email) DO NOTHING
    `);
  } catch (e) {
    return c.json({ error: "db", detail: (e as Error).message }, 500);
  }
  return c.json({ ok: true }, 201);
});

// =====================================================================
// Ko-fi: webhook + supporters wall
// =====================================================================
interface KofiPayload {
  verification_token: string;
  message_id: string;
  timestamp: string;
  type: string;
  is_public: boolean;
  from_name: string;
  message: string | null;
  amount: string;
  currency: string;
  is_first_subscription_payment?: boolean;
}

app.post("/api/kofi/webhook", async (c) => {
  const expected = c.env.KOFI_VERIFICATION_TOKEN;
  if (!expected) {
    return c.json({ error: "kofi webhook not configured" }, 503);
  }
  let payload: KofiPayload;
  try {
    const form = await c.req.parseBody();
    const raw = typeof form.data === "string" ? form.data : "";
    payload = JSON.parse(raw) as KofiPayload;
  } catch (e) {
    return c.json({ error: "invalid payload", detail: (e as Error).message }, 400);
  }
  if (payload.verification_token !== expected) {
    return c.json({ error: "invalid token" }, 401);
  }

  // Reject replays older than 5 minutes (defense vs leaked-token replay).
  const ts = Date.parse(payload.timestamp);
  if (Number.isFinite(ts) && Math.abs(Date.now() - ts) > 5 * 60 * 1000) {
    return c.json({ error: "stale timestamp" }, 401);
  }

  const id = crypto.randomUUID();
  const amount = Number(payload.amount);
  try {
    await c.get("db").execute(sql`
      INSERT INTO supporters
        (id, kofi_txn_id, display_name, type, amount, currency, message,
         is_public, is_first, raw)
      VALUES
        (${id}, ${payload.message_id},
         ${payload.from_name || "Anónimo"}, ${payload.type},
         ${Number.isFinite(amount) ? amount : null}, ${payload.currency},
         ${payload.is_public ? (payload.message ?? null) : null},
         ${payload.is_public}, ${payload.is_first_subscription_payment ?? false},
         ${JSON.stringify(payload)})
      ON CONFLICT (kofi_txn_id) DO NOTHING
    `);
  } catch (e) {
    return c.json({ error: "db", detail: (e as Error).message }, 500);
  }
  return c.json({ ok: true });
});

app.get("/api/supporters", async (c) => {
  const limit = Math.min(Number(c.req.query("limit") ?? 50), 200);
  type Row = {
    display_name: string;
    amount: number | null;
    currency: string | null;
    message: string | null;
    type: string;
    created_at: string;
  };
  const rows = await c.get("db").execute(sql`
    SELECT display_name, amount, currency, message, type, created_at
    FROM supporters
    WHERE is_public = TRUE
    ORDER BY created_at DESC
    LIMIT ${limit}
  `);
  c.header("Cache-Control", "public, max-age=60, s-maxage=300");
  return c.json({
    items: rowsOf<Row>(rows).map((r) => ({
      name: r.display_name,
      amount: r.amount == null ? null : Number(r.amount),
      currency: r.currency,
      message: r.message,
      type: r.type,
      at: r.created_at,
    })),
  });
});

// =====================================================================
// Mapa del Olvido: obras + reportes
// =====================================================================
const num = (v: unknown): number =>
  v == null ? 0 : typeof v === "number" ? v : Number(v);
const numOpt = (v: unknown): number | undefined =>
  v == null || v === "" ? undefined : Number(v);

function rowToObra(r: typeof schema.obras.$inferSelect) {
  return {
    id: r.id,
    nombre: r.nombre,
    coordenadas: { lat: num(r.lat), lng: num(r.lng) },
    geohash: r.geohash ?? "",
    presupuesto_usd: num(r.presupuestoUsd),
    anio_inicio: r.anioInicio ?? 0,
    categoria: r.categoria ?? "",
    estado_venezuela: r.estadoVenezuela,
    estatus: r.estatus,
    ente_responsable: r.enteResponsable ?? "",
    fuente_url: r.fuenteUrl ?? "",
    fotos_url: (r.fotosUrl as string[] | null) ?? [],
    descripcion: r.descripcion ?? undefined,
    progreso_pct: numOpt(r.progresoPct),
    sobrecosto_pct: numOpt(r.sobrecostoPct),
    presupuesto_original_usd: numOpt(r.presupuestoOriginalUsd),
    responsable_politico: r.responsablePolitico ?? undefined,
    partido_politico: r.partidoPolitico ?? undefined,
    contratista: r.contratista ?? undefined,
  };
}

app.get("/api/obras", async (c) => {
  const rows = await c
    .get("db")
    .select()
    .from(schema.obras)
    .orderBy(schema.obras.nombre);
  c.header("Cache-Control", "public, max-age=60, s-maxage=300");
  return c.json(rows.map(rowToObra));
});

app.get("/api/obras/:id", async (c) => {
  const id = c.req.param("id");
  const [row] = await c
    .get("db")
    .select()
    .from(schema.obras)
    .where(eq(schema.obras.id, id))
    .limit(1);
  if (!row) return c.json({ error: "not found" }, 404);
  c.header("Cache-Control", "public, max-age=60, s-maxage=300");
  return c.json(rowToObra(row));
});

const ReportSchema = z.object({
  obra_id: z.string().min(1).max(64).optional(),
  descripcion: z.string().min(10).max(4000),
  contacto: z
    .string()
    .max(254)
    .email()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  evidencia_url: z
    .string()
    .max(2048)
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  website: z.string().max(0).optional().default(""), // honeypot
});

const reportLimiter = rateLimit({ limit: 5, windowMs: 10 * 60 * 1000 });

app.post("/api/reportes", reportLimiter, async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "invalid json" }, 400);
  }
  const parsed = ReportSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "invalid", details: parsed.error.flatten() }, 400);
  }
  if (parsed.data.website && parsed.data.website.length > 0) {
    return c.json({ id: crypto.randomUUID(), status: "pending" }, 201);
  }
  const id = crypto.randomUUID();
  await c.get("db").insert(schema.reportesCiudadanos).values({
    id,
    obraId: parsed.data.obra_id ?? null,
    descripcion: parsed.data.descripcion,
    contacto: parsed.data.contacto ?? null,
    evidenciaUrl: parsed.data.evidencia_url ?? null,
  });
  return c.json({ id, status: "pending" }, 201);
});

} // end registerRoutes
