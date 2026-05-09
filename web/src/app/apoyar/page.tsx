import { Coffee, Server, Database, Code, Heart } from "lucide-react";
import { KofiButton } from "@/components/kofi-button";
import { KofiFeed } from "@/components/kofi-feed";
import { SupportersWall } from "@/components/supporters-wall";
import { HelpWays } from "@/components/help-ways";
import { ShareButtons } from "@/components/share-buttons";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getSupporters } from "@/lib/api";

export const metadata = {
  title: "Apoyar — Cuentas Venezuela",
  description:
    "Cuentas Venezuela es un proyecto cívico independiente sin publicidad ni datos de usuarios. Hay muchas formas de apoyar: compartir, reportar errores, sugerir fuentes o aportar.",
};

export const dynamic = "force-dynamic";

const KOFI_URL =
  process.env.NEXT_PUBLIC_KOFI_URL ?? "https://ko-fi.com/donjonny";

const TIERS = [
  {
    icon: "☕",
    label: "Café",
    amount: "$3.000 CLP",
    aprox: "≈ USD $3",
    bullets: ["1 día de servidor", "Tu nombre en muro de apoyo"],
  },
  {
    icon: "🥪",
    label: "Almuerzo",
    amount: "$10.000 CLP",
    aprox: "≈ USD $10",
    bullets: ["4 días de servidor + APIs", "Tu nombre + mensaje en muro"],
  },
  {
    icon: "🎒",
    label: "Mochila",
    amount: "$25.000 CLP",
    aprox: "≈ USD $25",
    bullets: ["2 semanas de infra", "Mención destacada"],
  },
];

const COSTS = [
  { icon: Server, label: "Servidores y CDN", desc: "Frontend + API edge global" },
  { icon: Database, label: "Base de datos", desc: "Postgres con histórico desde 1998" },
  { icon: Code, label: "Tiempo de desarrollo", desc: "Pipelines ETL, indicadores nuevos, mantenimiento" },
];

export default async function ApoyarPage() {
  const supporters = await getSupporters(60);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Hero — tono humano, sin CTA monetario inmediato */}
      <header className="mb-12">
        <p className="text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-2">
          Proyecto cívico independiente
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
          Hay muchas formas de apoyar
        </h1>
        <p className="text-slate-300 max-w-2xl leading-relaxed">
          Cuentas Venezuela existe porque mucha gente decidió compartirlo,
          reportar errores, citar las fuentes en su trabajo, o aportar
          unos pesos para los servidores. Todo suma. No tienes que pagar para
          que esto siga existiendo — pero si puedes, gracias.
        </p>
      </header>

      {/* 1. Otras formas de ayudar (NO monetario, primero) */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-100 mb-2">
          Sin gastar nada
        </h2>
        <p className="text-sm text-slate-400 mb-5">
          Las acciones más útiles muchas veces no cuestan dinero.
        </p>
        <HelpWays />
      </section>

      {/* 2. Newsletter / suscribirse a alertas */}
      <section className="mb-12 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-1">
          Que te avisemos cuando haya algo nuevo
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Email cuando publiquemos un dataset o dashboard. Frecuencia baja.
        </p>
        <NewsletterSignup interest="general" />
      </section>

      {/* 3. Compartir */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-100 mb-1">Compartir</h2>
        <p className="text-sm text-slate-400 mb-4">
          Recomendar a alguien que pueda usar estos datos.
        </p>
        <ShareButtons
          url="https://cuentasvenezuela.org"
          text="Cuentas Venezuela: datos oficiales sobre Venezuela y la diáspora venezolana, sin tracking ni publicidad."
        />
      </section>

      {/* 4. Costos transparentes */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-100 mb-1">
          Si decides aportar
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          En qué se va cada peso. Costo operativo aproximado: USD 30–50 al mes
          según tráfico.
        </p>
        <ul className="grid gap-4 sm:grid-cols-3">
          {COSTS.map(({ icon: Icon, label, desc }) => (
            <li
              key={label}
              className="rounded-lg border border-slate-700/40 bg-slate-900/60 p-4"
            >
              <Icon className="h-5 w-5 text-cyan-400 mb-2" aria-hidden />
              <p className="font-semibold text-slate-100 mb-1">{label}</p>
              <p className="text-sm text-slate-400">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Tiers psicológicos — más sutiles, sin "más popular", botón cyan no pink */}
      <section className="mb-12">
        <h2 className="text-base font-semibold text-slate-200 mb-1">
          Aportes sugeridos
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Solo referencia — Ko-fi acepta cualquier monto, una vez o mensual.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.label}
              className="rounded-lg border border-slate-700/40 bg-slate-900/60 p-4"
            >
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl" aria-hidden>{t.icon}</span>
                <span className="text-slate-300 text-sm font-semibold">{t.label}</span>
              </div>
              <p className="text-lg font-bold text-slate-100 font-mono leading-none mb-0.5">
                {t.amount}
              </p>
              <p className="text-[0.7rem] text-slate-500 mb-3">{t.aprox}</p>
              <ul className="space-y-1 text-xs text-slate-400 mb-4">
                {t.bullets.map((b, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-cyan-400" aria-hidden>·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <KofiButton
                variant="footer"
                source={`apoyar-tier-${t.label.toLowerCase()}`}
                label="Aportar este monto"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 6. Botón Ko-fi general (sin cargar iframe) */}
      <section className="mb-12 rounded-xl border border-slate-700/40 bg-slate-900/40 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-slate-200 mb-1">
          Aportar otra cantidad
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          También puedes elegir tu propio monto en Ko-fi. Pagos vía Stripe o PayPal.
          No guardamos datos de pago.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <KofiButton variant="pill" source="apoyar-cta-fallback" />
          <span className="text-xs text-slate-500">
            o cargar el feed embebido abajo ↓
          </span>
        </div>
      </section>

      {/* 7. Feed Ko-fi opt-in (lazy) */}
      <section className="mb-12">
        <details className="rounded-lg border border-slate-700/40 bg-slate-900/40 p-4">
          <summary className="cursor-pointer text-sm text-slate-300 hover:text-cyan-300 select-none flex items-center gap-2">
            <Coffee className="h-4 w-4" aria-hidden />
            Mostrar feed Ko-fi embebido (3rd-party)
          </summary>
          <div className="mt-4">
            <KofiFeed url={KOFI_URL} height={520} />
          </div>
        </details>
      </section>

      {/* 8. Supporters wall */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-100 mb-1 flex items-center gap-2">
          <Heart className="h-4 w-4 text-pink-400" aria-hidden />
          Quienes hicieron esto posible
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Aportes públicos recientes. Si donaste anónimamente, también te lo
          agradecemos enormemente.
        </p>
        <SupportersWall supporters={supporters} />
      </section>

      {/* 9. FAQ */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Preguntas</h2>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-200">¿Tengo que aportar para usar el sitio?</dt>
            <dd className="text-slate-400 mt-1">
              No. Todo el contenido es y será gratuito. Aportar es opcional.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">¿Por qué no usan Patreon o suscripción?</dt>
            <dd className="text-slate-400 mt-1">
              Ko-fi cobra menos comisión y permite aportes únicos sin compromisos.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">¿Hay contraprestación?</dt>
            <dd className="text-slate-400 mt-1">
              No. Datos abiertos para todos. El nombre en el muro es nuestra
              forma de agradecer públicamente, nada más.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">¿Puedo aportar de forma anónima?</dt>
            <dd className="text-slate-400 mt-1">
              Sí. Marca &quot;mantener privado&quot; en Ko-fi y no aparecerás en el muro.
            </dd>
          </div>
        </dl>
      </section>

      <footer className="border-t border-slate-700/40 pt-6 text-xs text-slate-500 text-center">
        Gracias por considerar apoyar. Esto existe porque gente como tú lo sostiene.
      </footer>
    </div>
  );
}
