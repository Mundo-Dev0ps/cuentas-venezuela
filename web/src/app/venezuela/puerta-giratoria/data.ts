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
];

export const REPLICA_EMAIL = "hola@cuentasvenezuela.org";
