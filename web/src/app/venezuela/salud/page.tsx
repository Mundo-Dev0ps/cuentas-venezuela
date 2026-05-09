import Link from "next/link";
import { ArrowLeft, HeartPulse } from "lucide-react";
import { getVeMacroIndicators } from "@/lib/api";
import { IndicatorBlock } from "@/components/indicator-block";
import type { VeUnit } from "@/components/ve-trend-chart";

export const metadata = {
  title: "Salud — Venezuela | Cuentas Venezuela",
  description:
    "Esperanza de vida, mortalidad infantil/materna, médicos por habitante y gasto en salud. Venezuela vs Chile, datos Banco Mundial.",
};

export const dynamic = "force-dynamic";

interface I {
  code: string;
  title: string;
  unitLabel: string;
  unit: VeUnit;
}

const FEATURED: I[] = [
  { code: "SP.DYN.LE00.IN", title: "Esperanza de vida al nacer", unitLabel: "Años", unit: "years" },
  { code: "SP.DYN.IMRT.IN", title: "Mortalidad infantil (<1 año)", unitLabel: "Por mil nacidos vivos", unit: "perThousand" },
  { code: "SH.DYN.MORT", title: "Mortalidad menores de 5 años", unitLabel: "Por mil nacidos vivos", unit: "perThousand" },
  { code: "SH.STA.MMRT", title: "Mortalidad materna", unitLabel: "Por 100.000 nacidos vivos", unit: "per100k" },
  { code: "SH.MED.PHYS.ZS", title: "Médicos por mil habitantes", unitLabel: "Por mil habitantes", unit: "perThousand" },
  { code: "SH.XPD.CHEX.GD.ZS", title: "Gasto en salud", unitLabel: "% del PIB", unit: "pct" },
];

export default async function SaludPage() {
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
        <p className="text-pink-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Salud pública
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3 flex items-center gap-3">
          <HeartPulse className="h-7 w-7 text-pink-400" aria-hidden />
          Sistema de salud venezolano
        </h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          Esperanza de vida, mortalidad infantil y materna, densidad médica
          y gasto sanitario. Indicadores que reflejan el deterioro del
          sistema público desde mediados de los 2010 y la migración masiva
          de personal de salud.
        </p>
      </header>

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
          </a>{" "}
          (consolidado de OMS, UNICEF, ONU). Pipeline ETL{" "}
          <code className="text-slate-400">etl/pipelines/ve_macro.py</code>.
        </p>
      </footer>
    </div>
  );
}
