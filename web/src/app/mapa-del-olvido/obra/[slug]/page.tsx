import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_OBRAS } from "@/lib/obras-mock";

const STATUS_LABEL: Record<string, string> = {
  inaugurada: "Inaugurada",
  abandonada: "Abandonada",
  parcial: "Parcial",
  en_construccion: "En construcción",
};

const TIPO_LABEL: Record<string, string> = {
  vialidad: "Vialidad",
  salud: "Salud",
  educacion: "Educación",
  vivienda: "Vivienda",
  agua: "Agua",
  energia: "Energía",
  otros: "Otros",
};

export async function generateStaticParams() {
  return MOCK_OBRAS.map((o) => ({ slug: o.slug }));
}

export default async function ObraDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const obra = MOCK_OBRAS.find((o) => o.slug === slug);
  if (!obra) notFound();

  const usd = (n?: number) =>
    n != null
      ? n.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })
      : "—";

  return (
    <article className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <Link
        href="/mapa-del-olvido"
        className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
      >
        ← Volver al mapa
      </Link>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{obra.nombre}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {obra.estado}
          {obra.municipio ? ` · ${obra.municipio}` : ""} ·{" "}
          {TIPO_LABEL[obra.tipo] ?? obra.tipo}
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-4 rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <Field label="Status" value={STATUS_LABEL[obra.status] ?? obra.status} />
        <Field label="Monto (USD)" value={usd(obra.monto_usd)} />
        <Field
          label="Año de inicio"
          value={obra.anio_inicio?.toString() ?? "—"}
        />
        <Field label="Año de fin" value={obra.anio_fin?.toString() ?? "—"} />
        {obra.lat != null && obra.lon != null && (
          <Field
            label="Coordenadas"
            value={`${obra.lat.toFixed(3)}, ${obra.lon.toFixed(3)}`}
          />
        )}
      </dl>

      {obra.fuente_url && (
        <div className="text-sm">
          <strong>Fuente:</strong>{" "}
          <a
            href={obra.fuente_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline dark:text-emerald-400"
          >
            {obra.fuente_url}
          </a>
        </div>
      )}
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-neutral-500">
        {label}
      </dt>
      <dd className="mt-1 text-base font-medium tabular-nums">{value}</dd>
    </div>
  );
}
