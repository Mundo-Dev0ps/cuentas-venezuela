import {
  bigint,
  integer,
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
