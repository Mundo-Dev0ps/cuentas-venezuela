import { devices, expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });
test.use({ ...devices["Pixel 5"] });

test("mapa loads on mobile viewport with topbar visible", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".integration-topbar")).toBeVisible({
    timeout: 15000,
  });
});

test("topbar uses short labels on small screens", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".integration-topbar")).toBeVisible({
    timeout: 15000,
  });
  // At Pixel 5 width (393), short labels are visible.
  const shortBack = page.locator(".topbar-back-short");
  const fullBack = page.locator(".topbar-back-full");
  await expect(shortBack).toBeVisible();
  await expect(fullBack).toBeHidden();
});

test("body has cv-integrated class to push content below topbar", async ({
  page,
}) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".integration-topbar")).toBeVisible({
    timeout: 15000,
  });
  await expect(page.locator("body.cv-integrated")).toHaveCount(1);
});
