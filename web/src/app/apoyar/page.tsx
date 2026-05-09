import Link from "next/link";
import {
  Share2,
  AlertTriangle,
  Lightbulb,
  Github,
  Languages,
  Mail,
  Heart,
} from "lucide-react";
import { KofiButton } from "@/components/kofi-button";
import { SupportersWall } from "@/components/supporters-wall";
import { ShareButtons } from "@/components/share-buttons";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getSupporters } from "@/lib/api";

export const metadata = {
  title: "Apoyar — Cuentas Venezuela",
  description:
    "Cuentas Venezuela es un proyecto cívico independiente. Hay muchas formas de apoyar: compartir, reportar errores, sugerir fuentes, suscribirte a novedades o aportar.",
};

export const dynamic = "force-dynamic";

const REPO_URL =
  process.env.NEXT_PUBLIC_REPO_URL ??
  "https://github.com/donjonny/cuentas-venezuela";

const TIERS = [
  { icon: "☕", label: "Café", amount: "$3.000 CLP", aprox: "≈ USD $3" },
  { icon: "🥪", label: "Almuerzo", amount: "$10.000 CLP", aprox: "≈ USD $10" },
  { icon: "🎒", label: "Mochila", amount: "$25.000 CLP", aprox: "≈ USD $25" },
];

function Card({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-700/40 bg-slate-900/60 p-4 flex flex-col">
      <Icon className="h-5 w-5 text-cyan-400 mb-2" aria-hidden />
      <p className="font-semibold text-slate-100 mb-1 text-sm">{title}</p>
      <p className="text-xs text-slate-400 leading-relaxed mb-3">{desc}</p>
      {children && <div className="mt-auto pt-1">{children}</div>}
    </div>
  );
}

export default async function ApoyarPage() {
  const supporters = await getSupporters(60);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* 1. Hero */}
      <header className="mb-10">
        <p className="text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-2">
          Proyecto cívico independiente
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
          Hay muchas formas de apoyar
        </h1>
        <p className="text-slate-300 max-w-2xl leading-relaxed">
          Cuentas Venezuela existe gracias a quienes lo comparten, reportan
          errores, citan fuentes o aportan unos pesos. Todo suma.
        </p>
      </header>

      {/* 2. Cómo ayudar — grid único 6 cards (incluye share + newsletter inline) */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Cómo ayudar</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <Card
            icon={Share2}
            title="Compartir"
            desc="Recomendar a alguien que pueda usar estos datos."
          >
            <ShareButtons
              url="https://cuentasvenezuela.org"
              text="Cuentas Venezuela: datos oficiales sobre Venezuela y la diáspora venezolana, sin tracking ni publicidad."
            />
          </Card>

          <Card
            icon={Mail}
            title="Avisarme novedades"
            desc="Email cuando publiquemos nuevos datos. Sin spam."
          >
            <NewsletterSignup interest="general" helper="Frecuencia baja. Te puedes desuscribir cuando quieras." />
          </Card>

          <Card
            icon={AlertTriangle}
            title="Reportar dato errado"
            desc="Si ves un número raro o cita rota, avísanos."
          >
            <Link
              href="/mapa-del-olvido/reportar"
              className="inline-flex text-cyan-300 hover:text-cyan-200 text-sm"
            >
              Ir a reportar →
            </Link>
          </Card>

          <Card
            icon={Lightbulb}
            title="Sugerir nueva fuente"
            desc="¿Conoces un dataset oficial que falta?"
          >
            <a
              href="mailto:hola@cuentasvenezuela.org?subject=Sugerencia%20de%20fuente"
              className="inline-flex text-cyan-300 hover:text-cyan-200 text-sm"
            >
              Mandar link por mail →
            </a>
          </Card>

          <Card
            icon={Github}
            title="Contribuir en GitHub"
            desc="Código, tests, traducciones, issues. Open source."
          >
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-cyan-300 hover:text-cyan-200 text-sm"
            >
              Abrir repo →
            </a>
          </Card>

          <Card
            icon={Languages}
            title="Traducir / verificar"
            desc="Inglés, portugués, idiomas indígenas. Voluntario."
          >
            <a
              href="mailto:hola@cuentasvenezuela.org?subject=Voluntariado"
              className="inline-flex text-cyan-300 hover:text-cyan-200 text-sm"
            >
              Escribir →
            </a>
          </Card>
        </div>
      </section>

      {/* 3. Aportar — compacto: 1 línea costos + 3 tiers + 1 botón Ko-fi */}
      <section className="mb-12 rounded-xl border border-slate-700/40 bg-slate-900/40 p-5 sm:p-6">
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

      {/* 4. Supporters + FAQ */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
          <Heart className="h-4 w-4 text-pink-400" aria-hidden />
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
              <dt className="font-semibold text-slate-200">¿Por qué Ko-fi y no Patreon?</dt>
              <dd className="text-slate-400 mt-1">
                Menos comisión y permite aportes únicos sin compromisos.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-200">¿Puedo aportar de forma anónima?</dt>
              <dd className="text-slate-400 mt-1">
                Sí. Marca &quot;mantener privado&quot; en Ko-fi y no aparecerás en el muro.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-200">¿Hay contraprestación?</dt>
              <dd className="text-slate-400 mt-1">
                No. Datos abiertos para todos. El nombre en el muro es solo agradecimiento público.
              </dd>
            </div>
          </dl>
        </details>
      </section>

      <footer className="border-t border-slate-700/40 pt-6 text-xs text-slate-500 text-center">
        Gracias.
      </footer>
    </div>
  );
}
