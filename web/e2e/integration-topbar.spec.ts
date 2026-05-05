import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("integration topbar visible on mapa", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("link", { name: /cuentas-venezuela/i }).first(),
  ).toBeAttached({ timeout: 15000 });
  await expect(
    page.getByRole("link", { name: /datos chile/i }).first(),
  ).toBeAttached();
});

test("topbar back link href points to /", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  const back = page.getByRole("link", { name: /cuentas-venezuela/i }).first();
  await expect(back).toHaveAttribute("href", "/");
});
