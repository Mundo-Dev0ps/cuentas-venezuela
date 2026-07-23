import Link from "next/link";
import {
  TrendingDown,
  Activity,
  Users,
  ShieldAlert,
  ShieldOff,
  HeartPulse,
  Scale,
  History,
  Newspaper,
  Globe2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { DAMAGE, fmtNum } from "./sismo-2026/data";

export const metadata = pageMetadata({
  title: "Venezuela en datos",
  description:
    "Crisis económica, diáspora global, derechos humanos, salud, inseguridad y comparativas antes/después. Datos oficiales agregados y citados.",
  path: "/venezuela",
});

const SECTIONS = [
  {
    href: "/venezuela/sismo-2026",
    icon: AlertTriangle,
    color: "text-red-400",
    title: "Terremoto 2026",
    desc: `Doble sismo Mw 7,5 y 7,2 del 24 de junio de 2026. ≥${fmtNum(DAMAGE.dead)} muertos, ≥${fmtNum(DAMAGE.injured)} heridos, estados afectados y daños PNUD $4,7–8,7 mil millones. Fuentes: USGS, OCHA, PNUD.`,
    badge: "Disponible",
  },
  {
    href: "/venezuela/antes-despues",
    icon: TrendingDown,
    color: "text-rose-400",
    title: "Antes y después",
    desc: "1998 vs hoy: PIB, esperanza de vida, salud, educación. Datos del Banco Mundial.",
    badge: "Disponible",
  },
  {
    href: "/venezuela/recibido-vs-hoy",
    icon: TrendingDown,
    color: "text-rose-400",
    title: "Cómo lo recibió el chavismo",
    desc: "1998 vs hoy: pobreza (ENCOVI), producción petrolera, inflación, PIB per cápita, desempleo y deuda. Cifra de entonces, cifra de hoy y tendencia. Cada dato citado.",
    badge: "Disponible",
  },
  {
    href: "/venezuela/economia",
    icon: Activity,
    color: "text-amber-400",
    title: "Crisis económica",
    desc: "PIB, inflación, desempleo, deuda y comercio exterior 1998-2024.",
    badge: "Disponible",
  },
  {
    href: "/venezuela/inseguridad",
    icon: ShieldOff,
    color: "text-rose-400",
    title: "Inseguridad",
    desc: "Tasa de homicidios por 100k habitantes según UNODC.",
    badge: "Disponible",
  },
  {
    href: "/venezuela/salud",
    icon: HeartPulse,
    color: "text-pink-400",
    title: "Salud pública",
    desc: "Esperanza de vida, mortalidad infantil/materna, médicos, gasto sanitario.",
    badge: "Disponible",
  },
  {
    href: "/venezuela/ddhh",
    icon: ShieldAlert,
    color: "text-orange-400",
    title: "Derechos humanos",
    desc: "Libertad civil y política según Freedom House (2013-2024) vs Chile y Uruguay.",
    badge: "Disponible",
  },
  {
    href: "/venezuela/diaspora",
    icon: Users,
    color: "text-cyan-400",
    title: "Diáspora global",
    desc: "Refugiados y solicitantes de asilo por país de destino. Fuente: ACNUR.",
    badge: "Disponible",
  },
  {
    href: "/venezuela/corrupcion",
    icon: Scale,
    color: "text-rose-400",
    title: "Corrupción y sanciones",
    desc: "Casos documentados, individuos sancionados (OFAC/UE/UK) y direcciones cripto SDN. Cada entrada con fuente oficial.",
    badge: "Disponible",
  },
  {
    href: "/venezuela/sanciones",
    icon: Scale,
    color: "text-cyan-400",
    title: "Sanciones, no bloqueo",
    desc: "Qué son y qué no son las sanciones a Venezuela: a personas (OFAC), sectoriales (PDVSA), exenciones humanitarias y la cronología del colapso previo. Cada afirmación citada.",
    badge: "Disponible",
  },
  {
    href: "/venezuela/puerta-giratoria",
    icon: RefreshCw,
    color: "text-amber-400",
    title: "Puerta giratoria",
    desc: "Funcionarios que rotan por múltiples cargos públicos dejando promesas y mandatos sin cumplimiento documentado. Ordenados por promesas incumplidas, cada una citada. Fuentes: Poderopedia, Transparencia Venezuela y prensa.",
    badge: "Disponible",
  },
  {
    href: "/venezuela/cronologia",
    icon: History,
    color: "text-amber-400",
    title: "Cronología del quiebre democrático",
    desc: "Eventos clave 1999-2024 que erosionaron la república. V-Dem Liberal Democracy Index Venezuela vs Chile y Uruguay. Fuentes: CIDH, ONU FFM, OEA, Foro Penal.",
    badge: "Disponible",
  },
  {
    href: "/venezuela/coyuntura",
    icon: Newspaper,
    color: "text-amber-400",
    title: "Coyuntura 2025-2026",
    desc: "Indicadores recientes: presos políticos (Foro Penal), inflación mensual (OVF), tipo de cambio BCV vs paralelo y producción petrolera. Cada cifra fechada y citada.",
    badge: "Disponible",
  },
  {
    href: "/venezuela/esequibo",
    icon: Globe2,
    color: "text-emerald-400",
    title: "Controversia del Esequibo",
    desc: "Cronología de la disputa territorial con Guyana: Laudo de París 1899, Acuerdo de Ginebra, caso ante la CIJ, referendo 2023 y estado Guayana Esequiba.",
    badge: "Disponible",
  },
];

export default function VenezuelaLanding() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-2">
          Sección
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
          Venezuela en datos
        </h1>
        <p className="text-slate-300 max-w-2xl leading-relaxed">
          Indicadores oficiales sobre Venezuela y su diáspora. Comparativas
          antes/después, crisis económica, derechos humanos y migración global.
          Cada cifra cita su fuente.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map(({ href, icon: Icon, color, title, desc, badge }) => {
          const isAvailable = badge === "Disponible";
          const Cmp = isAvailable ? Link : "div";
          return (
            <Cmp
              key={href}
              href={href as never}
              className={`group rounded-xl border p-6 transition ${
                isAvailable
                  ? "border-slate-700/40 bg-slate-900/80 hover:border-cyan-400/60 hover:shadow-lg cursor-pointer"
                  : "border-slate-800/40 bg-slate-900/40 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <h2 className="text-xl font-semibold text-slate-100">
                    {title}
                  </h2>
                </div>
                <span
                  className={`text-[0.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isAvailable
                      ? "bg-cyan-400/10 text-cyan-300 border border-cyan-400/40"
                      : "bg-slate-700/40 text-slate-400 border border-slate-700/60"
                  }`}
                >
                  {badge}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </Cmp>
          );
        })}
      </section>

      <p className="mt-10 text-xs text-slate-500">
        Fuentes principales: Banco Mundial, ACNUR, Freedom House, V-Dem, Foro
        Penal, Encovi (UCAB).
      </p>
    </div>
  );
}
