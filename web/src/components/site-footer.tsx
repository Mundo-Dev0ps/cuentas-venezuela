import Link from "next/link";
import { KofiButton } from "./kofi-button";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/[0.08] bg-slate-900/60 backdrop-blur-md py-8 text-sm text-slate-400">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-4">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-100">Productos</h2>
          <ul className="space-y-1.5">
            <li>
              <Link href="/mapa-del-olvido" className="transition-colors duration-150 hover:text-cyan-300">
                Mapa del Olvido
              </Link>
            </li>
            <li>
              <Link href="/datos-chile" className="transition-colors duration-150 hover:text-cyan-300">
                Datos Chile
              </Link>
            </li>
            <li>
              <Link href="/venezuela" className="transition-colors duration-150 hover:text-cyan-300">
                Venezuela
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-100">Apoyar</h2>
          <ul className="space-y-1.5">
            <li>
              <Link href="/apoyar" className="transition-colors duration-150 hover:text-cyan-300">
                Por qué donar
              </Link>
            </li>
            <li>
              <KofiButton variant="footer" source="site-footer" />
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-100">Transparencia</h2>
          <ul className="space-y-1.5">
            <li>
              <Link href="/fuentes" className="transition-colors duration-150 hover:text-cyan-300">
                Fuentes oficiales
              </Link>
            </li>
            <li>
              <Link href="/datos-chile/metodologia" className="transition-colors duration-150 hover:text-cyan-300">
                Metodología (Chile)
              </Link>
            </li>
            <li>
              <Link href="/mapa-del-olvido/metodologia" className="transition-colors duration-150 hover:text-cyan-300">
                Metodología (Mapa)
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="leading-relaxed">
            Datos oficiales agregados. Cada visualización cita su fuente y fecha
            de extracción. Sin datos personales identificables.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            © {new Date().getFullYear()} Cuentas Venezuela · proyecto cívico
            independiente
          </p>
        </div>
      </div>
    </footer>
  );
}
