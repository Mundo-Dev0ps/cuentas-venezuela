# Graph Report - .  (2026-07-29)

## Corpus Check
- 237 files · ~107,737 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1151 nodes · 1991 edges · 115 communities (80 shown, 35 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- page.tsx
- dependencies
- ObraPublica
- dependencies
- app.ts
- obras.py
- page.tsx
- App.tsx
- page.tsx
- MapaRoot.tsx
- compilerOptions
- ClusterLayer.ts
- _storage.py
- api.ts
- page.tsx
- page.tsx
- page.tsx
- compilerOptions
- page.tsx
- json-ld.tsx
- page.tsx
- page.tsx
- page.tsx
- page.tsx
- csv-export.ts
- update-sismo.py
- extranjeria.py
- card.tsx
- breadcrumbsJsonLd
- page.tsx
- App
- embi.py
- page.tsx
- LandingPage.tsx
- page.tsx
- page.tsx
- acnur.py
- ve_macro.py
- devDependencies
- scripts
- gen-map.js
- HeroStats.tsx
- freedom_house.py
- sanciones.py
- page.tsx
- pageMetadata
- chile-map.tsx
- vdem.py
- HighlightLayer.ts
- MapContainer.tsx
- page.tsx
- page.tsx
- page.tsx
- demografia-view.tsx
- RotateHint.tsx
- test_extranjeria.py
- cf-security-bootstrap.sh
- page.tsx
- CapitalLayer.ts
- verify_sources.sh
- next.config.mjs
- sitemap.ts
- embi-bar-chart.tsx
- ChoroplethLayer.ts
- ine.py
- test_comparativa.py
- cf-custom-domains.sh
- package.json
- opengraph-image.tsx
- newsletter-signup.tsx
- slug.ts
- __main__.py
- release-please-config.json
- cf-worker-secrets.sh
- set-gh-secrets.sh
- with-personal-gh.sh
- start.sh
- apple-icon.tsx
- icon.tsx
- help-ways.tsx
- kofi-feed.tsx
- autoprefixer
- __init__.py
- jsdom
- @playwright/test
- postcss
- tailwindcss
- @testing-library/jest-dom
- @testing-library/react
- @types/leaflet
- @types/react-dom
- mapa-internal-routes.spec.ts
- smoke.spec.ts
- next-env.d.ts
- @cloudflare/workers-types
- typescript
- vitest
- tailwind.config.ts
- datos-chile-etl

## God Nodes (most connected - your core abstractions)
1. `pageMetadata()` - 36 edges
2. `breadcrumbsJsonLd()` - 33 edges
3. `faqPageJsonLd()` - 33 edges
4. `ObraPublica` - 29 edges
5. `datasetJsonLd()` - 19 edges
6. `JsonLd()` - 18 edges
7. `App()` - 18 edges
8. `Reveal()` - 16 edges
9. `compilerOptions` - 16 edges
10. `compilerOptions` - 13 edges

## Surprising Connections (you probably didn't know these)
- `fetch_year()` --calls--> `fetch_bytes()`  [INFERRED]
  etl/pipelines/acnur.py → etl/pipelines/_http.py
- `fetch_series_last()` --calls--> `fetch_bytes()`  [INFERRED]
  etl/pipelines/embi.py → etl/pipelines/_http.py
- `run()` --calls--> `fetch_bytes()`  [INFERRED]
  etl/pipelines/freedom_house.py → etl/pipelines/_http.py
- `fetch_series()` --calls--> `fetch_bytes()`  [INFERRED]
  etl/pipelines/ve_macro.py → etl/pipelines/_http.py
- `test_geocoder_offline_returns_none()` --calls--> `Geocoder`  [INFERRED]
  etl/tests/test_obras.py → etl/pipelines/_obras_geocoder.py

## Import Cycles
- None detected.

## Communities (115 total, 35 thin omitted)

### Community 0 - "page.tsx"
Cohesion: 0.06
Nodes (39): DELAYS, HOME_FAQS, HomePage(), metadata, metadata, SECTIONS, AffectedStates(), SEVERITY (+31 more)

### Community 1 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, drizzle-orm, hono, @hono/node-server, mimetext, @neondatabase/serverless, postgres, zod (+31 more)

### Community 2 - "ObraPublica"
Cohesion: 0.11
Nodes (27): AggregateImpact(), AggregateImpactProps, calculateImpact(), ImpactResult, formatUSDCompact(), ObraDetail(), ObraDetailProps, STATUS_LABEL (+19 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (37): clsx, deck.gl, @deck.gl/core, @deck.gl/layers, @deck.gl/react, leaflet, lucide-react, maplibre-gl (+29 more)

### Community 4 - "app.ts"
Cohesion: 0.09
Nodes (25): AppType, createApp(), Env, NOTE: previous in-process DuckDB preview was removed for the Workers, registerRoutes(), rowsOf(), Variables, Db (+17 more)

### Community 5 - "obras.py"
Cohesion: 0.11
Nodes (26): _discover_urls(), _enrich(), Geocoder, Address -> (lat, lon) for Venezuelan obras with offline fallbacks.  Strategy: 1., _http_get(), main(), normalize_estatus(), normalize_presupuesto_usd() (+18 more)

### Community 6 - "page.tsx"
Cohesion: 0.11
Nodes (30): BeforeAfter(), delta(), EraLegend(), MegaStatCard(), nearestDot(), Props, sparkPath(), xForYear() (+22 more)

### Community 7 - "App.tsx"
Cohesion: 0.09
Nodes (20): DEFAULT_URL_STATE, findStateBySlug(), StateFeatureCollection, STATUS_LABEL, TOOLTIP_STYLE, MapModeToggle(), MapModeToggleProps, Onboarding() (+12 more)

### Community 8 - "page.tsx"
Cohesion: 0.09
Nodes (22): ApoyarPage(), metadata, TIERS, metadata, ORGANIZATION_JSONLD, viewport, WEBSITE_JSONLD, KofiButton() (+14 more)

### Community 9 - "MapaRoot.tsx"
Cohesion: 0.11
Nodes (19): ensureLoader(), Turnstile(), TurnstileProps, Window, LandingPage(), MetodologiaPage(), PageLayout(), PageLayoutProps (+11 more)

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, **/*.ts, **/*.tsx, compilerOptions (+18 more)

### Community 11 - "ClusterLayer.ts"
Cohesion: 0.14
Nodes (19): ESTATUS_OPTIONS, FiltersBar(), FiltersBarProps, Legend(), STATUSES, buildClusterLayers(), Cluster, featureCentroid() (+11 more)

### Community 12 - "_storage.py"
Cohesion: 0.14
Nodes (18): Pipeline: stock por nacionalidad para comparativa.  DEMO: aproximaciones pública, run(), db_url(), Tiny Postgres helper for ETL pipelines: connect + bulk upsert., Generic UPSERT.      Args:         table: schema-qualified target table (e.g. "c, upsert(), Pipeline: SII — aporte tributario estimado.  DEMO: estimación gruesa basada en c, run() (+10 more)

### Community 13 - "api.ts"
Cohesion: 0.09
Nodes (18): DemografiaPage(), metadata, DemografiaView(), AcnurRow, AporteRow, ComparativaRow, CotizantesSectorRow, Dataset (+10 more)

### Community 14 - "page.tsx"
Cohesion: 0.13
Nodes (20): EXCHANGE_RATE, ExchangeSnapshot, INFLATION_2025, INFLATION_PROJECTION_SOURCE, INFLATION_SOURCE, InflationPoint, OIL_PRODUCTION, OIL_SOURCES (+12 more)

### Community 15 - "page.tsx"
Cohesion: 0.19
Nodes (17): Figure, FIGURES, officeCount(), PromiseStatus, PublicOffice, PublicPromise, rankFigures(), Source (+9 more)

### Community 16 - "page.tsx"
Cohesion: 0.16
Nodes (18): FeaturedIndicator, I, FEATURED, I, INSEGURIDAD_FAQS, metadata, I, deltaSummary() (+10 more)

### Community 17 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, outDir, resolveJsonModule (+10 more)

### Community 18 - "page.tsx"
Cohesion: 0.15
Nodes (16): CATEGORY_LABEL, EventCategory, EVENTS, EventSource, TimelineEvent, CronologiaPage(), DELAYS, eventJsonLd() (+8 more)

### Community 19 - "json-ld.tsx"
Cohesion: 0.15
Nodes (13): ANTES_DESPUES_FAQS, FEATURED, metadata, FEATURED, metadata, SALUD_FAQS, BreadcrumbItem, DatasetInput (+5 more)

### Community 20 - "page.tsx"
Cohesion: 0.23
Nodes (10): metadata, TributarioPage(), AporteBarChart(), AporteByYear, Reveal(), Stat(), StatProps, getAporteTributario() (+2 more)

### Community 21 - "page.tsx"
Cohesion: 0.19
Nodes (13): ESTATUS_LABEL, fmtUsd(), generateMetadata(), generateStaticParams(), ObraDetailPage(), ESTATUS_LABEL, fmtUsd(), metadata (+5 more)

### Community 22 - "page.tsx"
Cohesion: 0.17
Nodes (13): CASES, CorruptionCase, INDIVIDUALS, SancionEstado, SanctionedIndividual, Source, CorrupcionPage(), DELAYS (+5 more)

### Community 23 - "page.tsx"
Cohesion: 0.17
Nodes (13): BLOCKS, CRS, FactBlock, OFAC_FAQ, SANCIONES_FAQS, Source, TIMELINE, TimelineItem (+5 more)

### Community 24 - "csv-export.ts"
Cohesion: 0.22
Nodes (11): downloadCSV(), escapeCell(), HEADERS, obrasToCSV(), MOCK_OBRAS, mockStats(), Obra, ObrasStats (+3 more)

### Community 25 - "update-sismo.py"
Cohesion: 0.22
Nodes (14): es_fecha(), es_num(), fetch_wikitext(), guard(), main(), _num_before(), parse_casualties(), date (+6 more)

### Community 26 - "extranjeria.py"
Cohesion: 0.21
Nodes (11): fetch_demo(), fetch_real(), parse_sermig_csv(), DataFrame, Pipeline: SERMIG — stock por región.  Strategy: 1. Try CKAN/datos.gob.cl resourc, Parses the SERMIG/CKAN CSV. Adapt as the real schema lands., run(), fetch_bytes() (+3 more)

### Community 27 - "card.tsx"
Cohesion: 0.24
Nodes (9): CATEGORIES, metadata, FuentesPage(), metadata, Card(), CardDescription(), CardTitle(), listSources() (+1 more)

### Community 28 - "breadcrumbsJsonLd"
Cohesion: 0.33
Nodes (13): AntesDespuesPage(), ECONOMIA_FAQS, EconomiaPage(), FEATURED, metadata, InseguridadPage(), RecibidoVsHoyPage(), SaludPage() (+5 more)

### Community 29 - "page.tsx"
Cohesion: 0.21
Nodes (12): DDHH_FAQS, DDHHPage(), deltaTotal(), lastPoint(), metadata, pivot(), STATUS_LABEL, FreedomPoint (+4 more)

### Community 30 - "App"
Cohesion: 0.29
Nodes (12): App(), readUrlState(), UrlState, useUrlSync(), VALID_ESTATUS, setCanonical(), setJsonLd(), setMeta() (+4 more)

### Community 31 - "embi.py"
Cohesion: 0.26
Nodes (12): fetch_all(), fetch_series_last(), _lookback_days(), main(), _parse_bcb_date(), date, Pipeline: EMBI+ riesgo país — Banco Central de Brasil SGS API.  Pulls latest EMB, BCB returns dates as 'DD/MM/YYYY'. (+4 more)

### Community 32 - "page.tsx"
Cohesion: 0.19
Nodes (11): EsequiboEvent, EsequiboKind, EsequiboSource, EVENTS, KIND_LABEL, DELAYS, EsequiboPage(), FAQS (+3 more)

### Community 33 - "LandingPage.tsx"
Cohesion: 0.23
Nodes (6): formatUSD(), Hero(), HeroProps, useObras(), fetchAllObras(), filterByYearRange()

### Community 34 - "page.tsx"
Cohesion: 0.24
Nodes (9): IndicadoresPage(), metadata, HomePage(), metadata, SAMPLE_STOCK, StockChart(), StockPoint, getHealth() (+1 more)

### Community 35 - "page.tsx"
Cohesion: 0.23
Nodes (9): DIASPORA_FAQS, DiasporaPage(), fmtN(), metadata, pickLatestYearWithData(), DiasporaBarChart(), DiasporaBarRow, Props (+1 more)

### Community 36 - "acnur.py"
Cohesion: 0.33
Nodes (10): fetch_all(), fetch_year(), main(), Pipeline: ACNUR/UNHCR — Venezuelan refugees + asylum seekers by destination.  Pu, Single API call: VE→[destinations] for a year., run(), _to_int(), upsert_db() (+2 more)

### Community 37 - "ve_macro.py"
Cohesion: 0.31
Nodes (10): fetch_all(), fetch_series(), main(), Pipeline: World Bank macroeconomic + social indicators for Venezuela.  Pulls a c, Returns list of {country_iso3, indicator_code, indicator_name, year, value}., run(), upsert_db(), _wb_url() (+2 more)

### Community 38 - "devDependencies"
Cohesion: 0.18
Nodes (11): @opennextjs/cloudflare, @types/react, @vitejs/plugin-react, devDependencies, @opennextjs/cloudflare, @types/node, @types/react, @vitejs/plugin-react (+3 more)

### Community 39 - "scripts"
Cohesion: 0.18
Nodes (11): scripts, build, build:cf, deploy:cf, dev, lint, preview:cf, start (+3 more)

### Community 40 - "gen-map.js"
Cohesion: 0.24
Nodes (10): feats, fs, g, H, kx, paths, perpDist(), project() (+2 more)

### Community 41 - "HeroStats.tsx"
Cohesion: 0.31
Nodes (8): formatUSD(), HeroStats(), HeroStatsProps, useCountUp(), downloadCSV(), escapeCell(), HEADERS, obrasToCSV()

### Community 42 - "freedom_house.py"
Cohesion: 0.33
Nodes (9): main(), parse_xlsx(), Pipeline: Freedom House — Freedom in the World annual scores.  Pulls the FIW yea, Parse FH XLSX (sheet FIW13-24) and return rows for known countries., run(), _to_int(), upsert_db(), write_parquet() (+1 more)

### Community 43 - "sanciones.py"
Cohesion: 0.33
Nodes (9): fetch_sdn_xml(), localname(), main(), parse_sdn(), Pipeline: OFAC SDN Advanced XML — Venezuela cohort.  Pulls the US Treasury's Spe, Returns a list of dicts: one per Venezuela-tagged sanctioned party,     each wit, run(), text_of() (+1 more)

### Community 44 - "page.tsx"
Cohesion: 0.27
Nodes (7): metadata, PensionesPage(), COLORS, SectorPieChart(), SectorRow, SourcePill(), getCotizantesSector()

### Community 45 - "pageMetadata"
Cohesion: 0.31
Nodes (6): generateMetadata(), SourceDetailPage(), metadata, getSource(), pageMetadata(), PageMetaInput

### Community 46 - "chile-map.tsx"
Cohesion: 0.24
Nodes (6): ChileMap, ChileMapLoader(), MapRow, REGION_BY_CODE, RegionMeta, REGIONS

### Community 47 - "vdem.py"
Cohesion: 0.39
Nodes (8): fetch_all(), fetch_indicator(), main(), parse_indicator(), Pipeline: V-Dem democracy scores via Our World in Data.  V-Dem (Varieties of Dem, run(), upsert_db(), year_min()

### Community 48 - "HighlightLayer.ts"
Cohesion: 0.31
Nodes (8): buildHighlightLayers(), BuildOpts, featureCentroid(), GeoFeature, GeoFeatureCollection, getFeatureName(), polygonCentroid(), WORLD_BG

### Community 49 - "MapContainer.tsx"
Cohesion: 0.31
Nodes (7): computeInitialZoom(), computeMinZoom(), MapContainer(), MapContainerProps, INITIAL_VIEW_STATE, SATELLITE_STYLE, VENEZUELA_BOUNDS

### Community 50 - "page.tsx"
Cohesion: 0.36
Nodes (6): ComparativaPage(), metadata, ComparativaChart(), ComparativaPoint, NATIONALITY_COLORS, getComparativaNacionalidad()

### Community 51 - "page.tsx"
Cohesion: 0.32
Nodes (5): CHILE_SLUGS, FuentesPage(), metadata, VE_SLUGS, Source

### Community 52 - "page.tsx"
Cohesion: 0.48
Nodes (5): generateMetadata(), IndicatorDetailPage(), formatValue(), PreviewTable(), getIndicator()

### Community 53 - "demografia-view.tsx"
Cohesion: 0.38
Nodes (4): RegionBarChart(), RegionRow, ShareButton(), StockRegionRow

### Community 54 - "RotateHint.tsx"
Cohesion: 0.48
Nodes (6): enterLandscape(), exitLandscape(), isOrientationLockSupported(), RotateHint(), RotateHintProps, useIsPortraitMobile()

### Community 56 - "cf-security-bootstrap.sh"
Cohesion: 0.53
Nodes (3): ok(), set_setting(), cf-security-bootstrap.sh script

### Community 57 - "page.tsx"
Cohesion: 0.40
Nodes (3): metadata, MapaLoader(), MapaRoot

### Community 58 - "CapitalLayer.ts"
Cohesion: 0.47
Nodes (4): buildCapitalLayers(), STAR_SVG, Capital, VENEZUELA_CAPITALS

### Community 59 - "verify_sources.sh"
Cohesion: 0.60
Nodes (3): probe(), section(), verify_sources.sh script

### Community 60 - "next.config.mjs"
Cohesion: 0.40
Nodes (4): CONNECT_SRC, nextConfig, SCRIPT_SRC, SECURITY_HEADERS

### Community 61 - "sitemap.ts"
Cohesion: 0.50
Nodes (4): fetchObrasForSitemap(), ObraSitemap, ROUTE_LASTMOD, sitemap()

### Community 62 - "embi-bar-chart.tsx"
Cohesion: 0.50
Nodes (4): EmbiBarChart(), EmbiBarRow, fmt(), Props

### Community 63 - "ChoroplethLayer.ts"
Cohesion: 0.60
Nodes (4): buildChoroplethLayer(), GeoFeature, getFeatureName(), heatColor()

### Community 67 - "package.json"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **337 isolated node(s):** `name`, `version`, `private`, `type`, `dev` (+332 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `pageMetadata()` connect `pageMetadata` to `page.tsx`, `page.tsx`, `page.tsx`, `api.ts`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `json-ld.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `card.tsx`, `breadcrumbsJsonLd`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `Reveal()` connect `page.tsx` to `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `demografia-view.tsx`, `page.tsx`, `page.tsx`, `card.tsx`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `faqPageJsonLd()` connect `breadcrumbsJsonLd` to `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `json-ld.tsx`, `page.tsx`, `page.tsx`, `page.tsx`, `page.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _337 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06259426847662142 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `ObraPublica` be split into smaller, more focused modules?**
  _Cohesion score 0.11095305832147938 - nodes in this community are weakly interconnected._