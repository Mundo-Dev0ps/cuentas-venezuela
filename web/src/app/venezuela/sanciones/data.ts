// "Sanciones, no bloqueo: los hechos".
//
// Desmentido directo pero citado: cada afirmación lleva fuente primaria
// (OFAC / Departamento del Tesoro / Departamento de Estado / CRS) o de
// referencia. Los hechos hacen el argumento; sin juicios de valor propios.

export interface Source {
  label: string;
  url: string;
}

/** Bloque "lo que se dice ↔ los hechos". */
export interface FactBlock {
  id: string;
  /** Lo que se afirma comúnmente (el "bloqueo"). */
  claim: string;
  /** Lo que muestran los hechos, citado. */
  fact: string;
  sources: Source[];
}

export interface TimelineItem {
  /** ISO. */
  date: string;
  label: string;
  note?: string;
  sources: Source[];
}

const OFAC_FAQ: Source = {
  label: "OFAC — Venezuela Sanctions (Departamento del Tesoro)",
  url: "https://ofac.treasury.gov/faqs/topic/1581",
};
const CRS: Source = {
  label: "CRS — Venezuela: Overview of U.S. Sanctions Policy",
  url: "https://www.congress.gov/crs-product/IF10715",
};

export const BLOCKS: FactBlock[] = [
  {
    id: "personas",
    claim: "«Las sanciones castigan a todos los venezolanos.»",
    fact: "El grueso de las sanciones de EE. UU. son designaciones individuales: desde 2017, la OFAC incluyó en su lista SDN a Nicolás Maduro y a decenas de altos funcionarios, congelando sus bienes en EE. UU. y prohibiendo hacer negocios con ellos. Están dirigidas a gobernantes y sus testaferros, no a la población.",
    sources: [
      { label: "Departamento de Estado — Venezuela-Related Sanctions", url: "https://www.state.gov/venezuela-related-sanctions" },
      CRS,
    ],
  },
  {
    id: "sectorial",
    claim: "«EE. UU. bloquea toda la economía venezolana.»",
    fact: "La sanción de mayor alcance es sectorial y concreta: en enero de 2019 la OFAC designó a PDVSA, la petrolera estatal (marco de la Orden Ejecutiva 13850 de nov. 2018). Es una sanción a una empresa del Estado, no un embargo comercial general sobre el país.",
    sources: [
      { label: "Departamento de Estado — Sanctions Against PDVSA and Venezuela Oil Sector", url: "https://2017-2021.state.gov/sanctions-against-pdvsa-and-venezuela-oil-sector/" },
      CRS,
    ],
  },
  {
    id: "humanitario",
    claim: "«Las sanciones impiden que lleguen alimentos y medicinas.»",
    fact: "Las órdenes ejecutivas excluyen expresamente alimentos, ropa y medicinas, y la OFAC emitió licencias generales que autorizan la exportación de productos agrícolas, medicinas y dispositivos médicos a Venezuela. La ayuda humanitaria y esos bienes no están prohibidos.",
    sources: [
      { label: "Embajada de EE. UU. — Provision of Humanitarian Assistance and Trade", url: "https://ve.usembassy.gov/fact-sheet-provision-of-humanitarian-assistance-and-trade-to-combat-covid-19/" },
      OFAC_FAQ,
    ],
  },
  {
    id: "cronologia",
    claim: "«El colapso económico lo causaron las sanciones.»",
    fact: "La secuencia no cuadra con esa versión: el PIB de Venezuela ya se había desplomado y la hiperinflación arrancó en noviembre de 2017, más de un año antes de las sanciones petroleras de enero de 2019. La producción de PDVSA venía cayendo desde 2014. El derrumbe empezó antes de las sanciones sectoriales.",
    sources: [
      { label: "Banco Mundial — Venezuela", url: "https://data.worldbank.org/country/venezuela-rb" },
      CRS,
    ],
  },
  {
    id: "no-bloqueo",
    claim: "«Venezuela vive bajo un bloqueo.»",
    fact: "No hay un embargo comercial total como el de Cuba ni un bloqueo naval. Venezuela siguió comerciando con terceros países: sus exportaciones de crudo continuaron hacia China e India, y empresas como Chevron han operado con licencias. «Bloqueo» es el término del gobierno; los hechos describen sanciones dirigidas y sectoriales, con exenciones.",
    sources: [
      { label: "WITA — Venezuela: Overview of U.S. Sanctions", url: "https://www.wita.org/atp-research/venezuela-overview-of-u-s-sanctions/" },
      CRS,
    ],
  },
];

export const TIMELINE: TimelineItem[] = [
  {
    date: "2017-08-25",
    label: "Sanciones financieras (OE 13808)",
    note: "Se prohíbe al gobierno y a PDVSA acceder a los mercados financieros de EE. UU. (emisión de nueva deuda).",
    sources: [CRS],
  },
  {
    date: "2017-11-01",
    label: "Comienza la hiperinflación",
    note: "La hiperinflación arranca más de un año antes de las sanciones petroleras.",
    sources: [
      { label: "Banco Mundial — Venezuela", url: "https://data.worldbank.org/country/venezuela-rb" },
    ],
  },
  {
    date: "2018-11-01",
    label: "Marco sectorial (OE 13850)",
    note: "Base legal para sancionar sectores de la economía venezolana.",
    sources: [CRS],
  },
  {
    date: "2019-01-28",
    label: "Sanción a PDVSA",
    note: "La OFAC designa a la petrolera estatal: la sanción de mayor alcance.",
    sources: [
      { label: "Departamento de Estado — Sanctions Against PDVSA", url: "https://2017-2021.state.gov/sanctions-against-pdvsa-and-venezuela-oil-sector/" },
    ],
  },
  {
    date: "2019-08-05",
    label: "Bloqueo de activos del Gobierno (OE 13884)",
    note: "Con exención expresa para alimentos, ropa y medicinas.",
    sources: [OFAC_FAQ],
  },
];

export const SANCIONES_FAQS = [
  {
    question: "¿Venezuela sufre un bloqueo o sanciones?",
    answer:
      "Las medidas de EE. UU. contra Venezuela son sanciones dirigidas: individuales (OFAC SDN a Maduro y altos funcionarios desde 2017) y sectoriales (PDVSA, enero de 2019). No constituyen un embargo comercial total como el de Cuba ni un bloqueo naval, y hay exenciones explícitas para alimentos, medicinas y ayuda humanitaria.",
  },
  {
    question: "¿Las sanciones impiden que lleguen alimentos y medicinas?",
    answer:
      "No. Las órdenes ejecutivas excluyen expresamente alimentos, ropa y medicinas, y la OFAC emitió licencias generales que autorizan la exportación de productos agrícolas, medicinas y dispositivos médicos a Venezuela.",
  },
  {
    question: "¿El colapso económico de Venezuela lo causaron las sanciones?",
    answer:
      "La cronología no lo respalda: el PIB ya se había desplomado y la hiperinflación empezó en noviembre de 2017, más de un año antes de las sanciones petroleras de enero de 2019, y la producción de PDVSA caía desde 2014. Distintas fuentes debaten el impacto de las sanciones sobre la crisis, pero el derrumbe comenzó antes de ellas.",
  },
];
