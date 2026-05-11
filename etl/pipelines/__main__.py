"""Entrypoint: runs all registered pipelines or lists them."""

import sys

from pipelines import (
    acnur,
    comparativa,
    extranjeria,
    freedom_house,
    ine,
    obras,
    sii,
    sp,
    ve_macro,
)

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
}


def main() -> None:
    if len(sys.argv) > 1 and sys.argv[1] in PIPELINES:
        PIPELINES[sys.argv[1]]()
        return
    if len(sys.argv) > 1 and sys.argv[1] == "all":
        for name, fn in PIPELINES.items():
            print(f"running {name}...")
            fn()
        return
    print("registered pipelines:")
    for name in PIPELINES:
        print(f"  - {name}")
    print("\nrun all:        python -m pipelines all")
    print("run one:        python -m pipelines <name>")
    print("or directly:    python -m pipelines.<name>")


if __name__ == "__main__":
    main()
