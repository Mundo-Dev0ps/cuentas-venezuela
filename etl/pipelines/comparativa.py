"""Pipeline: stock por nacionalidad para comparativa.

DEMO: aproximaciones públicas de las 5 nacionalidades migrantes principales
en Chile. TODO: reemplazar con descarga real cruzada SERMIG + INE.
"""

from __future__ import annotations

import io

import polars as pl
import structlog

from pipelines._storage import put_parquet

log = structlog.get_logger(__name__)

# Stock aproximado por nacionalidad y año (legal vigente).
DATA = [
    # year, nacionalidad, stock_legal
    (2018, "Venezuela",  83_000),
    (2018, "Perú",       192_000),
    (2018, "Haití",       62_000),
    (2018, "Colombia",   105_000),
    (2018, "Bolivia",    115_000),

    (2019, "Venezuela", 288_000),
    (2019, "Perú",      210_000),
    (2019, "Haití",      82_000),
    (2019, "Colombia",  125_000),
    (2019, "Bolivia",   125_000),

    (2020, "Venezuela", 448_000),
    (2020, "Perú",      225_000),
    (2020, "Haití",      90_000),
    (2020, "Colombia",  140_000),
    (2020, "Bolivia",   135_000),

    (2021, "Venezuela", 460_000),
    (2021, "Perú",      230_000),
    (2021, "Haític",     95_000),
    (2021, "Colombia",  145_000),
    (2021, "Bolivia",   140_000),

    (2022, "Venezuela", 444_000),
    (2022, "Perú",      232_000),
    (2022, "Haití",     110_000),
    (2022, "Colombia",  155_000),
    (2022, "Bolivia",   145_000),

    (2023, "Venezuela", 470_000),
    (2023, "Perú",      236_000),
    (2023, "Haití",     115_000),
    (2023, "Colombia",  165_000),
    (2023, "Bolivia",   150_000),

    (2024, "Venezuela", 495_000),
    (2024, "Perú",      240_000),
    (2024, "Haití",     118_000),
    (2024, "Colombia",  175_000),
    (2024, "Bolivia",   155_000),
]

# Fix typo above (Haític → Haití for 2021).
DATA = [(y, "Haití" if n == "Haític" else n, s) for (y, n, s) in DATA]


def run() -> None:
    log.info("pipeline.start", name="comparativa")
    df = pl.DataFrame(
        DATA, schema=["year", "nacionalidad", "stock_legal"], orient="row"
    ).with_columns(
        [pl.col("year").cast(pl.Int32), pl.col("stock_legal").cast(pl.Int64)]
    )
    buf = io.BytesIO()
    df.write_parquet(buf, compression="zstd")
    put_parquet("comparativa/stock_nacionalidad.parquet", buf.getvalue())
    log.info("pipeline.done", name="comparativa", rows=df.height)


if __name__ == "__main__":
    run()
