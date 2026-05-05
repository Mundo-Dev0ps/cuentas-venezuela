"use client";

import Link from "next/link";
import { mockStats, MOCK_OBRAS } from "@/lib/obras-mock";

export function MapaDelOlvido() {
  const s = mockStats();
  const usd = (n: number) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Mapa del Olvido</h1>
        <p className="max-w-2xl text-neutral-600 dark:text-neutral-300">
          Obras públicas en Venezuela: inauguradas, paralizadas o abandonadas.
          Datos en preview con muestra de {MOCK_OBRAS.length} obras.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Obras totales" value={s.total_count} />
        <Stat label="Inauguradas" value={s.by_status.inaugurada} />
        <Stat label="Abandonadas" value={s.by_status.abandonada} />
        <Stat label="Parciales" value={s.by_status.parcial} />
      </section>

      <section className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
        <p className="text-neutral-600 dark:text-neutral-400">
          Mapa interactivo (deck.gl + maplibre) en construcción.
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Monto total de inversión registrada: <strong>{usd(s.total_monto_usd)}</strong>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Top 10 estados por monto</h2>
        <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {s.top10_estados.map((e) => (
            <li
              key={e.estado}
              className="flex items-center justify-between px-4 py-2"
            >
              <span>{e.estado}</span>
              <span className="text-sm tabular-nums text-neutral-600 dark:text-neutral-400">
                {e.count} obras · {usd(e.monto_usd)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Obras (muestra)</h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {MOCK_OBRAS.map((o) => (
            <li
              key={o.id}
              className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <div className="font-medium">{o.nombre}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {o.estado} · {o.tipo} · {o.status.replace("_", " ")}
              </div>
              {o.monto_usd && (
                <div className="text-sm tabular-nums text-neutral-500">
                  {usd(o.monto_usd)}
                </div>
              )}
              <Link
                href={`/mapa-del-olvido/obra/${o.slug}`}
                className="mt-2 inline-block text-sm text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Ver detalle →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="text-2xl font-bold tabular-nums">
        {value.toLocaleString("es")}
      </div>
      <div className="text-xs uppercase tracking-wide text-neutral-500">
        {label}
      </div>
    </div>
  );
}
