"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, Briefcase } from "lucide-react";
import type { Figure, PublicPromise, Source } from "./data";
import { unfulfilledCount, officeCount, rankFigures } from "./data";

const STATUS: Record<
  PublicPromise["status"],
  { label: string; badge: string }
> = {
  incumplido: {
    label: "Incumplido",
    badge: "border-rose-500/50 bg-rose-500/10 text-rose-200",
  },
  parcial: {
    label: "Parcial",
    badge: "border-amber-500/50 bg-amber-500/10 text-amber-200",
  },
  "en-disputa": {
    label: "En disputa",
    badge: "border-slate-500/50 bg-slate-600/20 text-slate-200",
  },
  cumplido: {
    label: "Cumplido",
    badge: "border-emerald-500/50 bg-emerald-500/10 text-emerald-200",
  },
};

const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

/** Accepts "2005" | "2005-01" | "2005-01-15". */
function fmtDate(iso: string): string {
  const parts = iso.split("-");
  if (parts.length === 1) return parts[0];
  const [y, m, d] = parts;
  const mi = Number(m) - 1;
  if (parts.length === 2) return `${MONTHS[mi]} ${y}`;
  return `${Number(d)} ${MONTHS[mi]} ${y}`;
}

function SourceLink({ source }: { source: Source }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-md border border-cyan-500/40 bg-cyan-500/5 px-2 py-0.5 text-[11px] text-cyan-200 hover:bg-cyan-500/10"
    >
      {source.label}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

const RANK_STYLE = [
  "border-amber-400/60 bg-amber-400/15 text-amber-200", // #1
  "border-slate-300/50 bg-slate-300/10 text-slate-200", // #2
  "border-orange-500/50 bg-orange-500/15 text-orange-200", // #3
];

export function RankingList({ figures }: { figures: Figure[] }) {
  const ranked = rankFigures(figures);
  const [open, setOpen] = useState<string>(ranked[0]?.id ?? "");
  const maxUnmet = Math.max(1, ...ranked.map(unfulfilledCount));

  return (
    <ol className="space-y-3">
      {ranked.map((f, idx) => {
        const isOpen = f.id === open;
        const unmet = unfulfilledCount(f);
        const offices = officeCount(f);
        const panelId = `figure-${f.id}`;
        const sortedOffices = [...f.offices].sort((a, b) =>
          a.start.localeCompare(b.start),
        );
        return (
          <li
            key={f.id}
            className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-900/50"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? "" : f.id)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-800/40"
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-sm font-bold ${
                  RANK_STYLE[idx] ??
                  "border-slate-600/50 bg-slate-800/60 text-slate-300"
                }`}
              >
                {idx + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-semibold text-slate-100">
                    {f.name}
                  </span>
                  <span className="shrink-0 font-mono text-sm font-bold text-rose-300">
                    {unmet}
                  </span>
                </span>
                {/* Barra proporcional a promesas sin cumplir */}
                <span className="mt-1.5 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-800/70">
                  <span
                    className="h-full rounded-full bg-gradient-to-r from-rose-500/70 to-rose-400"
                    style={{ width: `${(unmet / maxUnmet) * 100}%` }}
                  />
                </span>
                <span className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-0.5" aria-hidden>
                    {Array.from({ length: Math.min(offices, 8) }).map((_, i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-cyan-400/70"
                      />
                    ))}
                  </span>
                  {offices} cargos ·{" "}
                  {unmet} promesa{unmet === 1 ? "" : "s"} sin cumplir
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>

            {/* Detail always in the DOM (SEO-safe); collapsed visually. */}
            <div
              id={panelId}
              hidden={!isOpen}
              className="border-t border-slate-700/40 px-4 py-4 space-y-5"
            >
              <p className="text-sm leading-relaxed text-slate-300">
                {f.summary}
              </p>

              {/* Cargos */}
              <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <Briefcase className="h-3.5 w-3.5" />
                  Cargos públicos
                </h4>
                <ol className="relative space-y-2 border-l border-slate-700/40 pl-4">
                  {sortedOffices.map((o, i) => (
                    <li key={`${o.title}-${i}`} className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-cyan-500/60 bg-slate-950" />
                      <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
                        <span className="font-mono text-xs text-slate-500">
                          {fmtDate(o.start)}
                          {o.end ? `–${fmtDate(o.end)}` : "–actualidad"}
                        </span>
                        <span className="text-slate-200">{o.title}</span>
                        <a
                          href={o.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300"
                          aria-label={`Fuente: ${o.source.label}`}
                        >
                          <ExternalLink className="inline h-3 w-3" />
                        </a>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Promesas */}
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Promesas y mandatos
                </h4>
                <ul className="space-y-3">
                  {f.promises.map((p, i) => {
                    const st = STATUS[p.status];
                    return (
                      <li
                        key={i}
                        className="rounded-lg border border-slate-700/40 bg-slate-950/40 p-3"
                      >
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="font-mono text-xs text-slate-500">
                            {fmtDate(p.madeDate)}
                          </span>
                          <span
                            className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${st.badge}`}
                          >
                            {st.label}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-300">
                          {p.text}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <SourceLink source={p.promiseSource} />
                          <SourceLink source={p.statusSource} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {f.sources && f.sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 border-t border-slate-800/60 pt-3">
                  <span className="text-[11px] text-slate-500">Perfil:</span>
                  {f.sources.map((s) => (
                    <SourceLink key={s.url} source={s} />
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
