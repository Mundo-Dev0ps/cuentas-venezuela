import { PageLayout } from './PageLayout';

export function SobrePage() {
  return (
    <PageLayout eyebrow="Quiénes somos" title="Sobre el Mapa del Olvido">
      <p className="text-lg text-slate-200 leading-relaxed">
        Mapa del Olvido es un proyecto independiente de transparencia ciudadana que documenta y visualiza
        las obras públicas paralizadas, críticas o inoperativas en Venezuela.
      </p>

      <Section title="Por qué existe">
        <p>
          La información sobre el dinero público gastado en obras inconclusas está dispersa, fragmentada
          o escondida. Cada obra abandonada representa <strong>recursos que pudieron construir hospitales, escuelas
          o universidades</strong> y no lo hicieron.
        </p>
        <p>
          Visualizar este patrón en un mapa interactivo es la forma más directa de mostrar la escala y
          recurrencia del problema sin discursos políticos.
        </p>
      </Section>

      <Section title="Qué somos">
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>Independiente:</strong> sin afiliación a partido político ni gobierno.</li>
          <li><strong>Abierto:</strong> el código y los datos están públicos bajo licencia CC BY-SA 4.0.</li>
          <li><strong>Verificable:</strong> cada obra incluye fuente original. Si está mal, se corrige.</li>
          <li><strong>No comercial:</strong> no recibimos ingresos por publicidad.</li>
        </ul>
      </Section>

      <Section title="Qué NO somos">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>No somos un medio de comunicación.</li>
          <li>No emitimos juicios penales — solo documentamos hechos públicos.</li>
          <li>No publicamos especulaciones sin fuente.</li>
        </ul>
      </Section>

      <Section title="Cómo colaborar">
        <p>Hay cinco formas de aportar:</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>
            <strong>Reportar datos:</strong> agregar obras nuevas, corregir cifras o aportar fotos en{' '}
            <a href="/reportar" className="text-orange-400 hover:text-orange-300 underline underline-offset-4">
              esta página
            </a>.
          </li>
          <li><strong>Compartir:</strong> difundir el sitio en redes y entre periodistas locales.</li>
          <li><strong>Código:</strong> contribuir al repositorio público con mejoras técnicas.</li>
          <li>
            <strong>Apoyo económico:</strong> sostener hosting, dominio y horas de investigación en{' '}
            <a
              href="https://ko-fi.com/donjonny"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 underline underline-offset-4"
            >
              Ko-fi
            </a>.
          </li>
          <li>
            <strong>Apoyar a la fuente:</strong> los datos vienen del trabajo de{' '}
            <a
              href="https://transparenciave.org/obrasinconclusas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 underline underline-offset-4"
            >
              Transparencia Venezuela
            </a>. Visitá su sitio, leé sus investigaciones y, si podés, sostené su trabajo. Sin esa fuente
            primaria este mapa no existiría.
          </li>
        </ul>
      </Section>

      <Section title="Apoyá el proyecto">
        <p>
          Mapa del Olvido es independiente y no tiene publicidad. Si te resulta útil y querés que siga
          creciendo, podés invitarnos un café:
        </p>
        <a
          href="https://ko-fi.com/donjonny"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-white font-bold px-5 py-2.5 rounded-lg transition-colors"
        >
          <span className="text-lg">☕</span>
          <span>Apoyar en Ko-fi</span>
        </a>
        <p className="text-slate-500 text-sm">
          Cada aporte ayuda a mantener el dominio, el hosting y financiar nuevas fuentes de datos.
        </p>
      </Section>

      <Section title="Stack técnico">
        <p>
          React 19 · TypeScript · Vite · TailwindCSS · deck.gl para visualización geográfica · Firebase
          para datos · scraper en Python con BeautifulSoup. Hosting estático sin tracking de terceros.
        </p>
      </Section>

      <Section title="Contacto">
        <p>
          Para reportes de datos, correcciones o nuevas obras, usá el{' '}
          <a href="/reportar" className="text-orange-400 hover:text-orange-300 underline underline-offset-4">
            formulario de reporte
          </a>.
        </p>
        <p>
          Para consultas de prensa o colaboración técnica, contactanos vía Ko-fi (incluye comentario):{' '}
          <a
            href="https://ko-fi.com/donjonny"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-300 underline underline-offset-4"
          >
            ko-fi.com/donjonny
          </a>.
        </p>
      </Section>

      <Section title="Licencia">
        <p>
          Datos y contenido bajo{' '}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/deed.es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 underline underline-offset-4"
          >
            Creative Commons BY-SA 4.0
          </a>
          . Podés reutilizarlos con atribución y bajo la misma licencia.
        </p>
      </Section>
    </PageLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-slate-100 font-bold text-xl border-l-2 border-orange-400 pl-3">{title}</h2>
      {children}
    </section>
  );
}
