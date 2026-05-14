import Link from "next/link";
import { ArrowLeft, MapPin, AlertTriangle } from "lucide-react";
import { listObras, type ObraPublic } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbsJsonLd } from "@/components/json-ld";

// Server-rendered catalog of all obras. The interactive map (deck.gl +
// maplibre-gl) at /mapa-del-olvido stays as an SPA. This route gives
// Google something to actually index: a real HTML page with named obras
// grouped by estado, each link pointing to a server-rendered detail page.

export const metadata = pageMetadata({
  title: "Catálogo de obras paralizadas en Venezuela",
  description:
    "Listado completo de obras públicas paralizadas, críticas e inoperativas en Venezuela. Agrupadas por estado, con presupuesto, contratista y responsable político.",
  path: "/mapa-del-olvido/obras",
});

export const dynamic = "force-dynamic";

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

const fmtUsd = (n: number) =>
  n >= 1_000_000_000
    ? `$${(n / 1_000_000_000).toFixed(2)} mil M USD`
    : n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(1)} M USD`
      : `$${n.toLocaleString("es-VE")} USD`;

export default async function ObrasIndexPage() {
  const obras = await listObras();

  // Group by estado_venezuela for readable navigation. Falls back to
  // "Sin estado" for any row missing the field.
  const grouped = obras.reduce<Record<string, ObraPublic[]>>((acc, o) => {
    const key = o.estado_venezuela || "Sin estado";
    (acc[key] ??= []).push(o);
    return acc;
  }, {});
  const estadosOrdenados = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b, "es"),
  );

  const totalUsd = obras.reduce((s, o) => s + (o.presupuesto_usd ?? 0), 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbsJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Mapa del Olvido", path: "/mapa-del-olvido" },
          { name: "Catálogo de obras", path: "/mapa-del-olvido/obras" },
        ])}
      />

      <Link
        href="/mapa-del-olvido"
        className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 text-sm mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al mapa interactivo
      </Link>

      <header className="mb-10">
        <p className="text-rose-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Mapa del Olvido · Catálogo
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Obras paralizadas, críticas e inoperativas en Venezuela
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          {obras.length} obras documentadas en {estadosOrdenados.length}{" "}
          estados, con presupuesto público anunciado de {fmtUsd(totalUsd)}.
          Cada ficha incluye contratista, responsable político al iniciar la
          obra, sobrecosto y fuente original.
        </p>
      </header>

      <nav className="mb-10 flex flex-wrap gap-2 text-xs">
        {estadosOrdenados.map((estado) => (
          <a
            key={estado}
            href={`#${estado.toLowerCase().replace(/\s+/g, "-")}`}
            className="rounded-md border border-slate-700/50 bg-slate-900/50 px-2.5 py-1 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-200"
          >
            {estado}{" "}
            <span className="ml-1 text-slate-500">
              ({grouped[estado].length})
            </span>
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {estadosOrdenados.map((estado) => (
          <section
            key={estado}
            id={estado.toLowerCase().replace(/\s+/g, "-")}
            className="scroll-mt-20"
          >
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight">
              <MapPin className="h-5 w-5 text-rose-400" />
              {estado}
              <span className="ml-1 text-sm font-normal text-slate-500">
                · {grouped[estado].length} obras
              </span>
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[estado]
                .slice()
                .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
                .map((o) => {
                  const status = ESTATUS_LABEL[o.estatus];
                  return (
                    <li key={o.id}>
                      <Link
                        href={`/mapa-del-olvido/obras/${o.id}`}
                        className="block h-full rounded-xl border border-slate-700/40 bg-slate-900/40 p-4 transition hover:border-cyan-500/40 hover:bg-slate-900/70"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-slate-100">
                            {o.nombre}
                          </h3>
                          <span
                            className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                          <span className="rounded-md bg-slate-800 px-2 py-0.5">
                            {o.categoria}
                          </span>
                          <span className="rounded-md bg-slate-800 px-2 py-0.5">
                            desde {o.anio_inicio}
                          </span>
                        </div>
                        <div className="mt-3 text-sm font-mono text-amber-300">
                          {fmtUsd(o.presupuesto_usd)}
                        </div>
                        {o.descripcion ? (
                          <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                            {o.descripcion}
                          </p>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}

        {obras.length === 0 ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-300">
            <AlertTriangle className="mr-2 inline h-4 w-4" />
            No fue posible cargar el catálogo de obras en este momento.
          </div>
        ) : null}
      </div>
    </main>
  );
}
