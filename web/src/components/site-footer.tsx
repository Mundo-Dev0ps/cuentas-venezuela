import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-neutral-50 py-8 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
        <div>
          <h4 className="mb-2 font-semibold text-neutral-800 dark:text-neutral-200">
            Productos
          </h4>
          <ul className="space-y-1">
            <li>
              <Link
                href="/mapa-del-olvido"
                className="hover:text-neutral-900 dark:hover:text-white"
              >
                Mapa del Olvido
              </Link>
            </li>
            <li>
              <Link
                href="/datos-chile"
                className="hover:text-neutral-900 dark:hover:text-white"
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
