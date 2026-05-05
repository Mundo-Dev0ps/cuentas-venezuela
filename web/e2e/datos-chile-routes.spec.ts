import { test, expect } from '@playwright/test';

test('datos-chile dashboards reachable under /datos-chile', async ({ page }) => {
  await page.goto('/datos-chile');
  await expect(page).toHaveURL(/\/datos-chile$/);
  await expect(page.locator('h1, h2').first()).toBeVisible();
});

test('datos-chile fuentes index loads', async ({ page }) => {
  await page.goto('/datos-chile/fuentes');
  await expect(page).toHaveURL(/\/datos-chile\/fuentes$/);
});

test('datos-chile dashboards demografia loads', async ({ page }) => {
  await page.goto('/datos-chile/dashboards/demografia');
  await expect(page).toHaveURL(/\/datos-chile\/dashboards\/demografia$/);
});
