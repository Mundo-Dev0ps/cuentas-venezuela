# datos-chile

Portal público de datos oficiales sobre la migración venezolana en Chile. Dashboards navegables, comparables y citados desde fuentes oficiales (INE, Extranjería, SII, Superintendencia de Pensiones, etc.).

## Stack

- **Web**: Next.js 15 (App Router) + Tailwind + shadcn/ui
- **API**: Hono (TypeScript) — corre en Node local y Cloudflare Workers en prod
- **ETL**: Python (httpx, Polars, DuckDB)
- **DB relacional (dev)**: Postgres 16 → Cloudflare D1 (SQLite) en prod
- **Storage (dev)**: MinIO → Cloudflare R2 en prod (S3-compatible)
- **Datos masivos**: Parquet en object storage, query con DuckDB

## Requisitos

- Docker + Docker Compose v2
- ~4 GB RAM libres

## Arranque local

```bash
cp .env.example .env
docker compose build
docker compose up -d
```

URLs (puertos host alternos para evitar choques con otros proyectos):

- Web: http://localhost:3100
- API: http://localhost:8100/health
- MinIO S3: http://localhost:9100
- MinIO Console: http://localhost:9101 (user: `minioadmin`, pass: `minioadmin`)
- Postgres: `localhost:5433` (user: `dev`, pass: `dev`, db: `datos`)

Cambia los puertos host con env vars: `WEB_HOST_PORT`, `API_HOST_PORT`, `POSTGRES_HOST_PORT`, `MINIO_HOST_PORT`, `MINIO_CONSOLE_HOST_PORT`.

## Comandos

```bash
# logs en vivo
docker compose logs -f web api

# rebuild un servicio
docker compose build web && docker compose up -d web

# correr ETL bajo demanda
docker compose --profile etl run --rm etl python -m pipelines.extranjeria

# parar todo
docker compose down

# reset total (borra volúmenes)
docker compose down -v
```

## Estructura

```
.
├── web/      # Next.js front
├── api/      # Hono API
├── etl/      # Python pipelines
├── db/       # schema SQL + seeds
└── data/     # Parquet local (gitignored)
```

## Tests

```bash
# API (vitest) — requiere servicios up
docker compose exec -T -e TEST_API_URL=http://localhost:8000 api npm run test

# ETL (pytest)
docker compose --profile etl run --rm --entrypoint sh etl -c \
  'pip install -q pytest && python -m pytest tests/ -v'

# Web e2e (playwright) — primera vez instala chromium
docker compose exec -T web npx playwright install --with-deps chromium
docker compose exec -T -e E2E_BASE_URL=http://localhost:3000 web npx playwright test
```

En CI (GitHub Actions): mismo flujo, los runners ya tienen Docker + Playwright.

## Despliegue (futuro)

- `web` → Cloudflare Pages
- `api` → Cloudflare Workers
- Storage → R2
- DB metadata → D1

Sin pagos por ahora (freemium puro). Cuando se active Pro: Stripe + métricas de uso por API key.

## Licencia

Pendiente. Datos publicados conservan su licencia original; siempre se cita la fuente.
