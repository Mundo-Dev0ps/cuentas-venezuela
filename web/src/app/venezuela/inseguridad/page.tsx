import Link from "next/link";
import { ArrowLeft, ShieldOff } from "lucide-react";
import { getVeMacroIndicators } from "@/lib/api";
import { IndicatorBlock } from "@/components/indicator-block";
import { SourceBadge } from "@/components/source-badge";
import type { VeUnit } from "@/components/ve-trend-chart";
import { pageMetadata } from "@/lib/seo";
import {
  JsonLd,
  breadcrumbsJsonLd,
  datasetJsonLd,
} from "@/components/json-ld";

export const metadata = pageMetadata({
  title: "Inseguridad en Venezuela",
  description:
    "Tasa de homicidios intencionales en Venezuela vs Chile y otros países LATAM. Datos Banco Mundial / UNODC.",
  path: "/venezuela/inseguridad",
});

export const dynamic = "force-dynamic";

interface I {
  code: string;
  title: string;
  unitLabel: string;
  unit: VeUnit;
}

const FEATURED: I[] = [
  { code: "VC.IHR.PSRC.P5", title: "Homicidios intencionales", unitLabel: "Por 100.000 habitantes", unit: "per100k" },
];

export default async function InseguridadPage() {
  const allRows = await Promise.all(
    FEATURED.map((f) => getVeMacroIndicators({ code: f.code, from: 1998, to: 2024 })),
  );

  // Latest value highlight for VE
  const ven = allRows[0]
    .filter((r) => r.country === "VEN")
    .sort((a, b) => b.year - a.year)[0];
  const chl = allRows[0]
    .filter((r) => r.country === "CHL")
    .sort((a, b) => b.year - a.year)[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Venezuela", path: "/venezuela" },
          { name: "Inseguridad", path: "/venezuela/inseguridad" },
        ])}
      />
      <JsonLd
        data={datasetJsonLd({
          name: "Tasa de homicidios intencionales en Venezuela (1998-2024)",
          description:
            "Homicidios intencionales por 100.000 habitantes en Venezuela, comparados con Chile y otros países LATAM. Fuente: Banco Mundial / UNODC.",
          path: "/venezuela/inseguridad",
          keywords: [
            "Venezuela",
            "inseguridad",
            "homicidios",
            "UNODC",
            "Banco Mundial",
            "violencia",
          ],
          temporalCoverage: "1998/2024",
          spatialCoverage: "Venezuela",
          sameAs: "https://data.worldbank.org/indicator/VC.IHR.PSRC.P5",
        })}
      />
      <Link
        href="/venezuela"
        className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 text-sm mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Venezuela
      </Link>

      <header className="mb-8">
        <p className="text-rose-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Inseguridad
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3 flex items-center gap-3">
          <ShieldOff className="h-7 w-7 text-rose-400" aria-hidden />
          Homicidios en Venezuela
        </h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          Tasa de homicidios intencionales por 100.000 habitantes según UNODC,
          consolidada por el Banco Mundial. Indicador clave de violencia
          letal. Venezuela registró durante años una de las tasas más altas de
          América Latina.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <SourceBadge
            slug="unodc"
            name="UNODC"
            url="https://dataunodc.un.org/"
          />
          <SourceBadge
            slug="world-bank"
            name="World Bank"
            url="https://data.worldbank.org/indicator/VC.IHR.PSRC.P5"
          />
        </div>
      </header>

      {/* KPI strip */}
      {ven && chl && ven.value != null && chl.value != null && (
        <section className="grid gap-3 sm:grid-cols-3 mb-10">
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
            <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider mb-1">
              Venezuela {ven.year}
            </p>
            <p className="text-3xl font-bold text-rose-400 font-mono">
              {ven.value.toFixed(1)}
              <span className="text-sm text-rose-300/70 ml-1">/100k</span>
            </p>
          </div>
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
            <p className="text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-1">
              Chile {chl.year}
            </p>
            <p className="text-3xl font-bold text-cyan-300 font-mono">
              {chl.value.toFixed(1)}
              <span className="text-sm text-cyan-300/70 ml-1">/100k</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-700/40 bg-slate-900/60 p-4">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Brecha
            </p>
            <p className="text-3xl font-bold text-slate-100 font-mono">
              {(ven.value / chl.value).toFixed(1)}×
            </p>
            <p className="text-xs text-slate-500 mt-1">
              VE vs CL ({ven.year})
            </p>
          </div>
        </section>
      )}

      <section className="grid gap-8 mb-10">
        {FEATURED.map((cfg, i) => (
          <IndicatorBlock
            key={cfg.code}
            code={cfg.code}
            title={cfg.title}
            unit={cfg.unit}
            unitLabel={cfg.unitLabel}
            rows={allRows[i]}
            height={340}
          />
        ))}
      </section>

      <section className="rounded-xl border border-slate-700/40 bg-slate-900/60 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-slate-100 mb-2">
          Limitaciones de la cifra oficial
        </h2>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-400">
          <li>
            El registro estatal en Venezuela se redujo desde 2014; el OVV
            (Observatorio Venezolano de Violencia) suele reportar tasas
            superiores a las oficiales.
          </li>
          <li>
            UNODC/WB toman las series con mejor disponibilidad. Discontinuidades
            en el reporte hacen que falten años recientes.
          </li>
          <li>
            Próximamente: integraremos cifras del OVV y del Foro Penal para
            triangular.
          </li>
        </ul>
      </section>

      <footer className="mt-10 border-t border-slate-700/40 pt-6 text-xs text-slate-500">
        <p>
          Fuentes:{" "}
          <a
            className="text-cyan-300 hover:text-cyan-200"
            href="https://data.worldbank.org/"
            target="_blank"
            rel="noreferrer"
          >
            World Bank
          </a>{" "}
          ·{" "}
          <a
            className="text-cyan-300 hover:text-cyan-200"
            href="https://dataunodc.un.org/"
            target="_blank"
            rel="noreferrer"
          >
            UNODC
          </a>
          . Pipeline ETL{" "}
          <code className="text-slate-400">etl/pipelines/ve_macro.py</code>.
        </p>
      </footer>
    </div>
  );
}
