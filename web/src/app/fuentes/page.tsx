import Link from "next/link";
import { ExternalLink, Globe2, Flag } from "lucide-react";
import { listSources, type Source } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Fuentes oficiales",
  description:
    "Listado de las fuentes oficiales usadas en todos los dashboards: organismo, licencia, URL original y descripción. Sin fuente, no publicamos el dato.",
  path: "/fuentes",
});

export const dynamic = "force-dynamic";

// Tag each source as Chile-side or VE/global so we can group + filter.
// Anything not in this set falls under "Otras".
const CHILE_SLUGS = new Set(["sermig", "ine", "sii", "sp", "mineduc", "sjm"]);
const VE_SLUGS = new Set([
  "world-bank",
  "freedom-house",
  "unhcr",
  "unodc",
  "mapa-olvido-base",
]);

function SourceCard({ s }: { s: Source }) {
  return (
    <article
      id={s.slug}
      className="rounded-xl border border-slate-700/40 bg-slate-900/80 p-5 scroll-mt-20"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-100 mb-0.5">
            {s.name}
          </h3>
          <p className="text-xs text-slate-400">{s.organization}</p>
        </div>
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir ${s.name} en nueva pestaña`}
          className="shrink-0 inline-flex items-center gap-1 rounded-md border border-slate-700/40 hover:border-cyan-400/60 text-cyan-300 hover:text-cyan-200 text-xs px-2.5 py-1.5"
        >
          Abrir <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      {s.description && (
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          {s.description}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="rounded-full border border-slate-700/40 bg-slate-900/60 px-2 py-0.5">
          Licencia: <span className="text-slate-300">{s.license ?? "no especificada"}</span>
        </span>
        <code className="text-slate-500">{s.slug}</code>
      </div>
    </article>
  );
}

function Section({
  id,
  title,
  icon: Icon,
  desc,
  sources,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  desc: string;
  sources: Source[];
}) {
  if (sources.length === 0) return null;
  return (
    <section id={id} className="mb-12 scroll-mt-20">
      <header className="mb-4 flex items-center gap-3">
        <Icon className="h-6 w-6 text-orange-400" aria-hidden />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">{title}</h2>
          <p className="text-sm text-slate-400">{desc}</p>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {sources.map((s) => (
          <SourceCard key={s.id} s={s} />
        ))}
      </div>
    </section>
  );
}

export default async function FuentesPage() {
  const all = await listSources();

  const chile = all.filter((s) => CHILE_SLUGS.has(s.slug));
  const venezuela = all.filter((s) => VE_SLUGS.has(s.slug));
  const other = all.filter(
    (s) => !CHILE_SLUGS.has(s.slug) && !VE_SLUGS.has(s.slug),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Transparencia
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
          Fuentes oficiales
        </h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed mb-3">
          Toda cifra publicada cita el organismo y enlace original.
          Si crees que un dato está mal, ve a la fuente directa, verifícalo,
          y avísanos vía{" "}
          <Link href="/mapa-del-olvido/reportar" className="text-cyan-300 hover:text-cyan-200">
            reporte ciudadano
          </Link>{" "}
          o GitHub issue.
        </p>
        <nav aria-label="Saltar a sección" className="text-xs text-slate-400">
          Saltar a:{" "}
          <a href="#chile" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">Chile</a>
          {" · "}
          <a href="#venezuela" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">Venezuela / global</a>
          {other.length > 0 && (
            <>
              {" · "}
              <a href="#otras" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">Otras</a>
            </>
          )}
        </nav>
      </header>

      {all.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-700/40 p-8 text-center text-sm text-slate-400">
          Sin fuentes registradas. Aplica <code className="text-cyan-300">db/seeds.sql</code>.
        </p>
      ) : (
        <>
          <Section
            id="chile"
            title="Chile"
            icon={Flag}
            desc="Organismos chilenos: migración, empleo, pensiones, tributario, educación."
            sources={chile}
          />
          <Section
            id="venezuela"
            title="Venezuela / global"
            icon={Globe2}
            desc="Organismos multilaterales y observatorios para indicadores de Venezuela y la diáspora."
            sources={venezuela}
          />
          {other.length > 0 && (
            <Section
              id="otras"
              title="Otras"
              icon={Globe2}
              desc="Fuentes sin clasificar."
              sources={other}
            />
          )}
        </>
      )}

      <footer className="mt-10 border-t border-slate-700/40 pt-6 text-xs text-slate-500 space-y-2">
        <p>
          Los datasets agregados (Parquet en R2) se generan vía ETL en
          GitHub Actions y citan extracted_at para reproducibilidad.
        </p>
        <p>
          ¿Conoces una fuente oficial relevante que falta? Mándanos el
          link a{" "}
          <a
            href="mailto:hola@cuentasvenezuela.org?subject=Sugerencia%20de%20fuente"
            className="text-cyan-300 hover:text-cyan-200"
          >
            hola@cuentasvenezuela.org
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
