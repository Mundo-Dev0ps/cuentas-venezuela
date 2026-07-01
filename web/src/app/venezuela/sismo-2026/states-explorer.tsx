"use client";

import { useState } from "react";
import type { AffectedState } from "./data";
import { DamageMap } from "./damage-map";
import { AffectedStates, stateItemId } from "./affected-states";

// Coordinates the damage map and the detail list under one shared selection.
// Hovering/focusing a state updates the panel; clicking a state on the map
// also opens its entry in the list and scrolls it into view — so clicking
// visibly "does something" beyond the highlight.
export function StatesExplorer({ states }: { states: AffectedState[] }) {
  const [selected, setSelected] = useState<string>(states[0]?.name ?? "");

  function handleSelect(name: string, opts?: { scroll?: boolean }) {
    setSelected(name);
    if (opts?.scroll && typeof document !== "undefined") {
      document
        .getElementById(stateItemId(name))
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <div className="space-y-6">
      <DamageMap states={states} selected={selected} onSelect={handleSelect} />
      <AffectedStates
        states={states}
        selected={selected}
        onSelect={(name) => setSelected(name)}
      />
    </div>
  );
}
