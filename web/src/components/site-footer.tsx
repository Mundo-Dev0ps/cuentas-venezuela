import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-700 bg-slate-900 py-8 text-sm text-slate-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-500">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
        <div>
          <h4 className="mb-2 font-semibold text-slate-100 dark:text-neutral-200">
            Productos
          </h4>
          <ul className="space-y-1">
            <li>
              <Link
                href="/mapa-del-olvido"
                className="hover:text-slate-100 dark:hover:text-white"
              >
                Mapa del Olvido
              </Link>
            </li>
            <li>
              <Link
                href="/datos-chile"
                className="hover:text-slate-100 dark:hover:text-white"
              >
                Datos Chile
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <p>
            Datos oficiales agregados. Cada visualización cita su fuente y fecha
            de extracción. Sin datos personales identificables.
          </p>
          <p className="mt-2 text-xs">
            © {new Date().getFullYear()} cuentas-venezuela · proyecto cívico
          </p>
        </div>
      </div>
    </footer>
  );
}
