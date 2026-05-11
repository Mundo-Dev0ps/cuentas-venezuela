"""Pipeline: Freedom House — Freedom in the World annual scores.

Pulls the FIW yearly XLSX (one row per country × edition), filters to a
LATAM comparator set including Venezuela, upserts into Postgres
`ddhh.freedom_house`, writes a Parquet snapshot.

Source: https://freedomhouse.org/sites/default/files/<YYYY-MM>/All_data_FIW_<from>-<to>.xlsx
URL is fixed but the year suffix changes annually — override via
FH_XLSX_URL env when a newer edition lands.

Run:
  docker compose --profile etl run --rm \
    -e DATABASE_URL=postgres://dev:dev@postgres:5432/datos \
    etl python -m pipelines freedom_house

Env:
  DATABASE_URL    required, target Postgres.
  FH_XLSX_URL     optional, override default URL for new edition.
  DRY_RUN=1       parse + log, no DB write.
"""
from __future__ import annotations

import io
import logging
import os
import sys
from typing import Iterable

import polars as pl
import psycopg

from pipelines._http import fetch_bytes
from pipelines._storage import put_parquet

log = logging.getLogger("etl.freedom_house")
logging.basicConfig(
    level=os.environ.get("ETL_LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

DEFAULT_URL = (
    "https://freedomhouse.org/sites/default/files/"
    "2024-02/All_data_FIW_2013-2024.xlsx"
)

# LATAM comparator set: VE + South American peers + Mexico.
# Map English country names (as in FH XLSX) to ISO3.
COUNTRY_ISO3: dict[str, str] = {
    "Venezuela": "VEN",
    "Chile": "CHL",
    "Colombia": "COL",
    "Peru": "PER",
    "Argentina": "ARG",
    "Brazil": "BRA",
    "Ecuador": "ECU",
    "Bolivia": "BOL",
    "Uruguay": "URY",
    "Paraguay": "PRY",
    "Mexico": "MEX",
    "United States": "USA",
}

UPSERT = """
INSERT INTO ddhh.freedom_house
  (country_iso3, year, status, pr_rating, cl_rating, pr_score, cl_score, total)
VALUES
  (%(country_iso3)s, %(year)s, %(status)s, %(pr_rating)s, %(cl_rating)s,
   %(pr_score)s, %(cl_score)s, %(total)s)
ON CONFLICT (country_iso3, year) DO UPDATE SET
  status       = EXCLUDED.status,
  pr_rating    = EXCLUDED.pr_rating,
  cl_rating    = EXCLUDED.cl_rating,
  pr_score     = EXCLUDED.pr_score,
  cl_score     = EXCLUDED.cl_score,
  total        = EXCLUDED.total,
  extracted_at = NOW();
"""


def _xlsx_url() -> str:
    return os.environ.get("FH_XLSX_URL", DEFAULT_URL)


def _to_int(v) -> int | None:
    if v is None or v == "":
        return None
    try:
        return int(float(v))
    except (TypeError, ValueError):
        return None


def parse_xlsx(raw: bytes) -> list[dict]:
    """Parse FH XLSX (sheet FIW13-24) and return rows for known countries."""
    df = pl.read_excel(
        io.BytesIO(raw),
        sheet_name="FIW13-24",
        read_options={"header_row": 1},
    )
    expected = {"Country/Territory", "Edition", "Status",
                "PR rating", "CL rating", "PR", "CL", "Total"}
    missing = expected - set(df.columns)
    if missing:
        raise ValueError(f"FH xlsx missing columns: {missing}")

    # Filter to "country" rows (skip territories), known ISO3 mapping
    df = df.filter(pl.col("C/T") == "c") if "C/T" in df.columns else df
    df = df.filter(pl.col("Country/Territory").is_in(list(COUNTRY_ISO3)))

    rows: list[dict] = []
    for r in df.iter_rows(named=True):
        name = r["Country/Territory"]
        iso3 = COUNTRY_ISO3.get(name)
        if not iso3:
            continue
        year = _to_int(r["Edition"])
        if year is None:
            continue
        rows.append({
            "country_iso3": iso3,
            "year": year,
            "status": r.get("Status") or None,
            "pr_rating": _to_int(r.get("PR rating")),
            "cl_rating": _to_int(r.get("CL rating")),
            "pr_score": _to_int(r.get("PR")),
            "cl_score": _to_int(r.get("CL")),
            "total": _to_int(r.get("Total")),
        })
    return rows


def write_parquet(rows: list[dict]) -> int:
    if not rows:
        return 0
    df = pl.DataFrame(rows)
    buf = io.BytesIO()
    df.write_parquet(buf, compression="zstd")
    put_parquet("ddhh/freedom_house.parquet", buf.getvalue())
    return df.height


def upsert_db(db_url: str, rows: Iterable[dict]) -> int:
    rows = list(rows)
    if not rows:
        return 0
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.executemany(UPSERT, rows)
        conn.commit()
    return len(rows)


def run(db_url: str | None, dry_run: bool = False) -> int:
    url = _xlsx_url()
    log.info("freedom_house start url=%s", url)
    raw = fetch_bytes(url)
    if not raw:
        log.error("freedom_house: download failed")
        return 0
    log.info("downloaded bytes=%d", len(raw))

    rows = parse_xlsx(raw)
    log.info("parsed rows=%d for countries=%d", len(rows),
             len({r['country_iso3'] for r in rows}))

    if dry_run:
        for r in rows[:5]:
            log.info("sample: %s", r)
        return len(rows)

    n_parquet = write_parquet(rows)
    log.info("parquet rows=%d -> ddhh/freedom_house.parquet", n_parquet)

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
