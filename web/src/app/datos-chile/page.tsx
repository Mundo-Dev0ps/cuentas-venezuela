import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHealth, listIndicators, listSources } from "@/lib/api";
import { Stat } from "@/components/stat";
import { Card, CardDescription, CardTitle } from "@/components/card";
import { StockChart, type StockPoint } from "@/components/stock-chart";
import { SourcePill } from "@/components/source-pill";

const SAMPLE_STOCK: StockPoint[] = [
  { year: 2018, legal: 83000, estimado_total: 110000 },
  { year: 2019, legal: 288000, estimado_total: 380000 },
  { year: 2020, legal: 448000, estimado_total: 530000 },
  { year: 2021, legal: 460000, estimado_total: 600000 },
  { year: 2022, legal: 444000, estimado_total: 690000 },
  { year: 2023, legal: 470000, estimado_total: 720000 },
  { year: 2024, legal: 495000, estimado_total: 750000 },
];

export default async function HomePage() {
  const [health, sources, indicators] = await Promise.all([
    getHealth(),
    listSources(),
    listIndicators(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
          Proyecto cívico · datos públicos
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
          Migración venezolana en Chile, en datos.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Centralizamos cifras oficiales sobre stock migratorio, trabajo,
          cotizaciones, salud y aporte fiscal. Cada gráfico cita su fuente y
          fecha. Todo abierto, todo verificable.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/datos-chile/dashboards"
            className="inline-flex items-center gap-2 rounded-md bg-orange-400 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
          >
            Ver dashboards <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/datos-chile/fuentes"
            className="inline-flex items-center gap-2 rounded-md border border-slate-700/40 px-4 py-2 text-sm font-medium hover:bg-slate-900/80"
          >
            Explorar fuentes
          </Link>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat
          label="Stock legal 2024"
          value="≈495k"
          hint="DEM / Servicio Nacional de Migraciones"
        />
        <Stat
          label="Estimado total"
          value="≈750k"
          hint="incluye irregulares (SJM/ONU)"
        />
        <Stat
          label="Cotizantes AFP"
          value="≈310k"
          hint="Superintendencia de Pensiones"
        />
        <Stat
          label="Aporte SII estimado"
          value="≈USD 1.4B"
          hint="impuesto a la renta + IVA"
        />
      </section>

      <section className="mt-10">
        <Card>
          <div className="flex items-baseline justify-between">
            <div>
              <CardTitle>Stock migratorio venezolano · Chile</CardTitle>
              <CardDescription>
                Serie 2018–2024. Comparativa entre stock con permanencia legal
                y estimación total (incluye irregulares).
              </CardDescription>
            </div>
            <SourcePill
              name="DEM + SJM"
              url="https://serviciomigraciones.cl"
              extractedAt="2025-12"
            />
          </div>
          <div className="mt-6">
            <StockChart data={SAMPLE_STOCK} />
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Datos demostrativos. La versión final consume Parquet en almacenamiento R2 vía API.
          </p>
        </Card>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle>Fuentes oficiales</CardTitle>
          <CardDescription>
            {sources.length > 0
              ? `${sources.length} fuente(s) cargada(s) desde la API.`
              : "Sin datos aún. Cargá seeds en Postgres para verlos aquí."}
          </CardDescription>
          <ul className="mt-4 space-y-2 text-sm">
            {sources.slice(0, 5).map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between border-b border-neutral-100 pb-2 last:border-0"
              >
                <span>
                  <span className="font-medium">{s.name}</span>
                  <span className="ml-2 text-slate-400">
                    {s.organization}
                  </span>
                </span>
                <Link
                  href={`/datos-chile/fuentes`}
                  className="text-xs text-orange-400 hover:text-orange-300 hover:underline"
                >
                  ver →
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardTitle>Indicadores disponibles</CardTitle>
          <CardDescription>
            {indicators.length > 0
              ? `${indicators.length} indicador(es) catalogado(s).`
              : "Sin indicadores aún."}
          </CardDescription>
          <ul className="mt-4 space-y-2 text-sm">
            {indicators.slice(0, 5).map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between border-b border-neutral-100 pb-2 last:border-0"
              >
                <span>
                  <span className="font-medium">{i.name}</span>
                  <span className="ml-2 text-xs text-slate-400">
                    {i.unit}
                  </span>
                </span>
                <span className="text-xs text-slate-400">{i.category}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mt-10 text-xs text-slate-400">
        Estado API: {health ? `ok · ${new Date(health.ts).toLocaleString()}` : "sin respuesta"}
      </section>
    </main>
  );
}
