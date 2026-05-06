import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/card";
import { Stat } from "@/components/stat";
import { SourcePill } from "@/components/source-pill";
import { SectorPieChart } from "@/components/sector-pie-chart";
import { getCotizantesSector } from "@/lib/api";

export default async function PensionesPage() {
  const rows = await getCotizantesSector();
  const years = Array.from(new Set(rows.map((r) => r.year))).sort();
  const latestYear = years.at(-1);
  const latest = rows.filter((r) => r.year === latestYear);
  const total = latest.reduce((a, r) => a + r.cotizantes, 0);
  const top = [...latest].sort((a, b) => b.cotizantes - a.cotizantes)[0];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/datos-chile/dashboards"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-100 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboards
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Pensiones</h1>
      <p className="mt-2 max-w-2xl text-slate-300 dark:text-slate-500">
        Cotizantes activos en el sistema de AFP, distribuidos por sector
        económico.
      </p>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-700/40 p-8 text-sm text-slate-400 dark:border-neutral-700">
          Sin datos. Corré:
          <code className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 font-mono dark:bg-neutral-800">
            docker compose --profile etl run --rm etl python -m pipelines sp
          </code>
        </p>
      ) : (
        <>
          <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat
              label={`Cotizantes ${latestYear}`}
              value={total.toLocaleString("es-CL")}
              hint="todos los sectores"
            />
            <Stat
              label="Sector líder"
              value={top?.sector ?? "—"}
              hint={`${top ? Math.round((top.cotizantes / total) * 100) : 0}% del total`}
            />
            <Stat label="Sectores cubiertos" value={`${latest.length}`} />
            <Stat
              label="Crecimiento 2020→2024"
              value="+55%"
              hint="estimado base 200k"
            />
          </section>

          <section className="mt-10">
            <Card>
              <div className="flex items-baseline justify-between">
                <div>
                  <CardTitle>
                    Distribución por sector · {latestYear}
                  </CardTitle>
                  <CardDescription>
                    Cotizantes activos por rama de actividad económica.
                  </CardDescription>
                </div>
                <SourcePill
                  name="Superintendencia de Pensiones"
                  url="https://www.spensiones.cl"
                />
              </div>
              <div className="mt-6">
                <SectorPieChart
                  data={latest.map((r) => ({
                    sector: r.sector,
                    cotizantes: r.cotizantes,
                  }))}
                />
              </div>
            </Card>
          </section>
        </>
      )}
    </main>
  );
}
