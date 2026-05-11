import { describe, expect, it } from "vitest";

const API = process.env.TEST_API_URL ?? "http://localhost:8100";

async function get(path: string): Promise<{ status: number; json: unknown }> {
  const res = await fetch(`${API}${path}`);
  return { status: res.status, json: await res.json() };
}

describe("API smoke", () => {
  it("GET /health returns ok", async () => {
    const { status, json } = await get("/health");
    expect(status).toBe(200);
    expect((json as { status: string }).status).toBe("ok");
  });

  it("GET / returns endpoint list", async () => {
    const { status, json } = await get("/");
    expect(status).toBe(200);
    const body = json as { endpoints: string[] };
    expect(body.endpoints).toContain("/v1/sources");
    expect(body.endpoints).toContain("/v1/data/comparativa-nacionalidad");
    expect(body.endpoints).toContain("/v1/ve-macro/indicators");
    expect(body.endpoints).toContain("/v1/ddhh/freedom-house");
    expect(body.endpoints).toContain("/v1/migracion/acnur-ve");
  });

  it("GET /v1/sources returns Chile + VE sources", async () => {
    const { status, json } = await get("/v1/sources");
    expect(status).toBe(200);
    const body = json as { items: { slug: string }[] };
    const slugs = body.items.map((s) => s.slug);
    expect(slugs).toContain("sermig");
    expect(slugs).toContain("world-bank");
    expect(slugs).toContain("freedom-house");
    expect(slugs).toContain("unhcr");
  });

  it("GET /v1/sources/sermig returns datasets", async () => {
    const { status, json } = await get("/v1/sources/sermig");
    expect(status).toBe(200);
    const body = json as {
      source: { slug: string };
      datasets: unknown[];
    };
    expect(body.source.slug).toBe("sermig");
    expect(body.datasets.length).toBeGreaterThan(0);
  });

  it("GET /v1/sources/does-not-exist returns 404", async () => {
    const { status } = await get("/v1/sources/does-not-exist");
    expect(status).toBe(404);
  });

  it("GET /v1/indicators returns category-grouped items", async () => {
    const { status, json } = await get("/v1/indicators");
    expect(status).toBe(200);
    const body = json as { items: { category: string }[] };
    const categories = new Set(body.items.map((i) => i.category));
    expect(categories.size).toBeGreaterThanOrEqual(3);
  });
});

describe("Chile data endpoints (Postgres-backed)", () => {
  it.each([
    "/v1/data/stock-region",
    "/v1/data/cotizantes-sector",
    "/v1/data/comparativa-nacionalidad",
    "/v1/data/aporte-tributario",
  ])("GET %s returns items array", async (path) => {
    const { status, json } = await get(path);
    expect(status).toBe(200);
    const body = json as { items: unknown[] };
    expect(Array.isArray(body.items)).toBe(true);
  });
});

describe("Venezuela data endpoints", () => {
  it("GET /v1/ve-macro/indicators?country=VEN returns rows", async () => {
    const { status, json } = await get(
      "/v1/ve-macro/indicators?country=VEN&code=NY.GDP.PCAP.CD",
    );
    expect(status).toBe(200);
    const body = json as { items: { country: string; year: number }[] };
    expect(Array.isArray(body.items)).toBe(true);
    if (body.items.length > 0) {
      expect(body.items[0].country).toBe("VEN");
      expect(body.items[0].year).toBeGreaterThanOrEqual(1998);
    }
  });

  it("GET /v1/ddhh/freedom-house?country=VEN returns rows", async () => {
    const { status, json } = await get("/v1/ddhh/freedom-house?country=VEN");
    expect(status).toBe(200);
    const body = json as { items: { country: string; year: number; total: number | null }[] };
    expect(Array.isArray(body.items)).toBe(true);
    if (body.items.length > 0) {
      expect(body.items[0].country).toBe("VEN");
    }
  });

  it("GET /v1/migracion/acnur-ve?year=2025 returns ordered destinations", async () => {
    const { status, json } = await get("/v1/migracion/acnur-ve?year=2025");
    expect(status).toBe(200);
    const body = json as { items: { country: string; total: number }[] };
    expect(Array.isArray(body.items)).toBe(true);
    if (body.items.length > 1) {
      // ordered by total desc
      expect(body.items[0].total).toBeGreaterThanOrEqual(body.items[1].total);
    }
  });
});

describe("Mapa del Olvido", () => {
  it("GET /api/obras returns array", async () => {
    const res = await fetch(`${API}/api/obras`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as Array<{ id: string; coordenadas: { lat: number; lng: number } }>;
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      expect(body[0]).toHaveProperty("id");
      expect(body[0].coordenadas).toHaveProperty("lat");
    }
  });

  it("GET /api/obras/does-not-exist returns 404", async () => {
    const res = await fetch(`${API}/api/obras/does-not-exist`);
    expect(res.status).toBe(404);
  });

  it("POST /api/reportes rejects missing description (400)", async () => {
    const res = await fetch(`${API}/api/reportes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it("POST /api/reportes accepts valid payload (201)", async () => {
    const res = await fetch(`${API}/api/reportes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descripcion:
          "Test report from vitest smoke. Sufficient length for validation.",
      }),
    });
    expect([201, 429]).toContain(res.status); // 429 possible if rate-limited by prior test
  });
});

describe("Ko-fi + supporters + subscribers", () => {
  it("GET /api/supporters returns items array", async () => {
    const { status, json } = await get("/api/supporters");
    expect(status).toBe(200);
    const body = json as { items: unknown[] };
    expect(Array.isArray(body.items)).toBe(true);
  });

  it("POST /api/kofi/webhook without token returns 503", async () => {
    // Local dev has no KOFI_VERIFICATION_TOKEN set by default.
    const res = await fetch(`${API}/api/kofi/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(JSON.stringify({})),
    });
    expect([401, 503]).toContain(res.status);
  });

  it("POST /api/subscribers rejects bad email", async () => {
    const res = await fetch(`${API}/api/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });
    expect(res.status).toBe(400);
  });
});
