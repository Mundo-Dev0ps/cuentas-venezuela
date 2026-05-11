import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getVeMacroIndicators } from "@/lib/api";
import { IndicatorBlock } from "@/components/indicator-block";
import { SourceBadge } from "@/components/source-badge";
import type { VeUnit } from "@/components/ve-trend-chart";

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
        <div className="mt-4">
          <SourceBadge
            slug="world-bank"
            name="World Bank Open Data"
            url="https://data.worldbank.org/country/venezuela-rb"
          />
        </div>
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
          </a>
          . Indicadores extraídos vía API pública (CC BY 4.0). Pipeline ETL{" "}
          <code className="text-slate-400">etl/pipelines/ve_macro.py</code>.
        </p>
      </footer>
    </div>
  );
}
