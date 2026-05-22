"""Pipeline: OFAC SDN Advanced XML — Venezuela cohort.

Pulls the US Treasury's Specially Designated Nationals (SDN) Advanced
XML, walks the LegalBasis -> SanctionsProgram chain to find every
DistinctParty linked to a VENEZUELA-* program, extracts identifying
data and any Digital Currency Address features, and upserts into
corrupcion.sancionados + corrupcion.wallets.

This is the machine-ingested mirror of public sanctions data; curated
editorial content lives in web/src/app/venezuela/corrupcion/data.ts
and is not modified by this pipeline.

Run (dry):
  cd etl && DRY_RUN=1 python -m pipelines sanciones

Run (writes DB):
  docker compose --profile etl run --rm \\
    -e DATABASE_URL=postgres://dev:dev@postgres:5432/datos \\
    etl python -m pipelines sanciones

Env:
  DATABASE_URL                 required (or DRY_RUN=1)
  OFAC_SDN_URL                 optional override
  ETL_LOG_LEVEL                INFO (default) | DEBUG | WARNING
"""
from __future__ import annotations

import json
import logging
import os
import sys
from collections import defaultdict
from typing import Iterable

import httpx
import psycopg
from lxml import etree

log = logging.getLogger("etl.sanciones")
logging.basicConfig(
    level=os.environ.get("ETL_LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

OFAC_SDN_URL = os.environ.get(
    "OFAC_SDN_URL",
    "https://sanctionslistservice.ofac.treas.gov/api/publicationpreview/exports/SDN_ADVANCED.XML",
)

# Programs we filter on. OFAC names the family "VENEZUELA*" and we
# treat anything starting with that token as in-scope.
VE_PROGRAM_PREFIX = "VENEZUELA"

SOURCE = "ofac_sdn"

PARTY_TYPE_LABEL = {
    "1": "Vessel",
    "2": "Aircraft",
    "3": "Entity",
    "4": "Individual",
}

UPSERT_SANCIONADO = """
INSERT INTO corrupcion.sancionados
  (source, source_id, name, party_type, aliases, programs, jurisdictions,
   role, nationality, first_sanctioned_at, raw)
VALUES
  (%(source)s, %(source_id)s, %(name)s, %(party_type)s, %(aliases)s,
   %(programs)s, %(jurisdictions)s, %(role)s, %(nationality)s,
   %(first_sanctioned_at)s, %(raw)s)
ON CONFLICT (source, source_id) DO UPDATE SET
  name                = EXCLUDED.name,
  party_type          = EXCLUDED.party_type,
  aliases             = EXCLUDED.aliases,
  programs            = EXCLUDED.programs,
  jurisdictions       = EXCLUDED.jurisdictions,
  role                = EXCLUDED.role,
  nationality         = EXCLUDED.nationality,
  first_sanctioned_at = COALESCE(corrupcion.sancionados.first_sanctioned_at,
                                 EXCLUDED.first_sanctioned_at),
  last_seen_at        = NOW(),
  raw                 = EXCLUDED.raw
RETURNING id;
"""

UPSERT_WALLET = """
INSERT INTO corrupcion.wallets (sancionado_id, currency, address, source)
VALUES (%(sancionado_id)s, %(currency)s, %(address)s, %(source)s)
ON CONFLICT (currency, address) DO UPDATE SET
  sancionado_id = EXCLUDED.sancionado_id,
  source        = EXCLUDED.source;
"""


def localname(tag: str) -> str:
    return tag.split("}", 1)[1] if "}" in tag else tag


def text_of(el) -> str:
    return el.text.strip() if el is not None and el.text else ""


def fetch_sdn_xml() -> bytes:
    log.info("downloading OFAC SDN advanced XML")
    with httpx.Client(follow_redirects=True, timeout=120.0) as client:
        r = client.get(OFAC_SDN_URL)
        r.raise_for_status()
        log.info("downloaded bytes=%d", len(r.content))
        return r.content


def parse_sdn(raw_xml: bytes) -> list[dict]:
    """Returns a list of dicts: one per Venezuela-tagged sanctioned party,
    each with embedded wallet list."""
    root = etree.fromstring(raw_xml)

    # --- reference tables -------------------------------------------------
    # SanctionsProgram ID -> name
    sp_id_to_name: dict[str, str] = {}
    for sp in root.iter():
        if localname(sp.tag) == "SanctionsProgram":
            pid = sp.get("ID")
            if pid:
                sp_id_to_name[pid] = text_of(sp)

    # LegalBasis ID -> SanctionsProgram ID (via attribute)
    lb_id_to_sp_id: dict[str, str] = {}
    for lb in root.iter():
        if localname(lb.tag) == "LegalBasis":
            lid = lb.get("ID")
            spid = lb.get("SanctionsProgramID")
            if lid and spid:
                lb_id_to_sp_id[lid] = spid

    # FeatureType ID -> name (for Digital Currency Address detection)
    ft_id_to_name: dict[str, str] = {}
    for ft in root.iter():
        if localname(ft.tag) == "FeatureType":
            fid = ft.get("ID")
            if fid:
                ft_id_to_name[fid] = text_of(ft)
    crypto_ftypes = {
        fid for fid, n in ft_id_to_name.items()
        if n.startswith("Digital Currency Address")
    }

    # --- profile -> set(programs) via SanctionsEntry/EntryEvent ----------
    profile_programs: dict[str, set[str]] = defaultdict(set)
    for se in root.iter():
        if localname(se.tag) != "SanctionsEntry":
            continue
        pid = se.get("ProfileID")
        if not pid:
            continue
        # SanctionsEntry's children include EntryEvent and SanctionsMeasure.
        # The link to the sanction program is via EntryEvent's LegalBasisID.
        for ev in se.iter():
            if localname(ev.tag) == "EntryEvent":
                lb_id = ev.get("LegalBasisID")
                sp_id = lb_id_to_sp_id.get(lb_id or "")
                prog = sp_id_to_name.get(sp_id or "", "")
                if prog:
                    profile_programs[pid].add(prog)

    ve_profile_ids = {
        pid for pid, progs in profile_programs.items()
        if any(p.upper().startswith(VE_PROGRAM_PREFIX) for p in progs)
    }
    log.info(
        "ve_profiles count=%d (out of %d profiles with sanctions)",
        len(ve_profile_ids), len(profile_programs),
    )

    # --- walk DistinctParty -> extract everything for VE profiles --------
    rows: list[dict] = []
    for dp in root.iter():
        if localname(dp.tag) != "DistinctParty":
            continue
        profile = next((c for c in dp if localname(c.tag) == "Profile"), None)
        if profile is None:
            continue
        pid = profile.get("ID")
        if pid not in ve_profile_ids:
            continue

        party_type = PARTY_TYPE_LABEL.get(
            profile.get("PartySubTypeID", ""), "Unknown"
        )

        # Primary name + aliases
        primary_name = ""
        aliases: list[str] = []
        identity = next((c for c in profile if localname(c.tag) == "Identity"), None)
        if identity is not None:
            for alias in identity.iter():
                if localname(alias.tag) != "Alias":
                    continue
                is_primary = alias.get("IsPrimary") == "true"
                for dn in alias.iter():
                    if localname(dn.tag) != "DocumentedName":
                        continue
                    parts = []
                    for npart in dn.iter():
                        if localname(npart.tag) == "DocumentedNamePart":
                            for v in npart.iter():
                                if localname(v.tag) == "NamePartValue":
                                    parts.append(text_of(v))
                    name = " ".join(p for p in parts if p)
                    if not name:
                        continue
                    if is_primary and not primary_name:
                        primary_name = name
                    elif name != primary_name:
                        aliases.append(name)
        if not primary_name and aliases:
            primary_name = aliases.pop(0)

        # Title / role
        role = ""
        for feat in profile.iter():
            if localname(feat.tag) != "Feature":
                continue
            fname = ft_id_to_name.get(feat.get("FeatureTypeID", ""), "")
            if fname == "Title":
                for vd in feat.iter():
                    if localname(vd.tag) == "VersionDetail" and vd.text:
                        role = vd.text.strip()
                        break
                if role:
                    break

        # Crypto wallets
        wallets: list[dict] = []
        for feat in profile.iter():
            if localname(feat.tag) != "Feature":
                continue
            ftype = feat.get("FeatureTypeID")
            if ftype not in crypto_ftypes:
                continue
            fname = ft_id_to_name.get(ftype, "")
            # "Digital Currency Address - XBT" -> XBT
            currency = fname.split(" - ", 1)[-1].strip() or "UNKNOWN"
            for vd in feat.iter():
                if localname(vd.tag) == "VersionDetail" and vd.text:
                    addr = vd.text.strip()
                    if addr:
                        wallets.append({"currency": currency, "address": addr})

        rows.append({
            "source": SOURCE,
            "source_id": pid,
            "name": primary_name or "(sin nombre)",
            "party_type": party_type,
            "aliases": aliases[:20],
            "programs": sorted(profile_programs[pid]),
            "jurisdictions": ["USA"],
            "role": role or None,
            "nationality": None,
            "first_sanctioned_at": None,
            "raw": json.dumps({"wallets": wallets}),
            "_wallets": wallets,
        })

    log.info(
        "parsed ve_parties=%d with_crypto=%d",
        len(rows), sum(1 for r in rows if r["_wallets"]),
    )
    return rows


def upsert_db(db_url: str, rows: list[dict]) -> tuple[int, int]:
    if not rows:
        return (0, 0)
    sanc_count = 0
    wallet_count = 0
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            for r in rows:
                wallets = r.pop("_wallets", [])
                cur.execute(UPSERT_SANCIONADO, r)
                sancionado_id = cur.fetchone()[0]
                sanc_count += 1
                for w in wallets:
                    cur.execute(UPSERT_WALLET, {
                        "sancionado_id": sancionado_id,
                        "currency": w["currency"],
                        "address": w["address"],
                        "source": SOURCE,
                    })
                    wallet_count += 1
        conn.commit()
    return (sanc_count, wallet_count)


def run(db_url: str | None, dry_run: bool = False) -> int:
    raw = fetch_sdn_xml()
    rows = parse_sdn(raw)
    if dry_run:
        for r in rows[:5]:
            sample = {k: v for k, v in r.items() if k != "_wallets"}
            sample["wallet_count"] = len(r.get("_wallets", []))
            log.info("sample: %s", sample)
        return len(rows)
    if not db_url:
        log.warning("DATABASE_URL missing — skipping upsert")
        return len(rows)
    sanc, wall = upsert_db(db_url, rows)
    log.info("upserted sancionados=%d wallets=%d", sanc, wall)
    return sanc


def main() -> int:
    db_url = os.environ.get("DATABASE_URL")
    dry = os.environ.get("DRY_RUN") == "1"
    if not db_url and not dry:
        print("ERROR: DATABASE_URL required (or DRY_RUN=1)", file=sys.stderr)
        return 2
    n = run(db_url=db_url, dry_run=dry)
    print(n)
    return 0


if __name__ == "__main__":
    sys.exit(main())
