# cuentas-venezuela

Portal cívico independiente de datos abiertos sobre Venezuela y la diáspora venezolana. Sin anuncios, sin tracking, financiado por aportes voluntarios vía Ko-fi.

Producción: <https://cuentasvenezuela.com>

## Productos

- **Mapa del Olvido** — mapa interactivo de obras públicas paralizadas, críticas e inoperativas en Venezuela.
- **Datos Chile** — dashboards sobre venezolanos en Chile (demografía, pensiones, tributario, regional).
- **Venezuela** — comparativas antes/después, crisis económica, salud, inseguridad, derechos humanos, diáspora global.

## Stack

- **Web**: Next.js 15 (App Router) + Tailwind + shadcn/ui — Cloudflare Pages en prod
- **API**: Hono (TypeScript) — Fly.io en prod (single hobby machine)
- **ETL**: Python 3.12 (httpx, Polars, DuckDB, fastexcel) — GitHub Actions cron en prod
- **DB relacional**: Postgres 16 (dev: docker compose, prod: Neon)
- **Object storage**: MinIO (dev) → Cloudflare R2 (prod), S3-compatible
- **Datos masivos**: Parquet en object storage, query con DuckDB

## Requisitos dev

- Docker + Docker Compose v2
- ~4 GB RAM libres

## Arranque local

```bash
cp .env.example .env
docker compose build
docker compose up -d
```

URLs locales (puertos host alternos para evitar choques):

- Web: <http://localhost:3100>
- API: <http://localhost:8100/health>
- MinIO S3: <http://localhost:9100>
- MinIO Console: <http://localhost:9101> (user: `minioadmin`, pass: `minioadmin`)
- Postgres: `localhost:5433` (user: `dev`, pass: `dev`, db: `datos`)

Cambia los puertos host con env vars: `WEB_HOST_PORT`, `API_HOST_PORT`, `POSTGRES_HOST_PORT`, `MINIO_HOST_PORT`, `MINIO_CONSOLE_HOST_PORT`.

## Comandos

```bash
# logs en vivo
docker compose logs -f web api

# rebuild un servicio
docker compose build web && docker compose up -d web

# correr ETL bajo demanda
docker compose --profile etl run --rm etl python -m pipelines ve_macro
docker compose --profile etl run --rm etl python -m pipelines all

# parar todo
docker compose down

# reset total (borra volúmenes)
docker compose down -v
```

## Estructura

```
.
├── web/                  # Next.js (Cloudflare Pages)
├── api/                  # Hono API (Fly.io)
├── etl/                  # Python pipelines (GitHub Actions cron)
├── db/                   # schema SQL + seeds
├── data/                 # Parquet local (gitignored)
└── .github/workflows/    # CI + deploys + ETL cron
```

## Pipelines ETL disponibles

| Pipeline | Fuente | Tabla destino |
|---|---|---|
| `extranjeria` | datos.gob.cl SNM | parquet `sermig/` |
| `sii` | SII Chile | parquet `sii/` |
| `sp` | Superintendencia de Pensiones | parquet `sp/` |
| `comparativa` | INE Chile | parquet `comparativa/` |
| `ine` | INE Chile | parquet `ine/` |
| `obras` | Mapa del Olvido scrape | `public.obras` |
| `ve_macro` | World Bank API | `macro_ve.wb_indicators` |
| `freedom_house` | Freedom House XLSX | `ddhh.freedom_house` |
| `acnur` | UNHCR Population API | `migracion.acnur_ve` |

## Tests

```bash
# API (vitest) — requiere servicios up
docker compose exec -T -e TEST_API_URL=http://localhost:8000 api npm run test

# ETL (pytest)
docker compose --profile etl run --rm --entrypoint sh etl -c \
  'pip install -q pytest && python -m pytest tests/ -v'

# Web e2e (playwright)
docker compose exec -T web npx playwright install --with-deps chromium
docker compose exec -T -e E2E_BASE_URL=http://localhost:3000 web npx playwright test
```

## Despliegue

Cada `push` a `main` dispara, según paths cambiados:

- `web/**` → `deploy-web.yml` → Cloudflare Pages
- `api/**` → `deploy-api.yml` → Fly.io (`api/fly.toml`)
- `db/schema.sql` → `db-migrate.yml` → `psql -f schema.sql` contra Neon

ETL corre semanalmente (lunes 06:00 UTC) vía `etl-cron.yml`. Manual: GitHub → Actions → etl-cron → Run workflow.

Secretos requeridos en GitHub Actions:

```
FLY_API_TOKEN
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
DATABASE_URL_PROD          # Neon prod connection string
DATABASE_URL_STAGING       # Neon staging branch (opcional)
S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_KEY, S3_SECRET   # R2 credentials
```

## Observabilidad

Sin servicios externos. Todo dentro de Cloudflare:

- **API errores + logs por request:** dashboard CF → Workers & Pages → cuentas-venezuela-api → Logs (gratis, 30d retención)
- **Pages errores:** dashboard CF → cuentas-venezuela → Functions → Logs
- **Live tail:** `cd api && npx wrangler tail` (stream consola en vivo)
- **Métricas (req/s, errores, CPU):** dashboard CF → Workers & Pages → Analytics

Sin SDK que cargar, sin tracking 3rd-party, sin tarjeta de crédito.

## Apoyar

Proyecto sin fines de lucro. Aportes vía Ko-fi: <https://ko-fi.com/donjonny>

Otras formas: compartir, reportar errores en datos, sugerir nuevas fuentes, contribuir código vía PR, traducir.

## Licencia

Código: MIT (ver `LICENSE`).
Datos publicados conservan su licencia original; siempre se cita la fuente.
