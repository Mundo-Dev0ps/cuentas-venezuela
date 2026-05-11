import { describe, it, expect } from "vitest";

const BASE =
  process.env.E2E_API_URL || "http://localhost:8100";

function uniqueIp() {
  return `198.51.100.${Math.floor(Math.random() * 250) + 1}`;
}

async function post(payload: unknown, ip = uniqueIp()) {
  return fetch(`${BASE}/api/reportes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": ip,
    },
    body: JSON.stringify(payload),
  });
}

describe("POST /api/reportes", () => {
  it("rejects invalid JSON", async () => {
    const r = await fetch(`${BASE}/api/reportes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": uniqueIp(),
      },
      body: "not json",
    });
    expect(r.status).toBe(400);
  });

  it("rejects descripcion too short", async () => {
    const r = await post({ descripcion: "short" });
    expect(r.status).toBe(400);
  });

  it("rejects invalid email contacto", async () => {
    const r = await post({
      descripcion: "Esta obra está abandonada hace años, en mal estado.",
      contacto: "not-an-email",
    });
    expect(r.status).toBe(400);
  });

  it("accepts valid payload, returns 201 + id", async () => {
    const r = await post({
      descripcion: "Esta obra está abandonada hace años, en mal estado.",
    });
    expect(r.status).toBe(201);
    const body = await r.json();
    expect(typeof body.id).toBe("string");
    expect(body.status).toBe("pending");
  });

  it("rate limits after 5 reqs / 10 min from same IP", async () => {
    const ip = "203.0.113.99";
    let last: Response | null = null;
    for (let i = 0; i < 7; i++) {
      last = await post(
        { descripcion: `Reporte de prueba número ${i} con texto suficiente.` },
        ip,
      );
    }
    expect(last?.status).toBe(429);
  });
});
