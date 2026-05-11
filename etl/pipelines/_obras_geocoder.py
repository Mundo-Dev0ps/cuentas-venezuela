"""Address -> (lat, lon) for Venezuelan obras with offline fallbacks.

Strategy:
1. Cached known states (24 ADM1 centroids) for fast O(1) lookup when only
   the state name is known.
2. JSON cache on disk so repeated CI runs don't re-hit Nominatim.
3. Online Nominatim with strict 1 req/sec throttle + offline-mode env flag
   for tests and CI without network.
"""
from __future__ import annotations

import json
import os
import time
from pathlib import Path
from typing import Optional

import httpx

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "cuentas-venezuela-etl/1.0 (contact@cuentas-venezuela.com)"

ESTADO_COORDS: dict[str, tuple[float, float]] = {
    "Amazonas": (3.849, -65.647), "Anzoátegui": (8.591, -63.956),
    "Apure": (7.014, -68.532), "Aragua": (10.065, -67.602),
    "Barinas": (8.555, -69.847), "Bolívar": (7.124, -63.550),
    "Carabobo": (10.180, -68.003), "Cojedes": (9.381, -68.337),
    "Delta Amacuro": (8.596, -61.186), "Distrito Capital": (10.480, -66.904),
    "Falcón": (11.177, -69.741), "Guárico": (8.749, -65.987),
    "Lara": (10.068, -69.355), "Mérida": (8.560, -71.140),
    "Miranda": (10.230, -66.431), "Monagas": (9.327, -63.018),
    "Nueva Esparta": (10.992, -63.912), "Portuguesa": (9.094, -69.206),
    "Sucre": (10.458, -63.185), "Táchira": (7.773, -72.226),
    "Trujillo": (9.368, -70.432), "Vargas": (10.601, -66.936),
    "Yaracuy": (10.340, -68.750), "Zulia": (10.651, -71.614),
}


class Geocoder:
    def __init__(self, cache_path: str = "/data/geocode_cache.json"):
        self.cache_path = Path(cache_path)
        self._cache: dict[str, dict[str, float]] = {}
        if self.cache_path.exists():
            try:
                self._cache = json.loads(self.cache_path.read_text() or "{}")
            except Exception:
                self._cache = {}
        self._dirty = False
        self._last_call = 0.0

    def state_centroid(self, estado: str) -> Optional[tuple[float, float]]:
        return ESTADO_COORDS.get(estado.strip())

    def geocode(self, address: str) -> Optional[tuple[float, float]]:
        if not address.strip():
            return None
        if address in self._cache:
            v = self._cache[address]
            return (v["lat"], v["lon"])
        if os.environ.get("OFFLINE_GEOCODER") == "1":
            return None

        delta = time.time() - self._last_call
        if delta < 1.05:
            time.sleep(1.05 - delta)
        try:
            r = httpx.get(
                NOMINATIM_URL,
                params={
                    "q": address,
                    "format": "json",
                    "limit": 1,
                    "countrycodes": "ve",
                },
                headers={"User-Agent": USER_AGENT},
                timeout=10.0,
            )
            r.raise_for_status()
        except Exception:
            self._last_call = time.time()
            return None
        self._last_call = time.time()

        data = r.json()
        if not data:
            return None
        lat, lon = float(data[0]["lat"]), float(data[0]["lon"])
        self._cache[address] = {"lat": lat, "lon": lon}
        self._dirty = True
        return (lat, lon)

    def flush(self) -> None:
        if not self._dirty:
            return
        self.cache_path.parent.mkdir(parents=True, exist_ok=True)
        self.cache_path.write_text(
            json.dumps(self._cache, ensure_ascii=False, indent=2, sort_keys=True)
        )
        self._dirty = False
