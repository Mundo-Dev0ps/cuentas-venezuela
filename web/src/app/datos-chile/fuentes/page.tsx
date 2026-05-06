import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { listSources } from "@/lib/api";
import { Card, CardDescription, CardTitle } from "@/components/card";

export default async function FuentesPage() {
  const sources = await listSources();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Fuentes oficiales</h1>
      <p className="mt-2 max-w-2xl text-slate-300">
        Cada dataset publicado se origina en una fuente oficial. Listamos
        organismo, licencia, URL original y descripción.
      </p>

      {sources.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-700/40 p-8 text-center text-sm text-slate-400">
          Sin fuentes registradas. Corré los seeds para poblar Postgres.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {sources.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/datos-chile/fuentes/${s.slug}`}
                  className="flex-1 hover:opacity-80"
                >
                  <CardTitle>{s.name}</CardTitle>
                  <CardDescription>{s.organization}</CardDescription>
                </Link>
                <Link
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  aria-label="Abrir fuente"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
              {s.description ? (
                <p className="mt-3 text-sm text-slate-200">
                  {s.description}
                </p>
              ) : null}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Licencia: {s.license ?? "no especificada"} ·{" "}
                  <span className="font-mono">{s.slug}</span>
                </span>
                <Link
                  href={`/datos-chile/fuentes/${s.slug}`}
                  className="text-orange-400 hover:text-orange-300 hover:underline"
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
