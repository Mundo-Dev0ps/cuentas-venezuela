import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getVeMacroIndicators } from "@/lib/api";
import { IndicatorBlock } from "@/components/indicator-block";
import { SourceBadge } from "@/components/source-badge";
import type { VeUnit } from "@/components/ve-trend-chart";
import { pageMetadata } from "@/lib/seo";
import {
  JsonLd,
  breadcrumbsJsonLd,
  datasetJsonLd,
  faqPageJsonLd,
} from "@/components/json-ld";

const ANTES_DESPUES_FAQS = [
  {
    question: "¿Cómo cambió el PIB per cápita de Venezuela entre 1998 y 2024?",
    answer:
      "El PIB per cápita de Venezuela pasó de aproximadamente USD 4.000 en 1998 a un pico cercano a USD 13.000 en 2012 (boom petrolero) y se contrajo hasta cerca de USD 3.000-3.500 hacia 2020-2024 — niveles similares o inferiores a los de 1998 en términos reales. Fuente: Banco Mundial (NY.GDP.PCAP.CD).",
  },
  {
    question: "¿Cómo evolucionó la esperanza de vida en Venezuela versus Chile?",
    answer:
      "En 1998 la esperanza de vida en Venezuela era cercana a 72 años y en Chile 76. En 2024 Chile supera los 80 años mientras Venezuela está cerca de 72 — la brecha se amplió de 4 a casi 9 años. Es de los pocos países de la región donde la esperanza de vida se estancó o retrocedió. Fuente: Banco Mundial.",
  },
  {
    question: "¿Subió o bajó el acceso a internet y electricidad en Venezuela?",
    answer:
      "El acceso a internet en Venezuela creció hasta cerca del 70% en 2017 y se estancó/retrocedió desde entonces, mientras Chile alcanzó >90%. El acceso a electricidad llegó a 100% reportado pero la calidad cayó drásticamente (apagones masivos sostenidos desde 2019). Fuente: Banco Mundial.",
  },
  {
    question: "¿Cuál es el principal cambio estructural de Venezuela entre 1998 y 2024?",
    answer:
      "El cambio estructural más medible es la contracción acumulada del PIB (-78% nominal entre 2012 y 2020), la hiperinflación, la pérdida de población por emigración (~25%) y el colapso del aparato productivo. Países comparables de la región (Chile, Colombia, Perú) crecieron durante el mismo período. Fuente: Banco Mundial.",
  },
];

export const metadata = pageMetadata({
  title: "Venezuela antes y después (1998-2024)",
  description:
    "Comparativa de indicadores macroeconómicos y sociales de Venezuela y Chile entre 1998 y 2024. Fuente: Banco Mundial.",
  path: "/venezuela/antes-despues",
});

// World Bank historical comparison — edge-cache + hourly revalidate.
export const revalidate = 3600;

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
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Venezuela", path: "/venezuela" },
          { name: "Antes y después", path: "/venezuela/antes-despues" },
        ])}
      />
      <JsonLd
        data={datasetJsonLd({
          name: "Venezuela antes y después: indicadores macro y sociales (1998-2024)",
          description:
            "Comparativa longitudinal de PIB per cápita, esperanza de vida, mortalidad infantil, homicidios, acceso a internet y electricidad en Venezuela.",
          path: "/venezuela/antes-despues",
          keywords: [
            "Venezuela",
            "comparativa histórica",
            "antes y después",
            "PIB per cápita",
            "Banco Mundial",
          ],
          temporalCoverage: "1998/2024",
          spatialCoverage: "Venezuela",
          sameAs: "https://data.worldbank.org/country/venezuela-rb",
        })}
      />
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

      <section className="mt-12 space-y-5">
        <JsonLd data={faqPageJsonLd(ANTES_DESPUES_FAQS)} />
        <h2 className="text-2xl font-bold tracking-tight">
          Preguntas frecuentes sobre Venezuela 1998-2024
        </h2>
        <dl className="space-y-4">
          {ANTES_DESPUES_FAQS.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-5"
            >
              <dt className="text-base font-semibold text-slate-100">
                {faq.question}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-300">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
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
