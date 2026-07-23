import { ExternalLink, ArrowRight } from "lucide-react";
import { fmtValue, type Direction, type Point, type Source } from "./data";

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
}

function sparkPath(points: Point[], logScale: boolean, w: number, h: number): string {
  const ys = points.map((p) => (logScale ? Math.log10(Math.max(p.value, 1)) : p.value));
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = max - min || 1;
  const n = points.length;
  return points
    .map((_, i) => {
      const x = n === 1 ? w / 2 : (i / (n - 1)) * w;
      const y = h - ((ys[i] - min) / span) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join("");
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
}: Props) {
  const first = points[0];
  const last = points[points.length - 1];
  const rose = direction === "higherBetter" ? last.value < first.value : last.value > first.value;
  const deltaColor = rose
    ? "border-rose-500/50 bg-rose-500/10 text-rose-200"
    : "border-emerald-500/50 bg-emerald-500/10 text-emerald-200";
  const line = rose ? "#f43f5e" : "#34d399";

  return (
    <div className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-5">
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

      {/* mini-tendencia */}
      <svg
        viewBox="0 0 240 40"
        preserveAspectRatio="none"
        className="mt-3 h-10 w-full"
        aria-hidden
      >
        <path
          d={sparkPath(points, logScale, 240, 40)}
          fill="none"
          stroke={line}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
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
    </div>
  );
}
