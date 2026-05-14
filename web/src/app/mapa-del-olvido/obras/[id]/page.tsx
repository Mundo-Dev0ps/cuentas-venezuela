import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin, AlertTriangle } from "lucide-react";
import { getObra, listObras, type ObraPublic } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbsJsonLd } from "@/components/json-ld";

// Per-obra server-rendered detail page. The interactive map at
// /mapa-del-olvido is an SPA and not indexable; these pages give Google
// (and human readers without JS) one HTML page per documented obra.

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuentasvenezuela.org";

const ESTATUS_LABEL: Record<ObraPublic["estatus"], { label: string; color: string }> = {
  paralizada: {
    label: "Paralizada",
    color: "border-rose-500/40 bg-rose-500/5 text-rose-300",
  },
  critica: {
    label: "Crítica",
    color: "border-amber-500/40 bg-amber-500/5 text-amber-300",
  },
  inoperativa: {
    label: "Inoperativa",
    color: "border-slate-500/40 bg-slate-500/5 text-slate-300",
  },
};

const fmtUsd = (n: number | null | undefined) =>
  n == null
    ? "—"
    : n >= 1_000_000_000
      ? `$${(n / 1_000_000_000).toFixed(2)} mil M USD`
      : n >= 1_000_000
        ? `$${(n / 1_000_000).toFixed(1)} M USD`
        : `$${n.toLocaleString("es-VE")} USD`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const obra = await getObra(id);
  if (!obra) {
    return pageMetadata({
      title: "Obra no encontrada",
      description: "La obra solicitada no existe en el catálogo.",
      path: `/mapa-del-olvido/obras/${id}`,
    });
  }
  const status = ESTATUS_LABEL[obra.estatus]?.label ?? obra.estatus;
  return pageMetadata({
    title: `${obra.nombre} — ${obra.estado_venezuela}`,
    description:
      obra.descripcion ??
      `${obra.nombre} en ${obra.estado_venezuela}, categoría ${obra.categoria}. Estado: ${status}. Presupuesto: ${fmtUsd(obra.presupuesto_usd)}.`,
    path: `/mapa-del-olvido/obras/${id}`,
    type: "article",
  });
}

export const dynamic = "force-dynamic";

/**
 * Tell Next which ids to pre-render at build time. Returning all ids
 * fits comfortably on the free tier (~70 obras) and gives every page a
 * cache hit on first request.
 */
export async function generateStaticParams() {
  const obras = await listObras();
  return obras.map((o) => ({ id: o.id }));
}

export default async function ObraDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const obra = await getObra(id);
  if (!obra) notFound();

  const status = ESTATUS_LABEL[obra.estatus];

  // schema.org Article — Google understands documented public works as
  // editorial content. Adding spatialCoverage (Place) makes the page
  // eligible for local-search surfaces.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: obra.nombre,
    description: obra.descripcion ?? `Obra pública ${status.label.toLowerCase()} en ${obra.estado_venezuela}, Venezuela.`,
    inLanguage: "es",
    url: `${SITE_URL}/mapa-del-olvido/obras/${obra.id}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Cuentas Venezuela",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Cuentas Venezuela",
      url: SITE_URL,
    },
    contentLocation: {
      "@type": "Place",
      name: `${obra.estado_venezuela}, Venezuela`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: obra.coordenadas.lat,
        longitude: obra.coordenadas.lng,
      },
    },
    keywords: [
      obra.estado_venezuela,
      obra.categoria,
      status.label,
      "Venezuela",
      "obras paralizadas",
      "obras públicas",
      "Mapa del Olvido",
    ].join(", "),
    ...(obra.fuente_url ? { sameAs: obra.fuente_url } : {}),
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Mapa del Olvido", path: "/mapa-del-olvido" },
          { name: "Catálogo de obras", path: "/mapa-del-olvido/obras" },
          { name: obra.nombre, path: `/mapa-del-olvido/obras/${obra.id}` },
        ])}
      />
      <JsonLd data={articleJsonLd} />

      <Link
        href="/mapa-del-olvido/obras"
        className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 text-sm mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md bg-slate-800 px-2 py-1 text-slate-300">
            <MapPin className="mr-1 inline h-3 w-3" />
            {obra.estado_venezuela}
          </span>
          <span className="rounded-md bg-slate-800 px-2 py-1 text-slate-300">
            {obra.categoria}
          </span>
          <span
            className={`rounded-md border px-2 py-1 font-medium uppercase tracking-wide ${status.color}`}
          >
            <AlertTriangle className="mr-1 inline h-3 w-3" />
            {status.label}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {obra.nombre}
        </h1>
        {obra.descripcion ? (
          <p className="mt-4 max-w-3xl text-slate-300">{obra.descripcion}</p>
        ) : null}
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Presupuesto público" value={fmtUsd(obra.presupuesto_usd)} />
        {obra.presupuesto_original_usd != null ? (
          <Stat
            label="Presupuesto original"
            value={fmtUsd(obra.presupuesto_original_usd)}
          />
        ) : null}
        {obra.sobrecosto_pct != null ? (
          <Stat
            label="Sobrecosto"
            value={`${obra.sobrecosto_pct.toLocaleString("es-VE")}%`}
            tone="warning"
          />
        ) : null}
        {obra.progreso_pct != null ? (
          <Stat
            label="Progreso al paralizarse"
            value={`${obra.progreso_pct}%`}
          />
        ) : null}
        <Stat label="Año de inicio" value={String(obra.anio_inicio)} />
        <Stat label="Ente responsable" value={obra.ente_responsable || "—"} />
        {obra.contratista ? (
          <Stat label="Contratista" value={obra.contratista} />
        ) : null}
        {obra.responsable_politico ? (
          <Stat
            label="Responsable político"
            value={obra.responsable_politico}
            hint={obra.partido_politico ?? undefined}
          />
        ) : null}
      </section>

      <section className="mt-10 rounded-xl border border-slate-700/40 bg-slate-900/40 p-5">
        <h2 className="mb-2 text-lg font-semibold">Ubicación</h2>
        <p className="text-sm text-slate-400">
          {obra.estado_venezuela}, Venezuela ·{" "}
          <span className="font-mono">
            {obra.coordenadas.lat.toFixed(4)}, {obra.coordenadas.lng.toFixed(4)}
          </span>
        </p>
        <Link
          href={`/mapa-del-olvido#${obra.id}`}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-500/5 px-3 py-1.5 text-sm text-cyan-200 hover:bg-cyan-500/10"
        >
          Ver en el mapa interactivo →
        </Link>
      </section>

      {obra.fuente_url ? (
        <section className="mt-8 text-sm text-slate-300">
          <span className="text-slate-500">Fuente original: </span>
          <Link
            href={obra.fuente_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200"
          >
            {new URL(obra.fuente_url).hostname}
            <ExternalLink className="h-3 w-3" />
          </Link>
        </section>
      ) : null}

      <section className="mt-10 rounded-xl border border-slate-700/40 bg-slate-900/40 p-5 text-sm text-slate-400">
        ¿Conoces información adicional sobre esta obra (estado actual,
        fotos, costos verificados)?{" "}
        <Link
          href="/mapa-del-olvido/reportar"
          className="font-medium text-cyan-300 hover:text-cyan-200"
        >
          Reporta lo que sabés →
        </Link>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "warning";
}) {
  return (
    <div className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </div>
      <div
        className={`mt-1 text-lg font-semibold ${tone === "warning" ? "text-amber-300" : "text-slate-100"}`}
      >
        {value}
      </div>
      {hint ? <div className="mt-0.5 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}
