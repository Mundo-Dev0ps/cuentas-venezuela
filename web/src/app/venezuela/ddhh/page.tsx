import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { getFreedomHouse, type FreedomHouseRow } from "@/lib/api";
import {
  FreedomTrendChart,
  type FreedomPoint,
} from "@/components/freedom-trend-chart";
import { SourceBadge } from "@/components/source-badge";
import { pageMetadata } from "@/lib/seo";
import {
  JsonLd,
  breadcrumbsJsonLd,
  datasetJsonLd,
  faqPageJsonLd,
} from "@/components/json-ld";

const DDHH_FAQS = [
  {
    question: "¿Cuál es la clasificación de Venezuela en Freedom House?",
    answer:
      "Venezuela está clasificada como 'No Libre' (Not Free) por Freedom House desde 2017. En 2024 obtuvo un puntaje total de 15/100 (1/40 en derechos políticos, 14/60 en libertades civiles), una de las clasificaciones más bajas de América Latina, comparable con Cuba y Nicaragua.",
  },
  {
    question: "¿Desde cuándo Venezuela perdió la clasificación de país libre?",
    answer:
      "Venezuela fue clasificada como 'Parcialmente Libre' (Partly Free) entre los años 90 y 2016. En 2017 Freedom House la rebajó a 'No Libre' tras el desconocimiento de la Asamblea Nacional electa, la instalación de la Asamblea Nacional Constituyente y la represión de protestas. La trayectoria desde 2013 muestra un deterioro continuo del puntaje agregado.",
  },
  {
    question: "¿Cómo se compara Venezuela con Chile y Uruguay en derechos humanos?",
    answer:
      "Chile y Uruguay han sostenido clasificación 'Libre' (Free) durante todo el período medido, con puntajes consistentemente sobre 90/100. Venezuela arranca el período en 'Parcialmente Libre' y termina en 'No Libre' con menos de 20 puntos — una brecha de más de 75 puntos respecto a sus pares regionales democráticos.",
  },
  {
    question: "¿Qué mide exactamente el índice de Freedom House?",
    answer:
      "Freedom House mide dos dimensiones: derechos políticos (proceso electoral, pluralismo político, funcionamiento del gobierno) sobre 40 puntos, y libertades civiles (libertad de expresión, asociación, estado de derecho, autonomía personal) sobre 60 puntos. La metodología es pública y se aplica a 195 países anualmente. Fuente: freedomhouse.org/countries/freedom-world/scores",
  },
];

export const metadata = pageMetadata({
  title: "Derechos humanos en Venezuela",
  description:
    "Trayectoria de Venezuela en libertades civiles y políticas según Freedom House (2013-2024), comparada con Chile y Uruguay.",
  path: "/venezuela/ddhh",
});

// Freedom House publishes yearly — edge-cache + hourly revalidate.
export const revalidate = 3600;

const STATUS_LABEL: Record<string, { full: string; color: string }> = {
  F: { full: "Libre", color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/5" },
  PF: { full: "Parcialmente libre", color: "text-amber-400 border-amber-500/40 bg-amber-500/5" },
  NF: { full: "No libre", color: "text-rose-400 border-rose-500/40 bg-rose-500/5" },
};

function pivot(rows: FreedomHouseRow[]): FreedomPoint[] {
  const byYear = new Map<number, FreedomPoint>();
  for (const r of rows) {
    let p = byYear.get(r.year);
    if (!p) {
      p = { year: r.year };
      byYear.set(r.year, p);
    }
    if (r.country === "VEN") p.VEN = r.total;
    else if (r.country === "CHL") p.CHL = r.total;
    else if (r.country === "URY") p.URY = r.total;
  }
  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
}

function lastPoint(rows: FreedomHouseRow[], iso: string): FreedomHouseRow | null {
  const filtered = rows.filter((r) => r.country === iso).sort((a, b) => b.year - a.year);
  return filtered[0] ?? null;
}

function deltaTotal(rows: FreedomHouseRow[], iso: string): number | null {
  const sorted = rows.filter((r) => r.country === iso).sort((a, b) => a.year - b.year);
  if (sorted.length < 2) return null;
  const first = sorted[0].total;
  const last = sorted[sorted.length - 1].total;
  if (first == null || last == null) return null;
  return last - first;
}

export default async function DDHHPage() {
  const rows = await getFreedomHouse({
    from: 2013,
    to: 2024,
  });
  const points = pivot(rows);
  const venLatest = lastPoint(rows, "VEN");
  const venDelta = deltaTotal(rows, "VEN");

  const venRows = rows
    .filter((r) => r.country === "VEN")
    .sort((a, b) => b.year - a.year);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Venezuela", path: "/venezuela" },
          { name: "Derechos humanos", path: "/venezuela/ddhh" },
        ])}
      />
      <JsonLd
        data={datasetJsonLd({
          name: "Freedom in the World — Venezuela vs Chile/Uruguay (2013-2024)",
          description:
            "Puntajes anuales de Freedom House sobre derechos políticos y libertades civiles. Trayectoria de Venezuela, contrastada con Chile y Uruguay.",
          path: "/venezuela/ddhh",
          keywords: [
            "Venezuela",
            "derechos humanos",
            "Freedom House",
            "libertades civiles",
            "derechos políticos",
          ],
          temporalCoverage: "2013/2024",
          spatialCoverage: "Venezuela",
          sameAs: "https://freedomhouse.org/countries/freedom-world/scores",
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
        <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Derechos humanos
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3 flex items-center gap-3">
          <ShieldAlert className="h-7 w-7 text-rose-400" aria-hidden />
          Venezuela y la libertad civil-política
        </h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          Freedom House publica cada año un score combinado de derechos políticos
          (0-40) y libertades civiles (0-60) para 195 países y 15 territorios.
          Una caída sostenida del puntaje refleja restricciones a la prensa,
          oposición, justicia independiente, libertades de asociación.
        </p>
        <div className="mt-4">
          <SourceBadge
            slug="freedom-house"
            name="Freedom House — Freedom in the World"
            url="https://freedomhouse.org/country/venezuela/freedom-world/2024"
          />
        </div>
      </header>

      {/* KPI top row */}
      {venLatest && (
        <section className="grid gap-3 sm:grid-cols-3 mb-8">
          <div className={`rounded-xl border p-4 ${STATUS_LABEL[venLatest.status ?? ""]?.color ?? "border-slate-700/40 bg-slate-900/60"}`}>
            <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
              Estatus {venLatest.year}
            </p>
            <p className="text-2xl font-bold">
              {STATUS_LABEL[venLatest.status ?? ""]?.full ?? venLatest.status ?? "—"}
            </p>
            <p className="text-xs opacity-70 mt-1">Freedom House</p>
          </div>
          <div className="rounded-xl border border-slate-700/40 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
              Score total {venLatest.year}
            </p>
            <p className="text-2xl font-bold text-slate-100 font-mono">
              {venLatest.total ?? "—"}<span className="text-sm text-slate-500">/100</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              PR {venLatest.prScore ?? "—"}/40 · CL {venLatest.clScore ?? "—"}/60
            </p>
          </div>
          <div className="rounded-xl border border-slate-700/40 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
              Cambio 2013 → {venLatest.year}
            </p>
            <p className={`text-2xl font-bold font-mono ${venDelta != null && venDelta < 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {venDelta != null ? (venDelta > 0 ? "+" : "") + venDelta : "—"}
            </p>
            <p className="text-xs text-slate-500 mt-1">puntos sobre 100</p>
          </div>
        </section>
      )}

      {/* Trend chart */}
      <section className="mb-10 rounded-xl border border-slate-700/40 bg-slate-900/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
          <h2 className="text-xl font-semibold text-slate-100">
            Trayectoria 2013-{venLatest?.year ?? 2024}
          </h2>
          <p className="text-xs text-slate-500">Score 0-100</p>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Bandas: <span className="text-rose-400">No libre</span> (0-35) ·{" "}
          <span className="text-amber-400">Parcialmente libre</span> (36-70) ·{" "}
          <span className="text-emerald-400">Libre</span> (71-100)
        </p>
        {points.length === 0 ? (
          <p className="text-sm text-slate-400 py-12 text-center">
            Sin datos. Ejecuta <code className="text-cyan-300">python -m pipelines freedom_house</code>.
          </p>
        ) : (
          <FreedomTrendChart data={points} height={320} />
        )}
      </section>

      {/* Year-by-year table for VE */}
      {venRows.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-100 mb-3">
            Venezuela año por año
          </h2>
          <div className="overflow-x-auto rounded-lg border border-slate-700/40">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-2">Año</th>
                  <th className="text-left px-4 py-2">Estatus</th>
                  <th className="text-right px-4 py-2">PR</th>
                  <th className="text-right px-4 py-2">CL</th>
                  <th className="text-right px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {venRows.map((r) => (
                  <tr key={r.year} className="text-slate-200">
                    <td className="px-4 py-2 font-mono">{r.year}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${STATUS_LABEL[r.status ?? ""]?.color ?? ""}`}
                      >
                        {STATUS_LABEL[r.status ?? ""]?.full ?? r.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {r.prScore ?? "—"}<span className="text-slate-500">/40</span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {r.clScore ?? "—"}<span className="text-slate-500">/60</span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-bold">
                      {r.total ?? "—"}<span className="text-slate-500">/100</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mt-12 space-y-5">
        <JsonLd data={faqPageJsonLd(DDHH_FAQS)} />
        <h2 className="text-2xl font-bold tracking-tight">
          Preguntas frecuentes sobre derechos humanos en Venezuela
        </h2>
        <dl className="space-y-4">
          {DDHH_FAQS.map((faq) => (
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

      <footer className="mt-10 border-t border-slate-700/40 pt-6 text-xs text-slate-500">
        <p>
          Fuente:{" "}
          <a
            className="text-cyan-300 hover:text-cyan-200"
            href="https://freedomhouse.org/report/freedom-world"
            target="_blank"
            rel="noreferrer"
          >
            Freedom House — Freedom in the World
          </a>
          . Edición anual descargable en XLSX. Pipeline ETL{" "}
          <code className="text-slate-400">etl/pipelines/freedom_house.py</code>.
        </p>
      </footer>
    </div>
  );
}
