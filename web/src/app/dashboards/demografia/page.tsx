import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DemografiaView } from "@/components/demografia-view";
import { getStockRegion } from "@/lib/api";

export default async function DemografiaPage() {
  const rows = await getStockRegion();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/dashboards"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboards
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Demografía</h1>
      <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
        Stock migratorio venezolano por región y serie temporal. Filtros por
        año y exclusión de regiones se reflejan en la URL — copiá el enlace
        para compartir tu vista.
      </p>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-neutral-300 p-8 text-sm text-neutral-500 dark:border-neutral-700">
          Sin datos. Corré el ETL para generar Parquet:
          <code className="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 font-mono dark:bg-neutral-800">
            docker compose --profile etl run --rm etl python -m pipelines extranjeria
          </code>
        </p>
      ) : (
        <Suspense fallback={<div className="mt-8 text-sm text-neutral-500">Cargando filtros…</div>}>
          <DemografiaView rows={rows} />
        </Suspense>
      )}
    </main>
  );
}
