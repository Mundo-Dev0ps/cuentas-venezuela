import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  Activity,
  MapPin,
  Building2,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import {
  JsonLd,
  breadcrumbsJsonLd,
  faqPageJsonLd,
  datasetJsonLd,
  newsArticleJsonLd,
} from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { StatesExplorer } from "./states-explorer";
import {
  SEISMIC_EVENTS,
  DAMAGE,
  AFFECTED_STATES,
  ECONOMIC_DAMAGE,
  SISMO_FAQS,
  fmtNum,
  type Source,
  type SeismicEvent,
} from "./data";

export const metadata = pageMetadata({
  title: "Terremoto Venezuela 2026: muertos, daños y estados afectados",
  description:
    "Datos del doble sismo Mw 7,5 y 7,2 del 24 de junio de 2026 en Venezuela: víctimas, desaparecidos, estados afectados, daño estructural y estimaciones económicas. Fuentes: USGS, OCHA, PNUD, PAHO.",
  path: "/venezuela/sismo-2026",
  type: "article",
});

export const revalidate = 3600;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuentasvenezuela.org";

const DELAYS: Array<0 | 100 | 200 | 300 | 400> = [0, 100, 200, 300, 400];

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return `${d.getUTCDate()} de ${MONTHS[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
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

function eventJsonLd(ev: SeismicEvent) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Terremoto Mw ${ev.magnitude} — ${ev.epicenter}`,
    startDate: ev.datetimeUtc,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: `Sismo de magnitud ${ev.magnitude} ${ev.scale} a ${ev.depthKm} km de profundidad, con epicentro en ${ev.epicenter}, el 24 de junio de 2026 en Venezuela.`,
    location: {
      "@type": "Place",
      name: ev.epicenter,
      geo: {
        "@type": "GeoCoordinates",
        latitude: ev.lat,
        longitude: ev.lon,
      },
    },
    url: `${SITE_URL}/venezuela/sismo-2026#${ev.id}`,
    sameAs: ev.sources.map((s) => s.url),
    isPartOf: {
      "@type": "WebSite",
      name: "Cuentas Venezuela",
      url: SITE_URL,
    },
  };
}

const KPIS = [
  {
    label: "Muertos",
    value: `${fmtNum(DAMAGE.dead)}+`,
    color: "border-rose-500/40 bg-rose-500/5 text-rose-300",
  },
  {
    label: "Heridos",
    value: `${fmtNum(DAMAGE.injured)}+`,
    color: "border-orange-500/40 bg-orange-500/5 text-orange-300",
  },
  {
    label: "Desplazados",
    value: `${fmtNum(DAMAGE.displaced)}+`,
    color: "border-amber-500/40 bg-amber-500/5 text-amber-300",
  },
  {
    label: "Magnitud máx.",
    value: `${Math.max(...SEISMIC_EVENTS.map((e) => e.magnitude))} Mw`,
    color: "border-slate-600/50 bg-slate-800/40 text-slate-200",
  },
];

const DAMAGE_FACTS = [
  `Edificios colapsados por completo (conteo oficial): ${fmtNum(DAMAGE.buildingsCollapsedOfficial)}.`,
  `Edificios dañados o destruidos (análisis satelital, NASA): ~${fmtNum(DAMAGE.buildingsDamagedSatellite)}.`,
  `Infraestructuras afectadas en total (conteo humanitario OCHA): ${fmtNum(DAMAGE.infrastructureAffected)}, incluidos ${DAMAGE.hospitalsAffected} hospitales.`,
  "Aeropuerto internacional Simón Bolívar (Maiquetía): infraestructura dañada y cierre temporal.",
  "Servicios interrumpidos: electricidad, agua, saneamiento, transporte y telecomunicaciones, lo que complica la atención hospitalaria y los traslados de emergencia.",
];

export default function SismoPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Venezuela", path: "/venezuela" },
          { name: "Terremoto 2026", path: "/venezuela/sismo-2026" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(SISMO_FAQS)} />
      {SEISMIC_EVENTS.map((ev) => (
        <JsonLd key={`jsonld-${ev.id}`} data={eventJsonLd(ev)} />
      ))}
      <JsonLd
        data={datasetJsonLd({
          name: "Terremotos de Venezuela del 24 de junio de 2026",
          description:
            "Datos del doble sismo Mw 7,2 y 7,5: víctimas, desaparecidos, desplazados, estados afectados, daño estructural y estimaciones económicas. Fuentes: USGS, OCHA, PNUD, PAHO.",
          path: "/venezuela/sismo-2026",
          keywords: [
            "terremoto Venezuela 2026",
            "sismo Venezuela",
            "muertos terremoto Venezuela",
            "daños terremoto Venezuela",
            "estados afectados",
            "La Guaira",
            "Yaracuy",
          ],
          temporalCoverage: "2026-06-24/2026-06-27",
          spatialCoverage: "Venezuela",
          sameAs: "https://es.wikipedia.org/wiki/Terremotos_de_Venezuela_de_2026",
        })}
      />
      <JsonLd
        data={newsArticleJsonLd({
          headline:
            "Terremotos de Venezuela de 2026: muertos, daños y estados afectados",
          description:
            "Doble sismo Mw 7,2 y 7,5 del 24 de junio de 2026 en Venezuela. Resumen de víctimas, desaparecidos, estados afectados, daño estructural y costo económico, con cada cifra citada a su fuente.",
          path: "/venezuela/sismo-2026",
          datePublished: SEISMIC_EVENTS[0].datetimeUtc,
          dateModified: `${DAMAGE.asOf}T12:00:00Z`,
          image: "/venezuela/sismo-2026/opengraph-image",
          section: "Venezuela",
          keywords: [
            "terremoto Venezuela 2026",
            "sismo Venezuela",
            "muertos terremoto Venezuela",
            "La Guaira",
            "Yaracuy",
          ],
          citations: [
            "https://earthquake.usgs.gov/earthquakes/eventpage/us6000t7zp",
            "https://es.wikipedia.org/wiki/Terremotos_de_Venezuela_de_2026",
            "https://news.un.org/en/story/2026/06/1167815",
            "https://www.paho.org/en/earthquakes-venezuela-2026",
          ],
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
        <p className="text-red-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Emergencia · 24 de junio de 2026
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Terremotos de Venezuela de 2026
        </h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          El 24 de junio de 2026 un doblete sísmico de magnitudes Mw 7,2 y 7,5
          golpeó el norte y centro de Venezuela, con epicentros en Yaracuy. Es
          el terremoto más grave del país desde 1900. Resumen de víctimas,
          estados afectados, daño estructural y costo económico, con cada cifra
          citada a su fuente.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span>
            Por <span className="text-slate-300">Cuentas Venezuela</span>
          </span>
          <span aria-hidden>·</span>
          <span>
            Publicado{" "}
            <time dateTime={SEISMIC_EVENTS[0].datetimeUtc}>24 jun 2026</time>
          </span>
          <span aria-hidden>·</span>
          <span>
            Actualizado{" "}
            <time dateTime={DAMAGE.asOf}>{fmtDate(DAMAGE.asOf)}</time>
          </span>
          <span aria-hidden>·</span>
          <Link href="/fuentes" className="text-cyan-400 hover:text-cyan-300">
            Fuentes y metodología
          </Link>
        </div>
      </header>

      <aside className="mb-10 rounded-xl border border-red-500/30 bg-red-500/5 p-5 text-sm text-red-200">
        <p className="flex gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            <strong>Cifras en evolución.</strong> Las víctimas y los daños se
            actualizan a diario conforme avanzan los rescates. Última revisión
            de cifras: {fmtDate(DAMAGE.asOf)}. Cada bloque indica su fuente.
          </span>
        </p>
      </aside>

      {/* ── KPIs ── */}
      <section className="mb-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {KPIS.map((k) => (
          <div
            key={k.label}
            className={`rounded-xl border p-4 ${k.color}`}
          >
            <p className="text-xs uppercase tracking-wider opacity-70">
              {k.label}
            </p>
            <p className="mt-1 text-2xl font-bold sm:text-3xl">{k.value}</p>
          </div>
        ))}
      </section>

      {/* ── Evento sísmico ── */}
      <Reveal delay={0}>
        <section id="evento" className="mb-14 scroll-mt-24">
          <div className="mb-3 flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-400" />
            <h2 className="text-2xl font-bold tracking-tight">
              El evento sísmico
            </h2>
          </div>
          <p className="mb-5 text-sm text-slate-400">
            Dos sismos con 39 segundos de diferencia. El primero (Mw 7,2) actuó
            como precursor; el segundo (Mw 7,5), más superficial, fue el
            principal. Ambos de tipo desgarre (strike-slip).
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {SEISMIC_EVENTS.map((ev) => (
              <div
                key={ev.id}
                id={ev.id}
                className="scroll-mt-24 rounded-xl border border-slate-700/40 bg-slate-900/50 p-5"
              >
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-slate-100">
                    {ev.magnitude}{" "}
                    <span className="text-base font-medium text-slate-400">
                      {ev.scale}
                    </span>
                  </span>
                  <span className="rounded-md border border-slate-600/50 bg-slate-800/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-300">
                    {ev.type === "mainshock" ? "Principal" : "Precursor"}
                  </span>
                </div>
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Hora local</dt>
                    <dd className="font-mono text-slate-300">{ev.localTime}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Profundidad</dt>
                    <dd className="font-mono text-slate-300">{ev.depthKm} km</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="shrink-0 text-slate-500">Epicentro</dt>
                    <dd className="text-right text-slate-300">{ev.epicenter}</dd>
                  </div>
                </dl>
                <SourceLinks sources={ev.sources} />
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-slate-400">
            Fue el sismo más fuerte registrado en Venezuela desde el terremoto
            de San Narciso de 1900 (~Mw 7,6). Ocurrió durante la conmemoración
            de la Batalla de Carabobo, con muchos comercios cerrados. En
            septiembre de 2025 ya se había registrado un doblete previo (Mw 6,2
            y 6,3) que dejó daños en Zulia y Lara.
          </p>
        </section>
      </Reveal>

      {/* ── Estados afectados ── */}
      <Reveal delay={100}>
        <section id="estados" className="mb-14 scroll-mt-24">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-400" />
            <h2 className="text-2xl font-bold tracking-tight">
              Estados afectados
            </h2>
          </div>
          <p className="mb-5 text-sm text-slate-400">
            El sismo se sintió en gran parte del norte y centro del país. La
            Guaira y Yaracuy concentraron los mayores daños. Explora el mapa o
            la lista para ver el detalle por estado.
          </p>
          <StatesExplorer states={AFFECTED_STATES} />
        </section>
      </Reveal>

      {/* ── Daños estructurales ── */}
      <Reveal delay={200}>
        <section id="danos" className="mb-14 scroll-mt-24">
          <div className="mb-3 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-cyan-400" />
            <h2 className="text-2xl font-bold tracking-tight">
              Daños estructurales
            </h2>
          </div>
          <ul className="space-y-2.5">
            {DAMAGE_FACTS.map((fact) => (
              <li
                key={fact}
                className="flex gap-2 text-sm leading-relaxed text-slate-300"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                {fact}
              </li>
            ))}
          </ul>
          <SourceLinks sources={DAMAGE.sources} />
        </section>
      </Reveal>

      {/* ── Impacto económico ── */}
      <Reveal delay={300}>
        <section id="economia" className="mb-14 scroll-mt-24">
          <div className="mb-3 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            <h2 className="text-2xl font-bold tracking-tight">
              Impacto económico
            </h2>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <p className="text-xs uppercase tracking-wider text-emerald-300/70">
              Daño estimado (PNUD)
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-100 sm:text-4xl">
              USD {ECONOMIC_DAMAGE.pnudLowUsdBn}–{ECONOMIC_DAMAGE.pnudHighUsdBn}{" "}
              mil millones
            </p>
            <p className="mt-1 text-sm text-emerald-200/80">
              Aproximadamente {ECONOMIC_DAMAGE.pctGdpLow}–
              {ECONOMIC_DAMAGE.pctGdpHigh}% del PIB de Venezuela.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {ECONOMIC_DAMAGE.note}
            </p>
          </div>
          <SourceLinks sources={ECONOMIC_DAMAGE.sources} />
        </section>
      </Reveal>

      {/* ── Nota sobre desaparecidos ── */}
      <Reveal delay={400}>
        <section id="desaparecidos" className="mb-14 scroll-mt-24">
          <aside className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
            <p className="mb-2 flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              Cifra de desaparecidos disputada
            </p>
            <p className="leading-relaxed">
              El número de personas desaparecidas varía drásticamente según la
              fuente. El gobierno la reporta como{" "}
              <strong>{DAMAGE.missingGov}</strong>; un sitio independiente de
              seguimiento (venezuelatebusca.com) registra más de{" "}
              <strong>{fmtNum(DAMAGE.missingTracker)}</strong>{" "}
              personas no localizadas, y la ONU estima en torno a{" "}
              <strong>{fmtNum(DAMAGE.missingUn)}</strong> los
              desaparecidos. El colapso de las telecomunicaciones y la
              dificultad para acceder a zonas con edificios derrumbados complican
              el conteo. Registramos las distintas versiones sin tomar partido.
            </p>
          </aside>
        </section>
      </Reveal>

      {/* ── FAQ ── */}
      <section className="mt-16 space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-slate-400" />
          <h2 className="text-2xl font-bold tracking-tight">
            Preguntas frecuentes
          </h2>
        </div>
        <dl className="space-y-4">
          {SISMO_FAQS.map((faq, idx) => (
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
          Fuentes principales: USGS, OCHA / ReliefWeb, Programa de las Naciones
          Unidas para el Desarrollo (PNUD), Organización Panamericana de la
          Salud (PAHO/OPS), UN News, NASA. Cronología de
          referencia en Wikipedia.
        </p>
        <p>
          Cifras al {fmtDate(DAMAGE.asOf)}. Página de actualización manual: las
          cifras se revisan a medida que las fuentes oficiales consolidan los
          totales.
        </p>
      </footer>
    </main>
  );
}
