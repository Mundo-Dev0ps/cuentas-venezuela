import Link from "next/link";
import { ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbsJsonLd, faqPageJsonLd } from "@/components/json-ld";
import { RankingList } from "./ranking-list";
import {
  FIGURES,
  unfulfilledCount,
  officeCount,
  rankFigures,
  REPLICA_EMAIL,
} from "./data";

export const metadata = pageMetadata({
  title: "Puerta giratoria: cargos que rotan, promesas que no se cumplen",
  description:
    "Registro factual y citado de funcionarios venezolanos que rotaron por múltiples cargos públicos y dejaron promesas o mandatos sin cumplimiento documentado. Ordenado por número de promesas incumplidas. Cada afirmación con fuente.",
  path: "/venezuela/puerta-giratoria",
});

export const revalidate = 3600;

const FAQS = [
  {
    question: "¿Qué es la puerta giratoria?",
    answer:
      "Funcionarios que rotan de un cargo público a otro durante años, dejando promesas sin cumplir. Aquí se documentan con fuentes.",
  },
  {
    question: "¿Cómo se ordena el ranking?",
    answer:
      "Por número de promesas incumplidas; si hay empate, por cantidad de cargos. Es un conteo de hechos citados, no una opinión.",
  },
  {
    question: "¿Es una acusación de corrupción?",
    answer:
      "No. Solo hechos con fuente: cargos ocupados y promesas con su estado. Sin juicios propios. Si hay versiones distintas, se marca 'en disputa'.",
  },
  {
    question: "¿Cómo corrijo un dato o pido réplica?",
    answer: `Escribe a ${REPLICA_EMAIL}. Corregimos lo que esté documentado y publicamos las réplicas.`,
  },
];

export default function PuertaGiratoriaPage() {
  const ranked = rankFigures(FIGURES);
  const totalUnmet = FIGURES.reduce((n, f) => n + unfulfilledCount(f), 0);
  const totalOffices = FIGURES.reduce((n, f) => n + officeCount(f), 0);

  const STATS = [
    { value: FIGURES.length, label: "Figuras documentadas", color: "text-slate-100" },
    { value: totalOffices, label: "Cargos públicos sumados", color: "text-cyan-300" },
    { value: totalUnmet, label: "Promesas sin cumplir", color: "text-rose-300" },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Venezuela", path: "/venezuela" },
          { name: "Puerta giratoria", path: "/venezuela/puerta-giratoria" },
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

      <header className="mb-8">
        <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Rendición de cuentas
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Puerta giratoria: cargos que rotan, promesas que no se cumplen
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Funcionarios que saltan de un cargo a otro dejando promesas sin
          cumplir. Ordenados por promesas incumplidas. Cada dato con su fuente.
        </p>
      </header>

      <section className="mb-8 grid grid-cols-3 gap-3" aria-label="Resumen">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-4 text-center"
          >
            <p className={`text-2xl font-bold sm:text-3xl ${s.color}`}>
              {s.value}
            </p>
            <p className="mt-1 text-[11px] leading-tight text-slate-500 sm:text-xs">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      <aside className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
        <p className="flex gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            <strong>Registro factual, no opinión.</strong> Solo hechos con
            fuente: cargos y promesas con su estado. Correcciones o réplica:{" "}
            <a
              href={`mailto:${REPLICA_EMAIL}`}
              className="underline hover:text-amber-100"
            >
              {REPLICA_EMAIL}
            </a>
            .
          </span>
        </p>
      </aside>

      <section className="mb-12" aria-label="Ranking de figuras">
        <RankingList figures={ranked} />
      </section>

      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight">
          Preguntas frecuentes
        </h2>
        <dl className="space-y-4">
          {FAQS.map((faq) => (
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

      <footer className="mt-10 border-t border-slate-700/40 pt-6 text-xs text-slate-500 space-y-2">
        <p>
          Fuentes principales: Poderopedia Venezuela, Transparencia Venezuela,
          Runrun.es, Efecto Cocuyo, El Estímulo, TalCual, Convoca, OFAC. Cada
          entrada enlaza sus fuentes.
        </p>
        <p>
          Datos de actualización manual. Correcciones y derecho a réplica:{" "}
          <a
            href={`mailto:${REPLICA_EMAIL}`}
            className="text-cyan-300 hover:text-cyan-200"
          >
            {REPLICA_EMAIL}
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
