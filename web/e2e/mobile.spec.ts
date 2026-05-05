import { devices, expect, test } from "@playwright/test";

test.use({ ...devices["Pixel 5"] });

test("desktop nav hidden, hamburger visible on mobile", async ({ page }) => {
  await page.goto("/");
  const desktopNav = page.locator("header nav.hidden");
  await expect(desktopNav).toBeHidden();
  const hamburger = page.getByRole("button", { name: "Abrir menú" });
  await expect(hamburger).toBeVisible();
});

test("hamburger opens menu and navigates", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  const mobileNav = page.locator("header nav").last();
  const link = mobileNav.getByRole("link", { name: /datos chile/i });
  await expect(link).toBeVisible();
  await link.click();
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
