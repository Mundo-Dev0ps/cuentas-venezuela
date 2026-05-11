"""Tiny Postgres helper for ETL pipelines: connect + bulk upsert."""

from __future__ import annotations

import logging
import os
from typing import Iterable

import psycopg

log = logging.getLogger("etl.pg")


def db_url() -> str | None:
    return os.environ.get("DATABASE_URL")


def upsert(table: str, rows: Iterable[dict], conflict_cols: list[str]) -> int:
    """Generic UPSERT.

    Args:
        table: schema-qualified target table (e.g. "chile.sp_cotizantes").
        rows:  list of dicts; keys = column names.
        conflict_cols: PRIMARY KEY columns for ON CONFLICT clause.

    Returns: number of rows attempted.
    """
    rows = list(rows)
    if not rows:
        return 0
    url = db_url()
    if not url:
        log.warning("upsert.skip_no_db", table=table)
        return 0
    cols = list(rows[0].keys())
    placeholders = ", ".join(f"%({c})s" for c in cols)
    update_set = ", ".join(
        f"{c} = EXCLUDED.{c}" for c in cols if c not in conflict_cols
    ) or f"{conflict_cols[0]} = EXCLUDED.{conflict_cols[0]}"
    sql = (
        f"INSERT INTO {table} ({', '.join(cols)}) "
        f"VALUES ({placeholders}) "
        f"ON CONFLICT ({', '.join(conflict_cols)}) DO UPDATE SET "
        f"{update_set}, extracted_at = NOW()"
    )
    with psycopg.connect(url) as conn:
        with conn.cursor() as cur:
            cur.executemany(sql, rows)
        conn.commit()
    return len(rows)
