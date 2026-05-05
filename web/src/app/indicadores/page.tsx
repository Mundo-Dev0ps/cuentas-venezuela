import Link from "next/link";
import { listIndicators } from "@/lib/api";

export default async function IndicadoresPage() {
  const indicators = await listIndicators();

  const grouped = indicators.reduce<Record<string, typeof indicators>>(
    (acc, i) => {
      (acc[i.category] ??= []).push(i);
      return acc;
    },
    {},
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Indicadores</h1>
      <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
        Catálogo de variables medibles. Cada indicador está vinculado a una
        fuente y dataset Parquet en almacenamiento.
      </p>

      {indicators.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700">
          Sin indicadores catalogados aún.
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                {category}
              </h2>
              <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500 dark:bg-neutral-900">
                    <tr>
                      <th className="px-4 py-2.5">Indicador</th>
                      <th className="px-4 py-2.5">Slug</th>
                      <th className="px-4 py-2.5">Unidad</th>
                      <th className="px-4 py-2.5">Fuente</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {items.map((i) => (
                      <tr key={i.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                        <td className="px-4 py-2.5">
                          <Link href={`/indicadores/${i.slug}`} className="hover:underline">
                            <div className="font-medium">{i.name}</div>
                            {i.description ? (
                              <div className="text-xs text-neutral-500">
                                {i.description}
                              </div>
                            ) : null}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-neutral-500">
                          {i.slug}
                        </td>
                        <td className="px-4 py-2.5">{i.unit}</td>
                        <td className="px-4 py-2.5 text-neutral-600 dark:text-neutral-400">
                          {i.source?.name ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
