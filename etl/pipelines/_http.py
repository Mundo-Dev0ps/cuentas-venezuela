"""HTTP fetcher with retries and timeout."""

from __future__ import annotations

import time

import httpx
import structlog

log = structlog.get_logger(__name__)


def fetch_bytes(url: str, retries: int = 3, timeout: float = 30.0) -> bytes | None:
    """GET URL with retries. Returns None on terminal failure."""
    delay = 1.0
    for attempt in range(1, retries + 1):
        try:
            with httpx.Client(timeout=timeout, follow_redirects=True) as client:
                resp = client.get(url, headers={"User-Agent": "datos-chile-etl/0.1"})
                resp.raise_for_status()
                log.info("fetch.ok", url=url, status=resp.status_code, bytes=len(resp.content))
                return resp.content
        except (httpx.HTTPError, httpx.TimeoutException) as e:
            log.warning("fetch.fail", url=url, attempt=attempt, error=str(e))
            if attempt < retries:
                time.sleep(delay)
                delay *= 2
    log.error("fetch.giveup", url=url)
    return None
