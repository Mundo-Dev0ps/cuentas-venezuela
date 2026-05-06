import { PageLayout } from './PageLayout';

export function MetodologiaPage() {
  return (
    <PageLayout eyebrow="Cómo trabajamos" title="Metodología">
      <Section title="Fuentes de datos">
        <p>
          La información se construye a partir de fuentes públicas y verificables. La fuente primaria es{' '}
          <a
            href="https://transparenciave.org/obrasinconclusas/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 underline underline-offset-4"
          >
            Transparencia Venezuela — Obras Inconclusas
          </a>{' '}
          (<code className="text-slate-400 text-sm">transparenciave.org/obrasinconclusas/</code>).
          Complementamos con gacetas oficiales, contratos publicados por entes nacionales y regionales,
          reportes de prensa documentados y registros propios producto de visitas de campo.
        </p>
        <p>
          Cada obra incluye al menos una <strong>URL de fuente</strong> que puede ser consultada por cualquier persona.
        </p>
        <p className="text-slate-400 text-sm">
          Sin el trabajo de Transparencia Venezuela este mapa no existiría. Si querés sostener su
          investigación, visitá{' '}
          <a
            href="https://transparenciave.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
          >
            transparenciave.org
          </a>.
        </p>
      </Section>

      <Section title="Criterios de inclusión">
        <p>Una obra entra al registro si cumple al menos uno de estos criterios:</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>Paralizada:</strong> sin actividad constructiva por más de 6 meses con presupuesto público asignado.</li>
          <li><strong>Crítica:</strong> en operación con fallas estructurales, sin terminación o sin servicios.</li>
          <li><strong>Inoperativa:</strong> entregada formalmente pero sin uso por daños o falta de equipamiento.</li>
        </ul>
      </Section>

      <Section title="Conversión a dólares">
        <p>
          Todos los presupuestos se expresan en dólares estadounidenses (USD) usando la tasa de referencia del
          Banco Central de Venezuela (BCV) de la fecha del contrato original. Cuando esa fecha no existe, se usa
          la tasa promedio del año de inicio.
        </p>
        <p className="text-slate-500 text-sm italic">
          Esta conversión permite comparar obras de distintas épocas sin distorsiones por hiperinflación.
        </p>
      </Section>

      <Section title="Geolocalización">
        <p>
          Las coordenadas se obtienen por geocodificación con Nominatim (OpenStreetMap). Cuando no hay
          dirección exacta se usa el centroide del estado correspondiente, marcado como aproximado en los datos.
        </p>
      </Section>

      <Section title="Sobrecostos y progreso">
        <p>
          El <strong>sobrecosto</strong> compara el presupuesto anunciado en el contrato original contra el monto
          finalmente ejecutado o reportado. El <strong>progreso</strong> al paralizarse proviene de informes técnicos
          oficiales o, en su defecto, de inspección visual documentada.
        </p>
      </Section>

      <Section title="Equivalencias de impacto social">
        <p>Para contextualizar el dinero perdido, se usan estos costos referenciales:</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Escuela primaria modular: <strong>USD 250.000</strong></li>
          <li>Hospital comunitario tipo I: <strong>USD 1.500.000</strong></li>
          <li>Universidad pública pequeña: <strong>USD 8.000.000</strong></li>
          <li>Planta potabilizadora: <strong>USD 2.000.000</strong></li>
          <li>Planta eléctrica comunitaria: <strong>USD 5.000.000</strong></li>
        </ul>
        <p className="text-slate-500 text-sm italic">
          Cifras basadas en proyectos comparables construidos en la región andina entre 2018-2024.
        </p>
      </Section>

      <Section title="Limitaciones">
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Algunos contratos son confidenciales o están en proceso judicial; se incluyen solo cuando hay evidencia pública.</li>
          <li>No todas las obras tienen fecha exacta de paralización; se estima por última actualización pública.</li>
          <li>Los datos se actualizan con la frecuencia que permite el acceso a fuentes oficiales.</li>
        </ul>
      </Section>

      <Section title="Cómo verificar o corregir">
        <p>
          Si encontrás un dato incorrecto, faltante o desactualizado, podés{' '}
          <a href="/reportar" className="text-orange-400 hover:text-orange-300 underline underline-offset-4">
            reportarlo aquí
          </a>{' '}
          con la fuente que lo respalda. Cada reporte se revisa antes de aplicarse.
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
