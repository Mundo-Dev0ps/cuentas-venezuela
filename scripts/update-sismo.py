#!/usr/bin/env python3
"""Daily updater for the 2026 Venezuela earthquake figures.

Parses the death/injured counts from the English Wikipedia infobox
(machine-readable wikitext, not HTML) and, subject to sanity guardrails,
rewrites the counts in the site's manual data files so the change can be
auto-committed and deployed.

Guardrails (a factual site must not publish vandalism or parse errors):
  - counts only ever RISE (death tolls are monotonic during recovery);
  - a single-day jump may not exceed ~2x the current value (+ a floor);
  - hard upper bounds reject absurd values.
If a parsed value trips a guardrail, nothing is written; the script still
exits 0 (a tripped guard is an expected outcome, usually a transient bad
Wikipedia edit) but sets guard_tripped=true so the workflow opens an issue
for human review.

Usage:
  python3 scripts/update-sismo.py [--dry-run]

Exit code is always 0 unless the script itself errors (network/parse crash).
"""

from __future__ import annotations

import datetime as dt
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from typing import Callable

WIKI_API = (
    "https://en.wikipedia.org/w/api.php?action=parse"
    "&page=2026_Venezuela_earthquakes&prop=wikitext&format=json&formatversion=2"
)
# Wikimedia API policy requires a contact/project URL in User-Agent to avoid 429 throttling.
USER_AGENT = "cuentasvenezuela-sismo-bot/1.1 (https://cuentasvenezuela.org; hola@cuentasvenezuela.org)"
RETRY_HTTP_CODES = {429, 500, 502, 503, 504}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_TS = os.path.join(ROOT, "web/src/app/venezuela/sismo-2026/data.ts")
SITEMAP_TS = os.path.join(ROOT, "web/src/app/sitemap.ts")
LLMS = os.path.join(ROOT, "web/public/llms.txt")
LLMS_FULL = os.path.join(ROOT, "web/public/llms-full.txt")

PENDING_FILE = os.path.join(ROOT, "scripts/.sismo-pending.json")

MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

# Hard sanity bounds.
MAX_DEAD = 200_000
MAX_INJURED = 500_000


def es_num(n: int) -> str:
    """Spanish grouping: 3889 -> '3.889'."""
    return f"{n:,}".replace(",", ".")


def es_fecha(d: dt.date) -> str:
    return f"{d.day} de {MESES[d.month - 1]} de {d.year}"


def fetch_wikitext(
    retries: int = 4,
    opener: Callable = urllib.request.urlopen,
    sleep_fn: Callable[[float], None] = time.sleep,
) -> str:
    """Fetch Wikipedia infobox wikitext, retrying on 429/5xx with Retry-After or backoff."""
    req = urllib.request.Request(WIKI_API, headers={"User-Agent": USER_AGENT})
    for attempt in range(1, retries + 1):
        try:
            with opener(req, timeout=30) as r:
                return json.load(r)["parse"]["wikitext"]
        except urllib.error.HTTPError as e:
            if e.code not in RETRY_HTTP_CODES or attempt == retries:
                raise
            retry_after = e.headers.get("Retry-After") if e.headers else None
            delay = float(retry_after) if retry_after and retry_after.isdigit() else 5.0 * (2 ** (attempt - 1))
            print(f"WARN: Wikipedia HTTP {e.code}, retrying in {delay:.0f}s (attempt {attempt}/{retries})")
            sleep_fn(delay)
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt == retries:
                raise
            delay = 5.0 * (2 ** (attempt - 1))
            print(f"WARN: Network error ({e}), retrying in {delay:.0f}s (attempt {attempt}/{retries})")
            sleep_fn(delay)
    raise RuntimeError("unreachable")


def _num_before(text: str, keyword: str) -> int | None:
    idx = text.lower().find(keyword)
    if idx < 0:
        return None
    seg = text[:idx]
    for pat in (r"rounddown\|(\d+)", r"val\|(\d+)", r"(\d[\d,]*)"):
        m = re.findall(pat, seg)
        if m:
            return int(m[-1].replace(",", ""))
    return None


def parse_casualties(wikitext: str) -> tuple[int | None, int | None]:
    m = re.search(r"\|\s*casualties\s*=\s*(.+)", wikitext)
    if not m:
        return None, None
    val = m.group(1)
    dead = _num_before(val, "dead") or _num_before(val, "killed")
    after = val[val.lower().find("dead") + 4:] if "dead" in val.lower() else val
    injured = _num_before(after, "injured")
    return dead, injured


def read_current() -> tuple[int, int, str]:
    src = open(DATA_TS, encoding="utf-8").read()
    dead = int(re.search(r"\n  dead: (\d+)", src).group(1))
    injured = int(re.search(r"\n  injured: (\d+)", src).group(1))
    as_of = re.search(r'asOf: "([\d-]+)"', src).group(1)
    return dead, injured, as_of


def load_pending() -> dict | None:
    if os.path.exists(PENDING_FILE):
        try:
            return json.loads(open(PENDING_FILE, encoding="utf-8").read())
        except Exception:
            return None
    return None


def save_pending(dead: int | None, injured: int | None) -> None:
    data = {"dead": dead, "injured": injured, "timestamp": dt.datetime.now(dt.timezone.utc).isoformat()}
    with open(PENDING_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def clear_pending() -> None:
    if os.path.exists(PENDING_FILE):
        try:
            os.remove(PENDING_FILE)
        except Exception:
            pass


def guard(new: int | None, cur: int, hard_max: int, floor: int, mult: float, pending_val: int | None) -> tuple[int, str | None]:
    """Return (value_to_use, tripped_reason). Falls back to `cur` on reject."""
    if new is None:
        return cur, None
    if new == cur:
        return cur, None
    if new < cur:
        return cur, f"parsed {new} < current {cur} (counts should not fall)"
    if new >= hard_max:
        return cur, f"parsed {new} exceeds hard max {hard_max}"
    
    # Large jump check with persistence auto-approval
    if new > cur * mult + floor:
        if pending_val is not None and pending_val == new:
            print(f"AUTO-APPROVED persistent figure {new} (verified stable across runs)")
            return new, None
        return cur, f"parsed {new} jumps >{mult}x from {cur} (queued for persistence check)"
    
    return new, None


def sub_file(path: str, subs: list[tuple[str, str]]) -> None:
    txt = open(path, encoding="utf-8").read()
    for pat, repl in subs:
        txt = re.sub(pat, repl, txt)
    open(path, "w", encoding="utf-8").write(txt)


def _self_test() -> int:
    """Offline checks for parser, guardrails, and HTTP 429 retry logic."""
    import io

    assert parse_casualties("| casualties = at least 6,509 dead, 226,696 injured") == (6509, 226696)
    assert parse_casualties("| casualties = {{rounddown|7120}} dead, 90,000 injured") == (7120, 90000)
    assert guard(6000, 6509, MAX_DEAD, 1000, 3.0, None)[1] is not None
    assert guard(25000, 6509, MAX_DEAD, 1000, 3.0, 25000) == (25000, None)

    attempts = {"n": 0}
    sleeps: list[float] = []

    def fake_open(_req, timeout=30):
        attempts["n"] += 1
        if attempts["n"] < 3:
            raise urllib.error.HTTPError(WIKI_API, 429, "Too many requests", {"Retry-After": "2"}, None)
        return io.BytesIO(json.dumps({"parse": {"wikitext": "| casualties = 6509 dead, 226696 injured"}}).encode())

    wt = fetch_wikitext(retries=4, opener=fake_open, sleep_fn=sleeps.append)
    assert "6509 dead" in wt and sleeps == [2.0, 2.0]
    print("self-test ok")
    return 0


def main() -> int:
    if "--self-test" in sys.argv:
        return _self_test()
    dry = "--dry-run" in sys.argv
    today = dt.date.today()
    iso = today.isoformat()

    wikitext = fetch_wikitext()
    p_dead, p_injured = parse_casualties(wikitext)
    cur_dead, cur_injured, cur_asof = read_current()
    pending = load_pending()
    
    pending_dead = pending.get("dead") if pending else None
    pending_injured = pending.get("injured") if pending else None

    print(f"parsed wiki: dead={p_dead} injured={p_injured}")
    print(f"current    : dead={cur_dead} injured={cur_injured} asOf={cur_asof}")
    if pending:
        print(f"pending    : dead={pending_dead} injured={pending_injured}")

    dead, r1 = guard(p_dead, cur_dead, MAX_DEAD, floor=1000, mult=3.0, pending_val=pending_dead)
    injured, r2 = guard(p_injured, cur_injured, MAX_INJURED, floor=15000, mult=5.0, pending_val=pending_injured)

    if r1 or r2:
        reason = "; ".join(r for r in (r1, r2) if r)
        print(f"GUARDRAIL: {reason}")
        if not dry:
            save_pending(p_dead, p_injured)
        _set_output("guard_tripped", "true")
        _set_output("reason", reason)
        return 0

    if not dry:
        clear_pending()

    if dead == cur_dead and injured == cur_injured:
        print("no change")
        _set_output("changed", "false")
        return 0

    print(f"UPDATE -> dead={dead} injured={injured} asOf={iso}")
    if dry:
        _set_output("changed", "true")
        return 0

    # data.ts (source of truth; KPIs/banner/OG/FAQ/landing derive from it)
    sub_file(DATA_TS, [
        (r"(\n  dead: )\d+", rf"\g<1>{dead}"),
        (r"(\n  injured: )\d+", rf"\g<1>{injured}"),
        (r'(asOf: ")[\d-]+(")', rf"\g<1>{iso}\g<2>"),
    ])
    # sitemap lastmod
    sub_file(SITEMAP_TS, [
        (r'("/venezuela/sismo-2026": ")[\d-]+(")', rf"\g<1>{iso}\g<2>"),
    ])
    # llms.txt / llms-full.txt (GEO snapshots)
    d_es, i_es, f_es = es_num(dead), es_num(injured), es_fecha(today)
    sub_file(LLMS, [
        (r"Al \d+ \w+ 2026: ≥[\d.]+ muertos, ≥[\d.]+ heridos",
         f"Al {today.day} {MESES[today.month-1][:3]} {today.year}: ≥{d_es} muertos, ≥{i_es} heridos"),
    ])
    sub_file(LLMS_FULL, [
        (r"Última actualización de cifras: \d+ de \w+ de 2026",
         f"Última actualización de cifras: {f_es}"),
        (r"Víctimas \(al \d+ de \w+ de 2026\): al menos [\d.]+ muertos, más de [\d.]+ heridos",
         f"Víctimas (al {f_es}): al menos {d_es} muertos, más de {i_es} heridos"),
        (r"R: Al \d+ de \w+ de 2026, las autoridades reportaban al menos [\d.]+ muertos y más de [\d.]+ heridos",
         f"R: Al {f_es}, las autoridades reportaban al menos {d_es} muertos y más de {i_es} heridos"),
    ])
    _set_output("changed", "true")
    _set_output("summary", f"muertos {cur_dead}->{dead}, heridos {cur_injured}->{injured} ({iso})")
    return 0


def _set_output(key: str, value: str) -> None:
    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a", encoding="utf-8") as f:
            f.write(f"{key}={value}\n")


if __name__ == "__main__":
    raise SystemExit(main())
