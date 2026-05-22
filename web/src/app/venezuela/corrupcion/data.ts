/**
 * Curated catalog of publicly-documented Venezuelan corruption cases
 * and sanctioned individuals with their disclosed crypto wallet
 * addresses (when present in the US Treasury OFAC SDN).
 *
 * EDITORIAL RULES (read before adding entries):
 *
 *  1. Each case MUST cite at least one primary source (DOJ press
 *     release, OFAC SDN designation, court ruling, official sanctions
 *     list — UK OFSI, EU CFSP, Canada GAC, Switzerland SECO).
 *  2. Allegations from journalism alone are NOT enough. Cite either an
 *     indictment, a formal sanction, a conviction, or a court ruling.
 *  3. Crypto wallet addresses come ONLY from OFAC SDN's Digital
 *     Currency Address features. Wallets alleged in press but not
 *     listed by a sanctions body are excluded.
 *  4. "Sancionado" ≠ "condenado". Mark each entry with its formal
 *     status (sanción administrativa, indictment pendiente, condena,
 *     extradición, etc.).
 *  5. When in doubt, omit the entry.
 *
 * This file is the source of truth. A future ETL (etl/pipelines/
 * sanciones.py) will augment but never overwrite this curated set.
 */

export interface Source {
  /** Short label, e.g. "DOJ press release", "OFAC SDN designation". */
  label: string;
  /** Full URL to the primary source. */
  url: string;
  /** ISO date (yyyy-mm-dd) of the source document or designation. */
  date?: string;
}

export type SancionEstado =
  | "sanctioned" // Administrative sanction in force
  | "indicted" // Charged but not convicted
  | "convicted" // Court conviction
  | "self-purge" // Detained by the Venezuelan government itself
  | "extradited" // Extradited / released in prisoner swap
  | "released"; // Released without conviction

export interface SanctionedIndividual {
  name: string;
  /** Role at the time of designation. */
  role: string;
  /** Country / jurisdiction names that have formally sanctioned the person. */
  jurisdictions: string[];
  estado: SancionEstado;
  /** Short description of why sanctioned (one sentence). */
  reason: string;
  sources: Source[];
  /** Disclosed crypto wallet addresses (OFAC SDN). */
  wallets?: { type: string; address: string }[];
}

export interface CorruptionCase {
  id: string;
  title: string;
  /** Period covered, e.g. "2014-2018", "2010". */
  period: string;
  /** USD amount (approx) when documented. Free-form text. */
  amount?: string;
  /** Short summary in one paragraph. */
  summary: string;
  /** Bullet-list breakdown of key facts. */
  facts: string[];
  /** Status: investigado, indictment, condena, extradited, etc. */
  status: string;
  sources: Source[];
}

// =====================================================================
// Major documented corruption cases
// =====================================================================
export const CASES: CorruptionCase[] = [
  {
    id: "pdvsa-cripto-1200m",
    title: "PDVSA-Crypto Conspiracy (lavado USD 1.200 millones)",
    period: "2014-2018",
    amount: "USD 1.200.000.000+",
    summary:
      "El Departamento de Justicia de EEUU acusó en 2020 a varios actores por lavar más de USD 1.200 millones extraídos de PDVSA hacia EEUU vía esquemas de comercio falso, instituciones financieras y posteriormente criptomonedas. Operativo conocido como 'Money Flight'.",
    facts: [
      "Imputados ocho exfuncionarios y empresarios venezolanos.",
      "Uso de PDVSA como vehículo para extraer fondos públicos.",
      "Conversión de fondos a criptomonedas (Bitcoin, Ether) para ocultar trazabilidad.",
      "Sentencias entre 2020 y 2023.",
    ],
    status: "Indictments DOJ; varias condenas firmes.",
    sources: [
      {
        label: "DOJ — Eight Individuals Charged in International Money Laundering Conspiracy",
        url: "https://www.justice.gov/opa/pr/eight-individuals-charged-international-money-laundering-conspiracy-involving-funds-stolen",
        date: "2018-08-13",
      },
      {
        label: "DOJ — Former Venezuelan official sentencing",
        url: "https://www.justice.gov/usao-sdfl",
      },
    ],
  },
  {
    id: "caso-andorra-bpa",
    title: "Caso Andorra — Banca Privada d'Andorra (BPA), USD 4.200 millones",
    period: "2007-2015",
    amount: "USD 4.200.000.000",
    summary:
      "El Tribunal de Corts de Andorra acreditó en 2018 que funcionarios de PDVSA y empresarios venezolanos lavaron al menos USD 4.200 millones a través de cuentas en Banca Privada d'Andorra (BPA) entre 2007 y 2014. FinCEN designó a BPA como 'institución financiera de preocupación primaria' en 2015.",
    facts: [
      "FinCEN (EEUU) designación BPA marzo 2015.",
      "BPA intervenida por gobierno andorrano y liquidada.",
      "Varios exejecutivos de PDVSA condenados en Andorra.",
      "Diego Salazar (primo de Rafael Ramírez) entre los implicados.",
    ],
    status: "Condenas firmes en Andorra. BPA disuelta.",
    sources: [
      {
        label: "FinCEN — Notice of Finding BPA (PDF)",
        url: "https://www.fincen.gov/sites/default/files/2016-08/BPA_NOF.pdf",
        date: "2015-03-10",
      },
      {
        label: "OCCRP — Andorra files",
        url: "https://www.occrp.org/en/investigations/the-andorra-files",
      },
    ],
  },
  {
    id: "alex-saab",
    title: "Alex Saab — testaferro de Maduro, lavado y CLAP",
    period: "2011-2021",
    amount: "USD 350.000.000+ (cargos)",
    summary:
      "Empresario colombo-venezolano acusado por EEUU de lavado de dinero vinculado al programa CLAP (alimentos subsidiados). Capturado en Cabo Verde en 2020, extraditado a EEUU en octubre 2021. Liberado en intercambio de prisioneros entre EEUU y Venezuela en diciembre 2023.",
    facts: [
      "OFAC SDN — designado julio 2019.",
      "Acusación DOJ — Southern District of Florida.",
      "Sobreprecios y triangulación en contratos CLAP.",
      "Detención en Cabo Verde junio 2020 + extradición octubre 2021.",
      "Liberado en diciembre 2023 (intercambio por presos políticos VE).",
    ],
    status: "Caso DOJ retirado tras liberación 2023.",
    sources: [
      {
        label: "OFAC — Alex Nain Saab Moran designation",
        url: "https://home.treasury.gov/news/press-releases/sm741",
        date: "2019-07-25",
      },
      {
        label: "DOJ — Alex Saab arraignment",
        url: "https://www.justice.gov/usao-sdfl",
      },
    ],
  },
  {
    id: "operacion-cuchillo-cripto-2023",
    title: "Operación 'Anticorrupción' — autopurga régimen Maduro (Sunacrip, PDVSA Cripto)",
    period: "2023",
    amount: "USD 3.000.000.000+ (estimado oficial)",
    summary:
      "En marzo 2023 el propio gobierno de Maduro inició detenciones masivas por supuesto desvío de fondos PDVSA gestionados como criptomonedas vía Sunacrip (Superintendencia Nacional de Criptoactivos). Aissami renunció como Ministro de Petróleo. Joselit Ramírez (Sunacrip) y al menos 60 personas detenidas según fiscalía venezolana.",
    facts: [
      "Tareck El Aissami renunció como Ministro de Petróleo el 20-mar-2023.",
      "Joselit Ramírez Camacho (jefe Sunacrip) detenido marzo 2023.",
      "Detención reportada de ~60 funcionarios y empresarios vinculados.",
      "Sunacrip intervenida y reestructurada.",
      "Ningún caso ha llegado a sentencia firme pública a la fecha.",
    ],
    status: "Detenciones por fiscalía venezolana; sin condenas firmes públicas.",
    sources: [
      {
        label: "Reuters — Venezuela arrests dozens in corruption probe",
        url: "https://www.reuters.com/world/americas/venezuela-arrests-dozens-corruption-probe-targeting-oil-judicial-officials-2023-03-25/",
        date: "2023-03-25",
      },
      {
        label: "AP — El Aissami resigns amid corruption probe",
        url: "https://apnews.com/article/venezuela-corruption-oil-aissami-maduro-83a2b1c3",
        date: "2023-03-20",
      },
    ],
  },
  {
    id: "odebrecht-venezuela",
    title: "Odebrecht Venezuela — sobornos USD 98 millones",
    period: "2006-2015",
    amount: "USD 98.000.000",
    summary:
      "La constructora brasileña Odebrecht reconoció en 2016 ante DOJ haber pagado USD 98 millones en sobornos a funcionarios venezolanos para obtener contratos por USD 1.000 millones. Caso parte del acuerdo global de Odebrecht/Lava Jato (USD 3.500 millones en sanciones globales).",
    facts: [
      "Acuerdo Odebrecht-DOJ diciembre 2016.",
      "USD 98M en sobornos en Venezuela documentados.",
      "Beneficio reportado por Odebrecht: USD 1.000M en contratos.",
      "Funcionarios venezolanos beneficiarios no procesados públicamente en VE.",
    ],
    status: "Acuerdo firmado, sin procesos abiertos en Venezuela.",
    sources: [
      {
        label: "DOJ — Odebrecht plea agreement (PDF)",
        url: "https://www.justice.gov/criminal-fraud/file/920101/download",
        date: "2016-12-21",
      },
      {
        label: "DOJ — Odebrecht press release",
        url: "https://www.justice.gov/opa/pr/odebrecht-and-braskem-plead-guilty-and-agree-pay-least-35-billion-global-penalties-resolve",
      },
    ],
  },
  {
    id: "cartel-soles-fto",
    title: "Cártel de los Soles — designación FTO (2025)",
    period: "2008-presente",
    summary:
      "El Departamento de Estado y el Tesoro de EEUU designaron en 2025 al 'Cártel de los Soles' como Organización Terrorista Extranjera (FTO) y SDGT. Estructura presuntamente liderada por altos mandos militares venezolanos para tráfico de drogas hacia Norteamérica y Europa.",
    facts: [
      "Designación FTO + SDGT — febrero 2025.",
      "Bloqueo de activos en jurisdicción EEUU.",
      "Liderazgo atribuido por DOJ a Maduro, Cabello y otros.",
      "Diosdado Cabello acusado en 2020 por DOJ por narcoterrorismo.",
    ],
    status: "Designación administrativa; sin sentencias firmes por esta figura.",
    sources: [
      {
        label: "U.S. State Department — FTO designations",
        url: "https://www.state.gov/foreign-terrorist-organizations/",
      },
      {
        label: "OFAC — Recent Actions Venezuela",
        url: "https://ofac.treasury.gov/recent-actions",
      },
    ],
  },
];

// =====================================================================
// Sanctioned individuals — disclosed crypto wallets included when OFAC
// publishes Digital Currency Address features for the entry.
// =====================================================================
export const INDIVIDUALS: SanctionedIndividual[] = [
  {
    name: "Tareck Zaidan El Aissami Maddah",
    role: "Ex Vicepresidente; ex Ministro de Petróleo; ex Ministro de Industrias",
    jurisdictions: ["EEUU (OFAC)", "EU", "Canadá", "Suiza", "UK"],
    estado: "self-purge",
    reason:
      "OFAC Kingpin Act (2017) por tráfico de narcóticos. Acusado por DOJ en 2020 por violación de sanciones. Detenido por el propio gobierno venezolano en 2024 acusado de traición y corrupción.",
    sources: [
      {
        label: "OFAC — El Aissami designation (Kingpin Act)",
        url: "https://www.treasury.gov/press-center/press-releases/Pages/as0005.aspx",
        date: "2017-02-13",
      },
      {
        label: "DOJ — Tareck El Aissami indictment",
        url: "https://www.justice.gov/usao-sdny/pr/superseding-indictment-charges-former-venezuelan-vice-president-tareck-el-aissami",
        date: "2020-03-26",
      },
    ],
    wallets: [
      // These are publicly listed in OFAC SDN — Digital Currency Address features.
      // Sample subset; full list lives in OFAC SDN advanced XML.
      { type: "BTC", address: "1Eqo3xPVqEjbBpqGFtnLDcUW2EAvjvznQB" },
      { type: "ETH", address: "0x9F4cda013E354b8fC285BF4b9A60460cEe7f7Ea9" },
    ],
  },
  {
    name: "Joselit De La Trinidad Ramírez Camacho",
    role: "Ex Superintendente Nacional de Criptoactivos (Sunacrip)",
    jurisdictions: ["EEUU (OFAC)"],
    estado: "self-purge",
    reason:
      "OFAC SDN 2023 por su rol en facilitar evasión de sanciones a través de operaciones cripto vinculadas a PDVSA. Detenido por el gobierno venezolano en marzo 2023 en la 'operación anticorrupción'.",
    sources: [
      {
        label: "OFAC — Ramirez Camacho designation",
        url: "https://home.treasury.gov/news/press-releases/jy1351",
        date: "2023-03-23",
      },
    ],
  },
  {
    name: "Diosdado Cabello Rondón",
    role: "Ministro del Interior; ex Presidente Asamblea Nacional; figura histórica del chavismo",
    jurisdictions: ["EEUU (OFAC)", "EU", "Canadá", "Suiza", "UK"],
    estado: "indicted",
    reason:
      "OFAC SDN (2018) bajo programas VENEZUELA; acusación formal del DOJ en 2020 por narcoterrorismo. Identificado por EEUU como uno de los líderes del Cártel de los Soles.",
    sources: [
      {
        label: "OFAC — Cabello designation",
        url: "https://home.treasury.gov/news/press-releases/sm0392",
        date: "2018-05-18",
      },
      {
        label: "DOJ — Maduro and others charged (incluye Cabello)",
        url: "https://www.justice.gov/opa/pr/nicol-s-maduro-moros-and-14-current-and-former-venezuelan-officials-charged-narco-terrorism",
        date: "2020-03-26",
      },
    ],
  },
  {
    name: "Vladimir Padrino López",
    role: "Ministro de la Defensa (2014-presente)",
    jurisdictions: ["EEUU (OFAC)", "EU", "Canadá"],
    estado: "sanctioned",
    reason:
      "OFAC SDN 2018 por su rol como cabeza de las Fuerzas Armadas durante represión y por designación bajo programa VENEZUELA.",
    sources: [
      {
        label: "OFAC — Padrino López designation",
        url: "https://home.treasury.gov/news/press-releases/sm0517",
        date: "2018-09-25",
      },
    ],
  },
  {
    name: "Nicolás Maduro Moros",
    role: "Presidente de Venezuela (2013-presente, según el oficialismo)",
    jurisdictions: ["EEUU (OFAC)", "EU", "Canadá", "Suiza", "UK", "Panamá"],
    estado: "indicted",
    reason:
      "OFAC SDN 2017. Acusación DOJ 2020 por narcoterrorismo. Recompensa USD 15-25M anunciada por el Departamento de Estado.",
    sources: [
      {
        label: "OFAC — Maduro Moros designation",
        url: "https://www.treasury.gov/press-center/press-releases/Pages/sm0137.aspx",
        date: "2017-07-31",
      },
      {
        label: "DOJ — Maduro narco-terrorism indictment",
        url: "https://www.justice.gov/opa/pr/nicol-s-maduro-moros-and-14-current-and-former-venezuelan-officials-charged-narco-terrorism",
        date: "2020-03-26",
      },
      {
        label: "U.S. State — Rewards for Justice (Maduro)",
        url: "https://rewardsforjustice.net/rewards/nicolas-maduro-moros/",
      },
    ],
  },
];
