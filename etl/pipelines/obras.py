"""Obras pipeline: scrape + normalize + geocode + upsert into Postgres.

Run:
  docker compose --profile etl run --rm \
    -e DATABASE_URL=postgres://dev:dev@postgres:5432/datos \
    etl python -m pipelines obras

Env:
  DATABASE_URL          - required, target Postgres.
  OBRAS_SOURCE_URLS     - comma-separated detail URLs (override / explicit list).
  OBRAS_LISTING_URL     - optional, single listing page to crawl.
  OFFLINE_GEOCODER=1    - skip Nominatim lookups (CI / local without network).
  OFFLINE_PARSERS=1     - skip HTTP fetch entirely; useful for unit tests.
  DRY_RUN=1             - print what would be upserted, no DB writes.
"""
from __future__ import annotations

import logging
import os
import sys
from typing import Iterable

import httpx
import psycopg

from ._obras_geocoder import Geocoder
from ._obras_parser import (
    normalize_presupuesto_usd,
    parse_listing_html,
    parse_obra_html,
    slugify,
)

log = logging.getLogger("etl.obras")
logging.basicConfig(
    level=os.environ.get("ETL_LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

UPSERT = """
INSERT INTO obras (
  id, nombre, lat, lng, presupuesto_usd, anio_inicio, categoria,
  estado_venezuela, estatus, ente_responsable, fuente_url
) VALUES (
  %(id)s, %(nombre)s, %(lat)s, %(lng)s, %(presupuesto_usd)s, %(anio_inicio)s,
  %(categoria)s, %(estado_venezuela)s, %(estatus)s, %(ente_responsable)s,
  %(fuente_url)s
)
ON CONFLICT (id) DO UPDATE SET
  nombre              = EXCLUDED.nombre,
  lat                 = EXCLUDED.lat,
  lng                 = EXCLUDED.lng,
  presupuesto_usd     = EXCLUDED.presupuesto_usd,
  anio_inicio         = EXCLUDED.anio_inicio,
  categoria           = EXCLUDED.categoria,
  estado_venezuela    = EXCLUDED.estado_venezuela,
  estatus             = EXCLUDED.estatus,
  ente_responsable    = EXCLUDED.ente_responsable,
  fuente_url          = EXCLUDED.fuente_url,
  updated_at          = now();
"""


def _http_get(url: str) -> str:
    r = httpx.get(url, timeout=20.0, follow_redirects=True)
    r.raise_for_status()
    return r.text


def _discover_urls() -> list[str]:
    explicit = os.environ.get("OBRAS_SOURCE_URLS", "").strip()
    if explicit:
        return [u.strip() for u in explicit.split(",") if u.strip()]
    listing = os.environ.get("OBRAS_LISTING_URL", "").strip()
    if not listing or os.environ.get("OFFLINE_PARSERS") == "1":
        return []
    try:
        html = _http_get(listing)
    except Exception as e:
        log.warning("listing fetch failed: %s", e)
        return []
    return list({u for u in parse_listing_html(html)})


def _scrape_obras(urls: Iterable[str]) -> list[dict]:
    rows: list[dict] = []
    for url in urls:
        try:
            html = _http_get(url)
        except Exception as e:
            log.warning("fetch %s failed: %s", url, e)
            continue
        obra = parse_obra_html(html, fallback_id=slugify(url))
        if not obra:
            continue
        obra["fuente_url"] = url
        rows.append(obra)
    return rows


def _enrich(rows: list[dict], gc: Geocoder) -> list[dict]:
    enriched: list[dict] = []
    for r in rows:
        lat = r.get("lat")
        lng = r.get("lng")
        if lat is None or lng is None:
            addr = f"{r.get('nombre','')}, {r.get('estado_venezuela','')}, Venezuela".strip(", ")
            coords = gc.geocode(addr) if addr else None
            if not coords and r.get("estado_venezuela"):
                coords = gc.state_centroid(r["estado_venezuela"])
            if coords:
                lat, lng = coords
        enriched.append({
            "id": r["id"],
            "nombre": r["nombre"],
            "lat": lat,
            "lng": lng,
            "presupuesto_usd": normalize_presupuesto_usd(r.get("presupuesto_text", "")),
            "anio_inicio": r.get("anio_inicio") or 0,
            "categoria": r.get("categoria"),
            "estado_venezuela": r.get("estado_venezuela", ""),
            "estatus": r.get("estatus", "inoperativa"),
            "ente_responsable": r.get("ente_responsable"),
            "fuente_url": r.get("fuente_url", ""),
        })
    return enriched


def run(db_url: str, dry_run: bool = False) -> int:
    urls = _discover_urls()
    log.info("discovered %d urls", len(urls))
    raw = _scrape_obras(urls)
    log.info("parsed %d obras", len(raw))

    gc = Geocoder()
    enriched = _enrich(raw, gc)
    gc.flush()

    if dry_run:
        log.info("dry-run: would upsert %d obras", len(enriched))
        for r in enriched[:3]:
            log.info("sample: %s", r)
        return len(enriched)

    if not enriched:
        log.info("nothing to upsert")
        return 0

    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.executemany(UPSERT, enriched)
        conn.commit()
    log.info("upserted %d obras", len(enriched))
    return len(enriched)


def main() -> int:
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("ERROR: DATABASE_URL is required", file=sys.stderr)
        return 2
    n = run(db_url=db_url, dry_run=os.environ.get("DRY_RUN") == "1")
    print(n)
    return 0


if __name__ == "__main__":
    sys.exit(main())
