export const metadata = {
  title: "Sobre — Mapa del Olvido",
  description: "Quiénes somos y por qué documentamos las obras públicas en Venezuela.",
};

export default function SobrePage() {
  return (
    <article className="prose prose-neutral mx-auto max-w-3xl px-6 py-12 dark:prose-invert">
      <h1>Sobre el Mapa del Olvido</h1>
      <p className="lead">
        Proyecto independiente de transparencia ciudadana que documenta y
        visualiza las obras públicas paralizadas, críticas o inoperativas en
        Venezuela.
      </p>

      <h2>Por qué existe</h2>
      <p>
        La información sobre el dinero público gastado en obras inconclusas
        está dispersa, fragmentada o escondida. Cada obra abandonada representa{" "}
        <strong>
          recursos que pudieron construir hospitales, escuelas o universidades
        </strong>{" "}
        y no lo hicieron.
      </p>

      <h2>Qué somos</h2>
      <ul>
        <li>
          <strong>Independiente:</strong> sin afiliación a partido político ni
          gobierno.
        </li>
        <li>
          <strong>Abierto:</strong> código y datos públicos bajo licencia CC
          BY-SA 4.0.
        </li>
        <li>
          <strong>Verificable:</strong> cada obra incluye fuente original.
        </li>
        <li>
          <strong>No comercial:</strong> sin publicidad.
        </li>
      </ul>

      <h2>Cómo colaborar</h2>
      <ul>
        <li>
          <strong>Reportar datos:</strong>{" "}
          <a href="/mapa-del-olvido/reportar">enviar un reporte</a>.
        </li>
        <li>
          <strong>Compartir:</strong> difundir el sitio.
        </li>
        <li>
          <strong>Apoyar a la fuente:</strong> los datos provienen de{" "}
          <a
            href="https://transparenciave.org/obrasinconclusas/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Transparencia Venezuela
          </a>
          .
        </li>
      </ul>
    </article>
  );
}
