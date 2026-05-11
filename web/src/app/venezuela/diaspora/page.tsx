import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { getAcnurVe } from "@/lib/api";
import { DiasporaBarChart } from "@/components/diaspora-bar-chart";
import { SourceBadge } from "@/components/source-badge";

export const metadata = {
  title: "Diáspora venezolana — Venezuela | Cuentas Venezuela",
  description:
    "Refugiados y solicitantes de asilo venezolanos por país de destino. Datos ACNUR/UNHCR.",
};

export const dynamic = "force-dynamic";

const fmtN = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}k`
      : n.toLocaleString("es-CL");

async function pickLatestYearWithData(
  candidates: number[],
): Promise<{ year: number; rows: Awaited<ReturnType<typeof getAcnurVe>> }> {
  for (const y of candidates) {
    const rows = await getAcnurVe({ year: y });
    if (rows.length > 0) return { year: y, rows };
  }
  return { year: candidates[candidates.length - 1] ?? 0, rows: [] };
}

export default async function DiasporaPage() {
  // Try most recent first; fall back if API has no rows yet.
  const { year: latestYear, rows: latest } = await pickLatestYearWithData([
    2026, 2025, 2024, 2023,
  ]);
  const totalLatest = latest.reduce((s, r) => s + r.total, 0);
  const totalRefugees = latest.reduce((s, r) => s + (r.refugees ?? 0), 0);
  const totalAsylum = latest.reduce((s, r) => s + (r.asylumSeekers ?? 0), 0);
  const totalOoc = latest.reduce((s, r) => s + (r.othersConcern ?? 0), 0);

  // Top 12 destinations for the bar chart
  const top = latest.slice(0, 12).map((r) => ({
    country: r.countryName ?? r.country,
    refugees: r.refugees ?? 0,
    asylumSeekers: r.asylumSeekers ?? 0,
    othersConcern: r.othersConcern ?? 0,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/venezuela"
        className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 text-sm mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Venezuela
      </Link>

      <header className="mb-8">
        <p className="text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-2">
          Diáspora global
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3 flex items-center gap-3">
          <Users className="h-7 w-7 text-cyan-400" aria-hidden />
          Venezolanos en el mundo
        </h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          Refugiados y solicitantes de asilo venezolanos registrados por
          ACNUR/UNHCR según país de destino. La cifra real de la diáspora
          (incluyendo migrantes con estatutos especiales como el PEP/PPT
          colombiano) supera ampliamente lo aquí mostrado — la plataforma
          R4V de la ONU estima 7.7M+ venezolanos fuera del país.
        </p>
        <div className="mt-4">
          <SourceBadge
            slug="unhcr"
            name="UNHCR Population Statistics"
            url="https://www.unhcr.org/refugee-statistics/download/?url=2bxU2f"
          />
        </div>
      </header>

      {/* KPI strip */}
      {latest.length > 0 && (
        <section className="grid gap-3 sm:grid-cols-4 mb-8">
          <div className="rounded-xl border border-slate-700/40 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
              Total registrados {latestYear}
            </p>
            <p className="text-2xl font-bold text-slate-100 font-mono">
              {fmtN(totalLatest)}
            </p>
            <p className="text-xs text-slate-500 mt-1">{latest.length} países</p>
          </div>
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
            <p className="text-xs uppercase tracking-wider text-cyan-300 mb-1">
              Refugiados
            </p>
            <p className="text-2xl font-bold text-cyan-300 font-mono">
              {fmtN(totalRefugees)}
            </p>
          </div>
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4">
            <p className="text-xs uppercase tracking-wider text-orange-300 mb-1">
              Solicitantes de asilo
            </p>
            <p className="text-2xl font-bold text-orange-300 font-mono">
              {fmtN(totalAsylum)}
            </p>
          </div>
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
            <p className="text-xs uppercase tracking-wider text-violet-300 mb-1">
              Otros desplazados
            </p>
            <p className="text-2xl font-bold text-violet-300 font-mono">
              {fmtN(totalOoc)}
            </p>
          </div>
        </section>
      )}

      {/* Top destinations bar chart */}
      <section className="mb-10 rounded-xl border border-slate-700/40 bg-slate-900/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2 className="text-xl font-semibold text-slate-100">
            Top 12 destinos {latestYear}
          </h2>
          <p className="text-xs text-slate-500">Personas registradas</p>
        </div>
        {top.length === 0 ? (
          <p className="text-sm text-slate-400 py-12 text-center">
            Sin datos. Ejecuta{" "}
            <code className="text-cyan-300">python -m pipelines acnur</code>.
          </p>
        ) : (
          <DiasporaBarChart data={top} height={460} />
        )}
      </section>

      {/* Full table */}
      {latest.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-100 mb-3">
            Todos los destinos en {latestYear}
          </h2>
          <div className="overflow-x-auto rounded-lg border border-slate-700/40">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-2">#</th>
                  <th className="text-left px-4 py-2">País</th>
                  <th className="text-right px-4 py-2">Refugiados</th>
                  <th className="text-right px-4 py-2">Asilo</th>
                  <th className="text-right px-4 py-2">Otros</th>
                  <th className="text-right px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {latest.map((r, i) => (
                  <tr key={r.country} className="text-slate-200">
                    <td className="px-4 py-2 font-mono text-slate-500">
                      {i + 1}
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-slate-100">{r.countryName ?? r.country}</span>
                      <span className="text-xs text-slate-500 ml-2 font-mono">
                        {r.country}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {(r.refugees ?? 0).toLocaleString("es-CL")}
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {(r.asylumSeekers ?? 0).toLocaleString("es-CL")}
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {(r.othersConcern ?? 0).toLocaleString("es-CL")}
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-bold text-slate-100">
                      {r.total.toLocaleString("es-CL")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <footer className="mt-10 border-t border-slate-700/40 pt-6 text-xs text-slate-500 space-y-2">
        <p>
          Fuente:{" "}
          <a
            className="text-cyan-300 hover:text-cyan-200"
            href="https://www.unhcr.org/refugee-statistics/"
            target="_blank"
            rel="noreferrer"
          >
            UNHCR Refugee Population Statistics
          </a>
          . Definiciones: refugiados, solicitantes de asilo y &quot;otros de
          interés&quot; (OOC). Pipeline ETL{" "}
          <code className="text-slate-400">etl/pipelines/acnur.py</code>.
        </p>
        <p>
          Importante: ACNUR no contabiliza estatutos migratorios especiales
          (PEP/PPT colombiano, Visa Democrática chilena, ETPV brasileño) que
          cubren a millones más. Para totales completos ver R4V de ONU.
        </p>
      </footer>
    </div>
  );
}
