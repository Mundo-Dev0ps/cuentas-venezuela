import Link from "next/link";
import {
  Share2,
  AlertTriangle,
  Lightbulb,
  Github,
  Languages,
  Heart,
  ArrowRight,
} from "lucide-react";
import { KofiButton } from "@/components/kofi-button";
import { SupportersWall } from "@/components/supporters-wall";
import { ShareButtons } from "@/components/share-buttons";
import { getSupporters } from "@/lib/api";

export const metadata = {
  title: "Apoyar — Cuentas Venezuela",
  description:
    "Cuentas Venezuela es un proyecto cívico independiente. Hay muchas formas de apoyar: compartir, reportar errores, suscribirse a novedades o aportar.",
};

export const dynamic = "force-dynamic";

const REPO_URL =
  process.env.NEXT_PUBLIC_REPO_URL ??
  "https://github.com/Mundo-Dev0ps/cuentas-venezuela";

const TIERS = [
  { icon: "☕", label: "Café", amount: "$3.000 CLP", aprox: "≈ USD $3" },
  { icon: "🥪", label: "Almuerzo", amount: "$10.000 CLP", aprox: "≈ USD $10" },
  { icon: "🎒", label: "Mochila", amount: "$25.000 CLP", aprox: "≈ USD $25" },
];

function Row({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 border-b border-slate-700/30 last:border-0">
      <div className="flex items-center gap-3 sm:min-w-[180px]">
        <Icon className="h-5 w-5 text-cyan-400 shrink-0" aria-hidden />
        <span className="font-semibold text-slate-100 text-sm">{title}</span>
      </div>
      <div className="flex-1 sm:flex sm:justify-end">{children}</div>
    </li>
  );
}

export default async function ApoyarPage() {
  const supporters = await getSupporters(6);
  const linkCls = "inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 text-sm";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* 1. Hero — 1 línea */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-1">
          Apoyar
        </h1>
        <p className="text-slate-400 text-sm">
          Proyecto cívico independiente. Sin anuncios, sin tracking. Vive de
          aportes voluntarios y comunidad.
        </p>
      </header>

      {/* 2. Cómo ayudar — lista de filas */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Sin gastar nada
        </h2>
        <ul className="rounded-lg border border-slate-700/40 bg-slate-900/40 px-4 sm:px-5">
          <Row icon={Share2} title="Compartir">
            <ShareButtons
              url="https://cuentasvenezuela.org"
              text="Cuentas Venezuela: datos oficiales sobre Venezuela y la diáspora venezolana, sin tracking ni publicidad."
            />
          </Row>

          <Row icon={AlertTriangle} title="Reportar dato errado">
            <Link href="/mapa-del-olvido/reportar" className={linkCls}>
              Ir a reportar <ArrowRight className="h-3 w-3" />
            </Link>
          </Row>

          <Row icon={Lightbulb} title="Sugerir nueva fuente">
            <a
              href="mailto:hola@cuentasvenezuela.org?subject=Sugerencia%20de%20fuente"
              className={linkCls}
            >
              Mandar por mail <ArrowRight className="h-3 w-3" />
            </a>
          </Row>

          <Row icon={Github} title="Contribuir en GitHub">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkCls}
            >
              Abrir repo <ArrowRight className="h-3 w-3" />
            </a>
          </Row>

          <Row icon={Languages} title="Traducir / verificar">
            <a
              href="mailto:hola@cuentasvenezuela.org?subject=Voluntariado"
              className={linkCls}
            >
              Escribir <ArrowRight className="h-3 w-3" />
            </a>
          </Row>
        </ul>
      </section>

      {/* 3. Aportar — intacto, gusta */}
      <section className="mb-10 rounded-xl border border-slate-700/40 bg-slate-900/40 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-1">Aportar</h2>
        <p className="text-sm text-slate-400 mb-5">
          Costo operativo aprox <span className="text-slate-300">USD 30–50/mes</span> (servidores, base de datos, desarrollo). Cada aporte ayuda. Pagos vía Ko-fi (Stripe/PayPal). Sin contraprestación: todo sigue gratis.
        </p>

        <div className="grid gap-2 sm:grid-cols-3 mb-5">
          {TIERS.map((t) => (
            <div
              key={t.label}
              className="rounded-md border border-slate-700/40 bg-slate-900/60 px-3 py-2.5 flex items-center gap-3"
            >
              <span className="text-2xl shrink-0" aria-hidden>{t.icon}</span>
              <div className="min-w-0">
                <p className="text-slate-300 text-xs font-semibold leading-none mb-1">
                  {t.label}
                </p>
                <p className="text-sm font-mono font-bold text-slate-100 leading-none">
                  {t.amount}
                </p>
                <p className="text-[0.65rem] text-slate-500 mt-0.5">{t.aprox}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <KofiButton variant="pill" source="apoyar-cta" />
          <span className="text-xs text-slate-500">
            Ko-fi acepta cualquier monto, una vez o mensual.
          </span>
        </div>
      </section>

      {/* 4. Quienes hicieron esto posible — limitado a 6 + FAQ corto */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
          <Heart className="h-3 w-3 text-pink-400" aria-hidden />
          Quienes hicieron esto posible
        </h2>
        <SupportersWall supporters={supporters} />

        <details className="mt-8 rounded-lg border border-slate-700/40 bg-slate-900/40 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-200 hover:text-cyan-300 select-none">
            Preguntas frecuentes
          </summary>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-slate-200">¿Tengo que aportar para usar el sitio?</dt>
              <dd className="text-slate-400 mt-1">
                No. Todo el contenido es y será gratuito. Aportar es opcional.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-200">¿Puedo aportar de forma anónima?</dt>
              <dd className="text-slate-400 mt-1">
                Sí. Marca &quot;mantener privado&quot; en Ko-fi y no aparecerás en el muro.
              </dd>
            </div>
          </dl>
        </details>
      </section>
    </div>
  );
}
