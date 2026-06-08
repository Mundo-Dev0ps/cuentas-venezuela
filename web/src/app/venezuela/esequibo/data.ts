/**
 * Curated chronology of the Essequibo (Guayana Esequiba) territorial
 * controversy between Venezuela and Guyana.
 *
 * EDITORIAL RULES:
 *  1. Every event cites at least one primary or established secondary
 *     source (treaty text, ICJ ruling, government act, outlet of record).
 *  2. Strictly factual. The territorial claim itself is contested by both
 *     states; entries record acts and rulings, not a verdict on the merits.
 *  3. Dates to month/day precision where known; year-only entries use
 *     day=1, month=1.
 *
 * Last manual review: 2026-06-08.
 */

export interface EsequiboSource {
  label: string;
  url: string;
}

export type EsequiboKind = "treaty" | "legal" | "domestic" | "diplomatic";

export interface EsequiboEvent {
  id: string;
  /** ISO date (yyyy-mm-dd). Use the 1st when only year/month is known. */
  date: string;
  precision: "day" | "month" | "year";
  title: string;
  description: string;
  kind: EsequiboKind;
  sources: EsequiboSource[];
}

export const KIND_LABEL: Record<
  EsequiboKind,
  { label: string; color: string }
> = {
  treaty: {
    label: "Tratado / arbitraje",
    color: "border-amber-500/40 bg-amber-500/5 text-amber-300",
  },
  legal: {
    label: "Corte Internacional",
    color: "border-violet-500/40 bg-violet-500/5 text-violet-300",
  },
  domestic: {
    label: "Acto interno venezolano",
    color: "border-cyan-500/40 bg-cyan-500/5 text-cyan-300",
  },
  diplomatic: {
    label: "Diplomacia",
    color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-300",
  },
};

export const EVENTS: EsequiboEvent[] = [
  {
    id: "1899-laudo-paris",
    date: "1899-10-03",
    precision: "day",
    title: "Laudo Arbitral de París",
    description:
      "Un tribunal arbitral falla en París la frontera entre Venezuela y la Guayana Británica, adjudicando la mayor parte del territorio en disputa —el Esequibo, unos 160.000 km²— a la colonia británica. Venezuela lo aceptó inicialmente y luego lo denunció como nulo e írrito.",
    kind: "treaty",
    sources: [
      {
        label: "CNN — historia de la disputa",
        url: "https://cnnespanol.cnn.com/2023/12/02/historia-disputas-esequibo-reino-unido-guyana-venezuela-orix",
      },
    ],
  },
  {
    id: "1966-acuerdo-ginebra",
    date: "1966-02-17",
    precision: "day",
    title: "Acuerdo de Ginebra",
    description:
      "Reino Unido, Venezuela y la entonces Guayana Británica firman el Acuerdo de Ginebra, que reconoce la existencia de una controversia territorial y establece un mecanismo para buscar una solución práctica. Es el instrumento jurídico que Venezuela invoca como vigente.",
    kind: "treaty",
    sources: [
      {
        label: "Infobae — claves del conflicto",
        url: "https://www.infobae.com/venezuela/2023/12/03/el-esequibo-las-claves-del-conflicto-territorial-que-enfrenta-a-venezuela-y-guyana-desde-hace-mas-de-un-siglo/",
      },
    ],
  },
  {
    id: "2018-guyana-cij",
    date: "2018-03-29",
    precision: "day",
    title: "Guyana lleva el caso a la Corte Internacional de Justicia",
    description:
      "Guyana presenta el caso ante la Corte Internacional de Justicia (CIJ) en La Haya, solicitando que confirme la validez y el carácter vinculante del Laudo de París de 1899. Venezuela rechaza la jurisdicción de la Corte.",
    kind: "legal",
    sources: [
      {
        label: "Infobae — claves del conflicto",
        url: "https://www.infobae.com/venezuela/2023/12/03/el-esequibo-las-claves-del-conflicto-territorial-que-enfrenta-a-venezuela-y-guyana-desde-hace-mas-de-un-siglo/",
      },
    ],
  },
  {
    id: "2023-referendo-convocatoria",
    date: "2023-09-01",
    precision: "month",
    title: "La Asamblea Nacional convoca el referendo consultivo",
    description:
      "La Asamblea Nacional de Venezuela convoca a un referendo consultivo sobre el Esequibo, con preguntas sobre el rechazo a la jurisdicción de la CIJ y la creación de un estado venezolano en el territorio en disputa.",
    kind: "domestic",
    sources: [
      {
        label: "IRI — el referendo consultivo",
        url: "https://www.iri.edu.ar/index.php/2023/12/06/el-referendo-consultivo-en-venezuela-por-el-esequibo/",
      },
    ],
  },
  {
    id: "2023-cij-medidas-provisionales",
    date: "2023-12-01",
    precision: "day",
    title: "La CIJ dicta medidas provisionales",
    description:
      "Tras una solicitud de Guyana de suspender el referendo, la Corte Internacional de Justicia emite medidas provisionales: ordena a Venezuela abstenerse de acciones que alteren la situación de Guyana en la administración del territorio en disputa.",
    kind: "legal",
    sources: [
      {
        label: "IRI — el referendo consultivo",
        url: "https://www.iri.edu.ar/index.php/2023/12/06/el-referendo-consultivo-en-venezuela-por-el-esequibo/",
      },
    ],
  },
  {
    id: "2023-referendo-consultivo",
    date: "2023-12-03",
    precision: "day",
    title: "Referendo consultivo sobre el Esequibo",
    description:
      "Venezuela celebra el referendo consultivo no vinculante. El gobierno reportó un 95% de votos a favor de las posturas planteadas, incluida la incorporación del Esequibo; la participación real fue objeto de disputa.",
    kind: "domestic",
    sources: [
      {
        label: "CNN — historia y disputas",
        url: "https://cnnespanol.cnn.com/2023/12/02/historia-disputas-esequibo-reino-unido-guyana-venezuela-orix",
      },
    ],
  },
  {
    id: "2023-acuerdo-argyle",
    date: "2023-12-14",
    precision: "day",
    title: "Acuerdo de Argyle (San Vicente y las Granadinas)",
    description:
      "Nicolás Maduro e Irfaan Ali se reúnen en San Vicente y las Granadinas y firman la Declaración de Argyle, comprometiéndose a no usar la amenaza ni la fuerza, y a no agravar la controversia.",
    kind: "diplomatic",
    sources: [
      {
        label: "VOA — reunión Venezuela-Guyana",
        url: "https://www.vozdeamerica.com/a/reunion-venezuela-guyana-esequibo-analisis/7399479.html",
      },
    ],
  },
  {
    id: "2024-ley-guayana-esequiba",
    date: "2024-04-01",
    precision: "month",
    title: "Ley para la creación del estado Guayana Esequiba",
    description:
      "La Asamblea Nacional de Venezuela aprueba una ley orgánica para la defensa del Esequibo que crea el estado venezolano de Guayana Esequiba sobre el territorio en disputa, e instruye su incorporación al mapa oficial.",
    kind: "domestic",
    sources: [
      {
        label: "Bloomberg Línea — gobernador en territorio en disputa",
        url: "https://www.bloomberglinea.com/latinoamerica/venezuela/guyana-confronta-a-maduro-por-querer-nombrar-gobernador-en-territorio-en-disputa/",
      },
    ],
  },
  {
    id: "2025-eleccion-gobernador",
    date: "2025-05-25",
    precision: "month",
    title: "Elección de gobernador y legisladores de Guayana Esequiba",
    description:
      "Venezuela celebra por primera vez una elección de gobernador y legisladores para el estado Guayana Esequiba, pese a no ejercer control efectivo sobre el territorio, que es administrado por Guyana. Guyana rechaza el acto.",
    kind: "domestic",
    sources: [
      {
        label: "Bloomberg Línea — gobernador en territorio en disputa",
        url: "https://www.bloomberglinea.com/latinoamerica/venezuela/guyana-confronta-a-maduro-por-querer-nombrar-gobernador-en-territorio-en-disputa/",
      },
    ],
  },
  {
    id: "2025-venezuela-documentos-cij",
    date: "2025-08-11",
    precision: "day",
    title: "Venezuela presenta documentos a la CIJ y rechaza su fallo",
    description:
      "Venezuela presenta documentos ante la Corte Internacional de Justicia sobre el Esequibo y reitera que no acatará ninguna sentencia del tribunal sobre la controversia, manteniendo su rechazo a la jurisdicción de la Corte.",
    kind: "legal",
    sources: [
      {
        label: "CNN — Venezuela presenta documentos a la CIJ",
        url: "https://cnnespanol.cnn.com/2025/08/11/venezuela/venezuela-documentos-cij-esequibo-orix",
      },
    ],
  },
];
