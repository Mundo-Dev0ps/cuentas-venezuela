export default function MetodologiaPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Metodología</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Cómo extraemos, procesamos y publicamos los datos.
      </p>

      <section className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <h2>Principios</h2>
        <ul>
          <li>Nunca publicamos datos personales identificables.</li>
          <li>Toda visualización cita su fuente y fecha de extracción.</li>
          <li>Las estimaciones se marcan explícitamente como tales.</li>
          <li>El código del pipeline es público y auditable.</li>
        </ul>

        <h2>Flujo</h2>
        <ol>
          <li>
            <strong>Extracción</strong>: pipelines Python descargan CSV/XLSX
            o consumen APIs oficiales (INE, Servicio Nacional de Migraciones,
            Superintendencia de Pensiones, SII, etc.).
          </li>
          <li>
            <strong>Transformación</strong>: limpieza, normalización de
            códigos territoriales (DPA chileno), reconciliación temporal con
            Polars y DuckDB.
          </li>
          <li>
            <strong>Almacenamiento</strong>: hechos en Parquet (object
            storage S3-compatible). Metadata y dimensiones en Postgres.
          </li>
          <li>
            <strong>Publicación</strong>: API agrega y sirve, frontend
            renderiza con cita y descarga directa.
          </li>
        </ol>

        <h2>Fuentes prioritarias</h2>
        <p>
          INE (Censo, ENE, EOD), Servicio Nacional de Migraciones,
          Superintendencia de Pensiones, SII, MINSAL/Fonasa, MINEDUC,
          Carabineros (con contexto), SJM y reportes ONU/OIM para
          estimaciones de irregularidad.
        </p>
      </section>
    </main>
  );
}
