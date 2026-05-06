import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("/mapa-del-olvido renders with mapa title", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle(/mapa del olvido/i);
});

test("/mapa-del-olvido boundary geojson reachable", async ({ request }) => {
  const r = await request.get("/mapa-del-olvido/data/venezuela.geojson");
  expect(r.ok()).toBe(true);
});

test("SiteHeader nav still visible on /mapa-del-olvido", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(page.locator("header")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /mapa del olvido/i }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /datos chile/i }).first(),
  ).toBeVisible();
});
