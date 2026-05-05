import { test, expect } from '@playwright/test';

test('landing page lists both products', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1').first()).toContainText(/cuentas[\s-]?venezuela/i);
  await expect(page.getByRole('link', { name: /mapa del olvido/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /datos chile/i }).first()).toBeVisible();
});

test('landing CTA navigates to mapa-del-olvido', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /explorar.*mapa|abrir mapa|ver mapa/i }).first().click();
  await expect(page).toHaveURL(/\/mapa-del-olvido$/);
});
