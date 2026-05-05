import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("/mapa-del-olvido serves the original Vite mapa via rewrite", async ({
  page,
}) => {
  await page.goto("/mapa-del-olvido", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle(/mapa del olvido/i);
});

test("/mapa-del-olvido vite client asset reachable", async ({ request }) => {
  const r = await request.get("/mapa-del-olvido/@vite/client");
  expect(r.ok()).toBe(true);
});

test("/mapa-del-olvido boundary geojson reachable", async ({ request }) => {
  const r = await request.get("/mapa-del-olvido/data/venezuela.geojson");
  expect(r.ok()).toBe(true);
});
