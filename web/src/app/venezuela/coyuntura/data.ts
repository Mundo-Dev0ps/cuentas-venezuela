/**
 * Curated recent-conjuncture dataset for Venezuela, 2025-2026.
 *
 * These indicators move at monthly/weekly frequency and have NO clean,
 * free, machine-readable API (Foro Penal, OVF, BCV, OPEC publish via
 * reports, press releases and dashboards). They are therefore curated by
 * hand from primary sources and every datapoint is dated and cited.
 *
 * EDITORIAL RULES:
 *  1. Every figure cites at least one source: the issuing body's own
 *     publication where possible (Foro Penal, OVF, BCV, OPEC/EIA), or an
 *     established outlet of record reproducing it.
 *  2. Strictly factual. No editorial adjectives. Where sources disagree,
 *     a range is given with both references.
 *  3. Each block carries an explicit `asOf` date. This is a snapshot of
 *     fast-moving data — readers must see exactly when it was last
 *     updated. Do not present these numbers as "live".
 *
 * Last manual review: 2026-07-08.
 */

export interface Source {
  label: string;
  url: string;
}

/* ── Presos políticos (Foro Penal) ─────────────────────────────────── */

export interface PrisonerCount {
  /** ISO date of the Foro Penal balance. */
  date: string;
  count: number;
  note?: string;
  sources: Source[];
}

/**
 * Foro Penal periodic balances. The count peaked above 2,000 after the
 * 28 July 2024 election and fell through 2026 amid releases ("excarcela-
 * ciones") tied to the amnesty process. Foro Penal is the Venezuelan NGO
 * that has kept the most exhaustive registry of political detentions
 * since 2002.
 */
export const POLITICAL_PRISONERS: PrisonerCount[] = [
  {
    date: "2024-08-15",
    count: 2400,
    note: "Pico tras la elección del 28 de julio de 2024: más de 2.400 personas detenidas en el contexto de la represión postelectoral (cifra oficial citada por Foro Penal).",
    sources: [
      { label: "Infobae — balance Foro Penal", url: "https://www.infobae.com/venezuela/2026/06/03/venezuela-registra-404-presos-politicos-segun-la-ong-foro-penal/" },
    ],
  },
  {
    date: "2026-02-03",
    count: 687,
    note: "Balance tras las primeras excarcelaciones del proceso de amnistía iniciado el 8 de enero de 2026.",
    sources: [
      { label: "Infobae — 687 presos políticos", url: "https://www.infobae.com/venezuela/2026/02/03/la-ong-foro-penal-contabilizo-un-total-de-687-presos-politicos-en-venezuela-tras-las-excarcelaciones/" },
    ],
  },
  {
    date: "2026-03-02",
    count: 526,
    note: "Foro Penal reportó 670 excarcelaciones acumuladas desde el 8 de enero de 2026.",
    sources: [
      { label: "El Diario — 526 presos políticos", url: "https://eldiario.com/2026/03/05/foro-penal-reporto-526-presos-politicos-en-venezuela/" },
      { label: "La República — 670 excarcelaciones", url: "https://larepublica.pe/mundo/2026/03/09/foro-penal-reporta-670-excarcelaciones-de-presos-politicos-en-venezuela-desde-el-8-de-enero-de-2026-827703" },
    ],
  },
  {
    date: "2026-06-03",
    count: 404,
    note: "369 hombres y 35 mujeres; 225 civiles (incluido un adolescente) y 179 militares; 167 condenados y 237 a la espera de sentencia. 39 con doble nacionalidad o extranjeros.",
    sources: [
      { label: "Infobae — 404 presos políticos", url: "https://www.infobae.com/venezuela/2026/06/03/venezuela-registra-404-presos-politicos-segun-la-ong-foro-penal/" },
      { label: "La Patilla — 404, 39 extranjeros", url: "https://lapatilla.com/2026/06/03/foro-penal-contabiliza-404-presos-politicos-39-de-ellos-con-nacionalidad-extranjera/" },
    ],
  },
  {
    date: "2026-07-06",
    count: 372,
    note: "214 civiles y 159 militares; 214 aún sin condena. Foro Penal denunció que el proceso de excarcelaciones se detuvo tras los terremotos de finales de junio de 2026.",
    sources: [
      { label: "Foro Penal — la represión en cifras", url: "https://foropenal.com/represion-en-cifras" },
      { label: "TalCual — Foro Penal pide retomar las excarcelaciones", url: "https://talcualdigital.com/foro-penal-pide-que-excarcelaciones-de-presos-politicos-sean-retomadas/" },
    ],
  },
];

/** Total politically-motivated detentions registered by Foro Penal since 2014. */
export const PRISONERS_HISTORIC_TOTAL = 19102;
export const PRISONERS_SOURCE: Source = {
  label: "Foro Penal",
  url: "https://foropenal.com/",
};

/* ── Inflación mensual 2025 (OVF) ──────────────────────────────────── */

export interface InflationPoint {
  /** ISO month, day=1. */
  month: string;
  /** Variación mensual del IPC, %. */
  monthlyPct: number;
  /** Variación interanual, % (cuando disponible). */
  interannualPct?: number;
  sources: Source[];
}

/**
 * Monthly CPI variation in 2025, per the Observatorio Venezolano de
 * Finanzas (OVF) — Venezuela's central bank (BCV) stopped publishing
 * regular CPI data, so OVF is the most-cited independent measure.
 */
export const INFLATION_2025: InflationPoint[] = [
  {
    month: "2025-01-01",
    monthlyPct: 7.9,
    interannualPct: 91.3,
    sources: [
      { label: "Infobae — enero 7,9%", url: "https://www.infobae.com/venezuela/2025/02/06/el-observatorio-venezolano-de-finanzas-informo-que-el-pais-cerro-enero-con-una-inflacion-mensual-del-79/" },
    ],
  },
  {
    month: "2025-02-01",
    monthlyPct: 12.8,
    interannualPct: 117,
    sources: [
      { label: "OVF / Cointelegraph", url: "https://es.cointelegraph.com/news/venezuelan-observatory-of-finance-venezuelan-inflation-increased-136-so-far-this-year" },
    ],
  },
  {
    month: "2025-03-01",
    monthlyPct: 13.1,
    interannualPct: 136,
    sources: [
      { label: "El Impulso — marzo 13,1%", url: "https://www.elimpulso.com/2025/04/08/inflacion-en-venezuela-alcanza-el-131-en-marzo-segun-el-observatorio-venezolano-de-finanzas-8abr/" },
    ],
  },
  {
    month: "2025-04-01",
    monthlyPct: 18.4,
    sources: [
      { label: "Efecto Cocuyo", url: "https://efectococuyo.com/economia/inflacion-en-venezuela-llega-al-26-en-mayo-segun-observatorio/" },
    ],
  },
  {
    month: "2025-05-01",
    monthlyPct: 26,
    interannualPct: 229,
    sources: [
      { label: "Banca y Negocios — mayo 26%", url: "https://www.bancaynegocios.com/ovf-inflacion-en-venezuela-para-mayo-se-ubico-en-26-porciento-y-la-acumulada-se-situo-en-105-con-5-porciento/" },
    ],
  },
];

/** Acumulada enero–mayo 2025, %. */
export const INFLATION_2025_YTD = 105.5;
export const INFLATION_SOURCE: Source = {
  label: "Observatorio Venezolano de Finanzas (OVF)",
  url: "https://observatoriodefinanzas.com/",
};

/**
 * En 2026 el OVF redujo la publicación regular del IPC mensual ante la
 * presión sobre las fuentes independientes, por lo que la serie mensual
 * detallada se detiene en 2025. Como referencia anual se citan las
 * proyecciones del FMI.
 */
export const INFLATION_NOTE =
  "En 2026, el OVF redujo la publicación regular del IPC mensual ante la presión sobre las fuentes independientes de datos. Como referencia anual, el FMI proyecta una inflación de ~270% para el cierre de 2025 y ~682% para 2026.";
export const INFLATION_PROJECTION_SOURCE: Source = {
  label: "Bloomberg Línea — proyección de inflación del FMI (682% en 2026)",
  url: "https://www.bloomberglinea.com/latinoamerica/venezuela/fmi-proyecta-inflacion-de-682-en-venezuela-en-2026-ademas-de-contraccion-en-su-economia/",
};

/* ── Tipo de cambio (BCV vs paralelo) ──────────────────────────────── */

export interface ExchangeSnapshot {
  /** ISO date. */
  date: string;
  /** Tasa oficial BCV, bolívares por USD. */
  bcv: number;
  /** Tasa paralela / mercado (Binance P2P), bolívares por USD. */
  parallel?: number;
  sources: Source[];
}

/**
 * Exchange-rate snapshot. This is a point-in-time figure (it moves daily);
 * always shown with its date. The gap ("brecha") between the official BCV
 * rate and the parallel/Binance rate signals exchange-market pressure.
 */
export const EXCHANGE_RATE: ExchangeSnapshot = {
  date: "2026-07-08",
  bcv: 685.94,
  parallel: 762.4,
  sources: [
    { label: "BCV — tipo de cambio oficial", url: "https://www.bcv.org.ve/seccionportal/tipo-de-cambio-oficial-del-bcv" },
    { label: "Monitor Dólar Venezuela — mercado paralelo", url: "https://exchangemonitor.net/venezuela/monitor-dolar" },
  ],
};

/* ── Producción petrolera ──────────────────────────────────────────── */

export interface OilPoint {
  /** Human-readable period label. */
  period: string;
  /** Production in thousand barrels per day (kbpd). */
  kbpd: number;
  note?: string;
  sources: Source[];
}

/**
 * Crude oil production. Figures vary by source and methodology (OPEC
 * secondary sources vs direct communication vs analyst estimates), so a
 * single "official" number does not exist; ranges are noted.
 */
export const OIL_PRODUCTION: OilPoint[] = [
  {
    period: "Noviembre 2025",
    kbpd: 934,
    note: "Producción según fuentes secundarias de la OPEP.",
    sources: [
      { label: "EIA — Venezuela country analysis", url: "https://www.eia.gov/international/analysis/country/VEN" },
    ],
  },
  {
    period: "Cierre 2025 (estimado)",
    kbpd: 1000,
    note: "Estimaciones entre ~800.000 y ~1,1 millones de bpd según la fuente.",
    sources: [
      { label: "The National — proyección 2026", url: "https://www.thenationalnews.com/business/energy/2026/01/05/venezuelan-oil-output-could-reach-12-million-bpd-by-end-of-2026-if-sanctions-are-lifted/" },
    ],
  },
  {
    period: "Mayo 2026",
    kbpd: 1120,
    note: "La producción creció en 2026: estimaciones de la OPEP entre ~1,07 y ~1,17 millones de bpd según la metodología (fuentes secundarias vs comunicación directa), un alza cercana al 28% frente a los ~924.000 bpd de enero. Chevron apunta a 300.000 bpd tras un nuevo acuerdo con el gobierno.",
    sources: [
      { label: "La Patilla — producción crece a 1,17 millones de bpd (OPEP)", url: "https://lapatilla.com/2026/06/11/produccion-de-crudo-venezolano-crecio-hasta-117-millones-de-barriles-diarios-segun-la-opep/" },
      { label: "Vanguardia — producción crece 22,9% en cuatro meses (OPEP)", url: "https://www.vanguardia.com/mundo/2026/05/13/la-produccion-petrolera-de-venezuela-crece-229-en-cuatro-meses-segun-la-opep/" },
    ],
  },
];

export const OIL_CONTEXT =
  "Chevron opera en Venezuela mediante empresas mixtas con PDVSA (incluido el mejorador Petropiar). Las refinerías independientes de China importaron alrededor de 400.000 bpd de crudo venezolano en 2025. El Consejo de Relaciones Exteriores (CFR) estima que llevar la producción de 1 a 2 millones de bpd hacia 2030 requeriría del orden de 110.000 millones de dólares en inversión upstream.";
export const OIL_SOURCES: Source[] = [
  { label: "Council on Foreign Relations", url: "https://www.cfr.org/expert-brief/increasing-venezuelas-oil-output-will-take-several-years-and-billions-dollars" },
  { label: "EIA — Venezuela", url: "https://www.eia.gov/international/analysis/country/VEN" },
];
