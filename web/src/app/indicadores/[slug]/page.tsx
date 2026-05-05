import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/card";
import { PreviewTable } from "@/components/preview-table";
import { Stat } from "@/components/stat";
import { getIndicator } from "@/lib/api";

export default async function IndicatorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getIndicator(slug);
  if (!data) notFound();

  const { indicator, dataset, source, preview, previewError } = data;
  const rowCount = preview.length;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/indicadores"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Todos los indicadores
      </Link>

      <header className="mt-6">
        <span className="text-xs uppercase tracking-widest text-emerald-600">
          {indicator.category}
        </span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {indicator.name}
        </h1>
        {indicator.description ? (
          <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
            {indicator.description}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md bg-neutral-100 px-2.5 py-1 font-mono dark:bg-neutral-800">
            {indicator.slug}
          </span>
          <span className="rounded-md bg-neutral-100 px-2.5 py-1 dark:bg-neutral-800">
            unidad: {indicator.unit}
          </span>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Stat label="Filas en preview" value={String(rowCount)} hint="máx 200" />
        <Stat
          label="Dataset"
          value={dataset?.slug ?? "—"}
          hint={dataset?.title}
        />
        <Stat
          label="Fuente"
          value={source?.slug ?? "—"}
          hint={source?.name ?? undefined}
        />
      </section>

      {source ? (
        <div className="mt-6">
          <Link
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Sitio fuente <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}

      <section className="mt-10">
        <Card>
          <CardTitle>Preview de datos</CardTitle>
          <CardDescription>
            Primeras filas leídas directamente del Parquet en almacenamiento.
          </CardDescription>
          {previewError ? (
            <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
              {previewError}
            </p>
          ) : null}
          <div className="mt-4">
            <PreviewTable rows={preview} />
          </div>
        </Card>
      </section>
    </main>
  );
}
