"""Pipeline: SII — aporte tributario estimado.

DEMO: estimación gruesa basada en cotizantes y tasas medias. Reemplazar
con cruce real cuando esté disponible publicación SII por nacionalidad.
"""

from __future__ import annotations

import io

import polars as pl
import structlog

from pipelines._storage import put_parquet

log = structlog.get_logger(__name__)

# Millones de CLP estimados.
DATA = [
    (2020, "Impuesto a la renta",  430_000),
    (2020, "IVA",                  610_000),
    (2021, "Impuesto a la renta",  520_000),
    (2021, "IVA",                  720_000),
    (2022, "Impuesto a la renta",  610_000),
    (2022, "IVA",                  830_000),
    (2023, "Impuesto a la renta",  680_000),
    (2023, "IVA",                  920_000),
    (2024, "Impuesto a la renta",  720_000),
    (2024, "IVA",                  990_000),
]


def run() -> None:
    log.info("pipeline.start", name="sii")
    df = pl.DataFrame(
        DATA, schema=["year", "concepto", "monto_clp_millones"], orient="row"
    ).with_columns(
        [
            pl.col("year").cast(pl.Int32),
            pl.col("monto_clp_millones").cast(pl.Int64),
        ]
    )
    buf = io.BytesIO()
    df.write_parquet(buf, compression="zstd")
    put_parquet("sii/aporte.parquet", buf.getvalue())
    log.info("pipeline.done", name="sii", rows=df.height)


if __name__ == "__main__":
    run()
