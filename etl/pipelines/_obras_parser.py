"""HTML / RSS parsers for obras sources. One adapter per source.

The transparenciave.org HTML structure is the primary scraping target. This
parser is intentionally lenient — fields that can't be parsed return empty
strings, the pipeline geocodes from the state centroid as a fallback, and
malformed entries are skipped instead of aborting the run.
"""
from __future__ import annotations

import re
import unicodedata
from typing import Iterable

from bs4 import BeautifulSoup

ESTATUS_MAP = {
    "paralizada": "paralizada", "paralizado": "paralizada",
    "critica": "critica", "crítica": "critica",
    "critico": "critica", "crítico": "critica",
    "inoperativa": "inoperativa", "inoperativo": "inoperativa",
}


def slugify(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s


def normalize_estatus(raw: str) -> str:
    low = raw.lower()
    for k, v in ESTATUS_MAP.items():
        if k in low:
            return v
    return "inoperativa"


def parse_obra_html(html: str, fallback_id: str = "") -> dict | None:
    """Return a normalized obra dict or None if essential fields are missing."""
    soup = BeautifulSoup(html, "lxml")

    def field(label_text: str) -> str:
        label = soup.find(
            "span", class_="label", string=re.compile(label_text, re.IGNORECASE)
        )
        if label:
            value = label.find_next_sibling("span", class_="value")
            if value:
                return value.get_text(strip=True)
        return ""

    title_el = soup.find(class_="obra-title") or soup.find("h1")
    nombre = title_el.get_text(strip=True) if title_el else ""
    if not nombre:
        return None

    estado = field("Estado") or field("Ubicación") or ""
    estatus = normalize_estatus(field("Estatus"))
    ente = field("Ente") or field("Responsable") or ""
    presupuesto_text = field("Presupuesto") or field("Inversión") or ""
    anio_text = field("Año") or field("Año de inicio") or ""
    anio_match = re.search(r"\d{4}", anio_text)
    anio_inicio = int(anio_match.group(0)) if anio_match else 0

    return {
        "id": slugify(nombre)[:64] or fallback_id,
        "nombre": nombre,
        "estado_venezuela": estado.strip(),
        "estatus": estatus,
        "ente_responsable": ente,
        "presupuesto_text": presupuesto_text,
        "anio_inicio": anio_inicio,
        "fuente_url": "",
    }


def normalize_presupuesto_usd(raw: str) -> float:
    if not raw or not raw.strip():
        return 0.0
    lower = raw.lower()
    is_usd = "usd" in lower or "$" in raw
    # Strip currency symbols/letters/spaces and treat both . and , as
    # thousand separators (presupuestos publicados son enteros casi siempre).
    digits = re.sub(r"[^\d]", "", raw)
    if not digits:
        return 0.0
    try:
        n = float(digits)
    except ValueError:
        return 0.0
    if is_usd:
        return n
    return n * 0.0000277  # historical Bs blended rate


def parse_listing_html(html: str) -> Iterable[str]:
    """Yield obra detail URLs found in a listing page."""
    soup = BeautifulSoup(html, "lxml")
    for a in soup.select("a.obra-link, a[href*='/obras/']"):
        href = a.get("href")
        if href:
            yield href
