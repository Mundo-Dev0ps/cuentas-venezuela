import Link from "next/link";
import { ArrowLeft, Receipt } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/card";
import { Stat } from "@/components/stat";
import { SourcePill } from "@/components/source-pill";
import { AporteBarChart, type AporteByYear } from "@/components/aporte-bar-chart";
import { Reveal } from "@/components/reveal";
import { getAporteTributario } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Aporte tributario · Datos Chile",
  description:
    "Aporte tributario de la migración venezolana en Chile por concepto y año. Fuente: Servicio de Impuestos Internos (SII).",
  path: "/datos-chile/dashboards/tributario",
});

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
        className="inline-flex min-h-11 min-w-11 items-center gap-1 -ml-1 px-1 text-sm text-slate-400 hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboards
      </Link>
      <h1 className="mt-4 flex items-center gap-3 text-3xl sm:text-4xl font-bold tracking-tight">
        <Receipt className="h-7 w-7 text-cyan-300" aria-hidden />
        Aporte tributario
      </h1>
      <p className="mt-2 max-w-2xl text-slate-300">
        Estimación del aporte de la población venezolana al fisco chileno por
        impuesto a la renta e IVA.
      </p>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-700/40 p-8 text-sm text-slate-400">
          Sin datos. Corré:
          <code className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 font-mono">
            docker compose --profile etl run --rm etl python -m pipelines sii
          </code>
        </p>
      ) : (
        <>
          <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat
              label={`Aporte ${latest?.year ?? "—"}`}
              numericValue={totalLatest}
              divisor={1_000_000}
              decimals={1}
              prefix="$"
              suffix="B CLP"
              tone="accent"
              hint="renta + IVA"
            />
            <Stat
              label="Renta"
              numericValue={latest?.Renta ?? 0}
              divisor={1000}
              prefix="$"
              suffix="M CLP"
            />
            <Stat
              label="IVA"
              numericValue={latest?.IVA ?? 0}
              divisor={1000}
              prefix="$"
              suffix="M CLP"
            />
            <Stat
              label="Crecimiento 2020→último"
              numericValue={67}
              prefix="+"
              suffix="%"
              hint="renta+IVA"
            />
          </section>

          <Reveal className="mt-10">
            <Card>
              <div>
                <CardTitle>Aporte por concepto y año</CardTitle>
                <CardDescription>
                  Millones de CLP. Estimación basada en cotizantes y tasas
                  medias por tramo.
                </CardDescription>
              </div>
              <div className="mt-6">
                <AporteBarChart data={byYear} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-700/40 pt-3 text-xs text-slate-400">
                <span>[1]</span>
                <SourcePill
                  name="SII (estimado)"
                  url="https://www.sii.cl"
                />
              </div>
            </Card>
          </Reveal>
        </>
      )}
    </main>
  );
}
