import Link from "next/link";
import { ArrowLeft, ExternalLink, AlertTriangle } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import {
  JsonLd,
  breadcrumbsJsonLd,
  faqPageJsonLd,
} from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { EVENTS, KIND_LABEL } from "./data";

export const metadata = pageMetadata({
  title: "Controversia del Esequibo: Venezuela y Guyana",
  description:
    "Cronología factual de la disputa territorial por el Esequibo (Guayana Esequiba) entre Venezuela y Guyana: Laudo de París 1899, Acuerdo de Ginebra 1966, caso ante la CIJ, referendo 2023, Acuerdo de Argyle y creación del estado Guayana Esequiba. Cada hecho citado a su fuente.",
  path: "/venezuela/esequibo",
});

export const revalidate = 3600;

const DELAYS: Array<0 | 100 | 200 | 300 | 400> = [0, 100, 200, 300, 400];

const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function formatDate(iso: string, precision: "day" | "month" | "year"): string {
  const d = new Date(iso + "T00:00:00Z");
  if (precision === "year") return String(d.getUTCFullYear());
  if (precision === "month") {
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  }
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const FAQS = [
  {
    question: "¿Qué es la controversia del Esequibo?",
    answer:
      "Es la disputa territorial entre Venezuela y Guyana por la región del Esequibo (Guayana Esequiba), unos 160.000 km² al oeste del río Esequibo. Venezuela reclama el territorio alegando la nulidad del Laudo Arbitral de París de 1899; Guyana sostiene que ese laudo fijó la frontera de forma definitiva y administra el territorio.",
  },
  {
    question: "¿Qué dijo la Corte Internacional de Justicia sobre el Esequibo?",
    answer:
      "Guyana llevó el caso a la Corte Internacional de Justicia (CIJ) en 2018 para que confirmara la validez del Laudo de 1899. En diciembre de 2023, ante el referendo venezolano, la CIJ dictó medidas provisionales pidiendo a Venezuela abstenerse de alterar la situación de administración de Guyana. Venezuela rechaza la jurisdicción de la Corte y ha declarado que no acatará su fallo.",
  },
  {
    question: "¿Qué fue el referendo del Esequibo de diciembre de 2023?",
    answer:
      "Un referendo consultivo no vinculante celebrado el 3 de diciembre de 2023 en Venezuela. El gobierno reportó un 95% de votos a favor de sus posturas, incluida la creación de un estado venezolano sobre el territorio; la participación real fue disputada. Días después, Maduro e Irfaan Ali firmaron la Declaración de Argyle comprometiéndose a no usar la fuerza.",
  },
  {
    question: "¿Qué es el estado Guayana Esequiba?",
    answer:
      "En 2024 la Asamblea Nacional de Venezuela aprobó una ley que crea el estado Guayana Esequiba sobre el territorio en disputa y ordena incorporarlo al mapa oficial. En 2025 Venezuela celebró por primera vez una elección de gobernador y legisladores para ese estado, pese a no ejercer control efectivo sobre el territorio, que sigue administrado por Guyana.",
  },
];

export default function EsequiboPage() {
  const sorted = [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Venezuela", path: "/venezuela" },
          { name: "Esequibo", path: "/venezuela/esequibo" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(FAQS)} />

      <Link
        href="/venezuela"
        className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 text-sm mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Venezuela
      </Link>

      <header className="mb-10">
        <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Controversia territorial · 1899–2025
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          El Esequibo: Venezuela y Guyana
        </h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Cronología factual de la disputa por la Guayana Esequiba (~160.000
          km²): del Laudo de París de 1899 al caso ante la Corte Internacional
          de Justicia, el referendo de 2023 y la creación del estado Guayana
          Esequiba. Cada hecho cita su fuente.
        </p>
      </header>

      <aside className="mb-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
        <p className="flex gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            <strong>Importante.</strong> Cronología factual sin opinión
            editorial. La reclamación territorial está disputada por ambos
            Estados; las entradas registran actos y fallos, no un veredicto
            sobre el fondo del reclamo.
          </span>
        </p>
      </aside>

      <ol className="relative space-y-8 border-l border-slate-700/40 pl-6">
        {sorted.map((ev, idx) => {
          const kind = KIND_LABEL[ev.kind];
          return (
            <Reveal key={ev.id} delay={DELAYS[idx % DELAYS.length]}>
              <li
                id={ev.id}
                className="relative scroll-mt-24 rounded-xl border border-slate-700/40 bg-slate-900/50 p-5"
              >
                <span className="absolute -left-[34px] top-5 grid h-4 w-4 place-items-center rounded-full border border-cyan-500/60 bg-slate-950">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                </span>
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <time dateTime={ev.date} className="font-mono text-slate-400">
                    {formatDate(ev.date, ev.precision)}
                  </time>
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${kind.color}`}
                  >
                    {kind.label}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-slate-100">
                  {ev.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {ev.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {ev.sources.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-cyan-500/40 bg-cyan-500/5 px-2.5 py-1 text-cyan-200 hover:bg-cyan-500/10"
                    >
                      {s.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </li>
            </Reveal>
          );
        })}
      </ol>

      <section className="mt-16 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight">
          Preguntas frecuentes
        </h2>
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
          Fuentes principales: Acuerdo de Ginebra (1966), Corte Internacional de
          Justicia (CIJ), CNN en Español, Infobae, Bloomberg Línea, Voz de
          América, Instituto de Relaciones Internacionales (IRI).
        </p>
      </footer>
    </main>
  );
}
