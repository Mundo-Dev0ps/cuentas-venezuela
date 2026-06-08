"""Entrypoint: runs all registered pipelines or lists them."""

import sys

from pipelines import (
    acnur,
    comparativa,
    embi,
    extranjeria,
    freedom_house,
    ine,
    obras,
    sanciones,
    sii,
    sp,
    vdem,
    ve_macro,
)

# Order matters for `all`: flaky / network-heavy pipelines (embi hits BCB,
# which is frequently down) run LAST so they cannot starve the others of the
# CI job time budget.
PIPELINES = {
    "extranjeria": extranjeria.run,
    "ine": ine.run,
    "sp": sp.run,
    "sii": sii.run,
    "comparativa": comparativa.run,
    "obras": obras.main,
    "ve_macro": ve_macro.main,
    "freedom_house": freedom_house.main,
    "acnur": acnur.main,
    "sanciones": sanciones.main,
    "vdem": vdem.main,
    "embi": embi.main,
}


def main() -> None:
    if len(sys.argv) > 1 and sys.argv[1] in PIPELINES:
        PIPELINES[sys.argv[1]]()
        return
    if len(sys.argv) > 1 and sys.argv[1] == "all":
        failures: list[str] = []
        for name, fn in PIPELINES.items():
            print(f"running {name}...")
            try:
                fn()
            except Exception as exc:  # noqa: BLE001 — isolate per-pipeline
                # One pipeline failing must not abort the rest of `all`.
                failures.append(name)
                print(f"ERROR pipeline {name} failed: {exc}", file=sys.stderr)
        if failures:
            print(f"completed with failures: {', '.join(failures)}", file=sys.stderr)
            sys.exit(1)
        return
    print("registered pipelines:")
    for name in PIPELINES:
        print(f"  - {name}")
    print("\nrun all:        python -m pipelines all")
    print("run one:        python -m pipelines <name>")
    print("or directly:    python -m pipelines.<name>")


if __name__ == "__main__":
    main()
