import Link from "next/link";
import { Map, BarChart3, Globe2, AlertTriangle, ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, faqPageJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { DAMAGE, fmtNum } from "./venezuela/sismo-2026/data";

const DELAYS: Array<0 | 100 | 200 | 300 | 400> = [0, 100, 200, 300, 400];

export const metadata = pageMetadata({
  title: "Cuentas Venezuela — datos abiertos para venezolanos",
  description:
    "Mapa interactivo + catálogo de obras públicas paralizadas en Venezuela, datos de migración venezolana en Chile, y dashboards sobre economía, salud, derechos humanos y diáspora.",
  path: "/",
});

// Surface the most-asked questions about the site itself as a FAQPage.
// Same Q&A is rendered visibly below (LLMs cite Q&A pairs that match
// the page DOM, not only the JSON-LD).
const HOME_FAQS = [
  {
    question: "¿Qué es Cuentas Venezuela?",
    answer:
      "Cuentas Venezuela es una plataforma cívica independiente y sin fines de lucro que publica datos abiertos, oficiales y citados sobre Venezuela, su crisis multifactorial y su diáspora. Los datos provienen de Banco Mundial, ACNUR/UNHCR, Freedom House, BCB, UNODC y, para la migración venezolana en Chile, de SERMIG, INE, SII y la Superintendencia de Pensiones.",
  },
  {
    question: "¿Quién publica los datos y de dónde vienen?",
    answer:
      "Cada dashboard cita su fuente oficial. La plataforma agrega, normaliza y compara datos públicos sin opinión editorial. El código y los pipelines ETL están abiertos en GitHub (Mundo-Dev0ps/cuentas-venezuela). Los datos se publican bajo licencia Creative Commons CC BY 4.0.",
  },
  {
    question: "¿Qué cubre el Mapa del Olvido?",
    answer:
      "El Mapa del Olvido documenta 69 obras públicas paralizadas, críticas o inoperativas en Venezuela entre 1976 y 2024, distribuidas en 18 estados. Cada obra incluye ubicación geográfica, presupuesto público anunciado, contratista, responsable político al momento de iniciar la obra, sobrecosto y fuente original verificable.",
  },
  {
    question: "¿Puedo usar los datos en mi investigación, nota periodística o app?",
    answer:
      "Sí. Los datos están bajo licencia Creative Commons CC BY 4.0: uso libre con atribución a la fuente original (Banco Mundial, Freedom House, ACNUR, etc.) y, opcionalmente, a Cuentas Venezuela como agregador. La API pública está en https://api.cuentasvenezuela.org y el sitemap completo en https://cuentasvenezuela.org/sitemap.xml.",
  },
  {
    question: "¿El sitio tiene publicidad o cobra suscripción?",
    answer:
      "No. Cuentas Venezuela es 100% gratuito, sin publicidad, sin tracking de terceros y sin paywall. El proyecto se sostiene con donaciones voluntarias vía Ko-fi y trabajo abierto en GitHub.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-16">
      <JsonLd data={faqPageJsonLd(HOME_FAQS)} />
      <section className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-100">
          Cuentas Venezuela
        </h1>
        <p className="max-w-2xl text-lg text-slate-300 leading-relaxed">
          Datos abiertos sobre obras públicas en Venezuela y la migración
          venezolana en Chile. Auditables, comparables y citados desde fuentes
          oficiales.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/mapa-del-olvido"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-cyan-500 ps-4 pe-3.5 py-2 text-sm font-semibold text-slate-950 transition-[background-color,transform] duration-150 ease-out hover:bg-cyan-400 active:scale-[0.96]"
          >
            <span>Explorar el Mapa</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Link>
          <Link
            href="/datos-chile/dashboards"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-cyan-400/50 bg-slate-900/60 ps-4 pe-3.5 py-2 text-sm font-medium text-cyan-300 transition-[background-color,border-color,transform] duration-150 ease-out hover:bg-cyan-400/10 hover:border-cyan-400 active:scale-[0.96]"
          >
            <span>Ver dashboards</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </section>

      {/* Contingencia — terremoto 2026. Banner prioritario mientras dure la
          emergencia; retirar o degradar cuando pase la fase aguda. */}
      <Link
        href="/venezuela/sismo-2026"
        className="group block rounded-2xl border border-red-500/35 border-l-4 border-l-red-400 bg-slate-900/80 p-5 sm:p-6 transition-colors duration-150 ease-out hover:border-red-400/60 hover:bg-slate-900"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" strokeWidth={1.5} aria-hidden />
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" aria-hidden />
                Emergencia · actualización cada 12h
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-100 sm:text-2xl">
                Terremotos de Venezuela de 2026
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Doble sismo Mw 7,5 y 7,2 del 24 de junio.{" "}
                <span className="font-mono tabular-nums font-semibold text-slate-100">
                  {fmtNum(DAMAGE.dead)}+ muertos
                </span>
                ,{" "}
                <span className="font-mono tabular-nums font-semibold text-slate-100">
                  {fmtNum(DAMAGE.injured)}+ heridos
                </span>
                . Víctimas, estados afectados, mapa de daños y costo económico.
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-red-500 ps-4 pe-3.5 py-2 text-sm font-semibold text-slate-950 transition-colors duration-150 group-hover:bg-red-400 sm:self-center">
            <span>Ver cobertura</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </span>
        </div>
      </Link>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="group relative flex flex-col rounded-xl border border-white/[0.08] border-l-[3px] border-l-cyan-400 bg-slate-900/80 p-6 transition-colors duration-150 hover:border-cyan-400/50">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Map className="h-[18px] w-[18px] text-orange-400" strokeWidth={1.5} aria-hidden />
              <h2 className="text-xl font-semibold text-slate-100">Mapa del Olvido</h2>
            </div>
            <span className="text-xs font-mono text-cyan-300">Principal</span>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-300">
            Mapa interactivo de obras públicas inauguradas, abandonadas o
            paralizadas en Venezuela.
          </p>
          <div className="mt-auto flex flex-col gap-1.5 text-sm">
            <Link
              href="/mapa-del-olvido"
              className="inline-flex items-center gap-1 font-medium text-cyan-300 hover:underline"
            >
              <span>Explorar el mapa interactivo</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            </Link>
            <Link
              href="/mapa-del-olvido/obras"
              className="text-slate-400 transition-colors duration-150 hover:text-slate-200"
            >
              Ver catálogo completo de obras
            </Link>
          </div>
        </div>

        <Link
          href="/venezuela"
          className="group flex flex-col rounded-xl border border-white/[0.08] bg-slate-900/80 p-6 transition-colors duration-150 hover:border-rose-400/50"
        >
          <div className="mb-3 flex items-center gap-2">
            <Globe2 className="h-[18px] w-[18px] text-rose-400" strokeWidth={1.5} aria-hidden />
            <h2 className="text-xl font-semibold text-slate-100">Venezuela</h2>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-300">
            Crisis económica, salud, inseguridad, derechos humanos y
            comparativas antes/después con datos del Banco Mundial.
          </p>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-rose-300 group-hover:underline">
            <span>Ver dashboards</span>
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </span>
        </Link>

        <Link
          href="/datos-chile"
          className="group flex flex-col rounded-xl border border-white/[0.08] bg-slate-900/80 p-6 transition-colors duration-150 hover:border-cyan-400/50"
        >
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-[18px] w-[18px] text-orange-400" strokeWidth={1.5} aria-hidden />
            <h2 className="text-xl font-semibold text-slate-100">Datos Chile</h2>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-300">
            Dashboards sobre venezolanos en Chile: demografía, pensiones,
            tributario, regional.
          </p>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-cyan-300 group-hover:underline">
            <span>Ver dashboards</span>
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </span>
        </Link>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-100">
          Preguntas frecuentes
        </h2>
        <dl className="space-y-4">
          {HOME_FAQS.map((faq, idx) => (
            <Reveal key={faq.question} delay={DELAYS[idx % DELAYS.length]}>
            <div
              className="rounded-xl border border-white/[0.08] bg-slate-900/60 p-5"
            >
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
    </main>
  );
}
