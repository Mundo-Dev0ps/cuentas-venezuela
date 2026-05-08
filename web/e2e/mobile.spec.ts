import { devices, expect, test } from "@playwright/test";

test.use({ ...devices["Pixel 5"] });

test("hamburger menu reveals nav links on mobile", async ({ page }) => {
  await page.goto("/");
  const hamburger = page.getByRole("button", { name: /abrir menú/i });
  await expect(hamburger).toBeVisible();
  await hamburger.click();
  for (const label of ["Inicio", "Mapa del Olvido", "Datos Chile"]) {
    await expect(
      page.getByRole("navigation", { name: "mobile" }).getByRole("link", { name: label }),
    ).toBeVisible();
  }
});

test("nav link Datos Chile navigates from hamburger", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /abrir menú/i }).click();
  await page
    .getByRole("navigation", { name: "mobile" })
    .getByRole("link", { name: "Datos Chile" })
    .click();
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
