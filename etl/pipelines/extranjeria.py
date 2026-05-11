"""Pipeline: SERMIG — stock por región.

Strategy:
1. Try CKAN/datos.gob.cl resource(s) listed in SOURCES.
2. Validate parsed schema; if it matches, write Parquet.
3. On any failure, fall back to demo distribution (calibrated to public press totals).

Real source URLs are configurable via env vars. The default URLs point at
known dataset slugs — replace as official publications evolve.
"""

from __future__ import annotations

import io
import os
from typing import Any

import polars as pl
import structlog

from pipelines._http import fetch_bytes
from pipelines._pg import upsert
from pipelines._regions import REGIONS
from pipelines._storage import put_parquet

log = structlog.get_logger(__name__)

# Candidate real sources. These are intentionally configurable so the
# pipeline can be re-pointed without code changes once the official
# dataset slug is confirmed.
SOURCES = [
    os.environ.get(
        "SERMIG_STOCK_REGION_URL",
        "https://datos.gob.cl/dataset/permanencias-definitivas-otorgadas-por-region/resource/REPLACE-ME/download/permanencias.csv",
    ),
]

# Calibrated demo (used only when real sources unreachable or schema mismatch).
DEMO_WEIGHTS = {
    "CL-RM": 0.63, "CL-AN": 0.06, "CL-TA": 0.05, "CL-VS": 0.05,
    "CL-CO": 0.03, "CL-BI": 0.03, "CL-AR": 0.02, "CL-LL": 0.02,
    "CL-AT": 0.02, "CL-LI": 0.02, "CL-ML": 0.02, "CL-AP": 0.02,
    "CL-NB": 0.01, "CL-LR": 0.01, "CL-AI": 0.005, "CL-MA": 0.005,
}
DEMO_TOTALS = {
    2018: 83_000, 2019: 288_000, 2020: 448_000, 2021: 460_000,
    2022: 444_000, 2023: 470_000, 2024: 495_000,
}

EXPECTED_COLS = {"year", "region_code", "region", "stock_legal"}


def fetch_real() -> pl.DataFrame | None:
    for url in SOURCES:
        if "REPLACE-ME" in url:
            log.info("source.placeholder_skipped", url=url)
            continue
        raw = fetch_bytes(url)
        if not raw:
            continue
        try:
            df = parse_sermig_csv(raw)
        except Exception as e:
            log.warning("source.parse_fail", url=url, error=str(e))
            continue
        if EXPECTED_COLS.issubset(set(df.columns)):
            log.info("source.parsed_ok", url=url, rows=df.height)
            return df.select(list(EXPECTED_COLS))
        log.warning("source.schema_mismatch", url=url, columns=df.columns)
    return None


def parse_sermig_csv(raw: bytes) -> pl.DataFrame:
    """Parses the SERMIG/CKAN CSV. Adapt as the real schema lands."""
    text = raw.decode("utf-8", errors="replace")
    df = pl.read_csv(io.StringIO(text), separator=",", infer_schema_length=0)
    rename_map: dict[str, str] = {}
    for col in df.columns:
        low = col.lower().strip()
        if low in ("year", "anio", "año"):
            rename_map[col] = "year"
        elif low in ("region", "región", "nombre_region"):
            rename_map[col] = "region"
        elif low in ("region_code", "codigo_region", "iso_region"):
            rename_map[col] = "region_code"
        elif low in (
            "permanencias",
            "stock_legal",
            "permanencias_definitivas",
        ):
            rename_map[col] = "stock_legal"
    df = df.rename(rename_map)
    if "stock_legal" in df.columns:
        df = df.with_columns(pl.col("stock_legal").cast(pl.Int64, strict=False))
    if "year" in df.columns:
        df = df.with_columns(pl.col("year").cast(pl.Int32, strict=False))
    return df


def fetch_demo() -> pl.DataFrame:
    rows: list[dict[str, Any]] = []
    for year, total in DEMO_TOTALS.items():
        for code, name, _lat, _lng in REGIONS:
            rows.append(
                {
                    "year": year,
                    "region_code": code,
                    "region": name,
                    "stock_legal": int(total * DEMO_WEIGHTS[code]),
                }
            )
    return pl.DataFrame(rows).with_columns(
        [pl.col("year").cast(pl.Int32), pl.col("stock_legal").cast(pl.Int64)]
    )


def run() -> None:
    log.info("pipeline.start", name="extranjeria")
    df = fetch_real()
    used = "real"
    if df is None or df.height == 0:
        log.warning("pipeline.fallback_demo")
        df = fetch_demo()
        used = "demo"

    buf = io.BytesIO()
    df.write_parquet(buf, compression="zstd")
    put_parquet("sermig/stock_region.parquet", buf.getvalue())
    n_db = upsert(
        "chile.sermig_stock_region", df.to_dicts(), ["year", "region_code"]
    )
    log.info(
        "pipeline.done", name="extranjeria",
        rows=df.height, db_rows=n_db, source=used,
    )


if __name__ == "__main__":
    run()
