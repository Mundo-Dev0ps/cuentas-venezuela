import Link from "next/link";
import { ArrowLeft, ExternalLink, AlertTriangle, Bitcoin } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import {
  JsonLd,
  breadcrumbsJsonLd,
  faqPageJsonLd,
} from "@/components/json-ld";
import { CASES, INDIVIDUALS, type SancionEstado } from "./data";

export const metadata = pageMetadata({
  title: "Corrupción y sanciones — Venezuela",
  description:
    "Casos documentados de corrupción de políticos venezolanos, individuos sancionados por EEUU/UE/Canadá/UK/Suiza y direcciones de criptomonedas reportadas en OFAC SDN. Toda entrada cita fuente oficial primaria.",
  path: "/venezuela/corrupcion",
});

// Curated data — daily ISR is more than enough.
export const revalidate = 3600;

const ESTADO_LABEL: Record<
  SancionEstado,
  { label: string; color: string }
> = {
  sanctioned: {
    label: "Sancionado",
    color: "border-amber-500/40 bg-amber-500/5 text-amber-300",
  },
  indicted: {
    label: "Acusado (indictment)",
    color: "border-orange-500/40 bg-orange-500/5 text-orange-300",
  },
  convicted: {
    label: "Condenado",
    color: "border-rose-500/40 bg-rose-500/5 text-rose-300",
  },
  "self-purge": {
    label: "Detenido por gobierno VE",
    color: "border-violet-500/40 bg-violet-500/5 text-violet-300",
  },
  extradited: {
    label: "Extraditado / liberado",
    color: "border-cyan-500/40 bg-cyan-500/5 text-cyan-300",
  },
  released: {
    label: "Liberado sin condena",
    color: "border-slate-500/40 bg-slate-500/5 text-slate-300",
  },
};

const FAQS = [
  {
    question:
      "¿Cuáles son los mayores casos de corrupción documentados de políticos venezolanos?",
    answer:
      "Entre los casos públicamente documentados con sentencia o indictment formal destacan: PDVSA-Crypto Conspiracy (USD 1.200M+, DOJ 2018-2023), Caso Andorra/Banca Privada d'Andorra (USD 4.200M, condenas firmes en Andorra), Alex Saab/CLAP (extraditado 2021, liberado 2023), Odebrecht Venezuela (USD 98M en sobornos confesados ante DOJ), y la 'operación anticorrupción' del propio régimen Maduro en 2023 (Aissami/Sunacrip).",
  },
  {
    question:
      "¿Existen direcciones de criptomonedas vinculadas a sancionados venezolanos?",
    answer:
      "Sí. La OFAC del Tesoro estadounidense publica direcciones de Bitcoin, Ether, USDT y otras monedas en su SDN List (Specially Designated Nationals) para varios sancionados venezolanos, notablemente Tareck El Aissami. Las direcciones son públicas y auditables on-chain; su inclusión en SDN prohíbe a personas estadounidenses transaccionar con ellas.",
  },
  {
    question:
      "¿Qué jurisdicciones tienen listas formales de sanciones contra venezolanos?",
    answer:
      "Estados Unidos (OFAC del Tesoro, programas VENEZUELA, VENEZUELA-EO13692, VENEZUELA-EO13850, VENEZUELA-EO13884), Unión Europea (CFSP), Canadá (Global Affairs), Reino Unido (HM Treasury OFSI), Suiza (SECO) y Panamá. OpenSanctions.org agrega todas estas listas en formato consultable.",
  },
  {
    question:
      "¿Por qué algunos casos no llegan a sentencia firme?",
    answer:
      "Las sanciones administrativas (OFAC, EU, UK) son procedimientos ejecutivos, no judiciales: bloquean activos sin requerir condena. Los procesos judiciales formales (indictments DOJ) requieren extradición para ir a juicio — la mayoría de funcionarios venezolanos no pueden ser detenidos físicamente. Los casos andorranos y el de Alex Saab son excepciones donde sí hubo proceso judicial.",
  },
  {
    question:
      "¿Esta lista es exhaustiva?",
    answer:
      "No. Esta es una selección curada de casos mayores con fuente oficial verificable. La lista completa de individuos venezolanos en OFAC SDN supera los 250 nombres a la fecha. Para datos exhaustivos consultar directamente OpenSanctions.org y los sitios oficiales de cada jurisdicción (treasury.gov/ofac, gov.uk/ofsi, ec.europa.eu/finance/sanctions, etc.).",
  },
];

export default function CorrupcionPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Venezuela", path: "/venezuela" },
          { name: "Corrupción", path: "/venezuela/corrupcion" },
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
        <p className="text-rose-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Sanciones · Corrupción · Cripto
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Corrupción y sanciones — Venezuela
        </h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Casos de corrupción de políticos y empresarios venezolanos con
          documentación oficial (indictments, sentencias, designaciones de
          sanciones). Cuando OFAC del Tesoro estadounidense publica direcciones
          de criptomonedas asociadas a un sancionado, se incluyen literalmente
          como aparecen en la SDN List.
        </p>
      </header>

      <aside className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
        <p className="flex gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            <strong>Importante.</strong> Sancionado administrativamente
            (OFAC/EU/UK/Canadá/Suiza) <em>no</em> equivale a condenado por una
            corte. Cada entrada indica su estado formal. Toda información
            proviene de fuentes oficiales públicas linkeadas; este sitio no
            emite juicio propio.
          </span>
        </p>
      </aside>

      {/* Cases */}
      <section className="mb-16 space-y-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Casos mayores documentados
        </h2>
        {CASES.map((c) => (
          <article
            key={c.id}
            id={c.id}
            className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-6"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="rounded-md bg-slate-800 px-2 py-0.5">
                {c.period}
              </span>
              {c.amount ? (
                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 font-mono text-amber-300">
                  {c.amount}
                </span>
              ) : null}
            </div>
            <h3 className="text-xl font-semibold text-slate-100">{c.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {c.summary}
            </p>
            <ul className="mt-4 space-y-1 text-sm text-slate-300">
              {c.facts.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-slate-500">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xs">
              <span className="text-slate-500">Estado: </span>
              <span className="text-slate-300">{c.status}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              {c.sources.map((s) => (
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
          </article>
        ))}
      </section>

      {/* Sanctioned individuals */}
      <section className="mb-16 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Individuos sancionados (selección)
        </h2>
        <p className="text-sm text-slate-400">
          Lista no exhaustiva. OFAC tiene más de 250 venezolanos en SDN.
          Para datos completos consulte{" "}
          <a
            className="text-cyan-300 hover:text-cyan-200"
            href="https://www.opensanctions.org/datasets/sanctions/"
            target="_blank"
            rel="noreferrer"
          >
            OpenSanctions
          </a>
          .
        </p>
        <div className="space-y-5">
          {INDIVIDUALS.map((p) => {
            const state = ESTADO_LABEL[p.estado];
            return (
              <article
                key={p.name}
                className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-100">
                    {p.name}
                  </h3>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${state.color}`}
                  >
                    {state.label}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{p.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {p.reason}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {p.jurisdictions.map((j) => (
                    <span
                      key={j}
                      className="rounded-md bg-slate-800 px-2 py-0.5 text-slate-300"
                    >
                      {j}
                    </span>
                  ))}
                </div>
                {p.wallets && p.wallets.length > 0 ? (
                  <div className="mt-4 rounded-md border border-orange-500/30 bg-orange-500/5 p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300">
                      <Bitcoin className="h-3.5 w-3.5" />
                      Direcciones de criptomonedas (OFAC SDN)
                    </div>
                    <ul className="space-y-1 text-xs">
                      {p.wallets.map((w) => (
                        <li
                          key={w.address}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-orange-200">
                            {w.type}
                          </span>
                          <code className="break-all font-mono text-slate-300">
                            {w.address}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {p.sources.map((s) => (
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
              </article>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
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
          Fuentes principales:{" "}
          <a
            className="text-cyan-300 hover:text-cyan-200"
            href="https://ofac.treasury.gov/specially-designated-nationals-list-data-formats-data-schemas"
            target="_blank"
            rel="noreferrer"
          >
            OFAC SDN List
          </a>
          {", "}
          <a
            className="text-cyan-300 hover:text-cyan-200"
            href="https://www.justice.gov/news"
            target="_blank"
            rel="noreferrer"
          >
            DOJ Press Releases
          </a>
          {", "}
          <a
            className="text-cyan-300 hover:text-cyan-200"
            href="https://www.opensanctions.org/"
            target="_blank"
            rel="noreferrer"
          >
            OpenSanctions
          </a>
          .
        </p>
        <p>
          Este es un catálogo curado a mano. Próxima iteración: ETL
          automatizado que sincroniza OFAC + OpenSanctions diariamente.
        </p>
      </footer>
    </main>
  );
}
