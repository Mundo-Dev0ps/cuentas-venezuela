# 🇻🇪 Cuentas Venezuela

> Portal cívico independiente de **datos abiertos sobre Venezuela y la diáspora venezolana**.
> Sin anuncios. Sin tracking. Sin venta de datos. Financiado por aportes voluntarios vía Ko-fi.

🌐 **Producción:** <https://cuentasvenezuela.org>
☕ **Apoyar:** <https://ko-fi.com/donjonny>
📦 **Stack:** 100% Cloudflare free tier (~$0–1/mes solo dominio)

---

## ✨ ¿Qué encuentras acá?

| Sección | URL | Qué muestra |
|---|---|---|
| 🗺️ **Mapa del Olvido** | `/mapa-del-olvido` | Mapa interactivo de obras públicas paralizadas / críticas / inoperativas en Venezuela |
| 📊 **Datos Chile** | `/datos-chile` | Dashboards sobre venezolanos en Chile: demografía, pensiones, tributario, regional |
| 📈 **Venezuela** | `/venezuela` | Crisis económica, salud, inseguridad, derechos humanos, diáspora global, antes/después |
| 🌊 **Terremoto 2026** | `/venezuela/sismo-2026` | Doble sismo Mw 7,5 + 7,2 del 24 jun 2026: víctimas, mapa de daños por estado, costo económico. **Cifras auto-refrescadas a diario** |
| 🔁 **Puerta giratoria** | `/venezuela/puerta-giratoria` | Ranking factual de funcionarios que rotan por cargos dejando promesas incumplidas, cada una con doble fuente |
| 📰 **Coyuntura 2025-2026** | `/venezuela/coyuntura` | Presos políticos (Foro Penal), inflación (OVF), dólar BCV/paralelo, producción petrolera |
| 🌍 **Esequibo** | `/venezuela/esequibo` | Cronología factual de la controversia territorial con Guyana |
| 📚 **Fuentes** | `/fuentes` | Catálogo de las fuentes oficiales que alimentan los dashboards |
| ☕ **Apoyar** | `/apoyar` | Cómo colaborar (no solo dinero — compartir, reportar, traducir, contribuir código) |

---

## 🧱 Arquitectura (alto nivel)

```
                          ┌─────────────────────────────────┐
   👤 Usuario ────HTTPS──→│  cuentasvenezuela.org           │
                          │  Cloudflare Pages (Next.js)     │  ← deploy-web.yml
                          └────────────────┬────────────────┘
                                           │  fetch
                                           ▼
                          ┌─────────────────────────────────┐
                          │  api.cuentasvenezuela.org       │
                          │  Cloudflare Workers (Hono)      │  ← deploy-api.yml
                          └────────┬────────────────┬───────┘
                                   │ HTTP           │ S3
                                   ▼                ▼
                       ┌────────────────┐  ┌────────────────┐
                       │  Neon Postgres │  │  Cloudflare R2 │
                       │  (cifras +     │  │  (parquet      │
                       │   metadata)    │  │   archivos)    │
                       └────────▲───────┘  └────────▲───────┘
                                │                   │
                                │ upsert            │ put
                                ▼                   ▼
                       ┌────────────────────────────────────┐
                       │  GitHub Actions (cron semanal)     │
                       │  etl-cron.yml → pipelines Python   │  ← ETL
                       │  (World Bank, ACNUR, Freedom House)│
                       └────────────────────────────────────┘
```

---

## 🛠 Stack

| Capa | Tecnología | Hosting |
|---|---|---|
| 🎨 Frontend | Next.js 15 + React 19 + Tailwind + shadcn/ui + recharts + deck.gl | Cloudflare Pages (free) |
| ⚙️ API | Hono + drizzle-orm | Cloudflare Workers (free, 100k req/día) |
| 🗄️ Base de datos | Postgres 16 (schemas: `public`, `chile`, `migracion`, `macro_ve`, `ddhh`) | Neon (free tier 0.5GB) |
| 🪣 Object storage | S3-compatible (parquets, geojson) | Cloudflare R2 (free 10GB) |
| 🐍 ETL | Python 3.12 + httpx + Polars + fastexcel | GitHub Actions cron (free, repo público) |
| 🗺️ Mapas | maplibre-gl + react-map-gl + deck.gl | tiles desde basemaps.cartocdn.com |
| 💸 Donaciones | Ko-fi webhook → tabla `supporters` → muro público | Ko-fi (sin infra propia) |
| 📊 Observabilidad | Cloudflare Workers + Pages logs nativo | $0, sin SDK externo |

**Total infra: ~$1/mes** (solo dominio `.org`). Si te atacan: Workers free se detiene a 100k req/día, no hay overage. Cero riesgo factura sorpresa.

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

## ⚡ Comandos frecuentes

```bash
# 📜 logs en vivo
docker compose logs -f web api

# 🔄 rebuild un servicio
docker compose build web && docker compose up -d web

# 🐍 correr 1 pipeline ETL bajo demanda (puebla DB local + parquet en MinIO)
docker compose --profile etl run --rm etl python -m pipelines ve_macro

# 🐍 correr todos los pipelines
docker compose --profile etl run --rm etl python -m pipelines all

# 🧪 tests API (vitest, requiere stack arriba)
docker compose exec -T -e TEST_API_URL=http://localhost:8000 -e E2E_API_URL=http://localhost:8000 api npm test

# 🧪 tests E2E (Playwright)
docker compose exec -T web npx playwright install --with-deps chromium
docker compose exec -T -e E2E_BASE_URL=http://localhost:3000 web npx playwright test

# 🛑 parar todo
docker compose down

# ☢️ reset total (borra volúmenes + datos)
docker compose down -v
```

---

## 📁 Estructura del repo

```
.
├── 🎨 web/                 # Next.js 15 (App Router) → Cloudflare Pages
│   ├── src/app/           # rutas: /, /venezuela/*, /datos-chile/*, /mapa-del-olvido, /apoyar, /fuentes
│   ├── src/components/    # componentes compartidos (charts, badges, layout)
│   ├── src/mapa/          # SPA legacy del Mapa del Olvido (react-router-dom)
│   ├── src/lib/api.ts     # cliente API tipado
│   ├── wrangler.jsonc     # config worker web (OpenNext)
│   └── open-next.config.ts
│
├── ⚙️ api/                  # Hono → Cloudflare Workers
│   ├── src/app.ts         # rutas Hono compartidas
│   ├── src/index.ts       # Workers entry (neon-http)
│   ├── src/dev-server.ts  # Node entry compose (postgres-js)
│   └── wrangler.toml      # config worker api
│
├── 🐍 etl/                  # Python pipelines
│   ├── pipelines/*.py     # 1 archivo por fuente
│   └── pyproject.toml
│
├── 🗄️ db/                   # SQL declarativo (schema + seeds)
│   ├── schema.sql         # CREATE TABLE IF NOT EXISTS ...
│   └── seeds.sql          # INSERT ... ON CONFLICT DO UPDATE (sources, datasets, indicators, obras)
│
├── 🛠 scripts/             # Bash helpers (CF API, gh, secrets)
├── 🤖 .github/workflows/  # CI + deploys + ETL cron + db-migrate + secret-scan
└── 🧪 data/                # Parquets local (gitignored)
```

---

## 🛰 Pipelines ETL disponibles

| Pipeline | Fuente oficial | Tabla destino | Frecuencia recomendada |
|---|---|---|---|
| `extranjeria` | datos.gob.cl SNM (Chile) | `chile.sermig_stock_region` + parquet | mensual |
| `sii` | SII Chile | `chile.sii_aporte` + parquet | anual |
| `sp` | Superintendencia de Pensiones | `chile.sp_cotizantes` + parquet | mensual |
| `comparativa` | INE Chile | `chile.comparativa` + parquet | anual |
| `ine` | INE Chile | parquet `ine/` | anual |
| `obras` | Mapa del Olvido (scrape + ciudadano) | `public.obras` | semanal |
| `ve_macro` | World Bank API | `macro_ve.wb_indicators` (29 indicadores × VEN+CHL) | mensual |
| `freedom_house` | Freedom House XLSX | `ddhh.freedom_house` | anual (febrero) |
| `acnur` | UNHCR Population API | `migracion.acnur_ve` | mensual |

> 🤖 Cron: lunes 06:00 UTC vía `etl-cron.yml`. Manual: GitHub → Actions → etl-cron → Run workflow → pipeline `all` o uno específico.

### 🌊 Auto-refresh del terremoto 2026

`sismo-daily.yml` (cron diario 11:00 UTC) mantiene al día las cifras de muertos/heridos del sismo sin edición manual:

- `scripts/update-sismo.py` parsea el infobox de Wikipedia (wikitext; lee el valor crudo dentro de `{{rounddown|N}}`).
- **Guardas de seguridad**: las cifras solo suben, el salto diario no puede superar ~2× y hay topes duros → bloquea vandalismo o errores de parseo.
- Cambio válido → commit a `main` + dispara `deploy-web`. Guarda saltada → abre un issue de revisión en vez de publicar.
- La FAQ y la card del landing derivan de `DAMAGE`, así que el bot solo edita una fuente de verdad (`data.ts`).

> Las páginas manuales (`coyuntura`, `puerta-giratoria`, `esequibo`, y los campos del sismo que no toca el bot: desaparecidos, desplazados, económico) se refrescan a mano y cada cifra cita su fuente.

---

## 🚢 Despliegue

Los deploys de prod son **por release** (`release-please`). Al hacer merge a `main`, `release-please.yml` mantiene un **release PR** que acumula los conventional commits y sube la versión + `CHANGELOG.md`. Al mergear ese PR se crea el Release/tag y **eso** dispara los deploys.

| Workflow | Se dispara | Resultado |
|---|---|---|
| 🏷️ `release-please.yml` | push a `main` | Abre/actualiza el release PR; al mergearlo, crea el Release y despacha los deploys |
| 🎨 `deploy-web.yml` | Release (o `workflow_dispatch`) | `npx opennextjs-cloudflare build` + `wrangler deploy` |
| ⚙️ `deploy-api.yml` | Release (o `workflow_dispatch`) | `wrangler deploy` (worker `cuentas-venezuela-api`) |
| 🗄️ `db-migrate.yml` | push a `main` con `db/*.sql` | `psql -f` contra Neon prod (idempotente) |
| 🌊 `sismo-daily.yml` | cron diario | Actualiza cifras del sismo y despacha `deploy-web` directamente (los datos no esperan un release) |
| 🐍 `etl/**` | manual / cron semanal | Sin auto-deploy; ETL corre desde el runner |

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
