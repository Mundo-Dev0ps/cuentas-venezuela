import Link from "next/link";
import { ArrowLeft, ExternalLink, Scale, AlertTriangle } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbsJsonLd, faqPageJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { BLOCKS, TIMELINE, SANCIONES_FAQS, type Source } from "./data";

export const metadata = pageMetadata({
  title: "Sanciones, no bloqueo: los hechos sobre las sanciones a Venezuela",
  description:
    "Qué son y qué no son las sanciones a Venezuela: designaciones a personas (OFAC), sanción sectorial a PDVSA (2019), exenciones humanitarias para alimentos y medicinas, y la cronología del colapso previo a las sanciones. Cada afirmación citada.",
  path: "/venezuela/sanciones",
});

export const revalidate = 3600;

const DELAYS: Array<0 | 100 | 200 | 300 | 400> = [0, 100, 200, 300, 400];

const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];
function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function SourceLinks({ sources }: { sources: Source[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {sources.map((s) => (
        <a
          key={s.url}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md border border-cyan-500/40 bg-cyan-500/5 px-2 py-0.5 text-[11px] text-cyan-200 hover:bg-cyan-500/10"
        >
          {s.label}
          <ExternalLink className="h-3 w-3" />
        </a>
      ))}
    </div>
  );
}

export default function SancionesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Venezuela", path: "/venezuela" },
          { name: "Sanciones", path: "/venezuela/sanciones" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(SANCIONES_FAQS)} />

      <Link
        href="/venezuela"
        className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 text-sm mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Venezuela
      </Link>

      <header className="mb-8">
        <p className="text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Scale className="h-3.5 w-3.5" />
          Verificación
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Sanciones, no bloqueo: los hechos
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Qué son y qué no son las sanciones a Venezuela. Cada afirmación de esta
          página se contrasta con fuentes primarias (OFAC, Departamento del
          Tesoro y de Estado, informes del Congreso de EE. UU.).
        </p>
      </header>

      <aside className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
        <p className="flex gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            <strong>Registro factual.</strong> La página documenta qué son las
            sanciones, qué excluyen y la secuencia temporal, con fuentes. No
            zanja el debate sobre su efecto neto en la economía, sobre el que
            distintas fuentes discrepan.
          </span>
        </p>
      </aside>

      {/* Bloques: lo que se dice ↔ los hechos */}
      <section className="space-y-4">
        {BLOCKS.map((b, idx) => (
          <Reveal key={b.id} delay={DELAYS[idx % DELAYS.length]}>
            <div className="overflow-hidden rounded-xl border border-slate-700/40 bg-slate-900/50">
              <p className="border-l-4 border-rose-500/60 bg-rose-500/5 px-4 py-3 text-sm italic text-rose-200">
                {b.claim}
              </p>
              <div className="border-l-4 border-emerald-500/60 px-4 py-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                  Los hechos
                </p>
                <p className="text-sm leading-relaxed text-slate-300">{b.fact}</p>
                <SourceLinks sources={b.sources} />
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Cronología */}
      <section className="mt-14">
        <h2 className="mb-2 text-2xl font-bold tracking-tight">
          Cronología: el colapso empezó antes
        </h2>
        <p className="mb-5 text-sm text-slate-400">
          Las sanciones petroleras (enero de 2019) llegaron cuando la economía ya
          se había derrumbado y la hiperinflación llevaba más de un año.
        </p>
        <ol className="relative space-y-6 border-l border-slate-700/40 pl-6">
          {TIMELINE.map((it) => (
            <li key={it.date} className="relative">
              <span className="absolute -left-[31px] top-1 grid h-4 w-4 place-items-center rounded-full border border-cyan-500/60 bg-slate-950">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </span>
              <time className="font-mono text-xs text-slate-400">
                {fmtDate(it.date)}
              </time>
              <p className="mt-0.5 font-semibold text-slate-100">{it.label}</p>
              {it.note && (
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  {it.note}
                </p>
              )}
              <SourceLinks sources={it.sources} />
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-16 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight">Preguntas frecuentes</h2>
        <dl className="space-y-4">
          {SANCIONES_FAQS.map((faq, idx) => (
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
          Fuentes principales: Oficina de Control de Activos Extranjeros (OFAC) y
          Departamento del Tesoro de EE. UU., Departamento de Estado, Servicio de
          Investigación del Congreso (CRS), Banco Mundial. Cada bloque enlaza sus
          fuentes.
        </p>
        <p>
          Relacionado:{" "}
          <Link href="/venezuela/corrupcion" className="text-cyan-300 hover:text-cyan-200">
            individuos sancionados (OFAC/UE/UK)
          </Link>
          .
        </p>
      </footer>
    </main>
  );
}
