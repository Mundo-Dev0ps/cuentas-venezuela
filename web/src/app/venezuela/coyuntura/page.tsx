import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  Users,
  TrendingUp,
  DollarSign,
  Fuel,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import {
  JsonLd,
  breadcrumbsJsonLd,
  faqPageJsonLd,
  datasetJsonLd,
} from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import {
  POLITICAL_PRISONERS,
  PRISONERS_HISTORIC_TOTAL,
  PRISONERS_SOURCE,
  INFLATION_2025,
  INFLATION_2025_YTD,
  INFLATION_SOURCE,
  EXCHANGE_RATE,
  OIL_PRODUCTION,
  OIL_CONTEXT,
  OIL_SOURCES,
  type Source,
} from "./data";

export const metadata = pageMetadata({
  title: "Venezuela 2025-2026: coyuntura reciente",
  description:
    "Indicadores recientes de Venezuela: presos políticos (Foro Penal), inflación mensual 2025 (OVF), tipo de cambio BCV vs paralelo y producción petrolera. Cada cifra fechada y citada a su fuente primaria.",
  path: "/venezuela/coyuntura",
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

function fmtMonth(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function SourceLinks({ sources }: { sources: Source[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
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

const FAQS = [
  {
    question: "¿Cuántos presos políticos hay en Venezuela en 2026?",
    answer:
      "Según Foro Penal, al 3 de junio de 2026 había 404 presos políticos en Venezuela: 369 hombres y 35 mujeres, 225 civiles y 179 militares, de los cuales 167 estaban condenados y 237 esperaban sentencia. La cifra cayó desde un pico superior a 2.400 detenidos tras la elección del 28 de julio de 2024, en el marco del proceso de excarcelaciones iniciado el 8 de enero de 2026. Foro Penal ha registrado más de 19.000 detenciones con fines políticos desde 2014.",
  },
  {
    question: "¿Cuál fue la inflación de Venezuela en 2025?",
    answer:
      "Según el Observatorio Venezolano de Finanzas (OVF), la inflación mensual en 2025 fue: enero 7,9%, febrero 12,8%, marzo 13,1%, abril 18,4% y mayo 26%. La inflación acumulada en los primeros cinco meses de 2025 alcanzó 105,5% y la variación interanual a mayo se ubicó en 229%. El BCV dejó de publicar el IPC con regularidad, por lo que el OVF es la medición independiente más citada.",
  },
  {
    question: "¿A cuánto está el dólar en Venezuela (BCV y paralelo)?",
    answer:
      "Al 3 de junio de 2026, la tasa oficial del BCV era de 557,97 bolívares por dólar y la tasa paralela (Binance P2P) rondaba los 726,5 bolívares, una brecha cercana al 30%. Es un valor de referencia puntual: el tipo de cambio se mueve a diario.",
  },
  {
    question: "¿Cuánto petróleo produce Venezuela?",
    answer:
      "Según fuentes secundarias de la OPEP, Venezuela produjo unos 934.000 barriles diarios en noviembre de 2025; las estimaciones de cierre de 2025 van de ~800.000 a ~1,1 millones de bpd según la fuente. Goldman Sachs proyecta producción estable en ~900.000 bpd para 2026, con potencial de hasta 1,2 millones de bpd si se levantan las sanciones de EE. UU. Chevron opera mediante empresas mixtas con PDVSA.",
  },
];

export default function CoyunturaPage() {
  const latestPrisoners = POLITICAL_PRISONERS[POLITICAL_PRISONERS.length - 1];
  const maxInflation = Math.max(...INFLATION_2025.map((p) => p.monthlyPct));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Venezuela", path: "/venezuela" },
          { name: "Coyuntura 2025-2026", path: "/venezuela/coyuntura" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(FAQS)} />
      <JsonLd
        data={datasetJsonLd({
          name: "Venezuela — coyuntura reciente 2025-2026",
          description:
            "Indicadores recientes de Venezuela: presos políticos (Foro Penal), inflación mensual 2025 (OVF), tipo de cambio BCV vs paralelo y producción petrolera, fechados y citados.",
          path: "/venezuela/coyuntura",
          keywords: [
            "presos políticos Venezuela",
            "inflación Venezuela 2025",
            "dólar BCV paralelo",
            "producción petrolera Venezuela",
            "Foro Penal",
            "OVF",
          ],
          temporalCoverage: "2024/2026",
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

      <header className="mb-10">
        <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Coyuntura · 2025–2026
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Venezuela hoy: indicadores recientes
        </h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Datos de alta frecuencia que el Banco Mundial aún no recoge (su serie
          tiene ~1 año de rezago): presos políticos, inflación mensual, tipo de
          cambio y producción petrolera. Cada cifra está fechada y citada a su
          fuente primaria.
        </p>
      </header>

      <aside className="mb-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
        <p className="flex gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            <strong>Datos de actualización manual.</strong> Estos indicadores se
            mueven semanal o mensualmente y no tienen una API pública. Se
            actualizan a mano desde la fuente. Última revisión: 8 de junio de
            2026. Cada bloque indica la fecha exacta del dato.
          </span>
        </p>
      </aside>

      {/* ── Presos políticos ── */}
      <Reveal delay={0}>
        <section id="presos-politicos" className="mb-14 scroll-mt-24">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-rose-400" />
            <h2 className="text-2xl font-bold tracking-tight">
              Presos políticos
            </h2>
          </div>
          <p className="text-sm text-slate-400 mb-5">
            Balances periódicos de Foro Penal. La cifra alcanzó su pico tras la
            elección del 28 de julio de 2024 y descendió en 2026 con las
            excarcelaciones del proceso de amnistía. Foro Penal mantiene el
            registro más exhaustivo desde 2002 ({PRISONERS_HISTORIC_TOTAL.toLocaleString("es")}{" "}
            detenciones políticas documentadas desde 2014).
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-700/40">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium text-right">Presos</th>
                  <th className="px-4 py-3 font-medium">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {POLITICAL_PRISONERS.map((p) => (
                  <tr key={p.date} className="align-top">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-300">
                      {fmtDate(p.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-lg font-bold text-slate-100">
                      {p.count.toLocaleString("es")}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {p.note}
                      <SourceLinks sources={p.sources} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Fuente:{" "}
            <a
              href={PRISONERS_SOURCE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:underline"
            >
              {PRISONERS_SOURCE.label}
            </a>
            .
          </p>
        </section>
      </Reveal>

      {/* ── Inflación ── */}
      <Reveal delay={100}>
        <section id="inflacion" className="mb-14 scroll-mt-24">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-amber-400" />
            <h2 className="text-2xl font-bold tracking-tight">
              Inflación mensual 2025
            </h2>
          </div>
          <p className="text-sm text-slate-400 mb-5">
            Variación mensual del IPC según el OVF. El BCV dejó de publicar el
            IPC con regularidad. Acumulada enero–mayo 2025:{" "}
            <strong className="text-slate-200">{INFLATION_2025_YTD}%</strong>.
          </p>
          <div className="space-y-2">
            {INFLATION_2025.map((p) => (
              <div key={p.month} className="flex items-center gap-3">
                <span className="w-20 shrink-0 font-mono text-xs text-slate-400">
                  {fmtMonth(p.month)}
                </span>
                <div className="h-6 flex-1 overflow-hidden rounded bg-slate-800/60">
                  <div
                    className="flex h-full items-center justify-end rounded bg-gradient-to-r from-amber-500/60 to-rose-500/70 px-2 text-[11px] font-semibold text-slate-950"
                    style={{ width: `${(p.monthlyPct / maxInflation) * 100}%` }}
                  >
                    {p.monthlyPct}%
                  </div>
                </div>
                {p.interannualPct != null && (
                  <span className="w-28 shrink-0 text-right text-xs text-slate-500">
                    interanual {p.interannualPct}%
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Fuente:{" "}
            <a
              href={INFLATION_SOURCE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:underline"
            >
              {INFLATION_SOURCE.label}
            </a>
            . Detalle por mes en los enlaces de cada cifra arriba.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {INFLATION_2025.flatMap((p) => p.sources).map((s) => (
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
        </section>
      </Reveal>

      {/* ── Tipo de cambio ── */}
      <Reveal delay={200}>
        <section id="tipo-de-cambio" className="mb-14 scroll-mt-24">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            <h2 className="text-2xl font-bold tracking-tight">Tipo de cambio</h2>
          </div>
          <p className="text-sm text-slate-400 mb-5">
            Bolívares por dólar al {fmtDate(EXCHANGE_RATE.date)}. La brecha entre
            la tasa oficial y la paralela refleja la presión en el mercado
            cambiario. Valor de referencia puntual: cambia a diario.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Oficial BCV
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-100">
                Bs {EXCHANGE_RATE.bcv.toLocaleString("es")}
              </p>
            </div>
            <div className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Paralelo (Binance)
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-100">
                {EXCHANGE_RATE.parallel
                  ? `Bs ${EXCHANGE_RATE.parallel.toLocaleString("es")}`
                  : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Brecha
              </p>
              <p className="mt-1 text-2xl font-bold text-rose-300">
                {EXCHANGE_RATE.parallel
                  ? `${Math.round(((EXCHANGE_RATE.parallel - EXCHANGE_RATE.bcv) / EXCHANGE_RATE.bcv) * 100)}%`
                  : "—"}
              </p>
            </div>
          </div>
          <SourceLinks sources={EXCHANGE_RATE.sources} />
        </section>
      </Reveal>

      {/* ── Producción petrolera ── */}
      <Reveal delay={300}>
        <section id="petroleo" className="mb-14 scroll-mt-24">
          <div className="flex items-center gap-2 mb-3">
            <Fuel className="h-5 w-5 text-cyan-400" />
            <h2 className="text-2xl font-bold tracking-tight">
              Producción petrolera
            </h2>
          </div>
          <p className="text-sm text-slate-400 mb-5">
            Producción de crudo en miles de barriles diarios (kbpd). Las cifras
            varían por fuente y metodología (OPEP fuentes secundarias vs
            estimaciones de analistas), por lo que se indican rangos.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-700/40">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Período</th>
                  <th className="px-4 py-3 font-medium text-right">kbpd</th>
                  <th className="px-4 py-3 font-medium">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {OIL_PRODUCTION.map((o) => (
                  <tr key={o.period} className="align-top">
                    <td className="px-4 py-3 text-slate-300">{o.period}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-lg font-bold text-slate-100">
                      {o.kbpd.toLocaleString("es")}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {o.note}
                      <SourceLinks sources={o.sources} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            {OIL_CONTEXT}
          </p>
          <SourceLinks sources={OIL_SOURCES} />
        </section>
      </Reveal>

      {/* ── FAQ ── */}
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
          Fuentes principales: Foro Penal, Observatorio Venezolano de Finanzas
          (OVF), Banco Central de Venezuela (BCV), OPEP / U.S. Energy
          Information Administration (EIA), Council on Foreign Relations (CFR).
        </p>
        <p>
          Indicador más reciente al 3 de junio de 2026:{" "}
          {latestPrisoners.count} presos políticos.
        </p>
      </footer>
    </main>
  );
}
