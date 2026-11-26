# AGENTS.md — Cuentas Venezuela

Guía operativa para contribuidores y agentes en `Mundo-Dev0ps/cuentas-venezuela`.

## 1. Mapa del repositorio

- `web/`: Next.js 15 App Router + React 19 + Tailwind CSS + SPA `/mapa-del-olvido` (`src/mapa/`). Despliega en Cloudflare Workers (`cuentas-venezuela-web` vía `@opennextjs/cloudflare` y `web/wrangler.jsonc`).
- `api/`: Hono + Drizzle ORM + Zod. Despliega en Cloudflare Workers (`cuentas-venezuela-api`, `api/wrangler.toml`) contra Neon Postgres y Cloudflare R2.
- `etl/`: Paquete Python 3.12 (`datos-chile-etl`) con 12 pipelines en `etl/pipelines/` y tests en `etl/tests/`.
- `db/`: SQL declarativo (`db/schema.sql`, `db/seeds.sql`). Todo metadata permanente (`sources`, `datasets`, `indicators`, `obras`) se declara aquí; no ejecutar `INSERT` ad-hoc en producción.
- `scripts/`: `scripts/update-sismo.py` (bot de cifras del terremoto 2026) y utilidades de Cloudflare/GitHub.
- `docs/superpowers/specs/`: Especificaciones de diseño aprobadas de funcionalidades.

## 2. Flujo Git y despliegue

1. Prohibido commitear o pushear directo a `main`. Usar rama de trabajo (`feat/...`, `fix/...`, `chore/...` o `integracion`) y abrir PR hacia `main`.
2. Usar Conventional Commits (`feat(...)`, `fix(...)`, `chore(...)`, `data(...)`, `docs(...)`, `refactor(...)`, `test(...)`). `release-please.yml` genera releases y dispara `deploy-web.yml` y `deploy-api.yml`.
3. `sismo-daily.yml` corre cada 12h (`0 */12 * * *`), actualiza exclusivamente `web/src/app/venezuela/sismo-2026/data.ts`, `web/src/app/sitemap.ts`, `web/public/llms.txt` y `web/public/llms-full.txt`, y despacha `deploy-web.yml`.

## 3. Verificación antes de entregar

Ejecutar siempre en Docker o en el entorno aislado del proyecto (no instalar paquetes en el host):

- Web: `npm run typecheck`, `npm test` (Vitest) y `npm run build` dentro de `web/`.
  - Nota: `npm run lint` (`next lint`) está comentado en `.github/workflows/ci.yml` porque solicita configuración interactiva en Next 15.5.
- API: `npm run typecheck` y `npm test` dentro de `api/`.
- Sismo bot: `python3 scripts/update-sismo.py --self-test` (offline) y `python3 scripts/update-sismo.py --dry-run`.
- ETL: `pytest` dentro de `etl/`.
- Seguridad: no commitear `.env`, tokens ni llaves (`secret-scan.yml` + pre-commit `gitleaks`).

## 4. Invariantes de datos y UI

- **Datos y fuentes**: cada cifra publicada cita fuente oficial y fecha. `DAMAGE` en `web/src/app/venezuela/sismo-2026/data.ts` es la fuente única de verdad para tarjetas KPI, banner del home, tarjeta de `/venezuela`, FAQ y JSON-LD. Nunca desactivar ni reducir guardas en `scripts/update-sismo.py` sin revisión explícita.
- **Paleta y tipografía UI**:
  - Superficies sobre rampa oscura *Ink* (`--bg-page: #06102a`, paneles `slate-900/80`, bordes hairline sutiles, sin gradientes entre tonos ni resplandores decorativos).
  - Cifras siempre con `font-mono tabular-nums`; etiquetas en *sentence case* legible; iconos Lucide consistentes (`strokeWidth={1.5}`), evitando emojis como iconos de interfaz.
  - Accesibilidad y motion: respetar `prefers-reduced-motion: reduce` para todas las animaciones en `web/src/app/globals.css`, incluir `:focus-visible` claro en controles interactivos y mantener `<main id="contenido">` como destino del enlace "Saltar al contenido".
