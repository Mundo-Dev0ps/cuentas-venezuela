// "Cómo recibió el chavismo a Venezuela y cómo está hoy".
//
// Baseline 1998 (último año pre-chavismo; Chávez asume el 2 feb 1999) vs el
// último dato disponible. Indicadores del Banco Mundial se leen del pipeline
// ve_macro; pobreza, petróleo e inflación se curan a mano y citados (no hay
// API limpia — mismo patrón que coyuntura/). Registro factual, sin opinión.

export interface Source {
  label: string;
  url: string;
}

export interface Point {
  year: number;
  value: number;
}

/** Cómo se compara un indicador: si sube, ¿mejora o empeora? */
export type Direction = "higherBetter" | "lowerBetter";

export interface ManualSeries {
  id: string;
  title: string;
  unitLabel: string;
  /** "usd" | "pct" | "kbpd" — controla el formato de la cifra. */
  format: "usd" | "pct" | "kbpd";
  direction: Direction;
  /** "pp" (puntos %), "pct" (variación %) o "x" (veces). */
  deltaKind: "pp" | "pct" | "x";
  points: Point[];
  /** Escala logarítmica en la mini-tendencia (para hiperinflación). */
  logScale?: boolean;
  /** Badge extra opcional (p.ej. el pico de hiperinflación). */
  highlight?: string;
  note?: string;
  sources: Source[];
}

/* ── Indicadores del Banco Mundial (pipeline ve_macro) ─────────────── */

export interface WbIndicator {
  code: string;
  title: string;
  unitLabel: string;
  format: "usd" | "pct" | "kbpd";
  direction: Direction;
  deltaKind: "pp" | "pct" | "x";
  note?: string;
}

export const WB_INDICATORS: WbIndicator[] = [
  {
    code: "NY.GDP.PCAP.CD",
    title: "PIB per cápita",
    unitLabel: "USD corrientes",
    format: "usd",
    direction: "higherBetter",
    deltaKind: "pct",
    note: "Ingreso promedio por habitante. Refleja el auge petrolero de 2012 y el posterior derrumbe.",
  },
  {
    code: "SL.UEM.TOTL.ZS",
    title: "Desempleo",
    unitLabel: "% de la fuerza laboral",
    format: "pct",
    direction: "lowerBetter",
    deltaKind: "pp",
    note: "Estimación modelada de la OIT vía Banco Mundial. OJO: la baja tasa de desempleo engaña — no significa más empleo formal, sino que el desempleo se traslada a la economía informal y a la emigración de millones de trabajadores. Ver el bloque de empleo informal.",
  },
  {
    code: "GC.DOD.TOTL.GD.ZS",
    title: "Deuda del gobierno central",
    unitLabel: "% del PIB",
    format: "pct",
    direction: "lowerBetter",
    deltaKind: "pp",
    note: "La serie oficial tiene discontinuidades desde que Venezuela dejó de reportar con regularidad.",
  },
];

export const WB_SOURCE: Source = {
  label: "Banco Mundial — World Bank Open Data",
  url: "https://data.worldbank.org/country/venezuela-rb",
};

/* ── Series manuales ───────────────────────────────────────────────── */

/**
 * Pobreza de ingresos de hogares (%). El punto de 1998 proviene de las
 * encuestas oficiales del INE (previas al chavismo); la serie moderna es de
 * la ENCOVI (UCAB), la medición independiente de referencia desde 2014, ya
 * que el gobierno dejó de publicar cifras de pobreza. Metodologías distintas
 * entre el baseline y la serie ENCOVI: se indica la fuente en cada punto.
 */
export const POVERTY: ManualSeries = {
  id: "pobreza",
  title: "Pobreza de ingresos",
  unitLabel: "% de hogares",
  format: "pct",
  direction: "lowerBetter",
  deltaKind: "pp",
  points: [
    { year: 1998, value: 44 },
    { year: 2015, value: 73 },
    { year: 2020, value: 94 },
    { year: 2024, value: 73 },
  ],
  note: "Baseline 1998: encuesta oficial de hogares (INE). Serie 2015-2024: ENCOVI/UCAB (pobreza de ingresos). La pobreza extrema y de ingresos bajó en 2023-2024 por la estabilización cambiaria, pero sigue muy por encima de 1998.",
  sources: [
    { label: "ENCOVI 2024 — UCAB (73,2% pobreza de ingresos)", url: "https://www.proyectoencovi.com/encovi-2024" },
    { label: "Runrun.es — ENCOVI 2024: pobreza y desigualdad", url: "https://runrun.es/rr-es-plus/578457/encovi-2024-pobreza-y-brechas-de-genero-en-una-venezuela-cada-vez-mas-desigual/" },
  ],
};

/**
 * Producción de crudo (miles de barriles diarios). De ~3,3 millones en 1998
 * al mínimo histórico de 557.000 en 2020 y una recuperación parcial reciente.
 */
export const OIL: ManualSeries = {
  id: "petroleo",
  title: "Producción petrolera",
  unitLabel: "miles de barriles diarios",
  format: "kbpd",
  direction: "higherBetter",
  deltaKind: "pct",
  points: [
    { year: 1998, value: 3300 },
    { year: 2014, value: 2692 },
    { year: 2020, value: 557 },
    { year: 2023, value: 840 },
    { year: 2025, value: 1120 },
  ],
  note: "Fuentes secundarias de la OPEP. 2020 marcó el mínimo histórico moderno (557.000 bpd). La cifra de 2025 es la del bloque de coyuntura reciente.",
  sources: [
    { label: "Wikipedia — Producción de petróleo en Venezuela (serie OPEP)", url: "https://es.wikipedia.org/wiki/Anexo:Producci%C3%B3n_de_petr%C3%B3leo_en_Venezuela" },
    { label: "EIA — Venezuela country analysis", url: "https://www.eia.gov/international/analysis/country/VEN" },
  ],
};

/**
 * Inflación anual (IPC, %). El caso extremo: de ~36% en 1998 al episodio de
 * hiperinflación de 2017-2021 (pico anual cercano a 130.000% en 2018 según el
 * FMI) y un descenso posterior que la mantiene entre las más altas del mundo.
 * Mini-tendencia en escala logarítmica por el rango.
 */
export const INFLATION: ManualSeries = {
  id: "inflacion",
  title: "Inflación anual (IPC)",
  unitLabel: "% anual",
  format: "pct",
  direction: "lowerBetter",
  deltaKind: "pct",
  logScale: true,
  highlight: "Pico ~130.000% en 2018 (hiperinflación 2017-2021)",
  points: [
    { year: 1998, value: 36 },
    { year: 2013, value: 40 },
    { year: 2016, value: 274 },
    { year: 2018, value: 130060 },
    { year: 2021, value: 686 },
    { year: 2024, value: 48 },
  ],
  note: "1998: IPC oficial. Hiperinflación de 2017-2021 con pico anual cercano a 130.000% en 2018 (FMI). El BCV dejó de publicar el IPC con regularidad; para 2025 el FMI proyecta ~270%.",
  sources: [
    { label: "FMI — proyección de inflación de Venezuela", url: "https://www.bloomberglinea.com/latinoamerica/venezuela/fmi-proyecta-inflacion-de-682-en-venezuela-en-2026-ademas-de-contraccion-en-su-economia/" },
    { label: "Observatorio Venezolano de Finanzas (OVF)", url: "https://observatoriodefinanzas.com/" },
  ],
};

/**
 * Pobreza EXTREMA de ingresos (%): hogares cuyo ingreso no cubre ni la canasta
 * alimentaria. Baseline 1998 de la encuesta de hogares del INE (pobreza
 * crítica ~20%); serie moderna de la ENCOVI (UCAB). Pico en 2019-2020 (~79%),
 * con un retroceso en 2024-2025 por la estabilización cambiaria — pero todavía
 * por encima de 1998.
 */
export const EXTREME_POVERTY: ManualSeries = {
  id: "pobreza-extrema",
  title: "Pobreza extrema",
  unitLabel: "% de hogares",
  format: "pct",
  direction: "lowerBetter",
  deltaKind: "pp",
  highlight: "Pico ~79% en 2019-2020 (ENCOVI): sin ingreso para la canasta alimentaria",
  points: [
    { year: 1998, value: 20 },
    { year: 2020, value: 79 },
    { year: 2024, value: 36.5 },
    { year: 2025, value: 31.7 },
  ],
  note: "Baseline 1998: encuesta de hogares del INE (pobreza crítica ~20%). Serie ENCOVI/UCAB: pico de ~79% en 2019-2020. Bajó a 36,5% en 2024 y 31,7% en 2025 por la estabilización del tipo de cambio, pero sigue por encima del nivel pre-chavista.",
  sources: [
    { label: "ENCOVI 2019-2020 — 79% pobreza extrema (informe)", url: "https://www.proyectoencovi.com/informe-interactivo-2019" },
    { label: "PolítiKa UCAB — ENCOVI 2025 (31,7% pobreza extrema)", url: "https://politikaucab.net/2026/05/08/encovi-2025-685-de-los-hogares-del-pais-se-encuentran-en-pobreza-monetaria-y-317-en-pobreza-extrema/" },
  ],
};

/**
 * Empleo informal (% del empleo total). El contrapunto al desempleo: la tasa
 * de desempleo baja NO refleja más empleo formal, sino trabajo informal
 * (buhonería, changas, cuentapropismo de subsistencia) que absorbe la fuerza
 * laboral y no aparece como "desempleo". De ~50% en 1998 a ~70% en 2025 según
 * Ecoanalítica (4º más alto de América Latina). Metodologías dispares: la
 * ENCOVI, con una definición más estricta, da cifras más bajas (~50%).
 */
export const INFORMAL_EMPLOYMENT: ManualSeries = {
  id: "empleo-informal",
  title: "Empleo informal",
  unitLabel: "% del empleo total",
  format: "pct",
  direction: "lowerBetter",
  deltaKind: "pp",
  highlight: "El desempleo bajo engaña: la fuerza laboral se refugia en la informalidad",
  points: [
    { year: 1998, value: 50 },
    { year: 2025, value: 70 },
  ],
  note: "1998: el sector informal absorbía ~49,5% del empleo. 2025: ~70% según Ecoanalítica (4º más alto de América Latina, promedio regional ~50%). La ENCOVI, con una definición más estricta, reporta cifras más conservadoras (~50%). El punto: la baja tasa de desempleo oficial oculta el desplazamiento hacia el empleo informal y la emigración.",
  sources: [
    { label: "AméricaEconomía — informalidad laboral en Venezuela (Ecoanalítica ~70%)", url: "https://www.americaeconomia.com/economia-mercados/finanzas/venezuela-registra-la-tasa-mas-baja-de-empleo-informal-de-america-latina" },
    { label: "UCAB — La informalidad laboral en Venezuela (definiciones)", url: "https://www.ucab.edu.ve/wp-content/uploads/2021/11/11Notas-sobre-la-Economia-Venezolana-DML.pdf" },
  ],
};

export const MANUAL_SERIES: ManualSeries[] = [
  POVERTY,
  EXTREME_POVERTY,
  OIL,
  INFLATION,
  INFORMAL_EMPLOYMENT,
];

/* ── Marcadores de era en las mini-tendencias ──────────────────────────
 * Líneas verticales que ubican los hitos políticos en cada gráfica. El fin de
 * Chávez (muerte, marzo 2013) y el inicio de Maduro (abril 2013) coinciden en
 * el mismo año, así que se muestran como un solo marcador. */

export interface EraMarker {
  year: number;
  label: string;
  /** Color de la línea/leyenda. */
  color: string;
}

export const ERA_MARKERS: EraMarker[] = [
  { year: 1999, label: "Chávez asume la presidencia", color: "#38bdf8" },
  { year: 2013, label: "Muere Chávez y Maduro asume", color: "#fbbf24" },
];

/* ── Colapso monetario: cifras que no caben en un antes/después ────────
 * La devaluación y la inflación acumulada abarcan tantos órdenes de magnitud
 * (el bolívar perdió 14 ceros) que una comparación de dos columnas las
 * aplasta. Se muestran como cifras destacadas, cada una citada. */

export interface MegaStat {
  id: string;
  title: string;
  /** Cifra grande ya formateada como texto (p.ej. "14 ceros"). */
  value: string;
  /** Renglón corto bajo la cifra. */
  caption: string;
  note: string;
  sources: Source[];
}

export const MONETARY_STATS: MegaStat[] = [
  {
    id: "devaluacion",
    title: "Devaluación del bolívar",
    value: "−14 ceros",
    caption: "en 3 reconversiones monetarias",
    note: "Para que las cifras siguieran cabiendo en billetes y calculadoras, al bolívar se le quitaron 14 ceros en tres reconversiones: bolívar fuerte en 2008 (÷1.000), bolívar soberano en 2018 (÷100.000) y bolívar digital en 2021 (÷1.000.000). Un dólar que en 1998 costaba unos 570 bolívares equivale hoy a más de 10^16 de aquellos bolívares.",
    sources: [
      { label: "VenAmCham — Reconversión monetaria en Venezuela", url: "https://www.venamcham.org/reconversion-monetaria-en-venezuela/" },
      { label: "Wikipedia — Hiperinflación en Venezuela", url: "https://es.wikipedia.org/wiki/Hiperinflaci%C3%B3n_en_Venezuela" },
    ],
  },
  {
    id: "inflacion-acumulada",
    title: "Inflación acumulada 2013-2019",
    value: "5.395.536.286 %",
    caption: "primer gobierno de Maduro",
    note: "En apenas seis años (2013-2019) los precios se multiplicaron por más de 53 millones. Es la razón de fondo por la que al bolívar hubo que quitarle ceros: la inflación acumulada de todo el período chavista se cuenta en órdenes de magnitud, no en porcentajes legibles.",
    sources: [
      { label: "La Nación — inflación acumulada 2013-2019 (5.395.536.286%)", url: "https://www.lanacion.com.ar/el-mundo/punto-final-a-la-pax-economica-en-venezuela-se-vuelven-a-disparar-el-dolar-y-la-inflacion-nid29032025/" },
      { label: "Wikipedia — Hiperinflación en Venezuela", url: "https://es.wikipedia.org/wiki/Hiperinflaci%C3%B3n_en_Venezuela" },
    ],
  },
];

/* ── Helpers ───────────────────────────────────────────────────────── */

export function fmtValue(value: number, format: ManualSeries["format"]): string {
  const es = (n: number, d = 0) =>
    n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });
  if (format === "usd") return `$${es(Math.round(value))}`;
  if (format === "kbpd") return es(Math.round(value));
  // pct
  return `${es(value, value < 100 && !Number.isInteger(value) ? 1 : 0)}%`;
}
