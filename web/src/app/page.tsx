import Link from "next/link";
import { Map, BarChart3, Globe2 } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, faqPageJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";

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
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-16">
      <JsonLd data={faqPageJsonLd(HOME_FAQS)} />
      <section className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Cuentas Venezuela
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Datos abiertos sobre obras públicas en Venezuela y la migración
          venezolana en Chile. Auditables, comparables y citados desde fuentes
          oficiales.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/mapa-del-olvido"
            className="inline-flex min-h-11 items-center gap-1 rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Explorar el Mapa →
          </Link>
          <Link
            href="/datos-chile/dashboards"
            className="inline-flex min-h-11 items-center gap-1 rounded-md border border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
          >
            Ver dashboards →
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="group relative flex flex-col rounded-xl border border-slate-700/40 border-l-[3px] border-l-cyan-400 bg-slate-900/80 p-8 transition hover:border-cyan-400/60 hover:shadow-lg">
          <span className="absolute right-4 top-4 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-300">
            Destacado
          </span>
          <div className="mb-3 flex items-center gap-2">
            <Map className="h-5 w-5 text-orange-400" />
            <h2 className="text-2xl font-semibold">Mapa del Olvido</h2>
          </div>
          <p className="mb-4 text-slate-300">
            Mapa interactivo de obras públicas inauguradas, abandonadas o
            paralizadas en Venezuela.
          </p>
          <div className="flex flex-col gap-1 text-sm">
            <Link
              href="/mapa-del-olvido"
              className="font-medium text-cyan-300 hover:underline"
            >
              Explorar el mapa interactivo →
            </Link>
            <Link
              href="/mapa-del-olvido/obras"
              className="text-slate-400 hover:text-slate-200"
            >
              · Ver catálogo completo de obras
            </Link>
          </div>
        </div>

        <Link
          href="/venezuela"
          className="group rounded-xl border border-slate-700/40 bg-slate-900/80 p-8 transition hover:border-rose-400/60 hover:shadow-lg"
        >
          <div className="mb-3 flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-rose-400" />
            <h2 className="text-2xl font-semibold">Venezuela</h2>
          </div>
          <p className="mb-4 text-slate-300">
            Crisis económica, salud, inseguridad, derechos humanos y
            comparativas antes/después con datos del Banco Mundial.
          </p>
          <span className="text-sm font-medium text-rose-300 group-hover:underline">
            Ver dashboards →
          </span>
        </Link>

        <Link
          href="/datos-chile"
          className="group rounded-xl border border-slate-700/40 bg-slate-900/80 p-8 transition hover:border-cyan-400/60 hover:shadow-lg"
        >
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-400" />
            <h2 className="text-2xl font-semibold">Datos Chile</h2>
          </div>
          <p className="mb-4 text-slate-300">
            Dashboards sobre venezolanos en Chile: demografía, pensiones,
            tributario, regional.
          </p>
          <span className="text-sm font-medium text-cyan-300 group-hover:underline">
            Ver dashboards →
          </span>
        </Link>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Preguntas frecuentes
        </h2>
        <dl className="space-y-5">
          {HOME_FAQS.map((faq, idx) => (
            <Reveal key={faq.question} delay={DELAYS[idx % DELAYS.length]}>
            <div
              className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-5"
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
    </div>
  );
}
