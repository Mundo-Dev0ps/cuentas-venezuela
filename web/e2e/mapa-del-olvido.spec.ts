import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("/mapa-del-olvido renders with hero stats", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("hero-total")).toBeVisible({ timeout: 30000 });
  await expect(page.getByText(/Mapa del Olvido — Venezuela/i)).toBeVisible();
});

test("/mapa-del-olvido shows filters panel", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "Filtros" }),
  ).toBeVisible({ timeout: 30000 });
  await expect(
    page.getByRole("button", { name: /^limpiar$/i }),
  ).toBeVisible();
});

test("/mapa-del-olvido renders deckgl canvas", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#deckgl-overlay")).toBeAttached({ timeout: 30000 });
});
