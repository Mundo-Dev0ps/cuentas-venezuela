import Link from "next/link";
import { Map, BarChart3 } from "lucide-react";

export const metadata = {
  title: "Cuentas Venezuela — Datos abiertos para venezolanos",
  description:
    "Mapa de obras públicas en Venezuela y datos de migración venezolana en Chile.",
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
      <section className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Cuentas Venezuela
        </h1>
        <p className="max-w-2xl text-lg text-slate-300 dark:text-neutral-300">
          Datos abiertos sobre obras públicas en Venezuela y la migración
          venezolana en Chile. Auditables, comparables y citados desde fuentes
          oficiales.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Link
          href="/mapa-del-olvido"
          className="group rounded-xl border border-slate-700 bg-slate-900 p-8 transition hover:border-orange-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="mb-3 flex items-center gap-2">
            <Map className="h-5 w-5 text-orange-400" />
            <h2 className="text-2xl font-semibold">Mapa del Olvido</h2>
          </div>
          <p className="mb-4 text-slate-300 dark:text-neutral-300">
            Mapa interactivo de obras públicas inauguradas, abandonadas o
            paralizadas en Venezuela.
          </p>
          <span className="text-sm font-medium text-orange-400 group-hover:underline dark:text-orange-300">
            Explorar el mapa →
          </span>
        </Link>

        <Link
          href="/datos-chile"
          className="group rounded-xl border border-slate-700 bg-slate-900 p-8 transition hover:border-orange-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-400" />
            <h2 className="text-2xl font-semibold">Datos Chile</h2>
          </div>
          <p className="mb-4 text-slate-300 dark:text-neutral-300">
            Dashboards sobre venezolanos en Chile: demografía, pensiones,
            tributario, regional.
          </p>
          <span className="text-sm font-medium text-orange-400 group-hover:underline dark:text-orange-300">
            Ver dashboards →
          </span>
        </Link>
      </section>
    </div>
  );
}
