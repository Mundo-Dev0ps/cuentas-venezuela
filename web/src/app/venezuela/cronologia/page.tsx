import Link from "next/link";
import { ArrowLeft, ExternalLink, AlertTriangle } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import {
  JsonLd,
  breadcrumbsJsonLd,
  faqPageJsonLd,
} from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { getVDem } from "@/lib/api";
import { VdemTrendChart } from "@/components/vdem-trend-chart";
import { EVENTS, CATEGORY_LABEL } from "./data";

export const metadata = pageMetadata({
  title: "Cronología del quiebre democrático en Venezuela",
  description:
    "Registro factual de eventos clave en el deterioro de las instituciones republicanas y garantías democráticas en Venezuela entre 1999 y 2024. Cada entrada cita fuente oficial primaria (CIDH, ONU, OEA, HRW, CNE, TSJ).",
  path: "/venezuela/cronologia",
});

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuentasvenezuela.org";

const DELAYS: Array<0 | 100 | 200 | 300 | 400> = [0, 100, 200, 300, 400];

const FAQS = [
  {
    question:
      "¿Cuándo empezó el quiebre democrático en Venezuela?",
    answer:
      "No existe una fecha única. El deterioro es gradual y se inicia con la reforma constitucional de 1999. Los puntos de inflección documentados internacionalmente incluyen: la ampliación del TSJ en 2004, la Lista Tascón (discriminación política), el cierre de RCTV en 2007, la reelección indefinida en 2009, el bloqueo del referendo revocatorio en 2016, la imposición de la ANC en 2017, las elecciones presidenciales sin oposición real en 2018, y la disputada elección de julio 2024.",
  },
  {
    question:
      "¿Cuántos presos políticos hay en Venezuela?",
    answer:
      "Según Foro Penal — la ONG venezolana que mantiene el registro más exhaustivo desde 2002 — el número fluctúa de manera correlacionada con eventos electorales y protestas. En agosto de 2024 superó los 2.000 detenidos vinculados a la represión postelectoral. El registro histórico incluye más de 18.000 detenciones políticas documentadas desde 2014.",
  },
  {
    question:
      "¿Qué organismos internacionales han documentado el deterioro institucional?",
    answer:
      "La Misión Internacional Independiente de Determinación de los Hechos (FFM) de la ONU, la Comisión Interamericana de Derechos Humanos (CIDH), la Oficina del Alto Comisionado de Derechos Humanos de la ONU, la Corte Penal Internacional (con investigación formal abierta desde 2021), la OEA con la invocación de la Carta Democrática en 2016, el Parlamento Europeo, Human Rights Watch y Amnistía Internacional. Todos han publicado informes formales documentando violaciones específicas.",
  },
  {
    question:
      "¿Qué pasó en la elección presidencial de julio 2024?",
    answer:
      "El CNE proclamó a Maduro ganador con 51.2% el 29 de julio de 2024, sin publicar las actas de votación pese a estar obligado por ley. La oposición publicó el 73% de las actas obtenidas por sus testigos de mesa, mostrando un resultado de 67% para Edmundo González vs 30% para Maduro. El Centro Carter — invitado como observador — concluyó que la elección 'no puede ser considerada democrática'. Estados Unidos, Argentina, Costa Rica, Ecuador, Guatemala, Panamá, Paraguay, Perú, República Dominicana y Uruguay reconocieron a González como ganador.",
  },
  {
    question:
      "¿El Índice de Democracia Liberal de V-Dem refleja este deterioro?",
    answer:
      "Sí. El Liberal Democracy Index (V-Dem) de Venezuela cae de aproximadamente 0.6 en 1998 a menos de 0.1 en 2024, una de las caídas más pronunciadas en el dataset V-Dem para América Latina en el período. La métrica considera elecciones libres y justas, libertades civiles, controles judiciales al Ejecutivo e igualdad ante la ley.",
  },
];

function formatDate(iso: string, precision: "day" | "month" | "year"): string {
  const d = new Date(iso + "T00:00:00Z");
  if (precision === "year") return String(d.getUTCFullYear());
  const months = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  if (precision === "month") {
    return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  }
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function eventJsonLd(ev: (typeof EVENTS)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    startDate: ev.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: ev.description,
    location: {
      "@type": "Country",
      name: "Venezuela",
    },
    url: `${SITE_URL}/venezuela/cronologia#${ev.id}`,
    ...(ev.sources[0]?.url ? { sameAs: ev.sources.map((s) => s.url) } : {}),
    isPartOf: {
      "@type": "WebSite",
      name: "Cuentas Venezuela",
      url: SITE_URL,
    },
  };
}

export default async function CronologiaPage() {
  // Sort once at render — EVENTS is already chronological but defensive.
  const sorted = [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));

  // V-Dem trend — Venezuela vs Chile/Uruguay comparison. Falls back to
  // an empty array if the ETL has not populated the table yet, in which
  // case the chart component renders an explanatory placeholder.
  const vdemRows = await getVDem({
    countries: ["VEN", "CHL", "URY"],
    indicators: ["v2x_libdem", "v2x_polyarchy"],
    from: 1998,
    to: 2024,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Venezuela", path: "/venezuela" },
          { name: "Cronología", path: "/venezuela/cronologia" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(FAQS)} />
      {sorted.map((ev) => (
        <JsonLd key={`jsonld-${ev.id}`} data={eventJsonLd(ev)} />
      ))}

      <Link
        href="/venezuela"
        className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 text-sm mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Venezuela
      </Link>

      <header className="mb-10">
        <p className="text-rose-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Cronología · 1999–2024
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Quiebre democrático en Venezuela
        </h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Registro factual de eventos en el deterioro de las instituciones
          republicanas y garantías democráticas. Cada entrada cita su fuente
          oficial primaria: CIDH, ONU FFM, OEA, HRW, Foro Penal, CNE, TSJ,
          Centro Carter.
        </p>
      </header>

      <aside className="mb-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
        <p className="flex gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            <strong>Importante.</strong> Cronología factual sin opinión
            editorial. Categoría y fecha cargan el análisis; la descripción
            recuenta el hecho citado a la fuente. Donde un hecho está
            disputado, ambas versiones aparecen con sus fuentes.
          </span>
        </p>
      </aside>

      {/* V-Dem trend chart — Liberal Democracy Index */}
      <section className="mb-16 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Índice de Democracia Liberal — Venezuela vs Chile y Uruguay
        </h2>
        <p className="text-sm text-slate-400">
          V-Dem mide la calidad democrática en una escala 0–1 considerando
          elecciones libres, libertades civiles, separación de poderes e
          igualdad ante la ley. Venezuela cae de ~0.6 a menos de 0.1 en el
          período. Fuente: V-Dem Institute, dataset v14 (CC BY 4.0), agregado
          por Our World in Data.
        </p>
        <VdemTrendChart rows={vdemRows} />
      </section>

      {/* Timeline */}
      <section className="mb-12 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Eventos documentados
        </h2>
        <p className="text-sm text-slate-400">
          {sorted.length} eventos · ordenados cronológicamente.
        </p>
      </section>

      <ol className="relative space-y-8 border-l border-slate-700/40 pl-6">
        {sorted.map((ev, idx) => {
          const cat = CATEGORY_LABEL[ev.category];
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
                  <time
                    dateTime={ev.date}
                    className="font-mono text-slate-400"
                  >
                    {formatDate(ev.date, ev.precision)}
                  </time>
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${cat.color}`}
                  >
                    {cat.label}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-100">
                  {ev.title}
                </h3>
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

      {/* FAQ */}
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
          Fuentes principales: CIDH, ONU FFM Venezuela, OEA, Human Rights
          Watch, Amnistía Internacional, Foro Penal, Centro Carter, CNE, TSJ,
          V-Dem Institute (Universidad de Gotemburgo).
        </p>
      </footer>
    </main>
  );
}
