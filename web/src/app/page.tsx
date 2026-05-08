import Link from "next/link";
import { Map, BarChart3 } from "lucide-react";

export const metadata = {
  title: "Cuentas Venezuela — Datos abiertos para venezolanos",
  description:
    "Mapa de obras públicas en Venezuela y datos de migración venezolana en Chile.",
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-16">
      <section className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Cuentas Venezuela
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Datos abiertos sobre obras públicas en Venezuela y la migración
          venezolana en Chile. Auditables, comparables y citados desde fuentes
          oficiales.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/mapa-del-olvido"
            className="inline-flex min-h-11 items-center gap-1 rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Explorar el Mapa →
          </Link>
          <Link
            href="/datos-chile/dashboards"
            className="inline-flex min-h-11 items-center gap-1 rounded-md border border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
          >
            Ver dashboards →
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Link
          href="/mapa-del-olvido"
          className="group relative rounded-xl border border-slate-700/40 border-l-[3px] border-l-cyan-400 bg-slate-900/80 p-8 transition hover:border-cyan-400/60 hover:shadow-lg"
        >
          <span className="absolute right-4 top-4 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-300">
            Destacado
          </span>
          <div className="mb-3 flex items-center gap-2">
            <Map className="h-5 w-5 text-orange-400" />
            <h2 className="text-2xl font-semibold">Mapa del Olvido</h2>
          </div>
          <p className="mb-4 text-slate-300">
            Mapa interactivo de obras públicas inauguradas, abandonadas o
            paralizadas en Venezuela.
          </p>
          <span className="text-sm font-medium text-cyan-300 group-hover:underline">
            Explorar el mapa →
          </span>
        </Link>

        <Link
          href="/datos-chile"
          className="group rounded-xl border border-slate-700/40 bg-slate-900/80 p-8 transition hover:border-cyan-400/60 hover:shadow-lg"
        >
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-400" />
            <h2 className="text-2xl font-semibold">Datos Chile</h2>
          </div>
          <p className="mb-4 text-slate-300">
            Dashboards sobre venezolanos en Chile: demografía, pensiones,
            tributario, regional.
          </p>
          <span className="text-sm font-medium text-cyan-300 group-hover:underline">
            Ver dashboards →
          </span>
        </Link>
      </section>
    </div>
  );
}
