import { test, expect } from "@playwright/test";

test("/mapa-del-olvido renders with hero stats", async ({ page }) => {
  await page.goto("/mapa-del-olvido");
  await expect(page.getByText(/obras totales/i).first()).toBeVisible();
  await expect(page.getByText(/abandonadas/i).first()).toBeVisible();
});
