import { devices, expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });
test.use({ ...devices["Pixel 5"] });

test("mapa loads on mobile viewport with topbar visible", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".integration-topbar")).toBeVisible({
    timeout: 15000,
  });
});

test("topbar nav links present on small screens", async ({ page }) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".integration-topbar")).toBeVisible({
    timeout: 15000,
  });
  // All 3 nav links remain reachable even on Pixel 5 (393px).
  await expect(page.locator(".topbar-link")).toHaveCount(3);
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
