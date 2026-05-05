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
  });

  it("GET /v1/sources returns >= 6 seeded sources", async () => {
    const { status, json } = await get("/v1/sources");
    expect(status).toBe(200);
    const body = json as { items: { slug: string }[] };
    expect(body.items.length).toBeGreaterThanOrEqual(6);
    expect(body.items.map((s) => s.slug)).toContain("sermig");
  });

  it("GET /v1/sources/sermig returns datasets and indicators", async () => {
    const { status, json } = await get("/v1/sources/sermig");
    expect(status).toBe(200);
    const body = json as {
      source: { slug: string };
      datasets: unknown[];
      indicators: unknown[];
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

  it("GET /v1/data/stock-region returns rows from Parquet (or empty if ETL not run)", async () => {
    const { status, json } = await get("/v1/data/stock-region");
    expect(status).toBe(200);
    const body = json as { items: unknown[]; error?: string };
    expect(Array.isArray(body.items)).toBe(true);
    if (body.items.length === 0 && body.error) {
      console.warn("stock-region empty:", body.error);
    }
  });
});
