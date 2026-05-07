import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

const ROUTES = [
  { path: "/mapa-del-olvido", check: /mapa del olvido/i },
  { path: "/mapa-del-olvido/sobre", check: /sobre el mapa/i },
  { path: "/mapa-del-olvido/metodologia", check: /metodolog/i },
  { path: "/mapa-del-olvido/reportar", check: /reportar/i },
];

for (const { path, check } of ROUTES) {
  test(`${path} renders successfully`, async ({ page }) => {
    const r = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(r?.status()).toBe(200);
    // Wait for client hydration to render content
    await expect(page.getByText(check).first()).toBeVisible({
      timeout: 15000,
    });
  });
}

test("/mapa-del-olvido/obra/hospital-maracaibo renders", async ({ page }) => {
  const r = await page.goto("/mapa-del-olvido/obra/hospital-maracaibo", {
    waitUntil: "domcontentloaded",
  });
  expect(r?.status()).toBe(200);
});

test("security headers present on /mapa-del-olvido", async ({ request }) => {
  const r = await request.get("/mapa-del-olvido");
  expect(r.headers()["x-content-type-options"]).toBe("nosniff");
  expect(r.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  expect(r.headers()["content-security-policy"]).toContain("default-src 'self'");
  expect(r.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
});
