import Link from "next/link";
import {
  Share2,
  AlertTriangle,
  Lightbulb,
  Github,
  Languages,
  Newspaper,
} from "lucide-react";

const REPO_URL =
  process.env.NEXT_PUBLIC_REPO_URL ??
  "https://github.com/Mundo-Dev0ps/cuentas-venezuela";

const WAYS = [
  {
    icon: Share2,
    title: "Compartir el sitio",
    desc: "Más visibilidad = más fuentes citadas y más datos liberados.",
    href: "#share",
  },
  {
    icon: AlertTriangle,
    title: "Reportar un dato errado",
    desc: "Si ves un número raro o una cita rota, avísanos. Cada corrección suma.",
    href: "/mapa-del-olvido/reportar",
  },
  {
    icon: Lightbulb,
    title: "Sugerir nueva fuente",
    desc: "¿Conoces un dataset oficial que falta? Mándanos el link.",
    href: "mailto:hola@cuentasvenezuela.org?subject=Sugerencia%20de%20fuente",
  },
  {
    icon: Github,
    title: "Contribuir en GitHub",
    desc: "Código, tests, traducciones, issues. Open source desde el día uno.",
    href: REPO_URL,
    external: true,
  },
  {
    icon: Languages,
    title: "Traducir / verificar",
    desc: "Inglés, portugués, idiomas indígenas. Voluntariado horario libre.",
    href: "mailto:hola@cuentasvenezuela.org?subject=Voluntariado",
  },
  {
    icon: Newspaper,
    title: "Citar en tu medio",
    desc: "Si trabajas en prensa o academia, usa los datos. Sin permiso previo.",
    href: "/datos-chile",
  },
];

export function HelpWays() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {WAYS.map(({ icon: Icon, title, desc, href, external }) => {
        const isHash = href.startsWith("#");
        const isExternal = external || href.startsWith("http") || href.startsWith("mailto:");
        const className =
          "group block rounded-lg border border-slate-700/40 bg-slate-900/60 p-4 hover:border-cyan-400/50 transition-colors";
        const inner = (
          <>
            <Icon className="h-5 w-5 text-cyan-400 mb-2 group-hover:text-cyan-300" aria-hidden />
            <p className="font-semibold text-slate-100 mb-1 text-sm">{title}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
          </>
        );
        return (
          <li key={title}>
            {isExternal || isHash ? (
              <a
                href={href}
                {...(isExternal && !href.startsWith("mailto:")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={className}
              >
                {inner}
              </a>
            ) : (
              <Link href={href as never} className={className}>
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
