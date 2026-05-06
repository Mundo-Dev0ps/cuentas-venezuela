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
        href="/datos-chile/dashboards"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" /> Dashboards
      </Link>
      <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">Demografía</h1>
      <p className="mt-2 max-w-2xl text-slate-300">
        Stock migratorio venezolano por región y serie temporal. Filtros por
        año y exclusión de regiones se reflejan en la URL — copiá el enlace
        para compartir tu vista.
      </p>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-700/40 p-8 text-sm text-slate-400">
          Sin datos. Corré el ETL para generar Parquet:
          <code className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 font-mono">
            docker compose --profile etl run --rm etl python -m pipelines extranjeria
          </code>
        </p>
      ) : (
        <Suspense fallback={<div className="mt-8 text-sm text-slate-400">Cargando filtros…</div>}>
          <DemografiaView rows={rows} />
        </Suspense>
      )}
    </main>
  );
}
