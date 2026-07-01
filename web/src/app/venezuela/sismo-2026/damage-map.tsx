"use client";

import type { AffectedState } from "./data";
import { MAP_VIEWBOX, STATE_PATHS } from "./map-paths";

// Fill colors per severity (inline styles — SVG fill doesn't take Tailwind
// utility classes reliably across the palette).
const FILL: Record<AffectedState["severity"] | "none", string> = {
  critical: "#f43f5e", // rose-500
  high: "#f59e0b", // amber-500
  moderate: "#64748b", // slate-500
  none: "#1e293b", // slate-800
};
const SEV_LABEL: Record<AffectedState["severity"], string> = {
  critical: "Crítico",
  high: "Alto",
  moderate: "Moderado",
};

const LEGEND: Array<{ key: keyof typeof FILL; label: string }> = [
  { key: "critical", label: "Crítico" },
  { key: "high", label: "Alto" },
  { key: "moderate", label: "Moderado" },
  { key: "none", label: "Sin daños mayores" },
];

export function DamageMap({
  states,
  selected,
  onSelect,
}: {
  states: AffectedState[];
  selected: string;
  /** scroll=true when the interaction should jump to the detail list. */
  onSelect: (name: string, opts?: { scroll?: boolean }) => void;
}) {
  const byName = new Map(states.map((s) => [s.name, s]));
  const sel = byName.get(selected);

  return (
    <div className="grid gap-5 md:grid-cols-[1.3fr_1fr] md:items-start">
      {/* Map */}
      <figure className="rounded-xl border border-slate-700/40 bg-slate-950/40 p-3">
        <svg
          viewBox={MAP_VIEWBOX}
          role="img"
          aria-label="Mapa de Venezuela con los estados afectados por el terremoto, coloreados por severidad"
          className="h-auto w-full"
        >
          {Object.entries(STATE_PATHS).map(([name, d]) => {
            const st = byName.get(name);
            const sev = st?.severity ?? "none";
            const isSel = name === selected;
            const isAffected = !!st;
            return (
              <path
                key={name}
                d={d}
                fill={FILL[sev]}
                fillOpacity={isSel ? 0.95 : isAffected ? 0.72 : 0.5}
                stroke={isSel ? "#e2e8f0" : "#0f172a"}
                strokeWidth={isSel ? 2 : 0.6}
                style={{
                  cursor: isAffected ? "pointer" : "default",
                  transition: "fill-opacity 120ms",
                }}
                onMouseEnter={() => isAffected && onSelect(name)}
                onClick={() => isAffected && onSelect(name, { scroll: true })}
                tabIndex={isAffected ? 0 : -1}
                onFocus={() => isAffected && onSelect(name)}
                aria-label={st ? `${name}: ${SEV_LABEL[st.severity]}` : name}
              >
                <title>
                  {st ? `${name} — ${SEV_LABEL[st.severity]}` : name}
                </title>
              </path>
            );
          })}
        </svg>
        <figcaption className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 px-1 text-[11px] text-slate-400">
          {LEGEND.map((l) => (
            <span key={l.key} className="inline-flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-[3px]"
                style={{
                  background: FILL[l.key],
                  opacity: l.key === "none" ? 0.5 : 0.72,
                }}
              />
              {l.label}
            </span>
          ))}
        </figcaption>
      </figure>

      {/* Info panel */}
      <aside
        aria-live="polite"
        className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-5"
      >
        {sel ? (
          <>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-slate-100">
                {sel.name}
              </h3>
              <span
                className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                style={{
                  color: FILL[sel.severity],
                  borderColor: FILL[sel.severity] + "80",
                  background: FILL[sel.severity] + "1a",
                }}
              >
                {SEV_LABEL[sel.severity]}
              </span>
            </div>
            <dl className="mb-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-slate-700/40 bg-slate-950/40 px-3 py-2">
                <dt className="text-[11px] uppercase tracking-wider text-slate-500">
                  Capital
                </dt>
                <dd className="mt-0.5 font-medium text-slate-200">
                  {sel.capital}
                </dd>
              </div>
              <div className="rounded-lg border border-slate-700/40 bg-slate-950/40 px-3 py-2">
                <dt className="text-[11px] uppercase tracking-wider text-slate-500">
                  Severidad
                </dt>
                <dd
                  className="mt-0.5 font-medium"
                  style={{ color: FILL[sel.severity] }}
                >
                  {SEV_LABEL[sel.severity]}
                </dd>
              </div>
            </dl>
            <p className="text-sm leading-relaxed text-slate-400">
              {sel.notes}
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Pasa el cursor o toca un estado del mapa para ver su detalle.
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-400">
            Toca un estado coloreado del mapa para ver su detalle.
          </p>
        )}
      </aside>
    </div>
  );
}
