import { test, expect } from "@playwright/test";

test("/mapa-del-olvido renders with hero stats", async ({ page }) => {
  await page.goto("/mapa-del-olvido");
  await expect(page.getByTestId("hero-total")).toBeVisible();
  await expect(page.getByText(/obras totales/i).first()).toBeVisible();
});

test("/mapa-del-olvido shows filters panel", async ({ page }) => {
  await page.goto("/mapa-del-olvido");
  await expect(page.locator(".maplibregl-map")).toBeVisible({ timeout: 10000 });
  await expect(
    page.getByRole("heading", { name: "Filtros" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /limpiar filtros/i }),
  ).toBeVisible();
});

test("/mapa-del-olvido renders maplibre canvas", async ({ page }) => {
  await page.goto("/mapa-del-olvido");
  await expect(page.locator(".maplibregl-map")).toBeVisible({ timeout: 10000 });
});
