// Terremotos de Venezuela del 24 de junio de 2026 (doblete sísmico Mw 7.2 + 7.5).
//
// Reglas editoriales (igual que coyuntura/ y esequibo/):
//  - Cada cifra fechada (asOf) y citada a su fuente primaria.
//  - Cifras de víctimas en EVOLUCIÓN: actualizar `DAMAGE.asOf` y los números
//    a mano conforme las fuentes oficiales (OCHA, PAHO, gobierno) consoliden.
//  - Donde una cifra está disputada (desaparecidos), se registran AMBAS
//    versiones (gobierno vs. tracker independiente), no una conclusión.
//  - Sin opinión editorial: registramos hechos y magnitudes, no juicios.

// Spanish number formatter with forced grouping, so 4-digit counts render
// as "1.943" / "2.501" (matching the prose and news convention) instead of
// the locale default "1943" that toLocaleString("es") produces.
const NUM_FMT = new Intl.NumberFormat("es-ES", { useGrouping: "always" });
export function fmtNum(n: number): string {
  return NUM_FMT.format(n);
}

const MESES_LARGO = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
/** "2026-07-08" -> "8 de julio de 2026". */
export function fmtFechaLarga(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES_LARGO[m - 1]} de ${y}`;
}

export interface Source {
  label: string;
  url: string;
}

export interface SeismicEvent {
  id: string;
  /** ISO datetime UTC, p.ej. "2026-06-24T22:04:33Z". */
  datetimeUtc: string;
  /** Hora local mostrada al usuario, p.ej. "18:04:33 VET". */
  localTime: string;
  magnitude: number;
  scale: "Mw";
  depthKm: number;
  epicenter: string;
  lat: number;
  lon: number;
  type: "foreshock" | "mainshock";
  sources: Source[];
}

export interface AffectedState {
  name: string;
  severity: "critical" | "high" | "moderate";
  /** Capital del estado. */
  capital: string;
  notes: string;
}

export interface DamageStats {
  /** Fecha del snapshot de cifras. */
  asOf: string;
  dead: number;
  injured: number;
  /** Versión del gobierno (texto: "cientos"). */
  missingGov: string;
  /** Versión de tracker independiente de desaparecidos. */
  missingTracker: number;
  /** Estimación de personas desaparecidas según la ONU. */
  missingUn: number;
  displaced: number;
  /** Edificios colapsados por completo según conteo oficial. */
  buildingsCollapsedOfficial: number;
  /** Edificios dañados/destruidos según análisis satelital (NASA). */
  buildingsDamagedSatellite: number;
  /** Infraestructuras afectadas en total (conteo humanitario OCHA). */
  infrastructureAffected: number;
  /** Hospitales afectados (OCHA). */
  hospitalsAffected: number;
  sources: Source[];
}

export interface EconomicDamage {
  pnudLowUsdBn: number;
  pnudHighUsdBn: number;
  pctGdpLow: number;
  pctGdpHigh: number;
  note: string;
  sources: Source[];
}

export interface SismoFaq {
  question: string;
  answer: string;
}

export const SOURCES = {
  usgs_m72: {
    label: "USGS — M 7.2",
    url: "https://earthquake.usgs.gov/earthquakes/eventpage/us6000t7zn",
  },
  usgs_m75: {
    label: "USGS — M 7.5 Yumare",
    url: "https://earthquake.usgs.gov/earthquakes/eventpage/us6000t7zp",
  },
  wikipedia_es: {
    label: "Wikipedia ES — Terremotos de Venezuela de 2026",
    url: "https://es.wikipedia.org/wiki/Terremotos_de_Venezuela_de_2026",
  },
  wikipedia_en: {
    label: "Wikipedia EN — 2026 Venezuela earthquakes",
    url: "https://en.wikipedia.org/wiki/2026_Venezuela_earthquakes",
  },
  reliefweb: {
    label: "OCHA — Situation Report No. 8 (1 jul 2026)",
    url: "https://www.unocha.org/publications/report/venezuela-bolivarian-republic/earthquakes-venezuela-situation-report-no-8-01-july-2026-time-0700-pm",
  },
  paho: {
    label: "PAHO/OPS — Earthquake Response 2026",
    url: "https://www.paho.org/en/earthquakes-venezuela-2026",
  },
  un_news: {
    label: "UN News — Death toll passes 1,700",
    url: "https://news.un.org/en/story/2026/06/1167837",
  },
  abc_news: {
    label: "ABC News — live updates",
    url: "https://abcnews.com/International/live-updates/venezuela-earthquakes-updates/?id=134196335",
  },
  cnn: {
    label: "CNN — Over 900 killed",
    url: "https://edition.cnn.com/2026/06/26/world/live-news/venezuela-earthquake-hnk",
  },
} satisfies Record<string, Source>;

export const SEISMIC_EVENTS: SeismicEvent[] = [
  {
    id: "foreshock-m72",
    datetimeUtc: "2026-06-24T22:04:33Z",
    localTime: "18:04:33 VET",
    magnitude: 7.2,
    scale: "Mw",
    depthKm: 20.3,
    epicenter: "23 km al NO de San Felipe, Yaracuy",
    lat: 10.42,
    lon: -68.74,
    type: "foreshock",
    sources: [SOURCES.usgs_m72, SOURCES.wikipedia_es],
  },
  {
    id: "mainshock-m75",
    datetimeUtc: "2026-06-24T22:05:12Z",
    localTime: "18:05:12 VET",
    magnitude: 7.5,
    scale: "Mw",
    depthKm: 10.0,
    epicenter: "28 km al SE de Yumare, Yaracuy",
    lat: 10.49,
    lon: -68.52,
    type: "mainshock",
    sources: [SOURCES.usgs_m75, SOURCES.wikipedia_en],
  },
];

export const DAMAGE: DamageStats = {
  asOf: "2026-08-25",
  dead: 6509,
  injured: 226696,
  missingGov: "miles (sin cifra oficial)",
  missingTracker: 18100,
  missingUn: 50000,
  displaced: 16300,
  buildingsCollapsedOfficial: 189,
  buildingsDamagedSatellite: 59000,
  infrastructureAffected: 2501,
  hospitalsAffected: 38,
  sources: [SOURCES.un_news, SOURCES.reliefweb, SOURCES.paho, SOURCES.wikipedia_es],
};

export const AFFECTED_STATES: AffectedState[] = [
  {
    name: "La Guaira",
    severity: "critical",
    capital: "La Guaira",
    notes:
      "Zona más golpeada al norte de Caracas. Más de 1.400 edificios destruidos; aeropuerto internacional Simón Bolívar dañado y cerrado temporalmente.",
  },
  {
    name: "Yaracuy",
    severity: "critical",
    capital: "San Felipe",
    notes:
      "Epicentro del doblete (San Felipe y Yumare). Colapsos generalizados en viviendas e infraestructura.",
  },
  {
    name: "Carabobo",
    severity: "high",
    capital: "Valencia",
    notes: "Edificios colapsados. Valencia entre las ciudades con más daños.",
  },
  {
    name: "Aragua",
    severity: "high",
    capital: "Maracay",
    notes: "Estructuras colapsadas y daños en viviendas.",
  },
  {
    name: "Miranda",
    severity: "high",
    capital: "Los Teques",
    notes: "Daños estructurales en el área metropolitana de Caracas.",
  },
  {
    name: "Distrito Capital",
    severity: "high",
    capital: "Caracas",
    notes: "Caracas: edificios históricos y estructuras dañadas; servicios interrumpidos.",
  },
  {
    name: "Trujillo",
    severity: "moderate",
    capital: "Trujillo",
    notes: "Edificios colapsados en zonas andinas.",
  },
  {
    name: "Lara",
    severity: "moderate",
    capital: "Barquisimeto",
    notes: "Sismo sentido con fuerza; daños menores reportados.",
  },
  {
    name: "Falcón",
    severity: "moderate",
    capital: "Coro",
    notes: "Movimiento sentido en la costa; daños menores.",
  },
  {
    name: "Mérida",
    severity: "moderate",
    capital: "Mérida",
    notes: "Sismo percibido en los Andes; sin víctimas mayores reportadas.",
  },
];

export const ECONOMIC_DAMAGE: EconomicDamage = {
  pnudLowUsdBn: 4.7,
  pnudHighUsdBn: 8.7,
  pctGdpLow: 4,
  pctGdpHigh: 8,
  note:
    "Estimación del PNUD sobre pérdidas en vivienda y activos económicos. Excluye daños a infraestructura, disrupción económica prolongada y reconstrucción; el costo real podría ser entre 1,5 y 3 veces esta cifra. Una evaluación posterior de la UNDRR situó los daños directos en unos USD 37 mil millones (24 mil millones en edificaciones y 13 mil millones en infraestructura).",
  sources: [SOURCES.un_news, SOURCES.reliefweb],
};

export const SISMO_FAQS: SismoFaq[] = [
  {
    question: "¿Cuántas personas murieron en el terremoto de Venezuela de 2026?",
    answer: `Al ${fmtFechaLarga(DAMAGE.asOf)}, las autoridades reportaban al menos ${fmtNum(DAMAGE.dead)} muertos y más de ${fmtNum(DAMAGE.injured)} heridos por el doble terremoto del 24 de junio, con más de 6.400 personas rescatadas. La cifra siguió subiendo conforme avanzaban las labores de rescate. Más de 16.300 personas perdieron su vivienda y las estimaciones de desaparecidos oscilaban entre ~18.000 y 50.000.`,
  },
  {
    question: "¿Cuál fue la magnitud del terremoto y dónde estuvo el epicentro?",
    answer:
      "El 24 de junio de 2026 ocurrieron dos sismos con 39 segundos de diferencia: primero uno de magnitud Mw 7,2 a 23 km de San Felipe (Yaracuy, profundidad 20,3 km), seguido del sismo principal de magnitud Mw 7,5 a 28 km al sureste de Yumare (profundidad 10 km). Fue el terremoto más fuerte en Venezuela desde el sismo de San Narciso de 1900.",
  },
  {
    question: "¿Cuáles fueron los estados más afectados por el terremoto?",
    answer:
      "La Guaira y Yaracuy fueron los más golpeados. La Guaira sufrió más de 1.400 edificios destruidos y el cierre del aeropuerto internacional Simón Bolívar. También resultaron afectados Carabobo, Aragua, Miranda, el Distrito Capital (Caracas), Trujillo, Lara, Falcón y Mérida. El sismo se sintió en gran parte del norte y centro del país.",
  },
  {
    question: "¿Cuánto costaron los daños materiales del terremoto de Venezuela?",
    answer:
      "El PNUD estimó las pérdidas en vivienda y activos económicos entre 4.700 y 8.700 millones de dólares, aproximadamente entre 4% y 8% del PIB de Venezuela. Una evaluación posterior de la UNDRR elevó los daños directos a unos 37 mil millones de dólares (24 mil millones en edificaciones y 13 mil millones en infraestructura). Análisis satelital de la NASA calculó cerca de 59.000 edificios dañados o destruidos.",
  },
];
