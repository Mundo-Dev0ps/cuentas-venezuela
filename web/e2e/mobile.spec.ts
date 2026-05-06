import { devices, expect, test } from "@playwright/test";

test.use({ ...devices["Pixel 5"] });

test("nav links inline on mobile (no hamburger)", async ({ page }) => {
  await page.goto("/");
  const links = page.locator("header nav a");
  await expect(links).toHaveCount(3);
  for (const label of ["Inicio", "Mapa del Olvido", "Datos Chile"]) {
    await expect(
      page.locator("header nav").getByRole("link", { name: label }),
    ).toBeVisible();
  }
});

test("nav link Datos Chile navigates", async ({ page }) => {
  await page.goto("/");
  await page.locator("header nav").getByRole("link", { name: "Datos Chile" }).click();
  await expect(page).toHaveURL(/\/datos-chile$/);
});

test("dashboard demografia renders on mobile (stacked layout)", async ({
  page,
}) => {
  await page.goto("/datos-chile/dashboards/demografia");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /Demografía/i,
  );
  const select = page.locator("select").first();
  await expect(select).toBeVisible();
});
