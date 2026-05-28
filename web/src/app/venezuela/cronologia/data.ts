/**
 * Curated chronology of inflection points in the gradual breakdown of
 * Venezuelan republican institutions and democratic guarantees,
 * 1999-2024.
 *
 * EDITORIAL RULES:
 *  1. Every event MUST cite at least one primary source (constitutional
 *     text, court ruling, OAS resolution, UN FFM report, HRW/AI annual
 *     report, electoral authority publication, established media of
 *     record).
 *  2. Strictly factual framing — no editorial adjectives. The category
 *     and date carry the analytical weight; the description recounts
 *     what happened.
 *  3. Each entry is dateable to at least the month; entries with only a
 *     year known are written with day=1, month=1.
 *  4. When a fact is disputed, the entry records both versions with
 *     their respective sources.
 *
 * Used by /venezuela/cronologia. JSON-LD Event is emitted per row,
 * eligible for citation by Google AI Overviews / Perplexity / ChatGPT.
 */

export type EventCategory =
  | "constitutional"
  | "electoral"
  | "judicial"
  | "legislative"
  | "media"
  | "repression"
  | "militarization"
  | "international"
  | "civil-rights";

export interface EventSource {
  label: string;
  url: string;
}

export interface TimelineEvent {
  /** Stable slug for deep-linking. */
  id: string;
  /** ISO date (yyyy-mm-dd). Use the 1st when only year is known. */
  date: string;
  /** Free-form precision hint: "day", "month", "year". */
  precision: "day" | "month" | "year";
  title: string;
  /** One paragraph factual summary. */
  description: string;
  category: EventCategory;
  sources: EventSource[];
}

export const CATEGORY_LABEL: Record<EventCategory, { label: string; color: string }> = {
  constitutional: { label: "Constitucional", color: "border-amber-500/40 bg-amber-500/5 text-amber-300" },
  electoral: { label: "Electoral", color: "border-cyan-500/40 bg-cyan-500/5 text-cyan-300" },
  judicial: { label: "Judicial", color: "border-violet-500/40 bg-violet-500/5 text-violet-300" },
  legislative: { label: "Legislativo", color: "border-sky-500/40 bg-sky-500/5 text-sky-300" },
  media: { label: "Medios / libertad de prensa", color: "border-orange-500/40 bg-orange-500/5 text-orange-300" },
  repression: { label: "Represión", color: "border-rose-500/40 bg-rose-500/5 text-rose-300" },
  militarization: { label: "Militarización", color: "border-slate-500/40 bg-slate-500/5 text-slate-300" },
  international: { label: "Internacional", color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-300" },
  "civil-rights": { label: "Derechos civiles", color: "border-pink-500/40 bg-pink-500/5 text-pink-300" },
};

export const EVENTS: TimelineEvent[] = [
  {
    id: "1999-asamblea-constituyente",
    date: "1999-04-25",
    precision: "day",
    title: "Asamblea Constituyente convocada por referendo",
    description:
      "Hugo Chávez asume el 2 de febrero de 1999. El 25 de abril, mediante referendo consultivo, la población aprueba convocar a una Asamblea Nacional Constituyente. Es electa el 25 de julio. Disuelve el Congreso bicameral existente y redacta una nueva constitución, aprobada en referendo el 15 de diciembre de 1999.",
    category: "constitutional",
    sources: [
      { label: "Constitución de 1999 (texto oficial)", url: "https://www.oas.org/dil/esp/constitucion_venezuela.pdf" },
      { label: "OEA — informe sobre proceso constituyente", url: "https://www.oas.org/main/main.asp?sLang=S" },
    ],
  },
  {
    id: "2002-golpe-abril",
    date: "2002-04-11",
    precision: "day",
    title: "Golpe de Estado de abril y contragolpe",
    description:
      "Tras una marcha multitudinaria a Miraflores con muertos por disparos en ambos bandos, un sector militar exige la renuncia de Chávez. Pedro Carmona, presidente de Fedecámaras, asume y disuelve el Congreso, el TSJ y la Constitución. Es expulsado en 48 horas por contramovilización civil y militar. La CIDH documenta violaciones de derechos humanos cometidas durante el breve gobierno de Carmona y por la represión posterior.",
    category: "constitutional",
    sources: [
      { label: "CIDH — Informe 2003 Venezuela (cap. III, abril 2002)", url: "https://www.cidh.oas.org/annualrep/2002sp/cap.4d.htm" },
      { label: "HRW — Background and accountability", url: "https://www.hrw.org/news/2002/04/13/venezuela-investigate-killings-end-violence" },
    ],
  },
  {
    id: "2004-lista-tascon",
    date: "2004-02-01",
    precision: "month",
    title: "Lista Tascón — discriminación política por firma del revocatorio",
    description:
      "El diputado oficialista Luis Tascón publica en internet la lista nominal de 3.4 millones de venezolanos que firmaron solicitando el referendo revocatorio contra Chávez. La lista se cruza con bases de datos del Estado y se usa documentadamente para despidos en la administración pública, negar contratos y bloquear cédulas y pasaportes. HRW, CIDH y la Comisión Interamericana lo califican como discriminación política sistemática.",
    category: "civil-rights",
    sources: [
      { label: "HRW — A decade under Chávez (2008), sección Tascón List", url: "https://www.hrw.org/report/2008/09/18/decade-under-chavez/political-intolerance-and-lost-opportunities-advancing-human" },
      { label: "CIDH — Informe Venezuela 2009 (párr. 526-540)", url: "https://www.cidh.oas.org/countryrep/Venezuela2009sp/VE09.indice.sp.htm" },
    ],
  },
  {
    id: "2004-tsj-ampliacion",
    date: "2004-05-18",
    precision: "day",
    title: "Ampliación del TSJ — Ley Orgánica del Tribunal Supremo",
    description:
      "La Asamblea Nacional aprueba la Ley Orgánica del TSJ ampliando los magistrados de 20 a 32 con voto de mayoría simple en lugar de la 2/3 requerida por la Constitución. El oficialismo nombra 17 nuevos magistrados favorables al gobierno, asegurando control de Sala Constitucional, Electoral y Político-Administrativa. HRW documenta el fin de la independencia judicial.",
    category: "judicial",
    sources: [
      { label: "HRW — Manipulating the Judiciary (2004)", url: "https://www.hrw.org/report/2004/06/16/rigging-rule-law/judicial-independence-under-siege-venezuela" },
      { label: "Ley Orgánica del Tribunal Supremo de Justicia (Gaceta Oficial 37.942)", url: "http://www.tsj.gob.ve/" },
    ],
  },
  {
    id: "2007-cierre-rctv",
    date: "2007-05-27",
    precision: "day",
    title: "Cierre de Radio Caracas Televisión (RCTV)",
    description:
      "El gobierno no renueva la concesión de RCTV, el canal privado de cobertura nacional más antiguo y de mayor audiencia. La concesión, vigente desde 1953, expira a las 00:00. La frecuencia es asignada a TVes, canal estatal. CIDH y CIDH-RSF lo califican como represalia por línea editorial crítica. Estudiantes lideran las protestas que marcan el inicio del movimiento estudiantil de oposición.",
    category: "media",
    sources: [
      { label: "Relatoría Libertad de Expresión OEA — declaración cierre RCTV", url: "https://www.oas.org/es/cidh/expresion/showarticle.asp?artID=695&lID=2" },
      { label: "HRW — Closing RCTV undermined free expression", url: "https://www.hrw.org/news/2007/05/22/venezuela-closing-rctv-undermines-free-expression" },
    ],
  },
  {
    id: "2007-reforma-rechazada",
    date: "2007-12-02",
    precision: "day",
    title: "Referendo reforma constitucional — rechazado",
    description:
      "Chávez propone 69 cambios constitucionales incluyendo reelección presidencial indefinida, eliminación de autonomía del Banco Central, propiedad colectiva, jornada laboral de 36 horas y reorganización territorial. La población rechaza el paquete por 50.7% vs 49.3% (margen de ~125.000 votos sobre 9 millones). Es la primera derrota electoral del chavismo.",
    category: "electoral",
    sources: [
      { label: "CNE — Resultados referendo 2007", url: "http://www.cne.gob.ve/" },
      { label: "OAS — observación electoral 2007", url: "https://www.oas.org/eomdatabase/MoeReport.aspx?Lang=es&Id=315" },
    ],
  },
  {
    id: "2009-reeleccion-indefinida",
    date: "2009-02-15",
    precision: "day",
    title: "Enmienda 1 — reelección indefinida aprobada",
    description:
      "Tras el rechazo de 2007, Chávez convoca una nueva consulta limitada únicamente a permitir la reelección continua de todos los cargos de elección popular (presidente, gobernadores, alcaldes, parlamentarios). Aprobada con 54.4% vs 45.6%. Marca el fin del límite constitucional de dos períodos presidenciales.",
    category: "constitutional",
    sources: [
      { label: "Enmienda Constitucional 1 (Gaceta Oficial 5.908)", url: "https://www.oas.org/dil/esp/constitucion_venezuela.pdf" },
      { label: "OEA observación", url: "https://www.oas.org/eomdatabase/" },
    ],
  },
  {
    id: "2010-ley-habilitante",
    date: "2010-12-17",
    precision: "day",
    title: "Ley Habilitante — la AN saliente transfiere poder legislativo a Chávez",
    description:
      "Días antes de instalarse la nueva AN con bancada opositora ampliada, la AN saliente aprueba una Ley Habilitante por 18 meses cediendo la facultad legislativa al Ejecutivo. La nueva AN entrante queda neutralizada de facto. Ley Habilitante se renueva en 2013 y 2015.",
    category: "legislative",
    sources: [
      { label: "Gaceta Oficial 6.009 — Ley Habilitante 2010", url: "https://pandectasdigital.blogspot.com/" },
      { label: "CIDH — Informe Venezuela 2017 (cap. II)", url: "http://www.oas.org/es/cidh/informes/pdfs/Venezuela2018-es.pdf" },
    ],
  },
  {
    id: "2013-eleccion-maduro",
    date: "2013-04-14",
    precision: "day",
    title: "Elección presidencial — Maduro 1.49% sobre Capriles",
    description:
      "Tras la muerte de Chávez el 5 de marzo, se convocan elecciones. CNE proclama a Nicolás Maduro con 50.61% frente a 49.12% de Henrique Capriles, diferencia de 224.268 votos. La oposición denuncia 3.500 incidentes y solicita auditoría completa, denegada por el CNE. UNASUR avala los resultados; CNE solo audita el 54% de los votos. Es la elección presidencial más estrecha de la historia venezolana.",
    category: "electoral",
    sources: [
      { label: "CNE — Resultados 14 abril 2013", url: "http://www.cne.gob.ve/" },
      { label: "Observación UNASUR 2013", url: "https://www.refworld.org/docid/51b4f5f04.html" },
    ],
  },
  {
    id: "2014-la-salida",
    date: "2014-02-12",
    precision: "day",
    title: "Protestas 'La Salida' — 43 muertos, 3.351 detenidos",
    description:
      "Estudiantes y partidos opositores convocan protestas masivas exigiendo la salida de Maduro. La represión por GNB, PNB y colectivos armados deja 43 muertos según Foro Penal, 878 heridos, 3.351 detenidos. Líderes como Leopoldo López son encarcelados (López pasa 7 años preso). La CIDH dicta medidas cautelares.",
    category: "repression",
    sources: [
      { label: "Foro Penal — Cifras de represión 2014", url: "https://foropenal.com/" },
      { label: "CIDH — Medidas cautelares 2014/Venezuela", url: "https://www.oas.org/es/cidh/decisiones/cautelares.asp" },
      { label: "HRW — Punished for Protesting (2014)", url: "https://www.hrw.org/report/2014/05/05/punished-protesting/rights-violations-venezuelas-streets-detention-centers-and" },
    ],
  },
  {
    id: "2015-an-supermayoria",
    date: "2015-12-06",
    precision: "day",
    title: "AN — oposición gana 2/3 con 112 diputados",
    description:
      "En elecciones legislativas la Mesa de la Unidad Democrática (MUD) obtiene 112 diputados sobre 167 (supermayoría 2/3) frente a 55 del PSUV — primera derrota legislativa del chavismo. El CNE retrasa la proclamación de 4 diputados del estado Amazonas; el TSJ impide su juramentación, dejando a la AN sin la supermayoría operativa desde el primer día.",
    category: "electoral",
    sources: [
      { label: "CNE — Resultados parlamentarias 2015", url: "http://www.cne.gob.ve/" },
      { label: "TSJ Sala Electoral — sentencia 260 (diputados Amazonas)", url: "http://historico.tsj.gob.ve/decisiones/selec/Diciembre/184473-260-301215-2015-2015-000146.HTML" },
    ],
  },
  {
    id: "2016-tsj-vacia-an",
    date: "2016-01-11",
    precision: "month",
    title: "Sentencias del TSJ vacían atribuciones de la AN",
    description:
      "Entre enero 2016 y marzo 2017, el TSJ emite más de 50 sentencias declarando 'en desacato' a la AN y anulando todas sus leyes y decisiones. En marzo 2017 las sentencias 155 y 156 le atribuyen al TSJ las funciones del parlamento. Es señalado por la fiscal general Luisa Ortega como ruptura del orden constitucional. La OEA invoca la Carta Democrática Interamericana.",
    category: "judicial",
    sources: [
      { label: "Carta Democrática Interamericana — informe Almagro mayo 2016", url: "https://www.oas.org/en/sg/speeches/sg.asp?sCodigo=16-0050" },
      { label: "TSJ — Sentencias 155 y 156 (29 y 30 marzo 2017)", url: "http://historico.tsj.gob.ve/" },
    ],
  },
  {
    id: "2016-revocatorio-bloqueado",
    date: "2016-10-20",
    precision: "day",
    title: "CNE bloquea el referendo revocatorio presidencial",
    description:
      "El CNE suspende la recolección del 20% de firmas necesarias para activar el revocatorio contra Maduro, citando supuesto fraude en la primera fase y decisiones de tribunales penales regionales que ordenaron paralizar el proceso. La oposición había recolectado 2.5x el umbral mínimo en la primera fase. El revocatorio no se realiza.",
    category: "electoral",
    sources: [
      { label: "OEA — Almagro: revocatorio bloqueado", url: "https://www.oas.org/en/sg/speeches/sg.asp?sCodigo=16-0117" },
      { label: "HRW — Venezuela: government cancels recall vote", url: "https://www.hrw.org/news/2016/10/21/venezuela-government-cancels-recall-vote" },
    ],
  },
  {
    id: "2017-anc-impuesta",
    date: "2017-07-30",
    precision: "day",
    title: "Asamblea Nacional Constituyente impuesta — 120+ muertos en protestas",
    description:
      "Maduro convoca una ANC por decreto (sin referendo previo, requerido por la Constitución de 1999). Las protestas masivas entre abril y julio dejan según Foro Penal 157 muertos, 1.958 heridos por arma de fuego, 5.341 detenidos. La empresa contratada para auditar reconoce que las cifras del CNE (8.1M votantes) fueron infladas en al menos 1 millón. La ANC sesiona hasta 2020 sustituyendo a la AN electa.",
    category: "constitutional",
    sources: [
      { label: "OEA — sesión sobre ANC y declaratoria de ruptura", url: "https://www.oas.org/es/centro_noticias/comunicado_prensa.asp?sCodigo=C-052/17" },
      { label: "Smartmatic — declaración irregularidades ANC", url: "https://www.smartmatic.com/case-studies/article/statement-from-smartmatic-chairman-on-recent-constituent-assembly-election-in-venezuela/" },
      { label: "Foro Penal — informe 2017", url: "https://foropenal.com/" },
    ],
  },
  {
    id: "2018-maduro-reeleccion-disputada",
    date: "2018-05-20",
    precision: "day",
    title: "Elección presidencial disputada — oposición principal proscrita",
    description:
      "Maduro convoca elecciones adelantadas con la principal coalición opositora (MUD) ilegalizada y sus líderes en prisión, exilio o inhabilitados. Henri Falcón (disidencia opositora) compite. CNE proclama a Maduro con 67.8% y participación de 46% (la más baja desde 1958). El Grupo de Lima, OEA, UE, EEUU, Canadá y 50+ países declaran no reconocer la elección.",
    category: "electoral",
    sources: [
      { label: "Resolución del Grupo de Lima — no reconocimiento", url: "https://www.gob.mx/sre/prensa/declaracion-del-grupo-de-lima-pre-elecciones-en-venezuela" },
      { label: "Parlamento Europeo — Resolución 31 mayo 2018", url: "https://www.europarl.europa.eu/doceo/document/TA-8-2018-0238_ES.html" },
    ],
  },
  {
    id: "2019-guaido-presidente-interino",
    date: "2019-01-23",
    precision: "day",
    title: "Juan Guaidó juramentado presidente encargado — reconocido por 50+ países",
    description:
      "La AN, basada en el artículo 233 de la Constitución (vacío de poder por elección inválida), juramenta a su presidente Juan Guaidó como presidente encargado. EEUU, Canadá, la mayoría de la UE, Reino Unido, Grupo de Lima y más de 50 países lo reconocen. Maduro mantiene control efectivo del aparato del Estado y de las FAN. Inicia un período de dualidad institucional que se prolonga hasta 2023.",
    category: "international",
    sources: [
      { label: "Lista de países que reconocieron a Guaidó (Cancillería de Colombia)", url: "https://www.cancilleria.gov.co/" },
      { label: "OEA — Resolución sobre situación Venezuela 2019", url: "https://www.oas.org/es/centro_noticias/comunicado_prensa.asp?sCodigo=C-030/19" },
    ],
  },
  {
    id: "2019-ffm-onu-creada",
    date: "2019-09-27",
    precision: "day",
    title: "ONU establece la Misión Internacional Independiente (FFM Venezuela)",
    description:
      "El Consejo de Derechos Humanos de la ONU crea por Resolución 42/25 una Misión Internacional Independiente de Determinación de los Hechos sobre Venezuela. Sus informes 2020, 2022 y 2024 documentan ejecuciones extrajudiciales, torturas, desapariciones forzadas, violencia sexual y persecución política como política de Estado, atribuyéndolas a la cadena de mando hasta Maduro.",
    category: "international",
    sources: [
      { label: "ONU — Resolución 42/25", url: "https://digitallibrary.un.org/record/3829612" },
      { label: "FFM — Informe A/HRC/45/33 (2020)", url: "https://www.ohchr.org/es/hr-bodies/hrc/ffm-venezuela/index" },
    ],
  },
  {
    id: "2020-an-electa-abstencion-record",
    date: "2020-12-06",
    precision: "day",
    title: "AN electa con abstención récord y boicot opositor",
    description:
      "Elecciones parlamentarias convocadas tras una reestructuración del CNE por el TSJ (que designó rectores sin la participación constitucional de la AN). La oposición principal boicotea. CNE reporta 30.5% participación — la más baja en elecciones legislativas desde 1958. La AN resultante es controlada por el PSUV con 91% de los escaños.",
    category: "electoral",
    sources: [
      { label: "CNE — Resultados 6 diciembre 2020", url: "http://www.cne.gob.ve/" },
      { label: "FFM — Capítulo sobre elecciones (informe 2022)", url: "https://www.ohchr.org/es/hr-bodies/hrc/ffm-venezuela/index" },
    ],
  },
  {
    id: "2021-cpi-investigacion",
    date: "2021-11-03",
    precision: "day",
    title: "CPI abre investigación formal por crímenes de lesa humanidad",
    description:
      "La Fiscalía de la Corte Penal Internacional anuncia el paso del examen preliminar a investigación formal sobre crímenes de lesa humanidad presuntamente cometidos en Venezuela desde al menos abril 2017. Es la primera vez en la historia que un país latinoamericano es investigado en esa categoría por la CPI.",
    category: "international",
    sources: [
      { label: "CPI — Comunicado oficial 3 nov 2021", url: "https://www.icc-cpi.int/news/statement-prosecutor-international-criminal-court-mr-karim-aa-khan-qc-conclusion" },
    ],
  },
  {
    id: "2023-machado-inhabilitada",
    date: "2023-06-30",
    precision: "day",
    title: "María Corina Machado inhabilitada por 15 años por la Contraloría",
    description:
      "Tras ganar las primarias opositoras con 92% de los votos, la Contraloría General de la República (sin atribución constitucional para inhabilitar candidatos según la Constitución) extiende su inhabilitación administrativa a 15 años, impidiendo su candidatura. El TSJ ratifica la sanción en enero 2024. Machado designa a Edmundo González Urrutia como candidato sustituto.",
    category: "civil-rights",
    sources: [
      { label: "Contraloría General — comunicado de inhabilitación", url: "http://www.cgr.gob.ve/" },
      { label: "HRW — Disqualification undermines elections", url: "https://www.hrw.org/news/2023/06/30/venezuela-disqualification-machado-undermines-2024-elections" },
    ],
  },
  {
    id: "2024-eleccion-28julio",
    date: "2024-07-28",
    precision: "day",
    title: "Elección presidencial — actas publicadas por oposición vs proclamación CNE",
    description:
      "Edmundo González Urrutia (con respaldo de María Corina Machado) compite contra Maduro. El CNE proclama a Maduro a las 00:25 del 29 de julio con 51.2% vs 44.2%. La oposición publica el 73% de las actas reales obtenidas por testigos de mesa, mostrando un resultado de González 67% vs Maduro 30%. EEUU, Argentina, Costa Rica, Ecuador, Guatemala, Panamá, Paraguay, Perú, República Dominicana y Uruguay reconocen a González. El Centro Carter declara que la elección 'no puede ser considerada democrática'. Las actas siguen sin ser publicadas por el CNE.",
    category: "electoral",
    sources: [
      { label: "Centro Carter — declaración elecciones 2024", url: "https://www.cartercenter.org/news/pr/2024/venezuela-073024.html" },
      { label: "Actas publicadas por la oposición", url: "https://resultadosconvzla.com/" },
      { label: "OEA — Informe panel observación 2024", url: "https://www.oas.org/es/sap/dgde/" },
    ],
  },
  {
    id: "2024-represion-postelectoral",
    date: "2024-08-01",
    precision: "month",
    title: "Represión postelectoral — 27 muertos, 2.000+ detenidos, ola de exilio",
    description:
      "Tras el anuncio de los resultados oficiales, surgen protestas espontáneas en barrios populares. Foro Penal documenta 27 muertos, 200+ heridos y más de 2.000 detenidos en las dos semanas siguientes — incluyendo menores. Operación 'Tun Tun' del régimen identifica activistas, periodistas y testigos de mesa para detención. La FFM ONU documenta uso de cargos terroristas contra opositores.",
    category: "repression",
    sources: [
      { label: "Foro Penal — informe agosto 2024", url: "https://foropenal.com/" },
      { label: "FFM ONU — actualización oral oct 2024", url: "https://www.ohchr.org/es/hr-bodies/hrc/ffm-venezuela/index" },
      { label: "HRW — Crackdown after disputed election", url: "https://www.hrw.org/news/2024/08/15/venezuela-major-rights-abuses-after-presidential-election" },
    ],
  },
];
