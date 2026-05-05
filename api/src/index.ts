import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { eq } from "drizzle-orm";
import { db, schema } from "./db/client.js";
import { duckdb } from "./duckdb/client.js";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/health", (c) =>
  c.json({ status: "ok", service: "api", ts: new Date().toISOString() }),
);

app.get("/", (c) =>
  c.json({
    name: "datos-chile API",
    version: "0.1.0",
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
    ],
  }),
);

app.get("/v1/sources", async (c) => {
  const items = await db.select().from(schema.sources).orderBy(schema.sources.name);
  return c.json({ items });
});

app.get("/v1/sources/:slug", async (c) => {
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
  const slug = c.req.param("slug");
  const [row] = await db
    .select({
      id: schema.indicators.id,
      slug: schema.indicators.slug,
      name: schema.indicators.name,
      category: schema.indicators.category,
      unit: schema.indicators.unit,
      description: schema.indicators.description,
      datasetId: schema.indicators.datasetId,
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

  let preview: unknown[] = [];
  let previewError: string | null = null;
  if (row.parquetKey) {
    try {
      preview = await duckdb.query(
        `SELECT * FROM read_parquet('s3://${process.env.S3_BUCKET}/${row.parquetKey}') LIMIT 200`,
      );
    } catch (e) {
      previewError = (e as Error).message;
    }
  }

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
    preview,
    previewError,
  });
});

app.get("/v1/indicators", async (c) => {
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

app.get("/v1/data/stock-region", async (c) => {
  try {
    const rows = await duckdb.query<{
      year: number;
      region_code: string;
      region: string;
      stock_legal: number;
    }>(
      `SELECT year, region_code, region, stock_legal
       FROM read_parquet('s3://${process.env.S3_BUCKET}/sermig/stock_region.parquet')
       ORDER BY year, region`,
    );
    return c.json({ items: rows });
  } catch (e) {
    return c.json({ items: [], error: (e as Error).message }, 200);
  }
});

app.get("/v1/data/cotizantes-sector", async (c) => {
  try {
    const rows = await duckdb.query<{
      year: number;
      sector: string;
      cotizantes: number;
    }>(
      `SELECT year, sector, cotizantes
       FROM read_parquet('s3://${process.env.S3_BUCKET}/sp/cotizantes.parquet')
       ORDER BY year, sector`,
    );
    return c.json({ items: rows });
  } catch (e) {
    return c.json({ items: [], error: (e as Error).message }, 200);
  }
});

app.get("/v1/data/comparativa-nacionalidad", async (c) => {
  try {
    const rows = await duckdb.query<{
      year: number;
      nacionalidad: string;
      stock_legal: number;
    }>(
      `SELECT year, nacionalidad, stock_legal
       FROM read_parquet('s3://${process.env.S3_BUCKET}/comparativa/stock_nacionalidad.parquet')
       ORDER BY year, nacionalidad`,
    );
    return c.json({ items: rows });
  } catch (e) {
    return c.json({ items: [], error: (e as Error).message }, 200);
  }
});

app.get("/v1/data/aporte-tributario", async (c) => {
  try {
    const rows = await duckdb.query<{
      year: number;
      concepto: string;
      monto_clp_millones: number;
    }>(
      `SELECT year, concepto, monto_clp_millones
       FROM read_parquet('s3://${process.env.S3_BUCKET}/sii/aporte.parquet')
       ORDER BY year, concepto`,
    );
    return c.json({ items: rows });
  } catch (e) {
    return c.json({ items: [], error: (e as Error).message }, 200);
  }
});

const port = 8000;

serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, (info) => {
  console.log(`api listening on http://0.0.0.0:${info.port}`);
});
