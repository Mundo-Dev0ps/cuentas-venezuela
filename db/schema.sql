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

-- Mapa del Olvido: obras públicas en Venezuela
CREATE TABLE IF NOT EXISTS obras (
    id                       TEXT PRIMARY KEY,
    nombre                   TEXT NOT NULL,
    lat                      NUMERIC,
    lng                      NUMERIC,
    geohash                  TEXT,
    presupuesto_usd          NUMERIC,
    anio_inicio              INTEGER,
    categoria                TEXT,
    estado_venezuela         TEXT NOT NULL,
    estatus                  TEXT NOT NULL,
    ente_responsable         TEXT,
    fuente_url               TEXT,
    fotos_url                JSONB DEFAULT '[]',
    descripcion              TEXT,
    progreso_pct             NUMERIC,
    sobrecosto_pct           NUMERIC,
    presupuesto_original_usd NUMERIC,
    responsable_politico     TEXT,
    partido_politico         TEXT,
    contratista              TEXT,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_obras_estado  ON obras(estado_venezuela);
CREATE INDEX IF NOT EXISTS idx_obras_estatus ON obras(estatus);
CREATE INDEX IF NOT EXISTS idx_obras_anio    ON obras(anio_inicio);

CREATE TABLE IF NOT EXISTS reportes_ciudadanos (
    id            TEXT PRIMARY KEY,
    obra_id       TEXT REFERENCES obras(id),
    contacto      TEXT,
    descripcion   TEXT NOT NULL,
    evidencia_url TEXT,
    status        TEXT NOT NULL DEFAULT 'pending',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
