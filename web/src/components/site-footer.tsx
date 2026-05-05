export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-neutral-50 py-8 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
      <div className="mx-auto max-w-6xl px-6">
        <p>
          Datos oficiales agregados. Cada visualización cita su fuente y fecha
          de extracción. Sin datos personales identificables.
        </p>
        <p className="mt-2 text-xs">
          © {new Date().getFullYear()} datos-chile · proyecto cívico
        </p>
      </div>
    </footer>
  );
}
