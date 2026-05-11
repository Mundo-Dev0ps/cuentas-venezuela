"""Pipeline: World Bank macroeconomic + social indicators for Venezuela.

Pulls a curated set of WB indicators for VEN (and CHL as comparator) over
1998-present, upserts into Postgres `macro_ve.wb_indicators`, and writes a
Parquet snapshot for client-side dashboards.

Source: api.worldbank.org/v2 — open, no auth, JSON.

Run:
  docker compose --profile etl run --rm \
    -e DATABASE_URL=postgres://dev:dev@postgres:5432/datos \
    etl python -m pipelines ve_macro

Env:
  DATABASE_URL    required, target Postgres.
  VE_MACRO_YEARS  optional, default "1998:2024".
  DRY_RUN=1       parse + log, no DB write.
"""
from __future__ import annotations

import io
import json
import logging
import os
import sys
from typing import Iterable

import polars as pl
import psycopg

from pipelines._http import fetch_bytes
from pipelines._storage import put_parquet

log = logging.getLogger("etl.ve_macro")
logging.basicConfig(
    level=os.environ.get("ETL_LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

WB_BASE = "https://api.worldbank.org/v2"
COUNTRIES = ["VEN", "CHL"]

# Curated indicators: (code, human_name)
INDICATORS: list[tuple[str, str]] = [
    ("NY.GDP.MKTP.CD",    "PIB nominal (USD)"),
    ("NY.GDP.PCAP.CD",    "PIB per cápita (USD)"),
    ("NY.GDP.PCAP.PP.CD", "PIB per cápita PPA (USD intl)"),
    ("NY.GDP.MKTP.KD.ZG", "Crecimiento PIB (% anual)"),
    ("FP.CPI.TOTL.ZG",    "Inflación IPC (% anual)"),
    ("SL.UEM.TOTL.ZS",    "Desempleo (% fuerza laboral)"),
    ("SI.POV.GINI",       "Índice de Gini"),
    ("SI.POV.NAHC",       "Pobreza nacional (%)"),
    ("SP.DYN.LE00.IN",    "Esperanza de vida al nacer (años)"),
    ("SP.DYN.IMRT.IN",    "Mortalidad infantil <1 año (por mil)"),
    ("SH.DYN.MORT",       "Mortalidad <5 años (por mil)"),
    ("SH.STA.MMRT",       "Mortalidad materna (por 100k nv)"),
    ("SH.MED.PHYS.ZS",    "Médicos (por mil hab)"),
    ("SH.XPD.CHEX.GD.ZS", "Gasto en salud (% PIB)"),
    ("SE.XPD.TOTL.GD.ZS", "Gasto en educación (% PIB)"),
    ("SE.ADT.LITR.ZS",    "Alfabetización adulta (%)"),
    ("SP.POP.TOTL",       "Población total"),
    ("SP.URB.TOTL.IN.ZS", "Población urbana (%)"),
    ("SP.POP.GROW",       "Crecimiento poblacional (% anual)"),
    ("IT.NET.USER.ZS",    "Usuarios de internet (%)"),
    ("EG.ELC.ACCS.ZS",    "Acceso a electricidad (%)"),
    ("EN.GHG.CO2.PC.CE.AR5", "CO2 per cápita (t)"),
    ("BX.KLT.DINV.WD.GD.ZS", "IED entrante (% PIB)"),
    ("NE.EXP.GNFS.ZS",    "Exportaciones (% PIB)"),
    ("NE.IMP.GNFS.ZS",    "Importaciones (% PIB)"),
    ("GC.DOD.TOTL.GD.ZS", "Deuda gobierno central (% PIB)"),
    ("SM.POP.NETM",       "Migración neta (5 años)"),
    ("VC.IHR.PSRC.P5",    "Homicidios intencionales (por 100k)"),
    ("IS.AIR.PSGR",       "Pasajeros aéreos transportados"),
]

UPSERT = """
INSERT INTO macro_ve.wb_indicators
  (country_iso3, indicator_code, indicator_name, year, value)
VALUES
  (%(country_iso3)s, %(indicator_code)s, %(indicator_name)s, %(year)s, %(value)s)
ON CONFLICT (country_iso3, indicator_code, year) DO UPDATE SET
  indicator_name = EXCLUDED.indicator_name,
  value          = EXCLUDED.value,
  extracted_at   = NOW();
"""


def _years_range() -> str:
    return os.environ.get("VE_MACRO_YEARS", "1998:2024")


def _wb_url(country: str, code: str, years: str) -> str:
    # per_page large enough to avoid pagination across the date range
    return f"{WB_BASE}/country/{country}/indicator/{code}?format=json&date={years}&per_page=200"


def fetch_series(country: str, code: str, name: str, years: str) -> list[dict]:
    """Returns list of {country_iso3, indicator_code, indicator_name, year, value}."""
    url = _wb_url(country, code, years)
    raw = fetch_bytes(url)
    if not raw:
        log.warning("fetch failed for %s/%s", country, code)
        return []
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as e:
        log.warning("json decode failed for %s/%s: %s", country, code, e)
        return []
    # WB returns [meta, [observations]] — observations may be None for some series
    if not isinstance(payload, list) or len(payload) < 2 or not payload[1]:
        log.info("empty series %s/%s", country, code)
        return []
    rows: list[dict] = []
    for obs in payload[1]:
        try:
            year = int(obs["date"])
        except (KeyError, ValueError, TypeError):
            continue
        value = obs.get("value")
        if value is None:
            continue
        rows.append({
            "country_iso3": country,
            "indicator_code": code,
            "indicator_name": name,
            "year": year,
            "value": float(value),
        })
    return rows


def fetch_all(countries: Iterable[str], indicators: Iterable[tuple[str, str]],
              years: str) -> list[dict]:
    out: list[dict] = []
    for country in countries:
        for code, name in indicators:
            rows = fetch_series(country, code, name, years)
            log.info("fetched %s/%s rows=%d", country, code, len(rows))
            out.extend(rows)
    return out


def write_parquet(rows: list[dict]) -> int:
    if not rows:
        return 0
    df = pl.DataFrame(rows).select([
        pl.col("country_iso3").cast(pl.Utf8),
        pl.col("indicator_code").cast(pl.Utf8),
        pl.col("indicator_name").cast(pl.Utf8),
        pl.col("year").cast(pl.Int32),
        pl.col("value").cast(pl.Float64),
    ])
    buf = io.BytesIO()
    df.write_parquet(buf, compression="zstd")
    put_parquet("macro_ve/wb_indicators.parquet", buf.getvalue())
    return df.height


def upsert_db(db_url: str, rows: list[dict]) -> int:
    if not rows:
        return 0
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.executemany(UPSERT, rows)
        conn.commit()
    return len(rows)


def run(db_url: str | None, dry_run: bool = False) -> int:
    years = _years_range()
    log.info("ve_macro start years=%s countries=%s indicators=%d",
             years, COUNTRIES, len(INDICATORS))
    rows = fetch_all(COUNTRIES, INDICATORS, years)
    log.info("fetched total rows=%d", len(rows))

    if dry_run:
        for r in rows[:5]:
            log.info("sample: %s", r)
        log.info("dry-run: would upsert %d rows", len(rows))
        return len(rows)

    n_parquet = write_parquet(rows)
    log.info("parquet rows=%d -> macro_ve/wb_indicators.parquet", n_parquet)

    if db_url:
        n_db = upsert_db(db_url, rows)
        log.info("upserted db rows=%d", n_db)
    else:
        log.warning("DATABASE_URL not set, skipping DB upsert")
    return len(rows)


def main() -> int:
    db_url = os.environ.get("DATABASE_URL")
    if not db_url and os.environ.get("DRY_RUN") != "1":
        print("ERROR: DATABASE_URL is required (or set DRY_RUN=1)", file=sys.stderr)
        return 2
    n = run(db_url=db_url, dry_run=os.environ.get("DRY_RUN") == "1")
    print(n)
    return 0


if __name__ == "__main__":
    sys.exit(main())
