import { devices, expect, test } from "@playwright/test";

test.use({ ...devices["Pixel 5"] });

test("desktop nav hidden, hamburger visible on mobile", async ({ page }) => {
  await page.goto("/");
  // Desktop nav links should be hidden via md:flex on small screens.
  const desktopNav = page.locator("header nav.hidden");
  await expect(desktopNav).toBeHidden();
  // Hamburger button visible.
  const hamburger = page.getByRole("button", { name: "Abrir menú" });
  await expect(hamburger).toBeVisible();
});

test("hamburger opens menu and navigates", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  const link = page.getByRole("link", { name: "Indicadores" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/indicadores$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /Indicadores/i,
  );
});

test("dashboard demografia renders on mobile (stacked layout)", async ({
  page,
}) => {
  await page.goto("/dashboards/demografia");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /Demografía/i,
  );
  // Filter selector accessible.
  const select = page.locator("select").first();
  await expect(select).toBeVisible();
});
