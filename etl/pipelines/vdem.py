"""Pipeline: V-Dem democracy scores via Our World in Data.

V-Dem (Varieties of Democracy) publishes a country-year dataset with
the Liberal Democracy Index and related governance scores. We pull the
clean CSV slice mirrored by Our World in Data — much smaller and
already country-iso3 keyed — for a handful of indicators relevant to
the cronologia dashboard and Latin American comparison.

License: V-Dem dataset is CC BY 4.0. OWID redistribution under the
same license. We cite both in /venezuela/cronologia.

Run (dry):
  cd etl && DRY_RUN=1 python -m pipelines vdem

Run (writes DB):
  docker compose --profile etl run --rm \\
    -e DATABASE_URL=postgres://dev:dev@postgres:5432/datos \\
    etl python -m pipelines vdem

Env:
  DATABASE_URL    required (or DRY_RUN=1)
  VDEM_YEAR_MIN   optional, default 1998 (cronologia start)
"""
from __future__ import annotations

import csv
import io
import logging
import os
import sys

import httpx
import psycopg

log = logging.getLogger("etl.vdem")
logging.basicConfig(
    level=os.environ.get("ETL_LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

# (indicator_code, indicator_name, OWID CSV URL, column header in the CSV)
INDICATORS = [
    (
        "v2x_libdem",
        "Liberal Democracy Index",
        "https://ourworldindata.org/grapher/liberal-democracy-index.csv",
        "Liberal democracy index",
    ),
    (
        "v2x_polyarchy",
        "Electoral Democracy Index",
        "https://ourworldindata.org/grapher/electoral-democracy-index.csv",
        "Electoral democracy index",
    ),
]

# LATAM + reference set. Cronologia chart shows VEN/CHL/URY but we keep
# the broader cohort in DB for future regional comparisons.
COUNTRIES = {
    "VEN", "ARG", "BOL", "BRA", "CHL", "COL", "CRI", "CUB",
    "DOM", "ECU", "GTM", "HND", "HTI", "MEX", "NIC", "PAN",
    "PER", "PRY", "SLV", "URY",
}

UPSERT = """
INSERT INTO ddhh.vdem_scores
  (country_iso3, year, indicator_code, indicator_name, value)
VALUES
  (%(country_iso3)s, %(year)s, %(indicator_code)s,
   %(indicator_name)s, %(value)s)
ON CONFLICT (country_iso3, year, indicator_code) DO UPDATE SET
  indicator_name = EXCLUDED.indicator_name,
  value          = EXCLUDED.value,
  extracted_at   = NOW();
"""


def year_min() -> int:
    try:
        return int(os.environ.get("VDEM_YEAR_MIN", "1998"))
    except ValueError:
        return 1998


def fetch_indicator(url: str, value_col: str) -> bytes:
    log.info("vdem.fetch url=%s", url)
    with httpx.Client(follow_redirects=True, timeout=60.0) as client:
        r = client.get(url)
        r.raise_for_status()
        return r.content


def parse_indicator(
    raw_csv: bytes,
    value_col: str,
    code: str,
    name: str,
    cutoff: int,
) -> list[dict]:
    rows: list[dict] = []
    reader = csv.DictReader(io.StringIO(raw_csv.decode("utf-8")))
    for r in reader:
        iso3 = (r.get("Code") or "").strip()
        if iso3 not in COUNTRIES:
            continue
        try:
            year = int(r.get("Year") or 0)
        except ValueError:
            continue
        if year < cutoff:
            continue
        raw_val = (r.get(value_col) or "").strip()
        try:
            value = float(raw_val) if raw_val else None
        except ValueError:
            value = None
        rows.append({
            "country_iso3": iso3,
            "year": year,
            "indicator_code": code,
            "indicator_name": name,
            "value": value,
        })
    return rows


def fetch_all() -> list[dict]:
    cutoff = year_min()
    out: list[dict] = []
    for code, name, url, value_col in INDICATORS:
        try:
            raw = fetch_indicator(url, value_col)
            out.extend(parse_indicator(raw, value_col, code, name, cutoff))
        except Exception as e:
            log.warning("vdem.fetch_failed code=%s err=%s", code, e)
    return out


def upsert_db(db_url: str, rows: list[dict]) -> int:
    if not rows:
        return 0
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.executemany(UPSERT, rows)
        conn.commit()
    return len(rows)


def run(db_url: str | None, dry_run: bool = False) -> int:
    rows = fetch_all()
    log.info("vdem.fetched rows=%d", len(rows))
    if dry_run:
        for r in rows[:5]:
            log.info("sample: %s", r)
        return len(rows)
    if not db_url:
        log.warning("DATABASE_URL missing, skipping upsert")
        return len(rows)
    n = upsert_db(db_url, rows)
    log.info("vdem.upserted rows=%d", n)
    return n


def main() -> int:
    db_url = os.environ.get("DATABASE_URL")
    dry = os.environ.get("DRY_RUN") == "1"
    if not db_url and not dry:
        print("ERROR: DATABASE_URL required (or DRY_RUN=1)", file=sys.stderr)
        return 2
    n = run(db_url=db_url, dry_run=dry)
    print(n)
    return 0


if __name__ == "__main__":
    sys.exit(main())
