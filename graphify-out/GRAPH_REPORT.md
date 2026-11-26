# Graph Report - cuentas-venezuela  (2026-11-26)

## Corpus Check
- 221 files · ~109,123 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: (none) 8, .geojson 4, .example 1)

## Summary
- 1246 nodes · 2290 edges · 91 communities (72 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0beabc25`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sismo-2026/page.tsx
- dependencies
- ObraPublica
- dependencies
- app.ts
- test_obras.py
- recibido-vs-hoy/page.tsx
- App.tsx
- apoyar/page.tsx
- MapaRoot.tsx
- compilerOptions
- ClusterLayer.ts
- put_parquet
- api.ts
- coyuntura/page.tsx
- puerta-giratoria/page.tsx
- economia/page.tsx
- compilerOptions
- cronologia/page.tsx
- antes-despues/page.tsx
- demografia-view.tsx
- json-ld.tsx
- corrupcion/page.tsx
- sanciones/page.tsx
- csv-export.ts
- update-sismo.py
- extranjeria.py
- card.tsx
- breadcrumbsJsonLd
- ddhh/page.tsx
- App
- embi.py
- esequibo/page.tsx
- obra.ts
- 🇻🇪 Cuentas Venezuela
- Diseño: "Recibió vs hoy" + "Sanciones, no bloqueo"
- acnur.py
- ve_macro.py
- devDependencies
- scripts
- gen-map.js
- api/package.json
- freedom_house.py
- sanciones.py
- Diseño: Puerta giratoria — cargos que rotan, promesas que no se cumplen
- pageMetadata
- chile-map.tsx
- vdem.py
- HighlightLayer.ts
- MapContainer.tsx
- comparativa/page.tsx
- app/fuentes/page.tsx
- indicadores/[slug]/page.tsx
- dev-server.ts
- RotateHint.tsx
- devDependencies
- cf-security-bootstrap.sh
- scripts
- tributario/page.tsx
- verify_sources.sh
- next.config.mjs
- sitemap.ts
- AGENTS.md — Cuentas Venezuela
- schema.ts
- __main__.py
- mailer.ts
- cf-custom-domains.sh
- web/package.json
- app/opengraph-image.tsx
- newsletter-signup.tsx
- src/lib/slug.ts
- rate-limit.ts
- release-please-config.json
- cf-worker-secrets.sh
- set-gh-secrets.sh
- with-personal-gh.sh
- start.sh
- apple-icon.tsx
- icon.tsx
- lucide-react
- @playwright/test
- next-env.d.ts
- tailwindcss
- datos-chile-etl
- @vitejs/plugin-react

## God Nodes (most connected - your core abstractions)
1. `lucide-react` - 53 edges
2. `pageMetadata()` - 36 edges
3. `react` - 35 edges
4. `breadcrumbsJsonLd()` - 33 edges
5. `faqPageJsonLd()` - 33 edges
6. `ObraPublica` - 29 edges
7. `put_parquet()` - 20 edges
8. `datasetJsonLd()` - 19 edges
9. `App()` - 19 edges
10. `JsonLd()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `FuentesPage()` --calls--> `listSources()`  [EXTRACTED]
  web/src/app/datos-chile/fuentes/page.tsx → web/src/lib/api.ts
- `HeroStatsProps` --references--> `ObraPublica`  [EXTRACTED]
  web/src/mapa/components/HeroStats/HeroStats.tsx → web/src/mapa/types/obra.ts
- `fetch_year()` --calls--> `fetch_bytes()`  [EXTRACTED]
  etl/pipelines/acnur.py → etl/pipelines/_http.py
- `fetch_series_last()` --calls--> `fetch_bytes()`  [EXTRACTED]
  etl/pipelines/embi.py → etl/pipelines/_http.py
- `fetch_real()` --calls--> `fetch_bytes()`  [EXTRACTED]
  etl/pipelines/extranjeria.py → etl/pipelines/_http.py

## Import Cycles
- None detected.

## Communities (91 total, 19 thin omitted)

### Community 0 - "sismo-2026/page.tsx"
Cohesion: 0.06
Nodes (40): HomePage(), metadata, SECTIONS, AffectedStates(), SEVERITY, stateItemId(), DamageMap(), FILL (+32 more)

### Community 1 - "dependencies"
Cohesion: 0.25
Nodes (8): dependencies, drizzle-orm, hono, @hono/node-server, mimetext, @neondatabase/serverless, postgres, zod

### Community 2 - "ObraPublica"
Cohesion: 0.11
Nodes (27): AggregateImpact(), AggregateImpactProps, calculateImpact(), ImpactResult, formatUSDCompact(), ObraDetail(), ObraDetailProps, STATUS_LABEL (+19 more)

### Community 3 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, clsx, deck.gl, @deck.gl/core, @deck.gl/layers, @deck.gl/react, leaflet, lucide-react (+11 more)

### Community 4 - "app.ts"
Cohesion: 0.17
Nodes (12): AppType, createApp(), Env, NOTE: previous in-process DuckDB preview was removed for the Workers, registerRoutes(), rowsOf(), Variables, Db (+4 more)

### Community 5 - "test_obras.py"
Cohesion: 0.11
Nodes (26): _discover_urls(), _enrich(), Geocoder, Address -> (lat, lon) for Venezuelan obras with offline fallbacks. Strategy: 1.…, _http_get(), main(), normalize_estatus(), normalize_presupuesto_usd() (+18 more)

### Community 6 - "recibido-vs-hoy/page.tsx"
Cohesion: 0.11
Nodes (31): BeforeAfter(), delta(), EraLegend(), MegaStatCard(), nearestDot(), Props, sparkPath(), xForYear() (+23 more)

### Community 7 - "App.tsx"
Cohesion: 0.08
Nodes (23): @radix-ui/react-slider, react, KofiFeedProps, DEFAULT_URL_STATE, findStateBySlug(), StateFeatureCollection, STATUS_LABEL, TOOLTIP_STYLE (+15 more)

### Community 8 - "apoyar/page.tsx"
Cohesion: 0.09
Nodes (21): ApoyarPage(), metadata, revalidate, TIERS, metadata, ORGANIZATION_JSONLD, viewport, WEBSITE_JSONLD (+13 more)

### Community 9 - "MapaRoot.tsx"
Cohesion: 0.09
Nodes (22): react-router-dom, metadata, MapaLoader(), MapaRoot, ensureLoader(), Turnstile(), TurnstileProps, Window (+14 more)

### Community 10 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 11 - "ClusterLayer.ts"
Cohesion: 0.11
Nodes (23): ESTATUS_OPTIONS, FiltersBar(), FiltersBarProps, Legend(), STATUSES, buildClusterLayers(), Cluster, featureCentroid() (+15 more)

### Community 12 - "put_parquet"
Cohesion: 0.16
Nodes (18): Pipeline: stock por nacionalidad para comparativa. DEMO: aproximaciones…, run(), db_url(), Tiny Postgres helper for ETL pipelines: connect + bulk upsert., Generic UPSERT. Args: table: schema-qualified target table (e.g.…, upsert(), Pipeline: SII — aporte tributario estimado. DEMO: estimación gruesa basada en…, run() (+10 more)

### Community 13 - "api.ts"
Cohesion: 0.09
Nodes (21): IndicadoresPage(), metadata, HomePage(), AcnurRow, AporteRow, ComparativaRow, CotizantesSectorRow, Dataset (+13 more)

### Community 14 - "coyuntura/page.tsx"
Cohesion: 0.11
Nodes (25): EXCHANGE_RATE, ExchangeSnapshot, INFLATION_2025, INFLATION_2025_YTD, INFLATION_NOTE, INFLATION_PROJECTION_SOURCE, INFLATION_SOURCE, InflationPoint (+17 more)

### Community 15 - "puerta-giratoria/page.tsx"
Cohesion: 0.16
Nodes (19): Figure, FIGURES, officeCount(), PromiseStatus, PublicOffice, PublicPromise, rankFigures(), REPLICA_EMAIL (+11 more)

### Community 16 - "economia/page.tsx"
Cohesion: 0.12
Nodes (24): FeaturedIndicator, ECONOMIA_FAQS, FEATURED, I, metadata, revalidate, FEATURED, I (+16 more)

### Community 17 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, outDir, resolveJsonModule (+7 more)

### Community 18 - "cronologia/page.tsx"
Cohesion: 0.06
Nodes (30): recharts, CATEGORY_LABEL, EventCategory, EVENTS, EventSource, TimelineEvent, CronologiaPage(), DELAYS (+22 more)

### Community 19 - "antes-despues/page.tsx"
Cohesion: 0.18
Nodes (10): ANTES_DESPUES_FAQS, FEATURED, metadata, revalidate, FEATURED, metadata, revalidate, SALUD_FAQS (+2 more)

### Community 20 - "demografia-view.tsx"
Cohesion: 0.20
Nodes (13): metadata, PensionesPage(), metadata, SAMPLE_STOCK, Reveal(), SourcePill(), Stat(), StatProps (+5 more)

### Community 21 - "json-ld.tsx"
Cohesion: 0.12
Nodes (21): ESTATUS_LABEL, fmtUsd(), generateMetadata(), generateStaticParams(), ObraDetailPage(), revalidate, ESTATUS_LABEL, fmtUsd() (+13 more)

### Community 22 - "corrupcion/page.tsx"
Cohesion: 0.15
Nodes (14): CASES, CorruptionCase, INDIVIDUALS, SancionEstado, SanctionedIndividual, Source, CorrupcionPage(), DELAYS (+6 more)

### Community 23 - "sanciones/page.tsx"
Cohesion: 0.15
Nodes (14): BLOCKS, CRS, FactBlock, OFAC_FAQ, SANCIONES_FAQS, Source, TIMELINE, TimelineItem (+6 more)

### Community 24 - "csv-export.ts"
Cohesion: 0.22
Nodes (11): downloadCSV(), escapeCell(), HEADERS, obrasToCSV(), MOCK_OBRAS, mockStats(), Obra, ObrasStats (+3 more)

### Community 25 - "update-sismo.py"
Cohesion: 0.16
Nodes (20): clear_pending(), es_fecha(), es_num(), fetch_wikitext(), guard(), load_pending(), main(), _num_before() (+12 more)

### Community 26 - "extranjeria.py"
Cohesion: 0.19
Nodes (12): fetch_demo(), fetch_real(), parse_sermig_csv(), DataFrame, Pipeline: SERMIG — stock por región. Strategy: 1. Try CKAN/datos.gob.cl…, Parses the SERMIG/CKAN CSV. Adapt as the real schema lands., run(), Chile DPA: 16 regions with code (ISO 3166-2:CL), name, capital lat/lng. (+4 more)

### Community 27 - "card.tsx"
Cohesion: 0.19
Nodes (10): CATEGORIES, metadata, FuentesPage(), metadata, Card(), CardDescription(), CardTitle(), NAV (+2 more)

### Community 28 - "breadcrumbsJsonLd"
Cohesion: 0.25
Nodes (17): AntesDespuesPage(), DIASPORA_FAQS, DiasporaPage(), fmtN(), metadata, pickLatestYearWithData(), revalidate, EconomiaPage() (+9 more)

### Community 29 - "ddhh/page.tsx"
Cohesion: 0.21
Nodes (12): DDHH_FAQS, DDHHPage(), deltaTotal(), lastPoint(), metadata, pivot(), revalidate, STATUS_LABEL (+4 more)

### Community 30 - "App"
Cohesion: 0.53
Nodes (8): App(), setCanonical(), setJsonLd(), setMeta(), setTitle(), useSeoHome(), useSeoObra(), useSeoState()

### Community 31 - "embi.py"
Cohesion: 0.26
Nodes (12): fetch_all(), fetch_series_last(), _lookback_days(), main(), _parse_bcb_date(), date, Pipeline: EMBI+ riesgo país — Banco Central de Brasil SGS API. Pulls latest…, BCB returns dates as 'DD/MM/YYYY'. (+4 more)

### Community 32 - "esequibo/page.tsx"
Cohesion: 0.18
Nodes (12): EsequiboEvent, EsequiboKind, EsequiboSource, EVENTS, KIND_LABEL, DELAYS, EsequiboPage(), FAQS (+4 more)

### Community 33 - "obra.ts"
Cohesion: 0.14
Nodes (15): formatUSD(), HeroStats(), HeroStatsProps, formatUSD(), Hero(), HeroProps, LandingPage(), useCountUp() (+7 more)

### Community 34 - "🇻🇪 Cuentas Venezuela"
Cohesion: 0.10
Nodes (20): Arquitectura (alto nivel), 🚀 Arranque local (5 min), Auto-refresh del terremoto 2026, Comandos frecuentes y pruebas, 🤝 Contribuir, 🇻🇪 Cuentas Venezuela, Despliegue, Estructura del repo (+12 more)

### Community 35 - "Diseño: "Recibió vs hoy" + "Sanciones, no bloqueo""
Cohesion: 0.12
Nodes (15): Cambios en archivos existentes (ambas páginas), Componentes, Componentes, Contexto, Diseño: "Recibió vs hoy" + "Sanciones, no bloqueo", Encuadre, Estructura "lo que se dice ↔ los hechos", Fases (+7 more)

### Community 36 - "acnur.py"
Cohesion: 0.33
Nodes (10): fetch_all(), fetch_year(), main(), Pipeline: ACNUR/UNHCR — Venezuelan refugees + asylum seekers by destination.…, Single API call: VE→[destinations] for a year., run(), _to_int(), upsert_db() (+2 more)

### Community 37 - "ve_macro.py"
Cohesion: 0.31
Nodes (10): fetch_all(), fetch_series(), main(), Pipeline: World Bank macroeconomic + social indicators for Venezuela. Pulls a…, Returns list of {country_iso3, indicator_code, indicator_name, year, value}., run(), upsert_db(), _wb_url() (+2 more)

### Community 38 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, autoprefixer, @cloudflare/workers-types, jsdom, @opennextjs/cloudflare, @playwright/test, postcss, tailwindcss (+10 more)

### Community 39 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, build:cf, deploy:cf, dev, lint, preview:cf, start (+3 more)

### Community 40 - "gen-map.js"
Cohesion: 0.24
Nodes (10): feats, fs, g, H, kx, paths, perpDist(), project() (+2 more)

### Community 41 - "api/package.json"
Cohesion: 0.15
Nodes (12): @cloudflare/workers-types, @types/node, typescript, vitest, wrangler, name, private, type (+4 more)

### Community 42 - "freedom_house.py"
Cohesion: 0.23
Nodes (12): main(), parse_xlsx(), Pipeline: Freedom House — Freedom in the World annual scores. Pulls the FIW…, Parse FH XLSX (sheet FIW13-24) and return rows for known countries., run(), _to_int(), upsert_db(), write_parquet() (+4 more)

### Community 43 - "sanciones.py"
Cohesion: 0.33
Nodes (9): fetch_sdn_xml(), localname(), main(), parse_sdn(), Pipeline: OFAC SDN Advanced XML — Venezuela cohort. Pulls the US Treasury's…, Returns a list of dicts: one per Venezuela-tagged sanctioned party, each with…, run(), text_of() (+1 more)

### Community 44 - "Diseño: Puerta giratoria — cargos que rotan, promesas que no se cumplen"
Cohesion: 0.15
Nodes (12): Cambios en archivos existentes, Contexto, Datos iniciales, Diseño: Puerta giratoria — cargos que rotan, promesas que no se cumplen, Fuera de alcance (fase 1), Modelo de datos, Objetivo, Página — Fase 1 (ranking + timeline) (+4 more)

### Community 45 - "pageMetadata"
Cohesion: 0.15
Nodes (10): next, generateMetadata(), SourceDetailPage(), metadata, DELAYS, HOME_FAQS, metadata, getSource() (+2 more)

### Community 46 - "chile-map.tsx"
Cohesion: 0.24
Nodes (7): react-leaflet, ChileMap, ChileMapLoader(), MapRow, REGION_BY_CODE, RegionMeta, REGIONS

### Community 47 - "vdem.py"
Cohesion: 0.39
Nodes (8): fetch_all(), fetch_indicator(), main(), parse_indicator(), Pipeline: V-Dem democracy scores via Our World in Data. V-Dem (Varieties of…, run(), upsert_db(), year_min()

### Community 48 - "HighlightLayer.ts"
Cohesion: 0.13
Nodes (18): @deck.gl/core, @deck.gl/layers, buildCapitalLayers(), STAR_SVG, buildChoroplethLayer(), GeoFeature, getFeatureName(), heatColor() (+10 more)

### Community 49 - "MapContainer.tsx"
Cohesion: 0.24
Nodes (9): @deck.gl/react, maplibre-gl, computeInitialZoom(), computeMinZoom(), MapContainer(), MapContainerProps, INITIAL_VIEW_STATE, SATELLITE_STYLE (+1 more)

### Community 50 - "comparativa/page.tsx"
Cohesion: 0.36
Nodes (6): ComparativaPage(), metadata, ComparativaChart(), ComparativaPoint, NATIONALITY_COLORS, getComparativaNacionalidad()

### Community 51 - "app/fuentes/page.tsx"
Cohesion: 0.22
Nodes (7): CHILE_SLUGS, FuentesPage(), metadata, revalidate, VE_SLUGS, listSources(), Source

### Community 52 - "indicadores/[slug]/page.tsx"
Cohesion: 0.48
Nodes (5): generateMetadata(), IndicatorDetailPage(), formatValue(), PreviewTable(), getIndicator()

### Community 53 - "dev-server.ts"
Cohesion: 0.22
Nodes (7): app, db, env, pgClient, port, @hono/node-server, postgres

### Community 54 - "RotateHint.tsx"
Cohesion: 0.48
Nodes (6): enterLandscape(), exitLandscape(), isOrientationLockSupported(), RotateHint(), RotateHintProps, useIsPortraitMobile()

### Community 55 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, @cloudflare/workers-types, tsx, @types/node, typescript, vitest, wrangler

### Community 56 - "cf-security-bootstrap.sh"
Cohesion: 0.73
Nodes (5): cf(), jget(), ok(), set_setting(), cf-security-bootstrap.sh script

### Community 57 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, deploy, dev, test, test:watch, typecheck, wrangler:dev

### Community 58 - "tributario/page.tsx"
Cohesion: 0.43
Nodes (5): metadata, TributarioPage(), AporteBarChart(), AporteByYear, getAporteTributario()

### Community 59 - "verify_sources.sh"
Cohesion: 0.60
Nodes (3): probe(), section(), verify_sources.sh script

### Community 60 - "next.config.mjs"
Cohesion: 0.33
Nodes (4): CONNECT_SRC, nextConfig, SCRIPT_SRC, SECURITY_HEADERS

### Community 61 - "sitemap.ts"
Cohesion: 0.50
Nodes (4): fetchObrasForSitemap(), ObraSitemap, ROUTE_LASTMOD, sitemap()

### Community 62 - "AGENTS.md — Cuentas Venezuela"
Cohesion: 0.33
Nodes (5): 1. Mapa del repositorio, 2. Flujo Git y despliegue, 3. Verificación antes de entregar, 4. Invariantes de datos y UI, AGENTS.md — Cuentas Venezuela

### Community 63 - "schema.ts"
Cohesion: 0.33
Nodes (5): datasets, indicators, obras, reportesCiudadanos, sources

### Community 64 - "__main__.py"
Cohesion: 0.15
Nodes (5): Pipeline skeleton: Instituto Nacional de Estadísticas., # TODO: implement INE extraction., ETL pipelines for datos-chile., Entrypoint: runs all registered pipelines or lists them., Smoke tests for comparativa pipeline data shape.

### Community 65 - "mailer.ts"
Cohesion: 0.40
Nodes (3): NotifyArgs, SendEmailBinding, mimetext

### Community 67 - "web/package.json"
Cohesion: 0.08
Nodes (24): autoprefixer, clsx, deck.gl, jsdom, leaflet, @opennextjs/cloudflare, postcss, react-dom (+16 more)

### Community 68 - "app/opengraph-image.tsx"
Cohesion: 0.53
Nodes (3): alt, contentType, size

### Community 69 - "newsletter-signup.tsx"
Cohesion: 0.40
Nodes (3): NewsletterSignup(), NewsletterSignupProps, Status

### Community 72 - "rate-limit.ts"
Cohesion: 0.50
Nodes (3): Bucket, Options, hono

### Community 80 - "lucide-react"
Cohesion: 0.15
Nodes (7): lucide-react, DemografiaPage(), metadata, DemografiaView(), WAYS, ShareButton(), getStockRegion()

### Community 93 - "@playwright/test"
Cohesion: 0.18
Nodes (3): @playwright/test, ROUTES, PAGES

## Knowledge Gaps
- **424 isolated node(s):** `name`, `version`, `private`, `type`, `dev` (+419 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 555 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `lucide-react` to `sismo-2026/page.tsx`, `ObraPublica`, `recibido-vs-hoy/page.tsx`, `App.tsx`, `apoyar/page.tsx`, `MapaRoot.tsx`, `ClusterLayer.ts`, `coyuntura/page.tsx`, `puerta-giratoria/page.tsx`, `economia/page.tsx`, `cronologia/page.tsx`, `antes-despues/page.tsx`, `demografia-view.tsx`, `json-ld.tsx`, `corrupcion/page.tsx`, `sanciones/page.tsx`, `card.tsx`, `breadcrumbsJsonLd`, `ddhh/page.tsx`, `esequibo/page.tsx`, `obra.ts`, `pageMetadata`, `comparativa/page.tsx`, `app/fuentes/page.tsx`, `indicadores/[slug]/page.tsx`, `RotateHint.tsx`, `tributario/page.tsx`, `web/package.json`, `newsletter-signup.tsx`?**
  _High betweenness centrality (0.189) - this node is a cross-community bridge._
- **Why does `react` connect `App.tsx` to `sismo-2026/page.tsx`, `obra.ts`, `ObraPublica`, `web/package.json`, `newsletter-signup.tsx`, `recibido-vs-hoy/page.tsx`, `apoyar/page.tsx`, `MapaRoot.tsx`, `ClusterLayer.ts`, `chile-map.tsx`, `puerta-giratoria/page.tsx`, `lucide-react`, `MapContainer.tsx`, `demografia-view.tsx`, `RotateHint.tsx`, `card.tsx`, `App`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `pageMetadata()` connect `pageMetadata` to `sismo-2026/page.tsx`, `recibido-vs-hoy/page.tsx`, `apoyar/page.tsx`, `MapaRoot.tsx`, `api.ts`, `coyuntura/page.tsx`, `puerta-giratoria/page.tsx`, `economia/page.tsx`, `cronologia/page.tsx`, `antes-despues/page.tsx`, `demografia-view.tsx`, `json-ld.tsx`, `corrupcion/page.tsx`, `sanciones/page.tsx`, `card.tsx`, `breadcrumbsJsonLd`, `ddhh/page.tsx`, `esequibo/page.tsx`, `comparativa/page.tsx`, `app/fuentes/page.tsx`, `indicadores/[slug]/page.tsx`, `tributario/page.tsx`, `lucide-react`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _424 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sismo-2026/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05957767722473605 - nodes in this community are weakly interconnected._
- **Should `ObraPublica` be split into smaller, more focused modules?**
  _Cohesion score 0.10510510510510511 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._