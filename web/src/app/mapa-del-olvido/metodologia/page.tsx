export const metadata = {
  title: "Metodología — Mapa del Olvido",
  description: "Cómo recolectamos, normalizamos y citamos los datos de obras.",
};

export default function MetodologiaPage() {
  return (
    <article className="prose prose-neutral mx-auto max-w-3xl px-6 py-12 dark:prose-invert">
      <h1>Metodología</h1>

      <h2>Fuentes</h2>
      <ul>
        <li>
          <strong>Transparencia Venezuela</strong> — base de datos primaria
          sobre obras inconclusas.
        </li>
        <li>
          <strong>Gaceta Oficial</strong> — montos asignados, fechas de
          contratación.
        </li>
        <li>
          <strong>Prensa pública verificable</strong> — corroboración de status
          actual.
        </li>
        <li>
          <strong>Reportes ciudadanos</strong> — verificados antes de incluir.
        </li>
      </ul>

      <h2>Normalización</h2>
      <ul>
        <li>
          Estados ADM1 normalizados a la lista oficial de Venezuela (24
          entidades).
        </li>
        <li>Montos convertidos a USD usando la tasa BCV del año del contrato.</li>
        <li>
          Status reducido a 4 categorías: <code>inaugurada</code>,{" "}
          <code>parcial</code>, <code>abandonada</code>,{" "}
          <code>en_construccion</code>.
        </li>
        <li>Coordenadas geocodificadas vía OpenStreetMap (Nominatim).</li>
      </ul>

      <h2>Limitaciones</h2>
      <ul>
        <li>
          Los montos son estimados; en muchos casos los pagos reales no son
          públicos.
        </li>
        <li>El status puede cambiar; documentamos la última verificación.</li>
        <li>
          Algunas obras carecen de coordenadas precisas y se ubican en el
          centroide del estado.
        </li>
      </ul>

      <h2>Actualización</h2>
      <p>
        Pipeline ETL semanal (lunes 06:00 UTC). Los reportes ciudadanos pasan
        por revisión manual antes de ingresar a la base.
      </p>
    </article>
  );
}
