import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getVeMacroIndicators, type VeMacroRow } from "@/lib/api";
import {
  VeTrendChart,
  type VeTrendPoint,
  type VeUnit,
} from "@/components/ve-trend-chart";

export const metadata = {
  title: "Antes y después — Venezuela | Cuentas Venezuela",
  description:
    "Comparativa de indicadores macroeconómicos y sociales de Venezuela y Chile entre 1998 y 2024. Fuente: Banco Mundial.",
};

export const dynamic = "force-dynamic";

interface FeaturedIndicator {
  code: string;
  title: string;
  unitLabel: string;
  unit: VeUnit;
}

const FEATURED: FeaturedIndicator[] = [
  { code: "NY.GDP.PCAP.CD", title: "PIB per cápita", unitLabel: "USD corrientes", unit: "usd" },
  { code: "SP.DYN.LE00.IN", title: "Esperanza de vida al nacer", unitLabel: "Años", unit: "years" },
  { code: "SP.DYN.IMRT.IN", title: "Mortalidad infantil (<1 año)", unitLabel: "Por mil nacidos vivos", unit: "perThousand" },
  { code: "VC.IHR.PSRC.P5", title: "Homicidios intencionales", unitLabel: "Por 100.000 habitantes", unit: "per100k" },
  { code: "IT.NET.USER.ZS", title: "Usuarios de internet", unitLabel: "% de la población", unit: "pct" },
  { code: "EG.ELC.ACCS.ZS", title: "Acceso a electricidad", unitLabel: "% de la población", unit: "pct" },
];

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

function deltaSummary(points: VeTrendPoint[], country: "VEN" | "CHL"):
  | { from: number; to: number; first: number; last: number; pct: number | null }
  | null {
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

export default async function AntesDespuesPage() {
  const allRows = await Promise.all(
    FEATURED.map((f) => getVeMacroIndicators({ code: f.code, from: 1998, to: 2024 })),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/venezuela"
        className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 text-sm mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Venezuela
      </Link>

      <header className="mb-10">
        <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Comparativa
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
          Venezuela: 1998 vs 2024
        </h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          Trayectoria de indicadores clave de Venezuela frente a Chile como
          comparador regional. Datos del Banco Mundial — actualizados anualmente.
        </p>
      </header>

      <section className="grid gap-8">
        {FEATURED.map((cfg, i) => {
          const points = pivotByYear(allRows[i]);
          const ven = deltaSummary(points, "VEN");
          const chl = deltaSummary(points, "CHL");
          const fmt = (v: number) => fmtBy(cfg.unit, v);

          return (
            <article
              key={cfg.code}
              className="rounded-xl border border-slate-700/40 bg-slate-900/80 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h2 className="text-xl font-semibold text-slate-100">{cfg.title}</h2>
                <p className="text-xs text-slate-500">{cfg.unitLabel}</p>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Indicador WB: <code className="text-slate-400">{cfg.code}</code>
              </p>

              {points.length === 0 ? (
                <p className="text-sm text-slate-400 py-12 text-center">
                  Sin datos disponibles. Ejecuta el pipeline ETL{" "}
                  <code className="text-cyan-300">ve_macro</code>.
                </p>
              ) : (
                <>
                  <VeTrendChart data={points} unit={cfg.unit} height={260} />

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {ven && (
                      <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-3">
                        <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider mb-1">
                          Venezuela {ven.from} → {ven.to}
                        </p>
                        <p className="text-slate-100 text-sm">
                          {fmt(ven.first)} → <span className="font-semibold">{fmt(ven.last)}</span>
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
                          {fmt(chl.first)} → <span className="font-semibold">{fmt(chl.last)}</span>
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
        })}
      </section>

      <footer className="mt-10 border-t border-slate-700/40 pt-6 text-xs text-slate-500">
        <p>
          Fuente: <a className="text-cyan-300 hover:text-cyan-200" href="https://data.worldbank.org/" target="_blank" rel="noreferrer">World Bank Open Data</a>.
          Indicadores extraídos vía API pública (CC BY 4.0). Pipeline ETL{" "}
          <code className="text-slate-400">etl/pipelines/ve_macro.py</code>.
        </p>
      </footer>
    </div>
  );
}
