import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("integration topbar visible on mapa", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".integration-topbar")).toBeVisible({
    timeout: 20000,
  });
});

test("topbar back link href points to /", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  const back = page.getByRole("link", { name: /cuentas-venezuela/i }).first();
  await expect(back).toHaveAttribute("href", "/");
});
