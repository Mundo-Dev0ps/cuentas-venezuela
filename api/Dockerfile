# Dev-only image for docker compose. Prod runs on Cloudflare Workers
# (see api/wrangler.toml + .github/workflows/deploy-api.yml).
#
# Dev uses tsx watch → src/dev-server.ts → @hono/node-server + postgres-js
# (TCP to the local postgres container). Prod path in src/index.ts is the
# Workers fetch handler using @neondatabase/serverless instead.

FROM node:20-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates wget \
    && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 8000
HEALTHCHECK --interval=15s --timeout=5s --start-period=90s --retries=5 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1:8000/health || exit 1
CMD ["npm", "run", "dev"]
