"""Pipeline skeleton: Instituto Nacional de Estadísticas."""

from __future__ import annotations

import structlog

log = structlog.get_logger(__name__)


def run() -> None:
    log.info("pipeline.start", name="ine")
    # TODO: implement INE extraction.
    log.info("pipeline.done", name="ine")


if __name__ == "__main__":
    run()
