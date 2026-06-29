"use client";

import { useState } from "react";
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

export function AffectedStates({ states }: { states: AffectedState[] }) {
  // First state open by default; the rest collapse on load.
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    states.length > 0 ? { [states[0].name]: true } : {},
  );

  function toggle(name: string) {
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  return (
    <ul className="space-y-2">
      {states.map((st) => {
        const sev = SEVERITY[st.severity];
        const isOpen = !!open[st.name];
        const panelId = `state-panel-${st.name.replace(/\s+/g, "-").toLowerCase()}`;
        return (
          <li
            key={st.name}
            className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-900/50"
          >
            <button
              type="button"
              onClick={() => toggle(st.name)}
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
              {st.notes}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
