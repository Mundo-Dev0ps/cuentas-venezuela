import { describe, it, expect } from "vitest";
import { obrasToCSV } from "../csv-export";
import type { Obra } from "../obras-types";

const sample: Obra = {
  id: "a-1",
  slug: "test-quoted-obra",
  nombre: 'Test "quoted" obra',
  estado: "Miranda",
  tipo: "salud",
  status: "parcial",
  monto_usd: 1_000_000,
  anio_inicio: 2010,
  lat: 10,
  lon: -67,
  fuente_url: "https://example.com",
};

describe("obrasToCSV", () => {
  it("emits header row first", () => {
    const csv = obrasToCSV([sample]);
    const [header] = csv.split("\n");
    expect(header).toContain("id");
    expect(header).toContain("nombre");
    expect(header).toContain("estado");
    expect(header).toContain("monto_usd");
  });

  it("escapes inner double quotes by doubling them", () => {
    const csv = obrasToCSV([sample]);
    expect(csv).toContain('Test ""quoted"" obra');
  });

  it("produces N+1 lines for N obras", () => {
    const csv = obrasToCSV([sample, sample, sample]);
    expect(csv.split("\n")).toHaveLength(4);
  });

  it("handles empty array (header only)", () => {
    const csv = obrasToCSV([]);
    expect(csv.split("\n")).toHaveLength(1);
  });
});
