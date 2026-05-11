import { describe, it, expect } from "vitest";
import { MOCK_OBRAS, mockStats } from "../obras-mock";

describe("obras-mock", () => {
  it("exports at least 10 obras", () => {
    expect(MOCK_OBRAS.length).toBeGreaterThanOrEqual(10);
  });

  it("every obra has slug, estado, status", () => {
    for (const o of MOCK_OBRAS) {
      expect(o.slug).toMatch(/^[a-z0-9-]+$/);
      expect(o.estado).toBeTruthy();
      expect(o.status).toBeTruthy();
    }
  });

  it("mockStats sums match MOCK_OBRAS", () => {
    const s = mockStats();
    expect(s.total_count).toBe(MOCK_OBRAS.length);
    const summed =
      s.by_status.inaugurada +
      s.by_status.abandonada +
      s.by_status.parcial +
      s.by_status.en_construccion;
    expect(summed).toBe(MOCK_OBRAS.length);
  });

  it("top10_estados ordered by monto desc", () => {
    const t = mockStats().top10_estados;
    for (let i = 1; i < t.length; i++) {
      expect(t[i - 1].monto_usd).toBeGreaterThanOrEqual(t[i].monto_usd);
    }
  });
});
