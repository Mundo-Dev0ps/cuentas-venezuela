"""Pipeline: EMBI+ riesgo país — Banco Central de Brasil SGS API.

Pulls latest EMBI+ spread (bps over US Treasuries) for LATAM countries
from the public BCB SGS endpoint, upserts into macro_ve.embi_riesgo_pais
+ Parquet snapshot.

Source: https://api.bcb.gov.br/dados/serie/bcdata.sgs.<series_id>/dados

Run:
  docker compose --profile etl run --rm \
    -e DATABASE_URL=postgres://dev:dev@postgres:5432/datos \
    etl python -m pipelines embi

Env:
  DATABASE_URL    required (or DRY_RUN=1).
  EMBI_LOOKBACK_DAYS  optional, default 365. Mark country as frozen if
                      last datapoint is older than this window.

Note on Venezuela: JP Morgan stopped publishing VEN EMBI+ when sovereign
bonds entered default (Nov 2017). BCB series may have a stale last value
or be empty. Pipeline marks is_frozen=TRUE in that case and preserves
the existing seed snapshot for display purposes.
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

log = logging.getLogger("etl.embi")
logging.basicConfig(
    level=os.environ.get("ETL_LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

API_BASE = "https://api.bcb.gov.br/dados/serie/bcdata.sgs"

# (country_iso3, country_name, BCB SGS series id)
COUNTRIES: list[tuple[str, str, int]] = [
    ("VEN", "Venezuela",        40940),
    ("ARG", "Argentina",        40842),
    ("BRA", "Brasil",           40841),
    ("CHL", "Chile",            40839),
    ("COL", "Colombia",         40843),
    ("ECU", "Ecuador",          40846),
    ("MEX", "México",           40847),
    ("PER", "Perú",             40848),
    ("URY", "Uruguay",          40850),
    ("PRY", "Paraguay",         40849),
    ("SLV", "El Salvador",      40845),
    ("CRI", "Costa Rica",       40844),
    ("PAN", "Panamá",           40838),
    ("DOM", "Rep. Dominicana",  40837),
]

UPSERT = """
INSERT INTO macro_ve.embi_riesgo_pais
  (country_iso3, country_name, snapshot_date, value_bps, is_frozen, note)
VALUES
  (%(country_iso3)s, %(country_name)s, %(snapshot_date)s, %(value_bps)s,
   %(is_frozen)s, %(note)s)
ON CONFLICT (country_iso3, snapshot_date) DO UPDATE SET
  country_name = EXCLUDED.country_name,
  value_bps    = EXCLUDED.value_bps,
  is_frozen    = EXCLUDED.is_frozen,
  note         = EXCLUDED.note,
  extracted_at = NOW();
"""


def _lookback_days() -> int:
    try:
        return int(os.environ.get("EMBI_LOOKBACK_DAYS", "365"))
    except ValueError:
        return 365


def _parse_bcb_date(d: str) -> datetime.date | None:
    """BCB returns dates as 'DD/MM/YYYY'."""
    try:
        return datetime.datetime.strptime(d, "%d/%m/%Y").date()
    except (ValueError, TypeError):
        return None


def fetch_series_last(series_id: int) -> tuple[datetime.date, int] | None:
    """Returns (date, value_bps) of the most recent observation, or None."""
    url = f"{API_BASE}.{series_id}/dados/ultimos/30?formato=json"
    raw = fetch_bytes(url)
    if not raw:
        log.warning("embi fetch failed series=%s", series_id)
        return None
    try:
        items = json.loads(raw)
    except json.JSONDecodeError as e:
        log.warning("embi json decode failed series=%s: %s", series_id, e)
        return None
    if not isinstance(items, list) or not items:
        log.info("embi empty series=%s", series_id)
        return None
    last = items[-1]
    d = _parse_bcb_date(last.get("data", ""))
    try:
        v = int(round(float(last.get("valor", "0"))))
    except (ValueError, TypeError):
        return None
    if d is None:
        return None
    return (d, v)


def fetch_all() -> list[dict]:
    rows: list[dict] = []
    today = datetime.date.today()
    threshold = today - datetime.timedelta(days=_lookback_days())
    for iso3, name, series_id in COUNTRIES:
        result = fetch_series_last(series_id)
        if result is None:
            log.warning("embi.skip iso3=%s series=%s", iso3, series_id)
            continue
        date, value = result
        is_frozen = date < threshold
        note = (
            f"Último valor publicado por BCB SGS series {series_id}. "
            f"{'Sin actualización reciente — datos congelados.' if is_frozen else 'Actualizado.'}"
        )
        rows.append({
            "country_iso3": iso3,
            "country_name": name,
            "snapshot_date": date.isoformat(),
            "value_bps": value,
            "is_frozen": is_frozen,
            "note": note,
        })
    return rows


def write_parquet(rows: list[dict]) -> int:
    if not rows:
        return 0
    df = pl.DataFrame(rows)
    buf = io.BytesIO()
    df.write_parquet(buf, compression="zstd")
    put_parquet("macro_ve/embi_riesgo_pais.parquet", buf.getvalue())
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
    log.info("embi start countries=%d", len(COUNTRIES))
    rows = fetch_all()
    log.info("embi fetched rows=%d", len(rows))

    if not rows:
        log.warning(
            "embi.no_rows — BCB unreachable or all series empty; "
            "seed snapshot in db/seeds.sql remains the source of truth."
        )
        return 0

    if dry_run:
        for r in rows[:5]:
            log.info("sample: %s", r)
        return len(rows)

    n_parquet = write_parquet(rows)
    log.info("parquet rows=%d -> macro_ve/embi_riesgo_pais.parquet", n_parquet)

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
