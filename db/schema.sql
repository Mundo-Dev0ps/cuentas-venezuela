-- Metadata + dimensiones. Hechos masivos viven en Parquet (R2/MinIO).

CREATE TABLE IF NOT EXISTS sources (
    id           SERIAL PRIMARY KEY,
    slug         TEXT NOT NULL UNIQUE,
    name         TEXT NOT NULL,
    organization TEXT NOT NULL,
    url          TEXT NOT NULL,
    license      TEXT,
    description  TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS datasets (
    id              SERIAL PRIMARY KEY,
    slug            TEXT NOT NULL UNIQUE,
    source_id       INT NOT NULL REFERENCES sources(id),
    title           TEXT NOT NULL,
    description     TEXT,
    parquet_key     TEXT NOT NULL,
    schema_version  INT NOT NULL DEFAULT 1,
    row_count       BIGINT,
    extracted_at    TIMESTAMPTZ NOT NULL,
    published_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS indicators (
    id          SERIAL PRIMARY KEY,
    slug        TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    category    TEXT NOT NULL,
    unit        TEXT NOT NULL,
    description TEXT,
    dataset_id  INT REFERENCES datasets(id)
);

CREATE TABLE IF NOT EXISTS regions (
    code   TEXT PRIMARY KEY,
    name   TEXT NOT NULL,
    number INT
);

CREATE TABLE IF NOT EXISTS comunas (
    code        TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    region_code TEXT NOT NULL REFERENCES regions(code)
);

CREATE TABLE IF NOT EXISTS etl_runs (
    id           SERIAL PRIMARY KEY,
    pipeline     TEXT NOT NULL,
    started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at  TIMESTAMPTZ,
    status       TEXT NOT NULL DEFAULT 'running',
    rows_in      BIGINT,
    rows_out     BIGINT,
    error        TEXT
);

CREATE TABLE IF NOT EXISTS subscribers (
    id         SERIAL PRIMARY KEY,
    email      TEXT NOT NULL UNIQUE,
    interest   TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
