"use client";

import { useState } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useInView } from "@/lib/use-in-view";
import {
  fmtValue,
  type Direction,
  type Point,
  type Source,
  type MegaStat,
  type EraMarker,
} from "./data";

function SourceLinks({ sources }: { sources: Source[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {sources.map((s) => (
        <a
          key={s.url}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md border border-cyan-500/40 bg-cyan-500/5 px-2 py-0.5 text-[11px] text-cyan-200 hover:bg-cyan-500/10"
        >
          {s.label}
          <ExternalLink className="h-3 w-3" />
        </a>
      ))}
    </div>
  );
}

/** Leyenda de los marcadores de era que aparecen en cada mini-tendencia. */
export function EraLegend({ markers }: { markers: EraMarker[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
      <span className="text-slate-500">En las tendencias:</span>
      {markers.map((m) => (
        <span key={m.year} className="inline-flex items-center gap-1.5">
          <svg width="14" height="10" aria-hidden>
            <line
              x1="7"
              y1="0"
              x2="7"
              y2="10"
              stroke={m.color}
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          </svg>
          <span>
            <span className="font-mono text-slate-300">{m.year}</span> {m.label}
          </span>
        </span>
      ))}
    </div>
  );
}

/** Cifra destacada para magnitudes que no caben en un antes/después. */
export function MegaStatCard({ stat }: { stat: MegaStat }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-rose-500/30 bg-rose-500/5 p-5">
      <h3 className="text-lg font-semibold text-slate-100">{stat.title}</h3>
      <p className="mt-3 break-words font-mono text-2xl font-bold leading-tight text-rose-200 sm:text-3xl md:text-4xl">
        {stat.value}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">
        {stat.caption}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{stat.note}</p>
      <div className="mt-auto">
        <SourceLinks sources={stat.sources} />
      </div>
    </div>
  );
}

interface Props {
  title: string;
  unitLabel: string;
  format: "usd" | "pct" | "kbpd";
  direction: Direction;
  deltaKind: "pp" | "pct" | "x";
  points: Point[];
  logScale?: boolean;
  highlight?: string;
  note?: string;
  sources: Source[];
  markers?: EraMarker[];
}

/** Posición X de un año dentro del rango temporal de la serie. */
function xForYear(year: number, minYear: number, maxYear: number, w: number): number {
  if (maxYear === minYear) return w / 2;
  return ((year - minYear) / (maxYear - minYear)) * w;
}

function sparkPath(points: Point[], logScale: boolean, w: number, h: number): string {
  const ys = points.map((p) => (logScale ? Math.log10(Math.max(p.value, 1)) : p.value));
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = max - min || 1;
  const years = points.map((p) => p.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  return points
    .map((p, i) => {
      const x = xForYear(p.year, minYear, maxYear, w);
      const y = h - ((ys[i] - min) / span) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join("");
}

/** Índice del punto cuyo x% está más cerca del cursor. */
function nearestDot(
  el: HTMLElement,
  clientX: number,
  dots: { i: number; left: number }[],
): number {
  const rect = el.getBoundingClientRect();
  const relX = ((clientX - rect.left) / rect.width) * 100;
  let best = 0;
  let bestDist = Infinity;
  for (const d of dots) {
    const dist = Math.abs(d.left - relX);
    if (dist < bestDist) {
      bestDist = dist;
      best = d.i;
    }
  }
  return best;
}

function delta(points: Point[], kind: Props["deltaKind"]): string {
  const a = points[0].value;
  const b = points[points.length - 1].value;
  if (kind === "pp") {
    const d = Math.round(b - a);
    return `${d >= 0 ? "+" : ""}${d} pp`;
  }
  if (kind === "x") {
    return `×${(b / a).toFixed(1)}`;
  }
  const pct = Math.round(((b - a) / a) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

export function BeforeAfter({
  title,
  unitLabel,
  format,
  direction,
  deltaKind,
  points,
  logScale = false,
  highlight,
  note,
  sources,
  markers = [],
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const drawn = inView ? "is-drawn" : "";
  const [active, setActive] = useState<number | null>(null);
  const first = points[0];
  const last = points[points.length - 1];
  const minYear = first.year;
  const maxYear = last.year;
  const visibleMarkers = markers.filter((m) => m.year > minYear && m.year < maxYear);
  const rose = direction === "higherBetter" ? last.value < first.value : last.value > first.value;
  const deltaColor = rose
    ? "border-rose-500/50 bg-rose-500/10 text-rose-200"
    : "border-emerald-500/50 bg-emerald-500/10 text-emerald-200";
  const line = rose ? "#f43f5e" : "#34d399";

  // Geometría de los puntos para la capa interactiva (posiciones en %).
  const ys = points.map((p) => (logScale ? Math.log10(Math.max(p.value, 1)) : p.value));
  const minV = Math.min(...ys);
  const maxV = Math.max(...ys);
  const spanV = maxV - minV || 1;
  const peakIdx = ys.indexOf(maxV);
  const dots = points.map((p, i) => ({
    p,
    i,
    left: xForYear(p.year, minYear, maxYear, 100),
    top: (1 - (ys[i] - minV) / spanV) * 100,
    isPeak: i === peakIdx,
  }));
  const tip = active != null ? dots[active] : null;
  const tipAlign =
    tip == null
      ? ""
      : tip.left < 15
        ? "translate-x-0"
        : tip.left > 85
          ? "-translate-x-full"
          : "-translate-x-1/2";

  return (
    <div
      ref={ref}
      className="flex h-full flex-col rounded-xl border border-slate-700/40 bg-slate-900/50 p-5"
    >
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        <span className="text-[11px] uppercase tracking-wider text-slate-500">
          {unitLabel}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            {first.year}
          </p>
          <p className="font-mono text-2xl font-bold text-slate-300">
            {fmtValue(first.value, format)}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-slate-600" aria-hidden />
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            {last.year}
          </p>
          <p className="font-mono text-2xl font-bold text-slate-100">
            {fmtValue(last.value, format)}
          </p>
        </div>
        <span
          className={`ml-auto shrink-0 rounded-md border px-2 py-1 font-mono text-sm font-bold ${deltaColor}`}
        >
          {delta(points, deltaKind)}
        </span>
      </div>

      {/* mini-tendencia interactiva */}
      <div className="relative mt-3 h-12">
        <svg
          viewBox="0 0 240 40"
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-hidden
        >
          {visibleMarkers.map((m, i) => {
            const x = xForYear(m.year, minYear, maxYear, 240);
            return (
              <line
                key={m.year}
                className={`spark-marker ${drawn}`}
                style={{ animationDelay: `${700 + i * 150}ms` }}
                x1={x}
                y1={0}
                x2={x}
                y2={40}
                stroke={m.color}
                strokeWidth={1}
                strokeDasharray="2 2"
                opacity={0.55}
              />
            );
          })}
          <path
            className={`spark-path ${drawn}`}
            pathLength={1}
            d={sparkPath(points, logScale, 240, 40)}
            fill="none"
            stroke={line}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        {/* capa interactiva: sigue el mouse y marca el punto más cercano */}
        <div
          className="absolute inset-0 cursor-crosshair"
          onMouseMove={(e) => setActive(nearestDot(e.currentTarget, e.clientX, dots))}
          onMouseLeave={() => setActive(null)}
          onTouchStart={(e) =>
            setActive(nearestDot(e.currentTarget, e.touches[0].clientX, dots))
          }
          onTouchMove={(e) =>
            setActive(nearestDot(e.currentTarget, e.touches[0].clientX, dots))
          }
          onTouchEnd={() => setActive(null)}
        >
          {/* siempre visible: el pico. En hover: el punto activo. */}
          {dots.map(
            (d) =>
              (d.isPeak || d.i === active) && (
                <span
                  key={d.p.year}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${d.left}%`, top: `${d.top}%` }}
                >
                  <span
                    className={`block rounded-full border border-slate-900 ${
                      d.i === active ? "h-3 w-3" : "h-2.5 w-2.5"
                    } ${d.isPeak ? "ring-2 ring-amber-400/80" : ""}`}
                    style={{ backgroundColor: d.isPeak ? "#fbbf24" : line }}
                  />
                </span>
              ),
          )}

          {/* línea guía vertical en el punto activo */}
          {tip && (
            <span
              className="pointer-events-none absolute top-0 bottom-0 w-px bg-slate-500/40"
              style={{ left: `${tip.left}%` }}
            />
          )}

          {tip && (
            <div
              className={`pointer-events-none absolute z-10 -translate-y-full ${tipAlign} whitespace-nowrap rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-100 shadow-lg`}
              style={{ left: `${tip.left}%`, top: `${tip.top}%`, marginTop: "-8px" }}
            >
              <span className="font-mono text-slate-300">{tip.p.year}</span>
              {" · "}
              <span className="font-semibold">{fmtValue(tip.p.value, format)}</span>
              {tip.isPeak && <span className="ml-1 text-amber-300">pico</span>}
            </div>
          )}
        </div>
      </div>
      <p className="mt-1 flex justify-between text-[10px] text-slate-600">
        <span>{first.year}</span>
        {logScale && <span className="text-slate-500">escala log</span>}
        <span>{last.year}</span>
      </p>

      {highlight && (
        <p className="mt-2 rounded-md border border-amber-500/30 bg-amber-500/5 px-2 py-1 text-xs text-amber-200">
          {highlight}
        </p>
      )}

      {note && <p className="mt-3 text-sm leading-relaxed text-slate-400">{note}</p>}

      <div className="mt-auto">
        <SourceLinks sources={sources} />
      </div>
    </div>
  );
}
