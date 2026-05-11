"""Unit tests for obras pipeline helpers (no network, no DB)."""
from __future__ import annotations

import os

import pytest

from pipelines._obras_geocoder import Geocoder
from pipelines._obras_parser import (
    normalize_estatus,
    normalize_presupuesto_usd,
    parse_obra_html,
    slugify,
)


def test_slugify_strips_accents_and_lowercases():
    assert slugify("Mérida Bolívar") == "merida-bolivar"
    assert slugify("Año 2024 — Obra X") == "ano-2024-obra-x"


def test_normalize_estatus_maps_variants():
    assert normalize_estatus("Paralizado") == "paralizada"
    assert normalize_estatus("crítica fase 2") == "critica"
    assert normalize_estatus("desconocido") == "inoperativa"


def test_normalize_presupuesto_usd_handles_currency_symbols():
    assert normalize_presupuesto_usd("USD 1.000.000") == 1_000_000.0
    assert normalize_presupuesto_usd("$45,000,000") == 45_000_000.0
    assert normalize_presupuesto_usd("") == 0.0


def test_parse_obra_html_minimal():
    html = """
    <h1 class="obra-title">Hospital de Prueba</h1>
    <p>
      <span class="label">Estado</span>
      <span class="value">Zulia</span>
    </p>
    <p>
      <span class="label">Estatus</span>
      <span class="value">Paralizada</span>
    </p>
    <p>
      <span class="label">Año de inicio</span>
      <span class="value">2010</span>
    </p>
    """
    out = parse_obra_html(html, fallback_id="fb-1")
    assert out is not None
    assert out["nombre"] == "Hospital de Prueba"
    assert out["estado_venezuela"] == "Zulia"
    assert out["estatus"] == "paralizada"
    assert out["anio_inicio"] == 2010
    assert out["id"] == "hospital-de-prueba"


def test_parse_obra_html_returns_none_without_title():
    assert parse_obra_html("<div>nothing</div>") is None


def test_geocoder_state_centroid_known_states():
    gc = Geocoder(cache_path="/tmp/_test_geo_cache.json")
    assert gc.state_centroid("Zulia") == (10.651, -71.614)
    assert gc.state_centroid("Distrito Capital") == (10.480, -66.904)
    assert gc.state_centroid("Atlantis") is None


def test_geocoder_offline_returns_none(monkeypatch, tmp_path):
    monkeypatch.setenv("OFFLINE_GEOCODER", "1")
    gc = Geocoder(cache_path=str(tmp_path / "cache.json"))
    assert gc.geocode("Some address that needs network") is None


def test_geocoder_uses_cache(tmp_path):
    cache = tmp_path / "cache.json"
    cache.write_text(
        '{"Caracas, VE": {"lat": 10.5, "lon": -66.9}}',
        encoding="utf-8",
    )
    os.environ.pop("OFFLINE_GEOCODER", None)
    gc = Geocoder(cache_path=str(cache))
    assert gc.geocode("Caracas, VE") == (10.5, -66.9)
