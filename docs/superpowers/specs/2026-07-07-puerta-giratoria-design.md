# Diseño: Puerta giratoria — cargos que rotan, promesas que no se cumplen

Fecha: 2026-07-07
Estado: aprobado (diseño), pendiente plan de implementación

## Contexto

Cuentas Venezuela documenta la crisis con datos oficiales y citados, sin
opinión editorial. La página `/venezuela/corrupcion` ya cubre casos con
sanción/condena oficial (OFAC, DOJ). Falta capturar un fenómeno distinto: la
**puerta giratoria** de funcionarios que rotan por múltiples cargos públicos,
hacen promesas concretas y las incumplen, y luego reaparecen en nuevos cargos.
Caso emblemático: **Jacqueline Faría** — impulsó el saneamiento del río Guaire
(financiado en parte con >100M USD, incluido crédito BID) que quedó incompleto,
ocupó ~8 cargos altos en dos décadas, y el 6 de julio de 2026 fue designada
para coordinar la reconstrucción tras los terremotos.

El reto central es el **encuadre legal**: son personas vivas. La página debe ser
un registro factual y citado, no un juicio de opinión, para ser defendible.

## Objetivo

Nueva página que rankea figuras públicas por **número de promesas/mandatos
públicos sin cumplimiento documentado**, mostrando por persona su rotación de
cargos y sus promesas con estado y doble fuente. Ranking + timeline en fase 1;
grafo de red en fase 2.

## Ruta y metadata

- Ruta: `/venezuela/puerta-giratoria` (alternativa considerada:
  `/venezuela/promesas-incumplidas`).
- H1: "Puerta giratoria: cargos que rotan, promesas que no se cumplen".
- `pageMetadata()` con título/descr SEO; `revalidate = 3600`.
- Añadir a `sitemap.ts` (`ROUTE_LASTMOD`), card en `/venezuela` landing,
  entrada en `llms.txt` + `llms-full.txt`.

## Modelo de datos

Archivo: `web/src/app/venezuela/puerta-giratoria/data.ts`

```ts
interface Source { label: string; url: string; date?: string }

interface PublicOffice {
  title: string;        // "Ministra de Ambiente"
  org?: string;         // "MINEC"
  start: string;        // ISO ("2005-01" o "2005-01-15")
  end?: string;         // ISO; omitir si en curso
  source: Source;       // designación/cese
}

type PromiseStatus = "incumplido" | "parcial" | "en-disputa" | "cumplido";

interface Promise {
  text: string;         // qué prometió, concreto
  madeDate: string;     // ISO
  office?: string;      // cargo desde el que la hizo
  status: PromiseStatus;
  promiseSource: Source;  // OBLIGATORIA — dónde lo prometió
  statusSource: Source;   // OBLIGATORIA — evidencia del estado
  relatedObraId?: string; // cruce con Mapa del Olvido (/api/obras)
}

interface Figure {
  id: string;           // slug
  name: string;
  summary: string;      // 1-2 frases neutras, factuales
  offices: PublicOffice[];
  promises: Promise[];
  sources?: Source[];   // perfil general (p.ej. Poderopedia)
}

export const FIGURES: Figure[] = [ /* 3-5 al inicio */ ];

// Métrica de ranking: nº de promesas con status "incumplido".
export function unfulfilledCount(f: Figure): number;
```

Regla dura: `Promise` sin `promiseSource` **y** `statusSource` no se publica.

## Página — Fase 1 (ranking + timeline)

Server component. Estructura:

1. Breadcrumb JSON-LD + FAQPage JSON-LD (NO Person JSON-LD).
2. Header: badge, H1, subtítulo explicando el criterio factual.
3. `<aside>` disclaimer (ver Salvaguardas).
4. **Ranking** — lista ordenada desc por `unfulfilledCount`. Fila:
   nombre · nº cargos · nº promesas incumplidas. Client component para
   expandir (mismo patrón que `states-explorer`/acordeón del sismo).
5. Detalle por persona (al expandir), notas siempre en DOM (SEO):
   - Timeline de cargos (orden cronológico, fechas + fuente).
   - Lista de promesas: texto, fecha, badge de estado (color por status),
     links de las dos fuentes; si `relatedObraId`, link a la obra en Mapa
     del Olvido.
6. FAQ (3-4, factual). Footer con fuentes principales + nota de método.

Colores de estado: incumplido = rose, parcial = amber, en-disputa = slate,
cumplido = emerald.

## Página — Fase 2 (grafo) — entrega posterior

Grafo bipartito **personas ↔ cargos/organismos** en SVG propio (mismo enfoque
generado/offline que el mapa del sismo: sin lib de mapas ni deck.gl). Aristas
= "ocupó el cargo". Muestra solapamientos y rotación. Se especifica en su
propio plan tras validar la fase 1.

## Salvaguardas legales (personas vivas)

1. **Doble fuente por promesa** (promesa + evidencia de estado). Sin ambas, no
   se publica el ítem.
2. **Lenguaje neutro**: "sin cumplimiento documentado", "quedó incompleto",
   "no se ha documentado el cumplimiento" — nunca "mintió", "robó", "corrupto"
   como afirmación propia.
3. Estado `en-disputa` cuando hay versiones encontradas; se muestran ambas.
4. **Disclaimer visible** + **derecho a réplica**: contacto
   (hola@cuentasvenezuela.org) para correcciones/aclaraciones, con compromiso
   de publicar réplicas.
5. **Sin JSON-LD `Person`** con afirmaciones negativas. Solo Breadcrumb + FAQ.
6. El ranking se describe literal: "ordenado por número de promesas públicas
   sin cumplimiento documentado" — es un conteo verificable, no un juicio.
7. El `summary` por persona es factual (cargos, hechos), sin adjetivos de
   valor.

## Datos iniciales

3-5 figuras, arrancando por **Jacqueline Faría**. El asistente investiga y
redacta con fuentes (Poderopedia, prensa, gacetas de designación); el usuario
revisa antes de publicar. Candidatas adicionales a confirmar en el plan según
disponibilidad de fuentes sólidas.

## Cambios en archivos existentes

- `web/src/app/sitemap.ts` — ruta + lastmod.
- `web/src/app/venezuela/page.tsx` — card nueva en `SECTIONS`.
- `web/public/llms.txt` + `web/public/llms-full.txt` — entrada.

## Verificación

- `npm run typecheck` (en el contenedor `cuentas-venezuela-web-1`).
- Render en dev: `/venezuela/puerta-giratoria` 200, ranking ordenado,
  expansión muestra cargos + promesas + fuentes, notas en DOM.
- Landing card presente; `/sitemap.xml` incluye la ruta; `/llms.txt` entrada.
- Revisión legal manual: cada promesa con dos fuentes; lenguaje neutro;
  disclaimer + réplica presentes.

## Fuera de alcance (fase 1)

- Grafo de red (fase 2).
- Índice compuesto de ranking.
- Ingesta automática / ETL (datos manuales, como sismo-2026).
```
