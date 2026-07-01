"use client";

import { ChevronDown } from "lucide-react";
import type { AffectedState } from "./data";

const SEVERITY: Record<
  AffectedState["severity"],
  { label: string; badge: string; dot: string }
> = {
  critical: {
    label: "Crítico",
    badge: "border-rose-500/50 bg-rose-500/10 text-rose-200",
    dot: "bg-rose-400",
  },
  high: {
    label: "Alto",
    badge: "border-amber-500/50 bg-amber-500/10 text-amber-200",
    dot: "bg-amber-400",
  },
  moderate: {
    label: "Moderado",
    badge: "border-slate-600/50 bg-slate-700/20 text-slate-300",
    dot: "bg-slate-400",
  },
};

export function stateItemId(name: string): string {
  return `state-item-${name.replace(/\s+/g, "-").toLowerCase()}`;
}

export function AffectedStates({
  states,
  selected,
  onSelect,
}: {
  states: AffectedState[];
  /** Currently open/selected state, shared with the map. */
  selected: string;
  onSelect: (name: string) => void;
}) {
  return (
    <ul className="space-y-2">
      {states.map((st) => {
        const sev = SEVERITY[st.severity];
        const isOpen = st.name === selected;
        const panelId = `state-panel-${st.name.replace(/\s+/g, "-").toLowerCase()}`;
        return (
          <li
            key={st.name}
            id={stateItemId(st.name)}
            className="scroll-mt-24 overflow-hidden rounded-xl border border-slate-700/40 bg-slate-900/50"
          >
            <button
              type="button"
              onClick={() => onSelect(st.name)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-800/40"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${sev.dot}`} />
              <span className="flex-1 font-semibold text-slate-100">
                {st.name}
              </span>
              <span
                className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${sev.badge}`}
              >
                {sev.label}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>
            {/* Notes always in the DOM (SEO-safe); only collapsed visually. */}
            <div
              id={panelId}
              hidden={!isOpen}
              className="border-t border-slate-700/40 px-4 py-3 text-sm leading-relaxed text-slate-400"
            >
              <p className="mb-1 text-xs text-slate-500">
                Capital: <span className="text-slate-300">{st.capital}</span>
              </p>
              {st.notes}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
