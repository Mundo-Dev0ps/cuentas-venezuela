"""Pipeline: Superintendencia de Pensiones — cotizantes por sector.

DEMO: aproximaciones públicas. TODO: reemplazar con extracción real desde
spensiones.cl (Series Estadísticas).
"""

from __future__ import annotations

import io

import polars as pl
import structlog

from pipelines._storage import put_parquet

log = structlog.get_logger(__name__)

SECTORS = [
    "Comercio", "Construcción", "Servicios", "Manufactura",
    "Agricultura", "Transporte", "Hotelería y restaurantes",
    "Educación", "Salud", "Otros",
]
SHARES = [0.22, 0.18, 0.20, 0.10, 0.06, 0.07, 0.07, 0.03, 0.03, 0.04]
TOTALS = {
    2020: 200_000, 2021: 245_000, 2022: 270_000, 2023: 295_000, 2024: 310_000,
}


def fetch() -> pl.DataFrame:
    rows = []
    for year, total in TOTALS.items():
        for sector, share in zip(SECTORS, SHARES, strict=True):
            rows.append(
                {"year": year, "sector": sector, "cotizantes": int(total * share)}
            )
    return pl.DataFrame(rows)


def run() -> None:
    log.info("pipeline.start", name="sp")
    df = fetch().with_columns(
        [pl.col("year").cast(pl.Int32), pl.col("cotizantes").cast(pl.Int64)]
    )
    buf = io.BytesIO()
    df.write_parquet(buf, compression="zstd")
    put_parquet("sp/cotizantes.parquet", buf.getvalue())
    log.info("pipeline.done", name="sp", rows=df.height)


if __name__ == "__main__":
    run()
