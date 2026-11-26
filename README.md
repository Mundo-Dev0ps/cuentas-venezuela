# 🇻🇪 Cuentas Venezuela

> Portal cívico independiente de **datos abiertos sobre Venezuela y la diáspora venezolana**.
> Sin anuncios. Sin tracking. Sin venta de datos. Financiado por aportes voluntarios vía Ko-fi.

🌐 **Producción:** <https://cuentasvenezuela.org>
☕ **Apoyar:** <https://ko-fi.com/donjonny>
📦 **Stack:** 100% Cloudflare free tier (~$0–1/mes solo dominio)

---

## ¿Qué encuentras acá?

| Sección | URL | Qué muestra |
|---|---|---|
| **Mapa del Olvido** | `/mapa-del-olvido` · `/mapa-del-olvido/obras` | Mapa interactivo y catálogo de obras públicas paralizadas, críticas o inoperativas en Venezuela |
| **Datos Chile** | `/datos-chile` · `/datos-chile/dashboards` | Demografía, pensiones, tributario y comparativa por nacionalidad en Chile |
| **Venezuela (índice)** | `/venezuela` | Directorio de dashboards temáticos sobre Venezuela y su diáspora |
| **Terremoto 2026** | `/venezuela/sismo-2026` | Doble sismo Mw 7,5 + 7,2 (24 jun 2026): víctimas, mapa por estado y costo económico (**auto-refrescado cada 12h**) |
| **Antes y después / Recibido vs hoy** | `/venezuela/antes-despues` · `/venezuela/recibido-vs-hoy` | Comparativa 1998 vs último dato (Banco Mundial, ENCOVI, OPEP, FMI, Ecoanalítica) |
| **Economía, salud e inseguridad** | `/venezuela/economia` · `/venezuela/salud` · `/venezuela/inseguridad` | Series macroeconómicas, sistema sanitario y homicidios (UNODC) |
| **DDHH, corrupción y puerta giratoria** | `/venezuela/ddhh` · `/venezuela/corrupcion` · `/venezuela/puerta-giratoria` | Freedom House, casos/sancionados OFAC SDN y ranking de rotación de cargos con doble fuente |
| **Sanciones, coyuntura y cronología** | `/venezuela/sanciones` · `/venezuela/coyuntura` · `/venezuela/cronologia` | Alcance real de sanciones, indicadores 2025–2026 (Foro Penal, OVF, BCV) e hitos V-Dem |
| **Diáspora y Esequibo** | `/venezuela/diaspora` · `/venezuela/esequibo` | Refugiados/asilo por país (ACNUR) y cronología de la controversia territorial |
| **Fuentes y apoyar** | `/fuentes` · `/apoyar` | Catálogo de organismos fuente, licencias y vías de colaboración sin publicidad |

---

## Arquitectura (alto nivel)

```
                          ┌────────────────────────────────────────┐
   Usuario ─────HTTPS────→│  cuentasvenezuela.org                  │
                          │  Cloudflare Workers (OpenNext/Next.js) │  ← deploy-web.yml
                          └───────────────────┬────────────────────┘
                                              │ fetch
                                              ▼
                          ┌────────────────────────────────────────┐
                          │  api.cuentasvenezuela.org              │
                          │  Cloudflare Workers (Hono)             │  ← deploy-api.yml
                          └──────────┬──────────────────┬──────────┘
                                     │ HTTP             │ S3
                                     ▼                  ▼
                          ┌──────────────────┐ ┌──────────────────┐
                          │   Neon Postgres  │ │  Cloudflare R2   │
                          │ (cifras+metadatos)│ │ (parquet/geojson)│
                          └────────▲─────────┘ └────────▲─────────┘
                                   │                    │
                                   └──────────┬─────────┘
                                              │ upsert / put
                          ┌────────────────────────────────────────┐
                          │  GitHub Actions                        │
                          │  · etl-cron.yml (lunes 06:00 UTC)      │
                          │  · etl-obras.yml (semanal)             │
                          │  · sismo-daily.yml (cada 12h UTC)      │
                          └────────────────────────────────────────┘
```

---

## Stack

| Capa | Tecnología | Hosting |
|---|---|---|
| Frontend | Next.js 15 + React 19 + Tailwind CSS + Recharts + MapLibre/deck.gl | Cloudflare Workers via `@opennextjs/cloudflare` (`cuentas-venezuela-web`) |
| API | Hono + Drizzle ORM + Zod | Cloudflare Workers (`cuentas-venezuela-api`, free 100k req/día) |
| Base de datos | Postgres 16 (schemas: `public`, `chile`, `migracion`, `macro_ve`, `ddhh`) | Neon (free tier 0.5 GB) |
| Object storage | S3-compatible (parquets, geojson) | Cloudflare R2 (free 10 GB) |
| ETL | Python 3.12 + httpx + Polars + DuckDB + fastexcel | GitHub Actions cron |
| Mapas | maplibre-gl + react-map-gl + deck.gl + Leaflet | Tiles desde `basemaps.cartocdn.com` |
| Donaciones y correo | Ko-fi webhook → tabla `supporters`; `SEND_EMAIL` binding | Ko-fi + Cloudflare Email Routing |
| Observabilidad | Cloudflare Workers observability logs nativo | $0, sin SDK 3rd-party |

**Total infra: ~$1/mes** (solo dominio `.org`). Workers free se detiene a 100k req/día, sin cargos sorpresa.

---

## 🚀 Arranque local (5 min)

### Pre-requisitos
- Docker + Docker Compose v2
- ~4 GB RAM libres

### Pasos

```bash
git clone git@github.com:Mundo-Dev0ps/cuentas-venezuela.git
cd cuentas-venezuela
cp .env.example .env       # ajusta solo si lo necesitas
docker compose up -d        # tarda ~1min primer arranque
```

### URLs locales

| Servicio | URL | Credenciales |
|---|---|---|
| 🌐 Web | <http://localhost:3100> | — |
| ⚙️ API | <http://localhost:8100/health> | — |
| 🪣 MinIO Console | <http://localhost:9101> | `minioadmin` / `minioadmin` |
| 🗄️ Postgres | `localhost:5433` | `dev` / `dev` / db `datos` |

> 💡 Cambia los puertos host con `WEB_HOST_PORT`, `API_HOST_PORT`, `POSTGRES_HOST_PORT`, `MINIO_HOST_PORT`, `MINIO_CONSOLE_HOST_PORT` en `.env`.

---

## Comandos frecuentes y pruebas

```bash
# logs en vivo
docker compose logs -f web api

# rebuild un servicio
docker compose build web && docker compose up -d web

# correr 1 pipeline ETL bajo demanda (puebla DB local + parquet en MinIO)
docker compose --profile etl run --rm etl python -m pipelines ve_macro

# correr todos los pipelines
docker compose --profile etl run --rm etl python -m pipelines all

# typecheck y unit tests Web (Vitest)
docker compose exec -T web npm run typecheck
docker compose exec -T web npm test

# tests API (Vitest, requiere stack arriba)
docker compose exec -T -e TEST_API_URL=http://localhost:8000 -e E2E_API_URL=http://localhost:8000 api npm test

# auto-verificación del bot de sismo (sin red) y dry-run contra Wikipedia
python3 scripts/update-sismo.py --self-test
python3 scripts/update-sismo.py --dry-run

# tests E2E (Playwright)
docker compose exec -T web npx playwright install --with-deps chromium
docker compose exec -T -e E2E_BASE_URL=http://localhost:3000 web npx playwright test

# parar todo / reset total (borra volúmenes + datos)
docker compose down
docker compose down -v
```

---

## Estructura del repo

```
.
├── web/                  # Next.js 15 (App Router) → Cloudflare Workers (OpenNext)
│   ├── src/app/          # rutas: /, /venezuela/*, /datos-chile/*, /mapa-del-olvido, /apoyar, /fuentes
│   ├── src/components/   # componentes compartidos (charts, badges, layout)
│   ├── src/mapa/         # SPA del Mapa del Olvido (react-router-dom + deck.gl/maplibre)
│   ├── src/lib/api.ts    # cliente API tipado
│   ├── wrangler.jsonc    # config worker web (cuentas-venezuela-web)
│   └── open-next.config.ts
├── api/                  # Hono → Cloudflare Workers (cuentas-venezuela-api)
│   ├── src/app.ts        # rutas Hono compartidas
│   ├── src/index.ts      # Workers entry (neon-http)
│   ├── src/dev-server.ts # Node entry compose (postgres-js)
│   └── wrangler.toml     # config worker api
├── etl/                  # Python pipelines (pipelines/*.py + tests/)
├── db/                   # SQL declarativo (schema.sql + seeds.sql)
├── docs/superpowers/specs/ # especificaciones de diseño histórico
├── scripts/              # helpers CF/gh/secrets + update-sismo.py
├── .github/workflows/    # CI, deploys, ETL cron, db-migrate, secret-scan, sismo-daily
└── AGENTS.md             # guía operativa, convenciones e invariantes para agentes y contribuidores
```

---

## Pipelines ETL disponibles

| Pipeline | Fuente oficial | Tabla / destino principal | Frecuencia |
|---|---|---|---|
| `extranjeria` | datos.gob.cl SNM (Chile) | `chile.sermig_stock_region` + parquet | mensual |
| `sii` | SII Chile | `chile.sii_aporte` + parquet | anual |
| `sp` | Superintendencia de Pensiones | `chile.sp_cotizantes` + parquet | mensual |
| `comparativa` | INE Chile | `chile.comparativa` + parquet | anual |
| `ine` | INE Chile | parquet `ine/` | anual |
| `obras` | Mapa del Olvido (scrape + ciudadano) | `public.obras` | semanal (`etl-obras.yml` + `etl-cron.yml`) |
| `ve_macro` | World Bank API | `macro_ve.wb_indicators` (29 indicadores × VEN+CHL) | mensual / lunes |
| `freedom_house` | Freedom House XLSX | `ddhh.freedom_house` | anual |
| `acnur` | UNHCR Population API | `migracion.acnur_ve` | semanal / lunes |
| `sanciones` | US Treasury OFAC SDN XML | `public.sancionados` + wallets | semanal / lunes |
| `vdem` | V-Dem vía Our World in Data | `ddhh.vdem` | semanal / lunes |
| `embi` | Banco Central de Brasil SGS API | `macro_ve.embi` (con fallback a `db/seeds.sql` si BCB falla) | semanal / lunes |

> Cron: lunes `06:00 UTC` vía `etl-cron.yml` (ver orden en `etl/pipelines/__main__.py`). Manual: GitHub → Actions → `etl-cron` → Run workflow → `all` o uno específico.

### Auto-refresh del terremoto 2026

`sismo-daily.yml` (cron **cada 12h**, `00:00` y `12:00 UTC`) mantiene al día las cifras de fallecidos/heridos del sismo sin edición manual:

- `scripts/update-sismo.py` consulta el infobox de Wikipedia en inglés (wikitext; soporta `{{rounddown|N}}`, `{{val|N}}` y números planos) con `User-Agent` identificable y reintentos con `Retry-After` / backoff ante errores `429`/`5xx`.
- **Guardas de seguridad**: las cifras nunca bajan automáticamente (`new < cur` requiere confirmación humana), saltos mayores a `3.0× + 1.000` (muertos) o `5.0× + 15.000` (heridos) se encolan en `scripts/.sismo-pending.json` y se **auto-aprueban** si persisten idénticos en la siguiente corrida (12h después), y existen topes duros (`MAX_DEAD = 200.000`, `MAX_INJURED = 500.000`).
- Cambio válido → commit a `main` como `sismo-bot` + dispara `deploy-web.yml`. Guarda saltada → abre un Issue con etiqueta `sismo` para revisión humana.
- `DAMAGE` en `web/src/app/venezuela/sismo-2026/data.ts` es la fuente única de verdad para KPIs, banner principal, landing de `/venezuela`, FAQ y metadata; el script sincroniza además `sitemap.ts`, `llms.txt` y `llms-full.txt`.

> Las páginas manuales (`coyuntura`, `puerta-giratoria`, `esequibo`, `sanciones`, series manuales de `recibido-vs-hoy` y campos no cubiertos por el bot en `sismo-2026`) se actualizan con revisión de fuente primaria citada.

---

## Despliegue

Los deploys de prod son **por release** (`release-please.yml`). Al hacer merge a `main`, `release-please.yml` mantiene un **release PR** que acumula los conventional commits y sube la versión + `CHANGELOG.md`. Al mergear ese PR se crea el Release/tag y **eso** dispara los deploys.

| Workflow | Se dispara | Resultado |
|---|---|---|
| `release-please.yml` | push a `main` | Abre/actualiza el release PR; al mergearlo, crea el Release y despacha los deploys |
| `deploy-web.yml` | Release / `sismo-daily` / `workflow_dispatch` | `npx opennextjs-cloudflare build` + `npx wrangler deploy` (worker `cuentas-venezuela-web`) |
| `deploy-api.yml` | Release / `workflow_dispatch` | `npx wrangler deploy` (worker `cuentas-venezuela-api`) |
| `db-migrate.yml` | push a `main` con `db/*.sql` | `psql -f` contra Neon prod (idempotente) |
| `sismo-daily.yml` | cron cada 12h (`0 */12 * * *`) | Actualiza cifras del sismo y despacha `deploy-web.yml` directamente |
| `etl-cron.yml` / `etl-obras.yml` | lunes `06:00 UTC` / semanal / manual | Corre pipelines Python contra Neon prod + R2 |

> Versionado semver + changelog automáticos desde conventional commits. Para forzar un deploy sin release: Actions → `deploy-web` / `deploy-api` → Run workflow.

> ⚠️ **Nunca hacer `psql -c "INSERT..."` ad-hoc en prod.** Toda metadata permanente (sources, datasets, indicators) se declara en `db/seeds.sql`.

### Secretos requeridos en GitHub Actions

```
CLOUDFLARE_API_TOKEN          # Workers + Pages + DNS edit
CLOUDFLARE_ACCOUNT_ID
DATABASE_URL_PROD             # Neon prod connection string (HTTP)
DATABASE_URL_STAGING          # opcional (Neon dev branch)
S3_ENDPOINT                   # https://<account>.r2.cloudflarestorage.com
S3_REGION                     # auto
S3_BUCKET                     # cuentas-venezuela-prod
S3_KEY / S3_SECRET            # R2 token
```

> 🔧 Setearlos: `./scripts/with-personal-gh.sh ./scripts/set-gh-secrets.sh` (lee `.env` local).

### Worker secrets (independientes de GH)

```
DATABASE_URL                  # Neon HTTP URL — el Worker lee esto
KOFI_VERIFICATION_TOKEN       # opcional, si activas webhook Ko-fi
```

> 🔧 Setearlos: `./scripts/cf-worker-secrets.sh` (lee `.env`, llama CF API).

---

## 📊 Observabilidad

> Cero servicios externos. Todo dentro de Cloudflare.

| Qué | Dónde | Costo |
|---|---|---|
| 🐛 Errores Worker (API) | Dashboard CF → Workers & Pages → `cuentas-venezuela-api` → Logs | $0 |
| 🐛 Errores Worker (Web) | Dashboard CF → Workers & Pages → `cuentas-venezuela-web` → Logs | $0 |
| 📡 Live tail | `cd api && npx wrangler tail` | $0 |
| 📈 Métricas (req/s, CPU, errores) | Dashboard CF → Workers & Pages → Analytics | $0 |

Sin SDK que cargar, sin tracking 3rd-party, sin tarjeta de crédito.

---

## 🛡️ Seguridad

- 🔒 **TLS** Universal SSL automático CF (Full strict)
- 🚧 **WAF** custom rules: bloquea hosts fuera del dominio + bots POST + probes admin
- ⏱️ **Rate limit** edge: 10 POST/min/IP + 120 GET/min/IP en `/api/*`
- 🔑 **Secrets**: GH Actions encriptados + Workers secrets cifrados
- 🚫 **CSP**: `default-src 'self'` + 3rd-party explícitos (CartoDB, Plausible, Ko-fi, OSM)
- 🚫 **CORS**: locked a `cuentasvenezuela.org` y subdominios en prod
- 🤖 **Bot Fight Mode** + **DDoS protection** (CF free)
- 🔐 **Pre-commit gitleaks** + GH Actions secret-scan en cada PR

---

## 🤝 Contribuir

> No tienes que aportar dinero. Las acciones más útiles muchas veces no cuestan nada.

- 🐛 **Reportar dato errado**: <https://cuentasvenezuela.org/mapa-del-olvido/reportar>
- 💡 **Sugerir fuente nueva**: PR sobre `db/seeds.sql` o issue
- 🌍 **Traducir**: copy en `web/src/app/**/page.tsx` (es-CL → en, pt, indígenas)
- 💻 **Código**: PRs bienvenidos, sigue convencional commits + tests
- 🔁 **Compartir**: dile a alguien que pueda usar estos datos
- ☕ **Aportar**: <https://ko-fi.com/donjonny>

---

## 📜 Licencia

- 💻 **Código**: MIT (ver [`LICENSE`](LICENSE))
- 📊 **Datos**: cada dataset conserva su licencia original. Cada visualización cita su fuente. Ver [`/fuentes`](https://cuentasvenezuela.org/fuentes).

---

## 🙏 Quienes hacen esto posible

Aportes públicos en <https://cuentasvenezuela.org/apoyar>. Si donaste anónimo o no apareces, también gracias.

> Esto existe porque gente como tú lo sostiene.
