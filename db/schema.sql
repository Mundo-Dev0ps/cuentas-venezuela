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

-- ─────────────────────────────────────────────────────────────────────────────
-- Cross-domain extension (added 2026-05): venezuela / migration / ddhh data.
-- Each schema namespaces its own facts + dims. Keep `public` for legacy +
-- shared dims (regions, comunas, sources, datasets, indicators, etl_runs).
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS chile;
CREATE SCHEMA IF NOT EXISTS migracion;
CREATE SCHEMA IF NOT EXISTS macro_ve;
CREATE SCHEMA IF NOT EXISTS ddhh;

-- World Bank indicators: long format (country × indicator × year).
-- Source: api.worldbank.org/v2 (free, no auth).
CREATE TABLE IF NOT EXISTS macro_ve.wb_indicators (
    country_iso3   TEXT  NOT NULL,
    indicator_code TEXT  NOT NULL,
    indicator_name TEXT,
    year           INT   NOT NULL,
    value          DOUBLE PRECISION,
    extracted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (country_iso3, indicator_code, year)
);
CREATE INDEX IF NOT EXISTS idx_wb_country_year
    ON macro_ve.wb_indicators(country_iso3, year);
CREATE INDEX IF NOT EXISTS idx_wb_indicator_year
    ON macro_ve.wb_indicators(indicator_code, year);

-- Freedom House: aggregated yearly score per country.
-- Source: freedomhouse.org/sites/default/files/.../All_data_FIW_*.xlsx
CREATE TABLE IF NOT EXISTS ddhh.freedom_house (
    country_iso3 TEXT NOT NULL,
    year         INT  NOT NULL,
    status       TEXT,            -- F=Free, PF=Partly Free, NF=Not Free
    pr_rating    NUMERIC,         -- political rights 1 (best) - 7 (worst)
    cl_rating    NUMERIC,         -- civil liberties 1-7
    pr_score     INT,             -- 0-40
    cl_score     INT,             -- 0-60
    total        INT,             -- 0-100
    extracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (country_iso3, year)
);

-- ACNUR/UNHCR refugees + asylum seekers from Venezuela by country of asylum.
-- Source: api.unhcr.org/population/v1/population/?coo_iso=VEN
CREATE TABLE IF NOT EXISTS migracion.acnur_ve (
    year           INT  NOT NULL,
    coa_iso3       TEXT NOT NULL,           -- country of asylum
    coa_name       TEXT,
    refugees       BIGINT,
    asylum_seekers BIGINT,
    others_concern BIGINT,                  -- venezuelans displaced abroad
    extracted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (year, coa_iso3)
);
CREATE INDEX IF NOT EXISTS idx_acnur_year ON migracion.acnur_ve(year);

-- EMBI+ (Emerging Markets Bond Index Plus) — riesgo país en bps spread
-- vs US Treasuries. Para Venezuela, valor congelado desde 2017 por
-- suspensión de cotización (default). Fuente JP Morgan / Banco Central
-- de Brasil API (futuro pipeline embi.py); mientras tanto snapshot en
-- seeds.sql.
CREATE TABLE IF NOT EXISTS macro_ve.embi_riesgo_pais (
    country_iso3 TEXT NOT NULL,
    country_name TEXT NOT NULL,
    snapshot_date DATE NOT NULL,
    value_bps    INT NOT NULL,
    is_frozen    BOOLEAN NOT NULL DEFAULT FALSE,
    note         TEXT,
    extracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (country_iso3, snapshot_date)
);
CREATE INDEX IF NOT EXISTS idx_embi_country ON macro_ve.embi_riesgo_pais(country_iso3);

-- Chile-side fact tables — small (kilobytes) but live in Postgres so the
-- API can query them without DuckDB (Workers runtime cannot host DuckDB).
-- Parquet snapshots in R2 are kept as the immutable archive layer.

CREATE TABLE IF NOT EXISTS chile.sermig_stock_region (
    year         INT  NOT NULL,
    region_code  TEXT NOT NULL,
    region       TEXT NOT NULL,
    stock_legal  BIGINT,
    extracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (year, region_code)
);
CREATE INDEX IF NOT EXISTS idx_sermig_year ON chile.sermig_stock_region(year);

CREATE TABLE IF NOT EXISTS chile.sp_cotizantes (
    year         INT  NOT NULL,
    sector       TEXT NOT NULL,
    cotizantes   BIGINT,
    extracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (year, sector)
);

CREATE TABLE IF NOT EXISTS chile.sii_aporte (
    year                  INT  NOT NULL,
    concepto              TEXT NOT NULL,
    monto_clp_millones    BIGINT,
    extracted_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (year, concepto)
);

CREATE TABLE IF NOT EXISTS chile.comparativa (
    year         INT  NOT NULL,
    nacionalidad TEXT NOT NULL,
    stock_legal  BIGINT,
    extracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (year, nacionalidad)
);

-- Ko-fi supporters: populated by webhook from ko-fi.com on each donation.
-- Only `is_public = TRUE` rows are exposed via /api/supporters.
CREATE TABLE IF NOT EXISTS supporters (
    id           UUID PRIMARY KEY,
    kofi_txn_id  TEXT UNIQUE,                  -- dedupe webhook retries
    display_name TEXT NOT NULL,
    type         TEXT NOT NULL DEFAULT 'Donation', -- Donation, Subscription, Shop Order, Commission
    amount       NUMERIC,
    currency     TEXT,
    message      TEXT,
    is_public    BOOLEAN NOT NULL DEFAULT TRUE,
    is_first     BOOLEAN NOT NULL DEFAULT FALSE,
    raw          JSONB,                        -- full payload for forensics
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_supporters_created
    ON supporters(created_at DESC);

-- =====================================================================
-- corrupcion schema — sanctioned individuals + disclosed crypto wallets
-- Populated by etl/pipelines/sanciones.py from OFAC SDN (US Treasury).
-- Curated cases live in web/src/app/venezuela/corrupcion/data.ts and
-- are NOT mirrored here — they are editorial content, this schema is
-- the machine-ingested mirror of public sanctions lists.
-- =====================================================================
CREATE SCHEMA IF NOT EXISTS corrupcion;

CREATE TABLE IF NOT EXISTS corrupcion.sancionados (
    id                  SERIAL PRIMARY KEY,
    source              TEXT NOT NULL,      -- 'ofac_sdn' | 'opensanctions'
    source_id           TEXT NOT NULL,      -- OFAC ProfileID or OS id
    name                TEXT NOT NULL,
    party_type          TEXT,               -- Individual | Entity | Vessel | Aircraft
    aliases             TEXT[] DEFAULT '{}',
    programs            TEXT[] DEFAULT '{}',-- VENEZUELA, VENEZUELA-EO13850, ...
    jurisdictions       TEXT[] DEFAULT '{}',-- USA, EU, UK, ...
    role                TEXT,               -- role/title at designation, when present
    nationality         TEXT,               -- ISO2 best-effort
    first_sanctioned_at DATE,
    last_seen_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    raw                 JSONB,
    UNIQUE (source, source_id)
);
CREATE INDEX IF NOT EXISTS idx_sancionados_party_type
    ON corrupcion.sancionados(party_type);
CREATE INDEX IF NOT EXISTS idx_sancionados_programs
    ON corrupcion.sancionados USING GIN (programs);
CREATE INDEX IF NOT EXISTS idx_sancionados_jurisdictions
    ON corrupcion.sancionados USING GIN (jurisdictions);
CREATE INDEX IF NOT EXISTS idx_sancionados_name_trgm
    ON corrupcion.sancionados(name text_pattern_ops);

CREATE TABLE IF NOT EXISTS corrupcion.wallets (
    id            SERIAL PRIMARY KEY,
    sancionado_id INT NOT NULL REFERENCES corrupcion.sancionados(id) ON DELETE CASCADE,
    currency      TEXT NOT NULL,            -- BTC, ETH, USDT, USDC, TRX, XMR, ...
    address       TEXT NOT NULL,
    source        TEXT NOT NULL DEFAULT 'ofac_sdn',
    added_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (currency, address)
);
CREATE INDEX IF NOT EXISTS idx_wallets_sancionado
    ON corrupcion.wallets(sancionado_id);
CREATE INDEX IF NOT EXISTS idx_wallets_currency
    ON corrupcion.wallets(currency);

-- =====================================================================
-- V-Dem (Varieties of Democracy) — annual governance scores by country.
-- Populated by etl/pipelines/vdem.py from the Our World in Data mirror
-- of V-Dem v14 (CC BY 4.0). Compact slice — 0.1 = autocracy, 1 = full
-- democracy.
-- =====================================================================
CREATE TABLE IF NOT EXISTS ddhh.vdem_scores (
    country_iso3   TEXT NOT NULL,
    year           INT  NOT NULL,
    indicator_code TEXT NOT NULL,    -- v2x_libdem, v2x_polyarchy, v2x_egal...
    indicator_name TEXT,
    value          DOUBLE PRECISION,
    extracted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (country_iso3, year, indicator_code)
);
CREATE INDEX IF NOT EXISTS idx_vdem_country ON ddhh.vdem_scores(country_iso3);
CREATE INDEX IF NOT EXISTS idx_vdem_year ON ddhh.vdem_scores(year);
CREATE INDEX IF NOT EXISTS idx_vdem_indicator ON ddhh.vdem_scores(indicator_code);
