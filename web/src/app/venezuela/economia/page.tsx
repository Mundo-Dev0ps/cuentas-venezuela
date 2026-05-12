import Link from "next/link";
import { ArrowLeft, Activity, AlertTriangle } from "lucide-react";
import { getVeMacroIndicators, getEmbi } from "@/lib/api";
import { IndicatorBlock } from "@/components/indicator-block";
import { SourceBadge } from "@/components/source-badge";
import { EmbiBarChart } from "@/components/embi-bar-chart";
import type { VeUnit } from "@/components/ve-trend-chart";

export const metadata = {
  title: "Crisis económica — Venezuela | Cuentas Venezuela",
  description:
    "PIB, inflación, desempleo, deuda pública e inversión extranjera de Venezuela vs Chile. Datos Banco Mundial 1998-2024.",
};

export const dynamic = "force-dynamic";

interface I {
  code: string;
  title: string;
  unitLabel: string;
  unit: VeUnit;
}

const FEATURED: I[] = [
  { code: "NY.GDP.MKTP.CD", title: "PIB nominal", unitLabel: "USD corrientes", unit: "usd" },
  { code: "NY.GDP.MKTP.KD.ZG", title: "Crecimiento del PIB", unitLabel: "% anual", unit: "pct" },
  { code: "FP.CPI.TOTL.ZG", title: "Inflación (IPC)", unitLabel: "% anual — escala log no aplicada", unit: "pct" },
  { code: "SL.UEM.TOTL.ZS", title: "Desempleo", unitLabel: "% fuerza laboral", unit: "pct" },
  { code: "GC.DOD.TOTL.GD.ZS", title: "Deuda gobierno central", unitLabel: "% del PIB", unit: "pct" },
  { code: "BX.KLT.DINV.WD.GD.ZS", title: "Inversión extranjera directa entrante", unitLabel: "% del PIB", unit: "pct" },
  { code: "NE.EXP.GNFS.ZS", title: "Exportaciones de bienes y servicios", unitLabel: "% del PIB", unit: "pct" },
  { code: "NE.IMP.GNFS.ZS", title: "Importaciones de bienes y servicios", unitLabel: "% del PIB", unit: "pct" },
];

export default async function EconomiaPage() {
  const [allRows, embi] = await Promise.all([
    Promise.all(FEATURED.map((f) => getVeMacroIndicators({ code: f.code, from: 1998, to: 2024 }))),
    getEmbi(),
  ]);
  const ven = embi.find((e) => e.country === "VEN");
  const venVsChl = ven && embi.find((e) => e.country === "CHL");

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
        <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Crisis económica
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3 flex items-center gap-3">
          <Activity className="h-7 w-7 text-amber-400" aria-hidden />
          Economía de Venezuela 1998-2024
        </h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          PIB, inflación, deuda y comercio exterior. Caída sostenida desde
          2013 con hiperinflación, contracción de 80% del PIB y huida de
          inversión extranjera. Comparado con Chile como referencia regional.
        </p>
        <p className="text-xs text-slate-500 mt-3">
          Nota: las cifras oficiales del BCV dejaron de publicarse regularmente
          desde 2017. WB usa estimaciones FMI cuando aplica.
        </p>
        <div className="mt-4">
          <SourceBadge
            slug="world-bank"
            name="World Bank Open Data"
            url="https://data.worldbank.org/country/venezuela-rb"
          />
        </div>
      </header>

      {/* Riesgo país (EMBI+) — Venezuela vs LATAM */}
      {embi.length > 0 && (
        <section className="mb-10 rounded-xl border border-rose-500/30 bg-slate-900/80 p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
            <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-400" aria-hidden />
              Riesgo país — Venezuela vs LATAM
            </h2>
            <p className="text-xs text-slate-500">EMBI+ spread (bps vs US Treasuries)</p>
          </div>
          <p className="text-sm text-slate-400 mb-4 max-w-3xl leading-relaxed">
            Spread sobre bonos del Tesoro de EE.UU. Venezuela registra el spread
            más alto de la región — su último valor publicado por JP Morgan
            (2017) fue <strong className="text-rose-300">{ven?.valueBps.toLocaleString("es-CL")} bps</strong>
            {" "}({ven && venVsChl ? `${(ven.valueBps / venVsChl.valueBps).toFixed(0)}× peor que Chile` : ""}).
            Los bonos venezolanos están en default selectivo desde noviembre 2017,
            por lo que el indicador permanece congelado en esa fecha.
          </p>
          <EmbiBarChart
            data={embi.map((e) => ({
              country: e.country,
              countryName: e.countryName,
              valueBps: e.valueBps,
              isFrozen: e.isFrozen,
              snapshotDate: e.snapshotDate,
            }))}
            height={460}
          />
          <div className="mt-3 text-xs text-slate-500 grid gap-1">
            <p>
              <span className="inline-block w-3 h-3 rounded-sm bg-rose-500 mr-1.5 align-middle" />
              Venezuela (congelado 2017)
              <span className="inline-block w-3 h-3 rounded-sm bg-orange-400 mx-1.5 ml-4 align-middle" />
              Crítico (&gt;1000 bps)
              <span className="inline-block w-3 h-3 rounded-sm bg-yellow-300 mx-1.5 ml-4 align-middle" />
              Moderado (300-1000)
              <span className="inline-block w-3 h-3 rounded-sm bg-cyan-400 mx-1.5 ml-4 align-middle" />
              Bajo (&lt;300)
            </p>
            <p className="italic">
              EMBI+ {ven?.snapshotDate} (VEN) · resto: snapshot enero 2025.
              Fuente: JP Morgan / Banco Central de Brasil / Ámbito Financiero.
            </p>
          </div>
        </section>
      )}

      <section className="grid gap-8">
        {FEATURED.map((cfg, i) => (
          <IndicatorBlock
            key={cfg.code}
            code={cfg.code}
            title={cfg.title}
            unit={cfg.unit}
            unitLabel={cfg.unitLabel}
            rows={allRows[i]}
          />
        ))}
      </section>

      <footer className="mt-10 border-t border-slate-700/40 pt-6 text-xs text-slate-500">
        <p>
          Fuente:{" "}
          <a
            className="text-cyan-300 hover:text-cyan-200"
            href="https://data.worldbank.org/"
            target="_blank"
            rel="noreferrer"
          >
            World Bank Open Data
          </a>
          . Pipeline ETL{" "}
          <code className="text-slate-400">etl/pipelines/ve_macro.py</code>.
        </p>
      </footer>
    </div>
  );
}
