// "Puerta giratoria" — funcionarios que rotan por múltiples cargos públicos y
// dejan promesas o mandatos públicos sin cumplimiento documentado.
//
// Reglas editoriales (críticas — son personas vivas):
//  - Registro FACTUAL, no juicio de opinión. Sin adjetivos de valor propios
//    ("corrupto", "inepto", "ladrón"). Se describen hechos y se citan fuentes.
//  - Cada promesa lleva DOBLE fuente: dónde se hizo (promiseSource) y la
//    evidencia de su estado (statusSource). Sin ambas, no se publica.
//  - El ranking se ordena por número de promesas con estado "incumplido".
//    Es un conteo verificable, no una calificación.
//  - Estado "en-disputa" cuando hay versiones encontradas.
//  - Derecho a réplica: correcciones a hola@cuentasvenezuela.org.

export interface Source {
  label: string;
  url: string;
  date?: string;
}

export interface PublicOffice {
  title: string;
  org?: string;
  /** ISO ("2005" | "2005-01" | "2005-01-15"). */
  start: string;
  /** ISO; omitir si en curso. */
  end?: string;
  source: Source;
}

export type PromiseStatus = "incumplido" | "parcial" | "en-disputa" | "cumplido";

export interface PublicPromise {
  text: string;
  /** ISO de cuándo se hizo la promesa. */
  madeDate: string;
  office?: string;
  status: PromiseStatus;
  /** Dónde/ cuándo lo prometió. */
  promiseSource: Source;
  /** Evidencia del estado (incumplimiento). */
  statusSource: Source;
  /** Cruce con Mapa del Olvido (/api/obras) si aplica. */
  relatedObraId?: string;
}

export interface Figure {
  id: string;
  name: string;
  /** 1-2 frases factuales, sin adjetivos de valor. */
  summary: string;
  offices: PublicOffice[];
  promises: PublicPromise[];
  /** Perfil general (p.ej. Poderopedia). */
  sources?: Source[];
}

/** Métrica de ranking: nº de promesas con estado "incumplido". */
export function unfulfilledCount(f: Figure): number {
  return f.promises.filter((p) => p.status === "incumplido").length;
}

export function officeCount(f: Figure): number {
  return f.offices.length;
}

/** Orden del ranking: incumplidas desc, luego nº de cargos desc. */
export function rankFigures(figures: Figure[]): Figure[] {
  return [...figures].sort(
    (a, b) =>
      unfulfilledCount(b) - unfulfilledCount(a) ||
      officeCount(b) - officeCount(a) ||
      a.name.localeCompare(b.name),
  );
}

const PODEROPEDIA = (slug: string, name: string): Source => ({
  label: `Poderopedia — ${name}`,
  url: `https://poderopediave.org/persona/${slug}/`,
});

export const FIGURES: Figure[] = [
  {
    id: "haiman-el-troudi",
    name: "Haiman El Troudi",
    summary:
      "Ingeniero y planificador que ocupó los ministerios de Planificación, del Despacho de la Presidencia y de Transporte, además de una curul en la Asamblea Nacional. Bajo su gestión en Transporte quedaron inconclusas varias obras viales que debían inaugurarse en 2012.",
    offices: [
      {
        title: "Ministro de Planificación y Desarrollo",
        start: "2007",
        end: "2008",
        source: PODEROPEDIA("haiman-el-troudi", "Haiman El Troudi"),
      },
      {
        title: "Ministro del Despacho de la Presidencia",
        start: "2008",
        end: "2010",
        source: PODEROPEDIA("haiman-el-troudi", "Haiman El Troudi"),
      },
      {
        title: "Ministro de Transporte Terrestre y Obras Públicas",
        start: "2013",
        end: "2015",
        source: {
          label: "Wikipedia — Haiman El Troudi",
          url: "https://es.wikipedia.org/wiki/Haiman_El_Troudi",
        },
      },
      {
        title: "Diputado a la Asamblea Nacional (Miranda)",
        start: "2015",
        end: "2020",
        source: {
          label: "Wikipedia — Haiman El Troudi",
          url: "https://es.wikipedia.org/wiki/Haiman_El_Troudi",
        },
      },
    ],
    promises: [
      {
        text: "Entregar el Metro Caracas–Guarenas–Guatire, previsto para 2012. La obra avanzó cerca del 27% y quedó abandonada pese a que el presupuesto pasó de 1.303 a 8.981 millones de dólares.",
        madeDate: "2012",
        office: "Ministro de Transporte Terrestre y Obras Públicas",
        status: "incumplido",
        promiseSource: {
          label: "Runrun.es — Las andanzas del clan de El Troudi",
          url: "https://runrun.es/investigacion/307182/las-andanzas-del-clan-de-el-troudi/",
        },
        statusSource: {
          label: "Runrun.es — obras viales inconclusas desde 2012",
          url: "https://runrun.es/investigacion/307182/las-andanzas-del-clan-de-el-troudi/",
        },
      },
      {
        text: "Poner en servicio la Línea 5 del Metro de Caracas, incluida entre las obras que debían estar operativas en 2012.",
        madeDate: "2012",
        office: "Ministro de Transporte Terrestre y Obras Públicas",
        status: "incumplido",
        promiseSource: {
          label: "Runrun.es — obras que debían inaugurarse en 2012",
          url: "https://runrun.es/investigacion/307182/las-andanzas-del-clan-de-el-troudi/",
        },
        statusSource: {
          label: "Convoca — pagos de Odebrecht y obras inconclusas",
          url: "https://convoca.pe/investigacion/venezuela-pagos-ocultos-de-odebrecht-se-relacionan-con-el-exministro-chavista-haiman",
        },
      },
      {
        text: "Culminar el Cabletren Bolivariano de Petare, incluido entre las obras previstas para 2012 que permanecen inconclusas.",
        madeDate: "2012",
        office: "Ministro de Transporte Terrestre y Obras Públicas",
        status: "incumplido",
        promiseSource: {
          label: "Runrun.es — obras que debían inaugurarse en 2012",
          url: "https://runrun.es/investigacion/307182/las-andanzas-del-clan-de-el-troudi/",
        },
        statusSource: {
          label: "Convoca — obras de transporte inconclusas",
          url: "https://convoca.pe/investigacion/venezuela-pagos-ocultos-de-odebrecht-se-relacionan-con-el-exministro-chavista-haiman",
        },
      },
    ],
    sources: [PODEROPEDIA("haiman-el-troudi", "Haiman El Troudi")],
  },
  {
    id: "jacqueline-faria",
    name: "Jacqueline Faría",
    summary:
      "Una de las funcionarias que más cargos ha ocupado en dos décadas: presidenta de Hidrocapital, ministra del Ambiente, jefa de Gobierno del Distrito Capital (en dos periodos) y ministra de Comunicación, entre otros. El 6 de julio de 2026 fue designada para coordinar la reconstrucción tras los terremotos, pese a que el saneamiento del río Guaire que impulsó quedó incompleto.",
    offices: [
      {
        title: "Presidenta de Hidrocapital",
        org: "Hidrocapital",
        start: "1999",
        source: {
          label: "El Venezolano News — trayectoria de Jacqueline Faría",
          url: "https://elvenezolanonewspaper.com/2026/07/jacqueline-faria-asume-la-reconstruccion-de-venezuela-tras-los-terremotos-con-una-trayectoria-marcada-por-altos-cargos-publicos/",
        },
      },
      {
        title: "Ministra del Ambiente y de los Recursos Naturales",
        start: "2005",
        end: "2006",
        source: {
          label: "El Venezolano News — trayectoria de Jacqueline Faría",
          url: "https://elvenezolanonewspaper.com/2026/07/jacqueline-faria-asume-la-reconstruccion-de-venezuela-tras-los-terremotos-con-una-trayectoria-marcada-por-altos-cargos-publicos/",
        },
      },
      {
        title: "Jefa de Gobierno del Distrito Capital",
        start: "2009",
        source: {
          label: "Efecto Cocuyo — Faría en la Jefatura de Gobierno del Distrito Capital",
          url: "https://efectococuyo.com/politica/jacqueline-faria-vuelve-a-la-jefatura-de-gobierno-del-distrito-capital/",
        },
      },
      {
        title: "Jefa de Gobierno del Distrito Capital (segundo periodo)",
        start: "2020-08",
        source: {
          label: "Mppcomunas — designación como Jefa de Gobierno del Distrito Capital",
          url: "https://www.mpcomunas.gob.ve/2020/08/18/designada-jacqueline-faria-como-jefa-de-gobierno-de-distrito-capital/",
        },
      },
      {
        title: "Coordinadora de la reconstrucción tras los terremotos",
        start: "2026-07-06",
        source: {
          label: "Infobae — Faría designada para coordinar la reconstrucción",
          url: "https://www.infobae.com/venezuela/2026/07/06/delcy-rodriguez-nombro-a-jacqueline-faria-para-coordinar-la-reconstruccion-tras-los-terremotos-en-venezuela/",
        },
      },
    ],
    promises: [
      {
        text: "Sanear y recuperar el río Guaire, proyecto emblemático de su paso por el Ministerio del Ambiente, financiado en parte con más de 100 millones de dólares (incluido crédito del BID). El proyecto quedó incompleto.",
        madeDate: "2005",
        office: "Ministra del Ambiente y de los Recursos Naturales",
        status: "incumplido",
        promiseSource: {
          label: "El Venezolano News — el proyecto del río Guaire",
          url: "https://elvenezolanonewspaper.com/2026/07/jacqueline-faria-asume-la-reconstruccion-de-venezuela-tras-los-terremotos-con-una-trayectoria-marcada-por-altos-cargos-publicos/",
        },
        statusSource: {
          label: "Martí Noticias — designada para reconstrucción pese a proyecto fallido",
          url: "https://www.martinoticias.com/a/gobierno-interino-de-venezuela-designa-a-autoridad-chavista-con-proyecto-fallido-para-reconstruccion-tras-el-terremoto/470227.html",
        },
      },
    ],
    sources: [PODEROPEDIA("jacqueline-faria", "Jacqueline Faría")],
  },
  {
    id: "jesse-chacon",
    name: "Jesse Chacón",
    summary:
      "Militar retirado que rotó por los ministerios de Interior y Justicia, Comunicación e Información, Ciencia y Tecnología y Energía Eléctrica, y luego fue nombrado embajador en Austria. Como ministro de Energía Eléctrica prometió estabilizar el sistema en 100 días.",
    offices: [
      {
        title: "Ministro de Interior y Justicia",
        start: "2003",
        end: "2004",
        source: PODEROPEDIA("jesse-chacon", "Jesse Chacón"),
      },
      {
        title: "Ministro de Comunicación e Información",
        start: "2004",
        end: "2005",
        source: PODEROPEDIA("jesse-chacon", "Jesse Chacón"),
      },
      {
        title: "Ministro de Ciencia, Tecnología e Industrias Intermedias",
        start: "2010",
        end: "2013",
        source: PODEROPEDIA("jesse-chacon", "Jesse Chacón"),
      },
      {
        title: "Ministro de Energía Eléctrica y presidente de Corpoelec",
        org: "Corpoelec",
        start: "2013-04",
        end: "2015",
        source: {
          label: "Runrun.es — Chacón destituido de la presidencia de Corpoelec",
          url: "https://runrun.es/nacional/venezuela-2/216455/jesse-chacon-fue-destituido-de-la-presidencia-de-corpoelec/",
        },
      },
      {
        title: "Embajador de Venezuela en Austria",
        start: "2015",
        source: PODEROPEDIA("jesse-chacon", "Jesse Chacón"),
      },
    ],
    promises: [
      {
        text: "Estabilizar el Sistema Eléctrico Nacional en 100 días, con el compromiso público de renunciar si no lo lograba. Permaneció en el cargo cerca de 24 meses sin resolver la crisis, hasta ser destituido en 2015.",
        madeDate: "2013",
        office: "Ministro de Energía Eléctrica y presidente de Corpoelec",
        status: "incumplido",
        promiseSource: {
          label: "El Cooperante — los 100 días que Chacón prometió y no cumplió",
          url: "https://elcooperante.com/los-100-dias-para-solventar-la-crisis-energetica-que-jesse-chacon-prometio-y-no-cumplio/",
        },
        statusSource: {
          label: "Transparencia Venezuela — Los ministros del apagón",
          url: "https://transparenciave.org/los-ministros-del-apagon/",
        },
      },
    ],
    sources: [PODEROPEDIA("jesse-chacon", "Jesse Chacón")],
  },
  {
    id: "luis-motta-dominguez",
    name: "Luis Motta Domínguez",
    summary:
      "General de la Guardia Nacional que fue ministro de Energía Eléctrica y presidente de Corpoelec entre 2015 y 2019. Prometió acabar con los apagones y fue destituido tras el megaapagón nacional de marzo de 2019. Ese mismo año fue sancionado por la OFAC de Estados Unidos.",
    offices: [
      {
        title: "Ministro de Energía Eléctrica y presidente de Corpoelec",
        org: "Corpoelec",
        start: "2015",
        end: "2019-04",
        source: {
          label: "El Impulso — Maduro destituye a Motta Domínguez",
          url: "https://www.elimpulso.com/2019/04/01/maduro-destituido-luis-motta-dominguez-como-ministro-de-energia-electrica-1abr/",
        },
      },
    ],
    promises: [
      {
        text: "Acabar con los apagones en el país en 100 días. Durante su gestión (2015–2019) los cortes eléctricos se incrementaron y en marzo de 2019 ocurrió el peor apagón de la historia de Venezuela.",
        madeDate: "2015",
        office: "Ministro de Energía Eléctrica y presidente de Corpoelec",
        status: "incumplido",
        promiseSource: {
          label: "TalCual — Motta Domínguez, el ministro de los apagones",
          url: "https://talcualdigital.com/luis-motta-dominguez-el-ministro-de-los-apagones/",
        },
        statusSource: {
          label: "El Estímulo — la oscura gestión de Luis Motta Domínguez",
          url: "https://elestimulo.com/climax/la-oscura-gestion-de-luis-motta-dominguez",
        },
      },
    ],
    sources: [
      PODEROPEDIA("luis-motta-dominguez", "Luis Motta Domínguez"),
      {
        label: "OFAC — sanción a Motta Domínguez (27 jun 2019)",
        url: "https://home.treasury.gov/news/press-releases/sm715",
        date: "2019-06-27",
      },
    ],
  },
  {
    id: "rafael-ramirez",
    name: "Rafael Ramírez",
    summary:
      "Ministro de Energía y Petróleo y presidente de PDVSA durante más de una década, además de vicepresidente del área económica, canciller y embajador ante la ONU. Fijó como meta elevar la producción petrolera a 6 millones de barriles diarios. Sobre él pesa una orden de captura por el caso PDVSA.",
    offices: [
      {
        title: "Ministro de Energía y Petróleo",
        start: "2002",
        end: "2014",
        source: {
          label: "Wikipedia — Rafael Ramírez Carreño",
          url: "https://es.wikipedia.org/wiki/Rafael_Ram%C3%ADrez_Carre%C3%B1o",
        },
      },
      {
        title: "Presidente de PDVSA",
        org: "PDVSA",
        start: "2004",
        end: "2014",
        source: {
          label: "Wikipedia — Rafael Ramírez Carreño",
          url: "https://es.wikipedia.org/wiki/Rafael_Ram%C3%ADrez_Carre%C3%B1o",
        },
      },
      {
        title: "Vicepresidente para el Área Económica",
        start: "2013",
        end: "2014",
        source: {
          label: "Transparencia Venezuela — Rafael Ramírez, rojo rojito",
          url: "https://transparenciave.org/project/petroleo-historia-7/",
        },
      },
      {
        title: "Ministro de Relaciones Exteriores (canciller)",
        start: "2014",
        end: "2014",
        source: {
          label: "Wikipedia — Rafael Ramírez Carreño",
          url: "https://es.wikipedia.org/wiki/Rafael_Ram%C3%ADrez_Carre%C3%B1o",
        },
      },
      {
        title: "Embajador de Venezuela ante la ONU",
        start: "2014",
        end: "2017",
        source: {
          label: "Wikipedia — Rafael Ramírez Carreño",
          url: "https://es.wikipedia.org/wiki/Rafael_Ram%C3%ADrez_Carre%C3%B1o",
        },
      },
    ],
    promises: [
      {
        text: "Elevar la producción petrolera a 6 millones de barriles diarios mediante el Plan Siembra Petrolera. Ocurrió lo contrario: dejó la industria en torno a 3 millones de bpd y la producción siguió cayendo hasta poco más de 1 millón.",
        madeDate: "2005",
        office: "Ministro de Energía y Petróleo",
        status: "incumplido",
        promiseSource: {
          label: "Transparencia Venezuela — Plan Siembra Petrolera (meta 6M bpd)",
          url: "https://transparenciave.org/project/petroleo-historia-7/",
        },
        statusSource: {
          label: "France 24 — Ramírez y la caída de la producción de PDVSA",
          url: "https://www.france24.com/es/20190226-entrevista-rafael-ramirez-pdvsa-petroleo-venezuela",
        },
      },
    ],
    sources: [
      PODEROPEDIA("rafael-ramirez", "Rafael Ramírez"),
      {
        label: "Euronews — orden de captura internacional (caso PDVSA)",
        url: "https://es.euronews.com/2022/08/31/venezuela-orden-de-captura-internacional-contra-el-exministro-de-petroleo-rafael-ramirez",
        date: "2022-08-31",
      },
    ],
  },
  {
    id: "nestor-reverol",
    name: "Néstor Reverol",
    summary:
      "General de la Guardia Nacional que dirigió la Oficina Nacional Antidrogas y fue ministro de Interior, Justicia y Paz antes de pasar al Ministerio de Energía Eléctrica. Asumió el sector eléctrico con el mandato de frenar los apagones; los cortes y el racionamiento continuaron. Está sancionado por EE. UU., la UE, Canadá y Suiza.",
    offices: [
      {
        title: "Director de la Oficina Nacional Antidrogas (ONA)",
        org: "ONA",
        start: "2008",
        end: "2010",
        source: PODEROPEDIA("nestor-reverol", "Néstor Reverol"),
      },
      {
        title: "Comandante General de la Guardia Nacional Bolivariana",
        start: "2014",
        end: "2016",
        source: {
          label: "Wikipedia — Néstor Reverol",
          url: "https://es.wikipedia.org/wiki/N%C3%A9stor_Reverol",
        },
      },
      {
        title: "Ministro de Interior, Justicia y Paz",
        start: "2016-08",
        end: "2020",
        source: {
          label: "Wikipedia — Néstor Reverol",
          url: "https://es.wikipedia.org/wiki/N%C3%A9stor_Reverol",
        },
      },
      {
        title: "Ministro de Energía Eléctrica",
        start: "2020",
        end: "2023",
        source: {
          label: "El Nacional — Reverol designado ministro de Energía Eléctrica",
          url: "https://www.elnacional.com/venezuela/designan-a-nestor-reverol-como-ministro-de-energia-electrica/",
        },
      },
    ],
    promises: [
      {
        text: "Dar respuesta a la llamada 'guerra eléctrica' y frenar los apagones al frente del Ministerio de Energía Eléctrica. Durante su gestión continuaron los cortes, el racionamiento y las fluctuaciones del servicio.",
        madeDate: "2020",
        office: "Ministro de Energía Eléctrica",
        status: "incumplido",
        promiseSource: {
          label: "SWI swissinfo — Maduro cambia al ministro para responder a la 'guerra eléctrica'",
          url: "https://www.swissinfo.ch/spa/maduro-cambia-a-ministro-de-energ%C3%ADa-el%C3%A9ctrica-para-dar-respuesta-a-la-%22guerra-el%C3%A9ctrica%22/76252870",
        },
        statusSource: {
          label: "Runrun.es — Reverol, una pasantía de bajo voltaje",
          url: "https://runrun.es/noticias/528567/reverol-una-pasantia-de-bajo-voltaje-frente-al-ministerio-de-energia-electrica/",
        },
      },
    ],
    sources: [PODEROPEDIA("nestor-reverol", "Néstor Reverol")],
  },
  {
    id: "manuel-quevedo",
    name: "Manuel Quevedo",
    summary:
      "General de la Guardia Nacional que pasó del Ministerio de Vivienda al Ministerio del Petróleo y la presidencia de PDVSA sin experiencia en el sector. Recibió el encargo de aumentar la producción petrolera; durante su gestión cayó a su mínimo histórico.",
    offices: [
      {
        title: "Ministro de Vivienda y Hábitat y presidente del Banavih",
        org: "Banavih",
        start: "2015",
        end: "2017",
        source: {
          label: "Wikipedia — Manuel Quevedo",
          url: "https://es.wikipedia.org/wiki/Manuel_Quevedo_(pol%C3%ADtico)",
        },
      },
      {
        title: "Ministro del Petróleo y presidente de PDVSA",
        org: "PDVSA",
        start: "2017-11",
        end: "2020-04",
        source: {
          label: "TalCual — Quevedo sale del Ministerio del Petróleo y de PDVSA",
          url: "https://talcualdigital.com/manuel-quevedo-sale-del-ministerio-del-petroleo-y-de-pdvsa/",
        },
      },
    ],
    promises: [
      {
        text: "Aumentar la producción de PDVSA en un millón de barriles diarios adicionales. La producción cayó de 1.837.000 bpd en noviembre de 2017 a 622.000 bpd en abril de 2020, el mínimo histórico de la industria.",
        madeDate: "2017-11",
        office: "Ministro del Petróleo y presidente de PDVSA",
        status: "incumplido",
        promiseSource: {
          label: "Transparencia Venezuela — el ministro-presidente de PDVSA Manuel Quevedo",
          url: "https://transparenciave.org/lo-se-sabe-del-ministro-presidente-pdvsa-mayor-general-manuel-quevedo/",
        },
        statusSource: {
          label: "TalCual — el general que llevó la producción de PDVSA a su mínimo histórico",
          url: "https://talcualdigital.com/quevedo-el-general-que-llevo-la-produccion-de-pdvsa-a-su-minimo-historico/",
        },
      },
    ],
    sources: [
      {
        label: "Wikipedia — Manuel Quevedo",
        url: "https://es.wikipedia.org/wiki/Manuel_Quevedo_(pol%C3%ADtico)",
      },
    ],
  },
  {
    id: "elias-jaua",
    name: "Elías Jaua",
    summary:
      "Rotó por la Vicepresidencia de la República y los ministerios de Agricultura y Tierras, Relaciones Exteriores y Educación. Impulsó la Gran Misión AgroVenezuela para reducir la dependencia de importaciones de alimentos; la producción de rubros clave cayó y las importaciones aumentaron.",
    offices: [
      {
        title: "Ministro de Agricultura y Tierras",
        start: "2010",
        end: "2012",
        source: PODEROPEDIA("elias-jaua", "Elías Jaua"),
      },
      {
        title: "Vicepresidente de la República",
        start: "2010",
        end: "2012",
        source: {
          label: "Wikipedia — Elías Jaua",
          url: "https://es.wikipedia.org/wiki/El%C3%ADas_Jaua",
        },
      },
      {
        title: "Ministro de Relaciones Exteriores (canciller)",
        start: "2013",
        end: "2014",
        source: {
          label: "Wikipedia — Elías Jaua",
          url: "https://es.wikipedia.org/wiki/El%C3%ADas_Jaua",
        },
      },
      {
        title: "Ministro de Educación",
        start: "2017",
        end: "2018",
        source: {
          label: "Wikipedia — Elías Jaua",
          url: "https://es.wikipedia.org/wiki/El%C3%ADas_Jaua",
        },
      },
    ],
    promises: [
      {
        text: "Reducir las importaciones de alimentos e impulsar la producción nacional mediante la Gran Misión AgroVenezuela. Las importaciones aumentaron y la producción de rubros clave cayó (maíz, aves, café y caña de azúcar registraron descensos de dos dígitos).",
        madeDate: "2011",
        office: "Ministro de Agricultura y Tierras",
        status: "incumplido",
        promiseSource: {
          label: "Poderopedia — Gran Misión AgroVenezuela",
          url: "https://poderopediave.org/organizacion/gran-mision-agrovenezuela/",
        },
        statusSource: {
          label: "PROVEA — Gran Misión AgroVenezuela: otra ficción",
          url: "https://provea.org/opinion/anuncio-de-reactivacion-de-la-gran-mision-agrovenezuela-otra-ficcion/",
        },
      },
    ],
    sources: [PODEROPEDIA("elias-jaua", "Elías Jaua")],
  },
  {
    id: "vladimir-padrino-lopez",
    name: "Vladimir Padrino López",
    summary:
      "General en jefe y ministro de la Defensa desde 2014. En 2016 fue puesto al frente de la Gran Misión Abastecimiento Soberano, creada para resolver la escasez de alimentos; la escasez persistió y el programa amplió el control militar sobre la distribución de comida.",
    offices: [
      {
        title: "Ministro de la Defensa",
        start: "2014",
        source: {
          label: "CNN en Español — quién es Vladimir Padrino López",
          url: "https://cnnespanol.cnn.com/2026/01/03/venezuela/quien-es-vladimir-padrino-lopez-orix",
        },
      },
      {
        title: "Jefe de la Gran Misión Abastecimiento Soberano",
        start: "2016-07",
        source: {
          label: "ProDavinci — la visión de Padrino López sobre los alimentos",
          url: "https://historico.prodavinci.com/2016/07/12/actualidad/cual-es-la-vision-de-padrino-lopez-sobre-el-tema-de-los-alimentos-en-venezuela/",
        },
      },
    ],
    promises: [
      {
        text: "Resolver la escasez de alimentos al frente de la Gran Misión Abastecimiento Soberano. La escasez persistió y el programa sumó a cientos de militares al control de la distribución de alimentos y bienes de primera necesidad.",
        madeDate: "2016-07",
        office: "Jefe de la Gran Misión Abastecimiento Soberano",
        status: "incumplido",
        promiseSource: {
          label: "ProDavinci — Padrino López y el tema de los alimentos",
          url: "https://historico.prodavinci.com/2016/07/12/actualidad/cual-es-la-vision-de-padrino-lopez-sobre-el-tema-de-los-alimentos-en-venezuela/",
        },
        statusSource: {
          label: "Infobae — Padrino López refuerza el control militar sobre los alimentos",
          url: "https://www.infobae.com/venezuela/2026/04/16/padrino-lopez-refuerza-el-control-militar-sobre-el-manejo-de-los-alimentos-en-venezuela/",
        },
      },
    ],
    sources: [PODEROPEDIA("vladimir-padrino-lopez", "Vladimir Padrino López")],
  },
  {
    id: "ernesto-villegas",
    name: "Ernesto Villegas",
    summary:
      "Periodista que rotó por los ministerios de Comunicación e Información y de Cultura, el Ministerio para la Transformación de Caracas, la presidencia de VTV y una embajada ante la Unesco. En 2014 afirmó que solo un gobierno de derecha desalojaría la Torre de David; el propio gobierno inició el desalojo dos meses después.",
    offices: [
      {
        title: "Ministro de Comunicación e Información",
        start: "2012",
        end: "2013",
        source: PODEROPEDIA("ernesto-villegas", "Ernesto Villegas"),
      },
      {
        title: "Ministro de Estado para la Transformación de Caracas",
        start: "2013",
        end: "2017",
        source: {
          label: "Wikipedia — Ernesto Villegas",
          url: "https://es.wikipedia.org/wiki/Ernesto_Villegas_(periodista)",
        },
      },
      {
        title: "Ministro de Cultura",
        start: "2017-11",
        end: "2026-03",
        source: {
          label: "Wikipedia — Ernesto Villegas",
          url: "https://es.wikipedia.org/wiki/Ernesto_Villegas_(periodista)",
        },
      },
      {
        title: "Embajador de Venezuela ante la Unesco",
        start: "2026-05",
        source: {
          label: "Alba Ciudad — AN designó a Villegas embajador ante la Unesco",
          url: "https://albaciudad.org/2026/05/asamblea-nacional-ernesto-villegas-embajador-unesco/",
        },
      },
    ],
    promises: [
      {
        text: "Afirmó en mayo de 2014 que «solo un gobierno de derecha desalojaría la Torre de David». Dos meses después, en julio de 2014, el propio gobierno inició el desalojo y el traslado de las familias de la Torre de David hacia complejos en las afueras de Caracas.",
        madeDate: "2014-05",
        office: "Ministro de Estado para la Transformación de Caracas",
        status: "incumplido",
        promiseSource: {
          label: "Wikipedia — Ernesto Villegas (declaración sobre la Torre de David)",
          url: "https://es.wikipedia.org/wiki/Ernesto_Villegas_(periodista)",
        },
        statusSource: {
          label: "CNN — Comienza el desalojo de la Torre de David (23 jul 2014)",
          url: "https://cnnespanol.cnn.com/2014/07/23/comienza-el-desalojo-de-la-torre-de-david-la-favela-vertical-en-el-centro-de-caracas",
        },
      },
    ],
    sources: [PODEROPEDIA("ernesto-villegas", "Ernesto Villegas")],
  },
  {
    id: "carlos-osorio",
    name: "Carlos Osorio",
    summary:
      "General de división que presidió PDVAL y CASA y fue varias veces ministro de Alimentación, además de ministro de la Secretaría de la Presidencia y presidente de la Corporación Venezolana de Minería. Prometió resolver la escasez de alimentos; la Asamblea Nacional declaró su responsabilidad política por la gestión del ministerio.",
    offices: [
      {
        title: "Presidente de PDVAL y de CASA",
        org: "PDVAL",
        start: "2010",
        source: PODEROPEDIA("carlos-osorio", "Carlos Osorio"),
      },
      {
        title: "Ministro de Alimentación",
        start: "2010",
        end: "2013",
        source: {
          label: "Wikipedia — Carlos Osorio",
          url: "https://es.wikipedia.org/wiki/Carlos_Osorio",
        },
      },
      {
        title: "Ministro de Alimentación (segundo periodo)",
        start: "2015",
        source: {
          label: "Analítica — regreso de Carlos Osorio al Ministerio de Alimentación",
          url: "https://www.analitica.com/actualidad/actualidad-nacional/oficializado-regreso-de-carlos-osorio-al-ministerio-de-alimentacion/",
        },
      },
      {
        title: "Presidente de la Corporación Venezolana de Minería",
        start: "2019",
        source: {
          label: "Cuentas Claras Digital — Osorio designado presidente de la CVM",
          url: "https://www.cuentasclarasdigital.org/2019/07/carlos-osorio-designado-presidente-de-cvm/",
        },
      },
    ],
    promises: [
      {
        text: "Resolver la escasez de alimentos del país. La Asamblea Nacional le declaró responsabilidad política por su gestión, y en almacenes de PDVAL se hallaron miles de toneladas de alimentos descompuestos.",
        madeDate: "2015",
        office: "Ministro de Alimentación (segundo periodo)",
        status: "incumplido",
        promiseSource: {
          label: "Wikipedia — Carlos Osorio (gestión en Alimentación)",
          url: "https://es.wikipedia.org/wiki/Carlos_Osorio",
        },
        statusSource: {
          label: "Armando.info — el Ministerio de Alimentación, un cuartel de amigos",
          url: "https://armando.info/el-ministerio-de-alimentacion-es-un-cuartel-de-amigos/",
        },
      },
    ],
    sources: [PODEROPEDIA("carlos-osorio", "Carlos Osorio")],
  },
  {
    id: "rodolfo-marco-torres",
    name: "Rodolfo Marco Torres",
    summary:
      "General que dirigió el Ministerio de Economía, Finanzas y Banca Pública y el de Alimentación, presidió tres bancos estatales, fue gobernador de Aragua y luego presidente de la Corporación Venezolana de Minería. Como ministro de Alimentación fue objeto de una moción de censura de la Asamblea Nacional por la crisis de desabastecimiento.",
    offices: [
      {
        title: "Ministro de Economía, Finanzas y Banca Pública",
        start: "2014",
        end: "2016",
        source: {
          label: "Legis — Marco Torres, ministro de Economía, Finanzas y Banca Pública",
          url: "http://www.legis.com.ve/BancoConocimiento/N/noticia200114/noticia200114.asp?Miga=1&CodSeccion=25",
        },
      },
      {
        title: "Ministro de Alimentación",
        start: "2016-01",
        end: "2016-04",
        source: {
          label: "Wikipedia — Rodolfo Marco Torres",
          url: "https://es.wikipedia.org/wiki/Rodolfo_Marco_Torres",
        },
      },
      {
        title: "Gobernador del estado Aragua",
        start: "2017",
        end: "2021",
        source: {
          label: "Wikipedia — Rodolfo Marco Torres",
          url: "https://es.wikipedia.org/wiki/Rodolfo_Marco_Torres",
        },
      },
      {
        title: "Presidente de la Corporación Venezolana de Minería",
        start: "2024-11",
        source: {
          label: "LosTubazos — Marco Torres, nuevo presidente de la CVM",
          url: "https://n24.lostubazos.com/2024/12/11/rodolfo-marco-torres-nuevo-presidente-de-la-cvm/",
        },
      },
    ],
    promises: [
      {
        text: "Garantizar el abastecimiento de alimentos como ministro de Alimentación. Tres meses después de asumir, la Asamblea Nacional aprobó una moción de censura en su contra por la crisis de desabastecimiento y fue removido del cargo.",
        madeDate: "2016-01",
        office: "Ministro de Alimentación",
        status: "incumplido",
        promiseSource: {
          label: "Wikipedia — Marco Torres, ministro de Alimentación",
          url: "https://es.wikipedia.org/wiki/Rodolfo_Marco_Torres",
        },
        statusSource: {
          label: "Wikipedia — moción de censura de la Asamblea Nacional (abr 2016)",
          url: "https://es.wikipedia.org/wiki/Rodolfo_Marco_Torres",
        },
      },
    ],
    sources: [PODEROPEDIA("rodolfo-marco-torres", "Rodolfo Marco Torres")],
  },
  {
    id: "freddy-bernal",
    name: "Freddy Bernal",
    summary:
      "Comisario policial que fue alcalde del municipio Libertador, ministro de Agricultura Urbana, comisario del Sebin, jefe nacional de los CLAP, 'protector' del Táchira y gobernador de ese estado. En 2014 fue puesto al frente de una comisión presidencial para reorganizar los cuerpos policiales.",
    offices: [
      {
        title: "Alcalde del municipio Libertador (Caracas)",
        start: "2000",
        end: "2008",
        source: PODEROPEDIA("freddy-bernal", "Freddy Bernal"),
      },
      {
        title: "Jefe de la Comisión Presidencial para la reorganización policial",
        start: "2014-10",
        end: "2015-04",
        source: {
          label: "Analítica — Bernal y la intervención de policías",
          url: "https://www.analitica.com/actualidad/actualidad-nacional/sucesos/bernal-estan-intervenidas-tres-policias-municipales/",
        },
      },
      {
        title: "Jefe Nacional de los CLAP",
        start: "2016-05",
        source: {
          label: "Wikipedia — Freddy Bernal",
          url: "https://en.wikipedia.org/wiki/Freddy_Bernal",
        },
      },
      {
        title: "Protector y luego gobernador del estado Táchira",
        start: "2017",
        source: {
          label: "El Tiempo — Freddy Bernal, protector del Táchira",
          url: "https://www.eltiempo.com/mundo/venezuela/quien-es-freddy-bernal-el-protector-del-tachira-denunciado-en-la-oea-411634",
        },
      },
    ],
    promises: [
      {
        text: "Reorganizar y depurar los cuerpos policiales al frente de la comisión presidencial creada en 2014. La reforma policial derivó en mayor militarización de la seguridad y la participación de funcionarios en delitos siguió siendo un problema documentado.",
        madeDate: "2014-10",
        office: "Jefe de la Comisión Presidencial para la reorganización policial",
        status: "incumplido",
        promiseSource: {
          label: "Analítica — Bernal al frente de la reorganización policial",
          url: "https://www.analitica.com/actualidad/actualidad-nacional/sucesos/bernal-estan-intervenidas-tres-policias-municipales/",
        },
        statusSource: {
          label: "Efecto Cocuyo — ¿qué pasó con la reforma policial en Venezuela?",
          url: "https://efectococuyo.com/opinion/que-paso-con-la-reforma-policial-en-venezuela-i/",
        },
      },
    ],
    sources: [PODEROPEDIA("freddy-bernal", "Freddy Bernal")],
  },
  {
    id: "william-contreras",
    name: "William Contreras",
    summary:
      "Militar y economista que dirigió la Superintendencia para la Defensa de los Derechos Socioeconómicos (Sundde), encargada del control de 'precios justos'. Los controles de precios que aplicó coincidieron con un agravamiento de la escasez y el contrabando. Está sancionado por Estados Unidos.",
    offices: [
      {
        title: "Superintendente de la Sundde (Costos y Precios Justos)",
        org: "Sundde",
        start: "2016-02",
        source: {
          label: "TalCual — perfil de William Contreras, el fiscalizador de 'precios justos'",
          url: "https://talcualdigital.com/perfil-william-contreras-el-fiscalizador-de-precios-justos/",
        },
      },
    ],
    promises: [
      {
        text: "Garantizar 'precios justos' y frenar la especulación mediante inspecciones y controles de precios. Los controles coincidieron con un agravamiento de la escasez, el acaparamiento y el contrabando de extracción.",
        madeDate: "2016",
        office: "Superintendente de la Sundde",
        status: "incumplido",
        promiseSource: {
          label: "Sundde — mandato de la Ley de Precios Justos",
          url: "https://es.wikipedia.org/wiki/Superintendencia_Nacional_para_la_Defensa_para_los_Derechos_Socioecon%C3%B3micos",
        },
        statusSource: {
          label: "TalCual — perfil de William Contreras y los efectos del control de precios",
          url: "https://talcualdigital.com/perfil-william-contreras-el-fiscalizador-de-precios-justos/",
        },
      },
    ],
    sources: [PODEROPEDIA("william-antonio-contreras", "William Contreras")],
  },
  {
    id: "aristobulo-isturiz",
    name: "Aristóbulo Istúriz",
    summary:
      "Dirigente y docente (fallecido en 2021) que rotó por la Alcaldía de Libertador, el Ministerio de Educación, la Gobernación de Anzoátegui, la Vicepresidencia de la República y la vicepresidencia de la Asamblea Nacional. En 2005 declaró a Venezuela 'territorio libre de analfabetismo'; la Unesco no certificó la declaración y estudios independientes estimaron un impacto mucho menor.",
    offices: [
      {
        title: "Ministro de Educación",
        start: "2001",
        end: "2007",
        source: {
          label: "Wikipedia — Aristóbulo Istúriz",
          url: "https://es.wikipedia.org/wiki/Aristobulo_Isturiz",
        },
      },
      {
        title: "Gobernador del estado Anzoátegui",
        start: "2012",
        end: "2016",
        source: {
          label: "Wikipedia — Aristóbulo Istúriz",
          url: "https://es.wikipedia.org/wiki/Aristobulo_Isturiz",
        },
      },
      {
        title: "Vicepresidente de la República",
        start: "2016",
        end: "2017",
        source: {
          label: "Wikipedia — Aristóbulo Istúriz",
          url: "https://es.wikipedia.org/wiki/Aristobulo_Isturiz",
        },
      },
    ],
    promises: [
      {
        text: "Declaró a Venezuela 'territorio libre de analfabetismo' en octubre de 2005 mediante la Misión Robinson, cifrando en 1,5 millones las personas alfabetizadas. La Unesco no certificó la declaración y un estudio independiente estimó que apenas unas 48.000 personas aprendieron a leer y escribir con el programa.",
        madeDate: "2005-10",
        office: "Ministro de Educación",
        status: "en-disputa",
        promiseSource: {
          label: "Wikipedia — Aristóbulo Istúriz y la declaración a la Unesco",
          url: "https://es.wikipedia.org/wiki/Aristobulo_Isturiz",
        },
        statusSource: {
          label: "ProDavinci — ¿Venezuela libre de analfabetismo? Lo que dicen las cifras de la Unesco",
          url: "https://historico.prodavinci.com/blogs/venezuela-libre-de-analfabetismo-que-es-lo-que-dicen-las-cifras-de-unesco-prodavincidatos/",
        },
      },
    ],
    sources: [
      {
        label: "Wikipedia — Aristóbulo Istúriz",
        url: "https://es.wikipedia.org/wiki/Aristobulo_Isturiz",
      },
    ],
  },
];

export const REPLICA_EMAIL = "hola@cuentasvenezuela.org";
