# Diseño: "Recibió vs hoy" + "Sanciones, no bloqueo"

Fecha: 2026-07-23
Estado: diseño aprobado; pendiente plan de implementación

## Contexto

Cuentas Venezuela documenta la crisis con datos oficiales y citados, sin
opinión editorial. Faltan dos piezas que el usuario pidió:

1. Una **comparativa de rendición de cuentas**: cómo recibió el chavismo el
   país (baseline 1998, último año pre-chavismo — Chávez asume el 2 feb 1999)
   frente al último dato disponible, en indicadores económicos y sociales.
   Las páginas actuales (`/venezuela/antes-despues`, `/venezuela/economia`)
   ya comparan 1998-2024 pero contra Chile y sin el encuadre "recibió vs hoy",
   y no incluyen **pobreza** ni **producción petrolera** en serie larga.
2. Un **explicador de sanciones** que responda con hechos a la afirmación de
   que Venezuela sufre un "bloqueo": distinguir sanciones a personas/entidades
   y sectoriales de un embargo total, mostrar las exenciones humanitarias, y
   la cronología del colapso previo a las sanciones sectoriales.

Ambas son páginas independientes; pueden implementarse y desplegarse por
separado.

## Página A — `/venezuela/recibido-vs-hoy`

H1: "Cómo recibió el chavismo a Venezuela y cómo está hoy".

### Formato por indicador (aprobado)

Bloque "antes/después": cifra grande **1998** → cifra grande **último dato**,
delta (%, veces o puntos porcentuales según el indicador), y una **mini línea
de tendencia** que muestra el arco completo (auge petrolero y caída). Cada
bloque cita su fuente y la fecha del último dato.

### Indicadores

Reusan el pipeline World Bank existente (`getVeMacroIndicators`,
`etl/pipelines/ve_macro.py`), consultando `from: 1998`:

- PIB per cápita (`NY.GDP.PCAP.CD`)
- Crecimiento del PIB (`NY.GDP.MKTP.KD.ZG`)
- Inflación / IPC (`FP.CPI.TOTL.ZG`)
- Desempleo (`SL.UEM.TOTL.ZS`)
- Deuda del gobierno central (`GC.DOD.TOTL.GD.ZS`)

Datos nuevos, curados a mano y citados (sin API limpia — patrón `coyuntura`),
en `web/src/app/venezuela/recibido-vs-hoy/data.ts`:

- **Pobreza** — ENCOVI (UCAB). Baseline ~1998 (encuestas de hogares) y serie
  ENCOVI (picos 2020 y último dato). Fuente: ENCOVI/UCAB.
- **Producción petrolera** — serie larga kbpd: ~1998 (~3,3-3,4M bpd), auge,
  colapso (~400k en 2020) y recuperación reciente. Fuentes: OPEP/EIA. La cifra
  reciente puede referenciar la de `coyuntura`.

### Componentes

- `data.ts`: `Source`, `ManualSeries` (para pobreza y petróleo: puntos
  `{year, value, note?, sources}`), y helpers de delta.
- `before-after.tsx` (o reuso): bloque antes/después + mini sparkline. Para los
  indicadores World Bank, un componente server que toma la serie y renderiza el
  bloque. Para los manuales, el mismo componente sobre `ManualSeries`.
- `page.tsx`: server component, `revalidate = 3600`. Header + disclaimer +
  grid de bloques + FAQ. JSON-LD: Dataset + FAQPage + Breadcrumb.

### Encuadre

Factual: se muestran magnitudes y su cambio, citadas. El título usa "chavismo"
como referencia temporal (1999→hoy), no como juicio. Sin adjetivos de valor.

## Página B — `/venezuela/sanciones`

H1: "Sanciones, no bloqueo: los hechos".

Desmentido **directo pero citado**: el titular confronta el término "bloqueo",
pero cada afirmación lleva fuente primaria y los hechos hacen el argumento.

### Estructura "lo que se dice ↔ los hechos"

Bloques, cada uno con fuente:

1. **Sanciones a personas y entidades** — OFAC SDN desde 2017 (Maduro y altos
   funcionarios). Dirigidas a gobernantes, no a la población. Enlaza con
   `/venezuela/corrupcion` (que ya lista sancionados).
2. **Sanciones sectoriales** — petróleo/PDVSA (EO 13857; designación de PDVSA
   del 28 de enero de 2019).
3. **Exenciones humanitarias** — licencias generales de OFAC que autorizan
   alimentos, medicinas y bienes humanitarios.
4. **Cronología del colapso** — el PIB cayó ~50% y la hiperinflación arrancó
   (nov 2017) **antes** de las sanciones sectoriales (ene 2019). Mini timeline.
5. **Qué NO es** — ni embargo comercial total (tipo Cuba) ni bloqueo naval.

### Componentes

- `data.ts`: bloques `{ claim?, fact, sources[] }` + timeline de hitos con
  fecha y fuente.
- `page.tsx`: server component. Header + grid/lista de bloques + timeline + FAQ.
  JSON-LD: FAQPage + Breadcrumb (NO Person, NO Event).

### Salvaguardas

- Cada afirmación con fuente primaria (OFAC/Tesoro/GAO) o de referencia (Banco
  Mundial, académica). Sin ambas cuando corresponda.
- Lenguaje factual; el titular es directo pero el cuerpo describe hechos, no
  emite juicios de valor propios.
- Nota de contexto: distintas fuentes debaten el impacto de las sanciones; la
  página documenta qué son y qué no son y la secuencia temporal, no zanja el
  debate sobre su efecto total.

## Cambios en archivos existentes (ambas páginas)

- `web/src/app/sitemap.ts` — 2 rutas + `ROUTE_LASTMOD`.
- `web/src/app/venezuela/page.tsx` — 2 cards nuevas en `SECTIONS`.
- `web/public/llms.txt` + `web/public/llms-full.txt` — 2 entradas.

## Verificación

- `npm run typecheck` en el contenedor.
- Render dev: ambas rutas 200; bloques antes/después con cifras + tendencia;
  timeline de sanciones; FAQ; JSON-LD correcto (Dataset/FAQ/Breadcrumb, sin
  Event/Person).
- Landing cards, sitemap y llms actualizados.
- Revisión manual: cada dato con fuente; lenguaje factual en la página B.

## Fuera de alcance

- Nuevos pipelines ETL (pobreza y petróleo son datos manuales curados).
- Comparativa vs otros países (ya existe en antes-despues).
- Zanjar el debate económico sobre el efecto neto de las sanciones.

## Fases

1. Página A (recibido-vs-hoy) + datos manuales pobreza/petróleo.
2. Página B (sanciones).
Se pueden entregar en PRs separados.
