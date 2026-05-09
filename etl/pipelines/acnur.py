"""Pipeline: ACNUR/UNHCR — Venezuelan refugees + asylum seekers by destination.

Pulls UNHCR Population API (coo=VEN) per year, broken down by ~40 main
destination countries. Upserts into migracion.acnur_ve + Parquet snapshot.

Source: https://api.unhcr.org/population/v1/population/

Run:
  docker compose --profile etl run --rm \
    -e DATABASE_URL=postgres://dev:dev@postgres:5432/datos \
    etl python -m pipelines acnur

Env:
  DATABASE_URL   required (or DRY_RUN=1).
  ACNUR_YEAR_FROM    optional, default 2010.
  ACNUR_YEAR_TO      optional, default current year.
"""
from __future__ import annotations

import datetime
import io
import json
import logging
import os
import sys

import polars as pl
import psycopg

from pipelines._http import fetch_bytes
from pipelines._storage import put_parquet

log = logging.getLogger("etl.acnur")
logging.basicConfig(
    level=os.environ.get("ETL_LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

API_BASE = "https://api.unhcr.org/population/v1/population"

# ~45 main VE diaspora destinations (LATAM + N.America + Europe + selected).
# Comma-joined for the API `coa=` parameter.
DESTINATIONS = [
    # LATAM (top R4V destinations)
    "COL", "PER", "ECU", "CHL", "BRA", "ARG", "PAN", "MEX", "URY", "BOL",
    "PRY", "DOM", "CRI", "GTM", "HND", "NIC", "SLV", "CUB", "TTO", "ABW",
    "CUW", "GUY",
    # N. America
    "USA", "CAN",
    # Europe
    "ESP", "ITA", "PRT", "DEU", "FRA", "GBR", "NLD", "CHE", "BEL", "SWE",
    "NOR", "AUT", "DNK", "IRL",
    # Asia / Oceania
    "AUS", "NZL", "JPN", "KOR",
    # Other
    "ZAF", "ISR", "ARE",
]

UPSERT = """
INSERT INTO migracion.acnur_ve
  (year, coa_iso3, coa_name, refugees, asylum_seekers, others_concern)
VALUES
  (%(year)s, %(coa_iso3)s, %(coa_name)s, %(refugees)s, %(asylum_seekers)s,
   %(others_concern)s)
ON CONFLICT (year, coa_iso3) DO UPDATE SET
  coa_name        = EXCLUDED.coa_name,
  refugees        = EXCLUDED.refugees,
  asylum_seekers  = EXCLUDED.asylum_seekers,
  others_concern  = EXCLUDED.others_concern,
  extracted_at    = NOW();
"""


def _to_int(v) -> int | None:
    if v is None or v == "" or v == "-":
        return None
    try:
        return int(v)
    except (TypeError, ValueError):
        return None


def _year_range() -> tuple[int, int]:
    yfrom = int(os.environ.get("ACNUR_YEAR_FROM", "2010"))
    yto = int(os.environ.get("ACNUR_YEAR_TO", str(datetime.date.today().year)))
    return yfrom, yto


def fetch_year(year: int, coa_csv: str) -> list[dict]:
    """Single API call: VE→[destinations] for a year."""
    url = (
        f"{API_BASE}/?coo=VEN&year={year}&coa={coa_csv}"
        f"&limit=300"
    )
    raw = fetch_bytes(url)
    if not raw:
        log.warning("acnur fetch failed year=%d", year)
        return []
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as e:
        log.warning("acnur json decode failed year=%d: %s", year, e)
        return []
    items = payload.get("items") or []
    rows: list[dict] = []
    for it in items:
        coa = it.get("coa") or it.get("coa_iso")
        if not coa or coa == "-":
            continue
        rows.append({
            "year": year,
            "coa_iso3": coa,
            "coa_name": it.get("coa_name"),
            "refugees": _to_int(it.get("refugees")),
            "asylum_seekers": _to_int(it.get("asylum_seekers")),
            "others_concern": _to_int(it.get("ooc")),
        })
    return rows


def fetch_all() -> list[dict]:
    yfrom, yto = _year_range()
    coa_csv = ",".join(DESTINATIONS)
    out: list[dict] = []
    for year in range(yfrom, yto + 1):
        rows = fetch_year(year, coa_csv)
        log.info("acnur year=%d rows=%d", year, len(rows))
        out.extend(rows)
    return out


def write_parquet(rows: list[dict]) -> int:
    if not rows:
        return 0
    df = pl.DataFrame(rows).select([
        pl.col("year").cast(pl.Int32),
        pl.col("coa_iso3").cast(pl.Utf8),
        pl.col("coa_name").cast(pl.Utf8),
        pl.col("refugees").cast(pl.Int64),
        pl.col("asylum_seekers").cast(pl.Int64),
        pl.col("others_concern").cast(pl.Int64),
    ])
    buf = io.BytesIO()
    df.write_parquet(buf, compression="zstd")
    put_parquet("migracion/acnur_ve.parquet", buf.getvalue())
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
    yfrom, yto = _year_range()
    log.info("acnur start years=%d-%d destinations=%d",
             yfrom, yto, len(DESTINATIONS))
    rows = fetch_all()
    log.info("acnur fetched total rows=%d", len(rows))

    if dry_run:
        for r in rows[:5]:
            log.info("sample: %s", r)
        return len(rows)

    n_parquet = write_parquet(rows)
    log.info("parquet rows=%d -> migracion/acnur_ve.parquet", n_parquet)

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
