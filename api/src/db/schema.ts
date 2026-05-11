import {
  bigint,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  organization: text("organization").notNull(),
  url: text("url").notNull(),
  license: text("license"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  sourceId: integer("source_id")
    .notNull()
    .references(() => sources.id),
  title: text("title").notNull(),
  description: text("description"),
  parquetKey: text("parquet_key").notNull(),
  schemaVersion: integer("schema_version").notNull().default(1),
  rowCount: bigint("row_count", { mode: "number" }),
  extractedAt: timestamp("extracted_at", { withTimezone: true }).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
});

export const indicators = pgTable("indicators", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  unit: text("unit").notNull(),
  description: text("description"),
  datasetId: integer("dataset_id").references(() => datasets.id),
});

// Mapa del Olvido: obras públicas en Venezuela.
export const obras = pgTable("obras", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  // numeric() returns string in drizzle 0.38+; the rowToObra helper in
  // app.ts coerces to number via `num()`/`numOpt()`.
  lat: numeric("lat"),
  lng: numeric("lng"),
  geohash: text("geohash"),
  presupuestoUsd: numeric("presupuesto_usd"),
  anioInicio: integer("anio_inicio"),
  categoria: text("categoria"),
  estadoVenezuela: text("estado_venezuela").notNull(),
  estatus: text("estatus").notNull(),
  enteResponsable: text("ente_responsable"),
  fuenteUrl: text("fuente_url"),
  fotosUrl: jsonb("fotos_url").default([]),
  descripcion: text("descripcion"),
  progresoPct: numeric("progreso_pct"),
  sobrecostoPct: numeric("sobrecosto_pct"),
  presupuestoOriginalUsd: numeric("presupuesto_original_usd"),
  responsablePolitico: text("responsable_politico"),
  partidoPolitico: text("partido_politico"),
  contratista: text("contratista"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reportesCiudadanos = pgTable("reportes_ciudadanos", {
  id: text("id").primaryKey(),
  obraId: text("obra_id").references(() => obras.id),
  contacto: text("contacto"),
  descripcion: text("descripcion").notNull(),
  evidenciaUrl: text("evidencia_url"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
