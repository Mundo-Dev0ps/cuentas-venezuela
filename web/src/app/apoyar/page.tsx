import { Coffee, Server, Database, Code, Heart } from "lucide-react";
import { KofiButton } from "@/components/kofi-button";
import { KofiFeed } from "@/components/kofi-feed";
import { SupportersWall } from "@/components/supporters-wall";
import { getSupporters } from "@/lib/api";

export const metadata = {
  title: "Apoyar — Cuentas Venezuela",
  description:
    "Cuentas Venezuela es un proyecto cívico independiente sin publicidad ni datos de usuarios. Tu aporte mantiene los servidores, los datos y el desarrollo activos.",
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
    bullets: [
      "Cubre 1 día de servidor",
      "Tu nombre aparece en muro de apoyo",
    ],
  },
  {
    icon: "🥪",
    label: "Almuerzo",
    amount: "$10.000 CLP",
    aprox: "≈ USD $10",
    bullets: [
      "Cubre 4 días de servidor + APIs",
      "Tu nombre + mensaje en muro",
      "Sticker mental de gratitud eterna",
    ],
    featured: true,
  },
  {
    icon: "🎒",
    label: "Mochila",
    amount: "$25.000 CLP",
    aprox: "≈ USD $25",
    bullets: [
      "Cubre 2 semanas de infra",
      "Mención destacada en muro",
      "Acceso anticipado a nuevos dashboards",
    ],
  },
];

const COSTS = [
  { icon: Server, label: "Servidores y CDN", desc: "Frontend + API edge global" },
  { icon: Database, label: "Base de datos", desc: "Postgres con histórico desde 1998" },
  { icon: Code, label: "Tiempo de desarrollo", desc: "Pipelines ETL, nuevos indicadores, mantenimiento" },
];

export default async function ApoyarPage() {
  const supporters = await getSupporters(60);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Hero */}
      <header className="mb-12 text-center">
        <p className="text-pink-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Proyecto cívico independiente
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
          Si te sirvió, ayúdanos a sostenerlo
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
          Cuentas Venezuela es 100% independiente. Sin anuncios, sin tracking
          intrusivo, sin venta de datos. Vive de aportes voluntarios. Cada peso
          va a servidores, datos oficiales y tiempo de desarrollo.
        </p>
        <KofiButton variant="card" source="apoyar-hero" />
      </header>

      {/* Tiers psicológicos */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-100 mb-4 text-center">
          Aportes sugeridos
        </h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          Solo referencia — Ko-fi acepta cualquier monto, una vez o mensual.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.label}
              className={`rounded-xl border p-5 ${
                t.featured
                  ? "border-pink-400/60 bg-pink-500/5 ring-1 ring-pink-400/30"
                  : "border-slate-700/40 bg-slate-900/60"
              }`}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl" aria-hidden>
                  {t.icon}
                </span>
                {t.featured && (
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-pink-300 bg-pink-400/10 border border-pink-400/40 rounded-full px-2 py-0.5">
                    Más popular
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-sm font-semibold mb-1">
                {t.label}
              </p>
              <p className="text-xl font-bold text-slate-100 font-mono mb-0">
                {t.amount}
              </p>
              <p className="text-xs text-slate-500 mb-4">{t.aprox}</p>
              <ul className="space-y-1 text-sm text-slate-300 mb-4">
                {t.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-pink-400" aria-hidden>
                      •
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <KofiButton
                variant="pill"
                source={`apoyar-tier-${t.label.toLowerCase()}`}
                className="w-full justify-center"
                label={`Aportar ${t.icon}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Costos transparentes */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          ¿En qué se va tu aporte?
        </h2>
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
        <p className="mt-4 text-xs text-slate-500">
          Costo operativo aproximado: USD 30–50/mes según tráfico. Cada aporte
          de USD 10 cubre 5–7 días.
        </p>
      </section>

      {/* Ko-fi embed (lazy-loaded behind click) */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          Aportar directo
        </h2>
        <KofiFeed url={KOFI_URL} height={600} />
        <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
          <Coffee className="h-3 w-3" aria-hidden />
          Pagos seguros vía Ko-fi (Stripe / PayPal). No guardamos tus datos de pago.
        </p>
      </section>

      {/* Supporters wall */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-100 mb-1 flex items-center gap-2">
          <Heart className="h-4 w-4 text-pink-400" aria-hidden />
          Quienes hacen esto posible
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Aportes públicos recientes. Si donaste anónimamente o pediste no
          aparecer, no estás listado, pero también te lo agradecemos enormemente.
        </p>
        <SupportersWall supporters={supporters} />
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Preguntas</h2>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-slate-200">¿Por qué no usan Patreon o suscripción?</dt>
            <dd className="text-slate-400 mt-1">
              Ko-fi cobra menos comisión y permite aportes únicos sin compromisos.
              Queremos que apoyes solo si te sirve, cuando te sirva.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">¿Hay contraprestación?</dt>
            <dd className="text-slate-400 mt-1">
              No. Todos los datos seguirán siendo abiertos y gratuitos. Tu
              nombre en el muro es nuestra forma de agradecer públicamente.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">¿Puedo aportar de forma anónima?</dt>
            <dd className="text-slate-400 mt-1">
              Sí. En Ko-fi puedes marcar &quot;mantener privado&quot; y no aparecerás en el muro.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-200">¿Necesitas ayuda no-monetaria?</dt>
            <dd className="text-slate-400 mt-1">
              Sí — reportar errores en datos, sugerir fuentes, traducir o
              compartir el sitio también suma. Escríbenos.
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
