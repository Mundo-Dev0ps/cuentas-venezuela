import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/card";
import { getSource } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSource(slug);
  if (!data) {
    return pageMetadata({
      title: "Fuente no encontrada",
      description: "La fuente solicitada no existe.",
      path: `/datos-chile/fuentes/${slug}`,
    });
  }
  const { source } = data;
  return pageMetadata({
    title: `${source.name} — fuente oficial`,
    description:
      source.description ??
      `${source.name} (${source.organization}). Fuente oficial usada en Cuentas Venezuela.`,
    path: `/datos-chile/fuentes/${slug}`,
  });
}

export default async function SourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getSource(slug);
  if (!data) notFound();

  const { source, datasets, indicators } = data;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/datos-chile/fuentes"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" /> Todas las fuentes
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{source.name}</h1>
        <p className="mt-1 text-slate-300">
          {source.organization}
        </p>
        {source.description ? (
          <p className="mt-4 max-w-2xl text-slate-200">
            {source.description}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-700/40 px-3 py-1.5 hover:bg-slate-900/80"
          >
            Sitio oficial <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <span className="rounded-md bg-slate-800 px-3 py-1.5">
            Licencia: {source.license ?? "no especificada"}
          </span>
          <span className="rounded-md bg-slate-800 px-3 py-1.5 font-mono">
            {source.slug}
          </span>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Datasets ({datasets.length})</h2>
        {datasets.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">Sin datasets aún.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {datasets.map((d) => (
              <Card key={d.id}>
                <CardTitle>{d.title}</CardTitle>
                {d.description ? (
                  <CardDescription>{d.description}</CardDescription>
                ) : null}
                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <div>
                    Parquet: <span className="font-mono">{d.parquetKey}</span>
                  </div>
                  <div>
                    Extraído: {new Date(d.extractedAt).toLocaleString("es-CL")}
                  </div>
                  <div>Schema v{d.schemaVersion}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">
          Indicadores ({indicators.length})
        </h2>
        {indicators.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">Sin indicadores.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-700 rounded-xl border border-slate-700/40">
            {indicators.map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-medium">{i.name}</div>
                  <div className="text-xs text-slate-400">
                    {i.category} · {i.unit}
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  {i.slug}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
