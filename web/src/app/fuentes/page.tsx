import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { listSources } from "@/lib/api";
import { Card, CardDescription, CardTitle } from "@/components/card";

export default async function FuentesPage() {
  const sources = await listSources();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Fuentes oficiales</h1>
      <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
        Cada dataset publicado se origina en una fuente oficial. Listamos
        organismo, licencia, URL original y descripción.
      </p>

      {sources.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700">
          Sin fuentes registradas. Corré los seeds para poblar Postgres.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {sources.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/fuentes/${s.slug}`}
                  className="flex-1 hover:opacity-80"
                >
                  <CardTitle>{s.name}</CardTitle>
                  <CardDescription>{s.organization}</CardDescription>
                </Link>
                <Link
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
                  aria-label="Abrir fuente"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
              {s.description ? (
                <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">
                  {s.description}
                </p>
              ) : null}
              <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                <span>
                  Licencia: {s.license ?? "no especificada"} ·{" "}
                  <span className="font-mono">{s.slug}</span>
                </span>
                <Link
                  href={`/fuentes/${s.slug}`}
                  className="text-emerald-600 hover:underline"
                >
                  Ver detalle →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
