import type { VeMacroRow } from "@/lib/api";
import {
  VeTrendChart,
  type VeTrendPoint,
  type VeUnit,
} from "@/components/ve-trend-chart";

interface IndicatorBlockProps {
  code: string;
  title: string;
  unit: VeUnit;
  unitLabel: string;
  rows: VeMacroRow[];
  height?: number;
}

function pivotByYear(rows: VeMacroRow[]): VeTrendPoint[] {
  const byYear = new Map<number, VeTrendPoint>();
  for (const r of rows) {
    let p = byYear.get(r.year);
    if (!p) {
      p = { year: r.year };
      byYear.set(r.year, p);
    }
    if (r.country === "VEN") p.VEN = r.value ?? null;
    else if (r.country === "CHL") p.CHL = r.value ?? null;
  }
  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
}

function deltaSummary(points: VeTrendPoint[], country: "VEN" | "CHL") {
  const valid = points.filter((p) => p[country] != null) as Array<
    VeTrendPoint & { [k in typeof country]: number }
  >;
  if (valid.length < 2) return null;
  const first = valid[0];
  const last = valid[valid.length - 1];
  const a = first[country];
  const b = last[country];
  const pct = a === 0 ? null : ((b - a) / a) * 100;
  return { from: first.year, to: last.year, first: a, last: b, pct };
}

function fmtBy(unit: VeUnit, v: number): string {
  switch (unit) {
    case "usd":
      return `$${v.toLocaleString("es-CL", { maximumFractionDigits: 0 })}`;
    case "pct":
      return `${v.toFixed(1)}%`;
    case "years":
      return `${v.toFixed(1)} años`;
    case "perThousand":
      return `${v.toFixed(1)} ‰`;
    case "per100k":
      return `${v.toFixed(1)}`;
    default:
      return v.toLocaleString("es-CL", { maximumFractionDigits: 2 });
  }
}

export function IndicatorBlock({
  code,
  title,
  unit,
  unitLabel,
  rows,
  height = 260,
}: IndicatorBlockProps) {
  const points = pivotByYear(rows);
  const ven = deltaSummary(points, "VEN");
  const chl = deltaSummary(points, "CHL");
  const fmt = (v: number) => fmtBy(unit, v);

  return (
    <article className="rounded-xl border border-slate-700/40 bg-slate-900/80 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
        <p className="text-xs text-slate-500">{unitLabel}</p>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Indicador WB: <code className="text-slate-400">{code}</code>
      </p>

      {points.length === 0 ? (
        <p className="text-sm text-slate-400 py-12 text-center">
          Sin datos disponibles. Ejecuta el pipeline ETL{" "}
          <code className="text-cyan-300">ve_macro</code>.
        </p>
      ) : (
        <>
          <VeTrendChart data={points} unit={unit} height={height} />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ven && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-3">
                <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider mb-1">
                  Venezuela {ven.from} → {ven.to}
                </p>
                <p className="text-slate-100 text-sm">
                  {fmt(ven.first)} →{" "}
                  <span className="font-semibold">{fmt(ven.last)}</span>
                  {ven.pct != null && (
                    <span
                      className={`ml-2 font-mono text-xs ${
                        ven.pct >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {ven.pct >= 0 ? "+" : ""}
                      {ven.pct.toFixed(1)}%
                    </span>
                  )}
                </p>
              </div>
            )}
            {chl && (
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-4 py-3">
                <p className="text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-1">
                  Chile {chl.from} → {chl.to}
                </p>
                <p className="text-slate-100 text-sm">
                  {fmt(chl.first)} →{" "}
                  <span className="font-semibold">{fmt(chl.last)}</span>
                  {chl.pct != null && (
                    <span
                      className={`ml-2 font-mono text-xs ${
                        chl.pct >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {chl.pct >= 0 ? "+" : ""}
                      {chl.pct.toFixed(1)}%
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </article>
  );
}
