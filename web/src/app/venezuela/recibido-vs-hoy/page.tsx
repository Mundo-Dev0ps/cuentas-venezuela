import Link from "next/link";
import { ArrowLeft, AlertTriangle, TrendingDown } from "lucide-react";
import { getVeMacroIndicators } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import {
  JsonLd,
  breadcrumbsJsonLd,
  datasetJsonLd,
  faqPageJsonLd,
} from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { BeforeAfter } from "./before-after";
import {
  WB_INDICATORS,
  WB_SOURCE,
  POVERTY,
  OIL,
  INFLATION,
  type Point,
} from "./data";

export const metadata = pageMetadata({
  title: "Cómo recibió el chavismo a Venezuela y cómo está hoy",
  description:
    "Comparativa de rendición de cuentas: Venezuela en 1998 (antes del chavismo) frente al último dato en pobreza, producción petrolera, inflación, PIB per cápita, desempleo y deuda. Cada cifra fechada y citada.",
  path: "/venezuela/recibido-vs-hoy",
});

export const revalidate = 3600;

const DELAYS: Array<0 | 100 | 200 | 300 | 400> = [0, 100, 200, 300, 400];

const FAQS = [
  {
    question: "¿Cómo estaba Venezuela en 1998, antes del chavismo?",
    answer:
      "En 1998, el último año antes de que Hugo Chávez asumiera (2 de febrero de 1999), Venezuela producía cerca de 3,3 millones de barriles de petróleo diarios, la pobreza de ingresos de los hogares rondaba el 44% y la inflación anual estaba cerca del 36%. Era un país con problemas, pero con una industria petrolera entre las mayores del mundo.",
  },
  {
    question: "¿Cuánto cayó la producción petrolera de Venezuela?",
    answer:
      "De unos 3,3 millones de barriles diarios en 1998, la producción se desplomó hasta un mínimo histórico de 557.000 barriles diarios en 2020. Desde entonces se recuperó de forma parcial, hasta poco más de 1 millón de barriles diarios en 2025 — todavía cerca de un tercio de lo que producía en 1998.",
  },
  {
    question: "¿La pobreza en Venezuela subió o bajó bajo el chavismo?",
    answer:
      "La pobreza de ingresos pasó de cerca del 44% de los hogares en 1998 a un pico superior al 90% en 2020, según la ENCOVI de la UCAB. En 2023-2024 bajó (73,2% en 2024) por la estabilización cambiaria, pero sigue muy por encima del nivel de 1998. La medición independiente es la ENCOVI porque el gobierno dejó de publicar cifras oficiales de pobreza.",
  },
  {
    question: "¿Por qué se comparan 1998 y hoy?",
    answer:
      "1998 es el último año completo previo al chavismo, así que sirve como punto de partida: cómo recibió el gobierno al país frente a cómo está hoy. Los indicadores del Banco Mundial se muestran con su serie completa; pobreza, petróleo e inflación se curan a mano desde fuentes primarias (ENCOVI, OPEP, FMI) porque no tienen una API pública actualizada.",
  },
];

function toPoints(rows: { year: number; value: number | null }[]): Point[] {
  return rows
    .filter((r) => r.value != null)
    .map((r) => ({ year: r.year, value: r.value as number }))
    .sort((a, b) => a.year - b.year);
}

export default async function RecibidoVsHoyPage() {
  const wbRows = await Promise.all(
    WB_INDICATORS.map((i) =>
      getVeMacroIndicators({ country: "VEN", code: i.code, from: 1998, to: 2025 }),
    ),
  );
  const wb = WB_INDICATORS.map((cfg, i) => ({ cfg, points: toPoints(wbRows[i]) })).filter(
    (b) => b.points.length >= 2,
  );

  type BAProps = React.ComponentProps<typeof BeforeAfter>;
  const wbBlocks: BAProps[] = wb.map((b) => ({
    title: b.cfg.title,
    unitLabel: b.cfg.unitLabel,
    format: b.cfg.format,
    direction: b.cfg.direction,
    deltaKind: b.cfg.deltaKind,
    note: b.cfg.note,
    points: b.points,
    sources: [WB_SOURCE],
  }));
  const manualBlocks: BAProps[] = [POVERTY, OIL, INFLATION].map((m) => ({
    title: m.title,
    unitLabel: m.unitLabel,
    format: m.format,
    direction: m.direction,
    deltaKind: m.deltaKind,
    points: m.points,
    logScale: m.logScale,
    highlight: m.highlight,
    note: m.note,
    sources: m.sources,
  }));
  // PIB per cápita primero (si hay serie), luego pobreza/petróleo/inflación,
  // luego el resto del Banco Mundial (desempleo, deuda).
  const blocks: BAProps[] = [wbBlocks[0], ...manualBlocks, ...wbBlocks.slice(1)].filter(
    Boolean,
  ) as BAProps[];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Venezuela", path: "/venezuela" },
          { name: "Recibió vs hoy", path: "/venezuela/recibido-vs-hoy" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(FAQS)} />
      <JsonLd
        data={datasetJsonLd({
          name: "Venezuela 1998 vs hoy — indicadores de rendición de cuentas",
          description:
            "Comparativa 1998 vs último dato en pobreza, petróleo, inflación, PIB per cápita, desempleo y deuda de Venezuela. Fuentes: Banco Mundial, ENCOVI/UCAB, OPEP, FMI.",
          path: "/venezuela/recibido-vs-hoy",
          keywords: [
            "Venezuela 1998",
            "chavismo antes y después",
            "pobreza Venezuela ENCOVI",
            "producción petrolera Venezuela",
            "inflación Venezuela",
          ],
          temporalCoverage: "1998/2025",
          spatialCoverage: "Venezuela",
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
        <p className="text-rose-400 text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <TrendingDown className="h-3.5 w-3.5" />
          Rendición de cuentas
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Cómo recibió el chavismo a Venezuela y cómo está hoy
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          1998 (último año antes del chavismo) frente al último dato disponible.
          Cada indicador muestra la cifra de entonces, la de hoy y su tendencia.
          Cada dato cita su fuente.
        </p>
      </header>

      <aside className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
        <p className="flex gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            <strong>Registro factual.</strong> Se muestran magnitudes y su
            cambio, citadas. Los indicadores del Banco Mundial son anuales;
            pobreza, petróleo e inflación se curan a mano desde fuentes primarias
            (ENCOVI, OPEP, FMI) y el baseline de pobreza (1998) usa la encuesta
            oficial de hogares del INE.
          </span>
        </p>
      </aside>

      <section className="grid gap-4 sm:grid-cols-2">
        {blocks.map((b, i) => (
          <Reveal key={b.title} delay={DELAYS[i % DELAYS.length]}>
            <BeforeAfter {...b} />
          </Reveal>
        ))}
      </section>

      <section className="mt-16 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight">Preguntas frecuentes</h2>
        <dl className="space-y-4">
          {FAQS.map((faq, idx) => (
            <Reveal key={faq.question} delay={DELAYS[idx % DELAYS.length]}>
              <div className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-5">
                <dt className="text-base font-semibold text-slate-100">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-300">
                  {faq.answer}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      <footer className="mt-12 border-t border-slate-700/40 pt-6 text-xs text-slate-500 space-y-2">
        <p>
          Fuentes: Banco Mundial (ve_macro), ENCOVI / UCAB, OPEP / EIA, FMI.
          Cada bloque enlaza sus fuentes. Datos de actualización manual para
          pobreza, petróleo e inflación.
        </p>
      </footer>
    </main>
  );
}
