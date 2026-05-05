import { test, expect } from '@playwright/test';

test('header shows both product links on every route', async ({ page }) => {
  for (const path of ['/datos-chile', '/datos-chile/fuentes']) {
    await page.goto(path);
    await expect(page.getByRole('link', { name: /datos chile/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /mapa del olvido/i }).first()).toBeVisible();
  }
});

test('footer shows both product links', async ({ page }) => {
  await page.goto('/datos-chile');
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: /datos chile/i })).toBeVisible();
  await expect(footer.getByRole('link', { name: /mapa del olvido/i })).toBeVisible();
});
