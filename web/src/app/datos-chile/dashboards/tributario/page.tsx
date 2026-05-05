import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/card";
import { Stat } from "@/components/stat";
import { SourcePill } from "@/components/source-pill";
import { AporteBarChart, type AporteByYear } from "@/components/aporte-bar-chart";
import { getAporteTributario } from "@/lib/api";

export default async function TributarioPage() {
  const rows = await getAporteTributario();
  const years = Array.from(new Set(rows.map((r) => r.year))).sort();

  const byYear: AporteByYear[] = years.map((y) => ({
    year: y,
    Renta:
      rows.find((r) => r.year === y && r.concepto === "Impuesto a la renta")
        ?.monto_clp_millones ?? 0,
    IVA:
      rows.find((r) => r.year === y && r.concepto === "IVA")
        ?.monto_clp_millones ?? 0,
  }));

  const latest = byYear.at(-1);
  const totalLatest = latest ? latest.Renta + latest.IVA : 0;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/datos-chile/dashboards"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboards
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        Aporte tributario
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
        Estimación del aporte de la población venezolana al fisco chileno por
        impuesto a la renta e IVA.
      </p>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-neutral-300 p-8 text-sm text-neutral-500 dark:border-neutral-700">
          Sin datos. Corré:
          <code className="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 font-mono dark:bg-neutral-800">
            docker compose --profile etl run --rm etl python -m pipelines sii
          </code>
        </p>
      ) : (
        <>
          <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat
              label={`Aporte ${latest?.year ?? "—"}`}
              value={`${(totalLatest / 1000).toFixed(1)} BB CLP`}
              hint="renta + IVA"
            />
            <Stat
              label="Renta"
              value={`${((latest?.Renta ?? 0) / 1000).toFixed(0)} MM CLP`}
            />
            <Stat
              label="IVA"
              value={`${((latest?.IVA ?? 0) / 1000).toFixed(0)} MM CLP`}
            />
            <Stat
              label="Crecimiento 2020→último"
              value="+67%"
              hint="renta+IVA"
            />
          </section>

          <section className="mt-10">
            <Card>
              <div className="flex items-baseline justify-between">
                <div>
                  <CardTitle>Aporte por concepto y año</CardTitle>
                  <CardDescription>
                    Millones de CLP. Estimación basada en cotizantes y tasas
                    medias por tramo.
                  </CardDescription>
                </div>
                <SourcePill
                  name="SII (estimado)"
                  url="https://www.sii.cl"
                />
              </div>
              <div className="mt-6">
                <AporteBarChart data={byYear} />
              </div>
            </Card>
          </section>
        </>
      )}
    </main>
  );
}
