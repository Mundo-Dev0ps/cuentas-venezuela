import Link from "next/link";
import { ArrowLeft, Globe2 } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/card";
import { Stat } from "@/components/stat";
import { SourcePill } from "@/components/source-pill";
import {
  ComparativaChart,
  type ComparativaPoint,
} from "@/components/comparativa-chart";
import { Reveal } from "@/components/reveal";
import { getComparativaNacionalidad } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Comparativa por nacionalidad · Datos Chile",
  description:
    "Stock legal de migrantes en Chile por nacionalidad y año. Venezuela vs Perú, Bolivia, Colombia y Haití. Fuente: SERMIG.",
  path: "/datos-chile/dashboards/comparativa",
});

export default async function ComparativaPage() {
  const rows = await getComparativaNacionalidad();
  const years = Array.from(new Set(rows.map((r) => r.year))).sort();
  const nationalities = Array.from(
    new Set(rows.map((r) => r.nacionalidad)),
  ).sort();

  const chartData: ComparativaPoint[] = years.map((y) => {
    const point: ComparativaPoint = { year: y };
    for (const nat of nationalities) {
      const row = rows.find((r) => r.year === y && r.nacionalidad === nat);
      point[nat] = row?.stock_legal ?? 0;
    }
    return point;
  });

  const latestYear = years.at(-1);
  const latest = rows.filter((r) => r.year === latestYear);
  const total = latest.reduce((a, r) => a + r.stock_legal, 0);
  const ranked = [...latest].sort((a, b) => b.stock_legal - a.stock_legal);
  const top = ranked[0];
  const venezuela = ranked.find((r) => r.nacionalidad === "Venezuela");

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/datos-chile/dashboards"
        className="inline-flex min-h-11 min-w-11 items-center gap-1 -ml-1 px-1 text-sm text-slate-400 hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboards
      </Link>
      <h1 className="mt-4 flex items-center gap-3 text-3xl sm:text-4xl font-bold tracking-tight">
        <Globe2 className="h-7 w-7 text-cyan-300" aria-hidden />
        Comparativa por nacionalidad
      </h1>
      <p className="mt-2 max-w-2xl text-slate-300">
        Stock legal vigente para las principales colectividades migrantes en
        Chile.
      </p>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-700/40 p-8 text-sm text-slate-400">
          Sin datos. Corré:
          <code className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 font-mono">
            docker compose --profile etl run --rm etl python -m pipelines comparativa
          </code>
        </p>
      ) : (
        <>
          <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat
              label={`Total ${latestYear}`}
              numericValue={total}
              hint="5 nacionalidades"
            />
            <Stat
              label="Líder"
              value={top?.nacionalidad ?? "—"}
              hint={`${top ? Math.round((top.stock_legal / total) * 100) : 0}% del total`}
            />
            <Stat
              label="Venezuela"
              numericValue={venezuela?.stock_legal ?? 0}
              hint={`${venezuela ? Math.round((venezuela.stock_legal / total) * 100) : 0}% del total`}
            />
            <Stat
              label="Crecimiento Venezuela"
              numericValue={496}
              prefix="+"
              suffix="%"
              hint="2018 → 2024"
            />
          </section>

          <Reveal className="mt-10">
            <Card>
              <div>
                <CardTitle>Stock legal por nacionalidad</CardTitle>
                <CardDescription>
                  Serie {years.at(0)}–{years.at(-1)}. Permanencias vigentes
                  al cierre de cada año.
                </CardDescription>
              </div>
              <div className="mt-6">
                <ComparativaChart
                  data={chartData}
                  nationalities={nationalities}
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-700/40 pt-3 text-xs text-slate-400">
                <span>[1]</span>
                <SourcePill
                  name="SERMIG (estimado)"
                  url="https://serviciomigraciones.cl"
                />
              </div>
            </Card>
          </Reveal>
        </>
      )}
    </main>
  );
}
