import { describe, it, expect } from "vitest";
import { toSlug, matchesSlug } from "../slug";

describe("toSlug", () => {
  it("lowercases and replaces spaces with dashes", () => {
    expect(toSlug("Distrito Capital")).toBe("distrito-capital");
  });

  it("strips Spanish accents", () => {
    expect(toSlug("Anzoátegui")).toBe("anzoategui");
    expect(toSlug("Bolívar")).toBe("bolivar");
    expect(toSlug("Mérida")).toBe("merida");
    expect(toSlug("Táchira")).toBe("tachira");
  });

  it("collapses non-alphanumeric runs into single dash", () => {
    expect(toSlug("Delta  Amacuro!!")).toBe("delta-amacuro");
  });

  it("trims leading and trailing dashes", () => {
    expect(toSlug("  --hola--  ")).toBe("hola");
  });

  it("handles ñ correctly", () => {
    expect(toSlug("Cataluña")).toBe("cataluna");
  });
});

describe("matchesSlug", () => {
  it("matches accented name to its slug", () => {
    expect(matchesSlug("Anzoátegui", "anzoategui")).toBe(true);
    expect(matchesSlug("Mérida", "merida")).toBe(true);
  });

  it("case-insensitive match on slug side", () => {
    expect(matchesSlug("Zulia", "ZULIA")).toBe(true);
  });

  it("rejects non-matching name", () => {
    expect(matchesSlug("Zulia", "miranda")).toBe(false);
  });
});
