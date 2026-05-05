import { expect, test } from "@playwright/test";

const PAGES = [
  { path: "/", heading: /Migración venezolana en Chile/i },
  { path: "/fuentes", heading: /Fuentes oficiales/i },
  { path: "/fuentes/sermig", heading: /Servicio Nacional de Migraciones/i },
  { path: "/indicadores", heading: /Indicadores/i },
  { path: "/dashboards", heading: /Dashboards/i },
  { path: "/dashboards/demografia", heading: /Demografía/i },
  { path: "/dashboards/pensiones", heading: /Pensiones/i },
  { path: "/dashboards/tributario", heading: /Aporte tributario/i },
  { path: "/dashboards/comparativa", heading: /Comparativa por nacionalidad/i },
  { path: "/metodologia", heading: /Metodología/i },
];

for (const { path, heading } of PAGES) {
  test(`page ${path} responds and renders heading`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      heading,
    );
  });
}

test("nav links work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Fuentes" }).first().click();
  await expect(page).toHaveURL(/\/fuentes$/);
});

test("demografia year filter changes view", async ({ page }) => {
  await page.goto("/dashboards/demografia");
  const year = page.locator("select").first();
  await year.waitFor({ state: "visible", timeout: 10_000 });
  await year.selectOption("2024");
  await expect(page.getByText(/Stock legal 2024/)).toBeVisible();
});

test("demografia URL params seed filters and reflect changes", async ({
  page,
}) => {
  // Load with prefilled year + exclude.
  await page.goto("/dashboards/demografia?year=2022&exclude=CL-RM");
  await expect(page.getByText("Stock legal 2022")).toBeVisible();
  await expect(page.getByText(/excluyendo 1 región/)).toBeVisible();
  // The Metropolitana pill should be in excluded (inactive) state.
  const metro = page.getByRole("button", { name: "Metropolitana" });
  await expect(metro).toHaveClass(/border-neutral-300/);

  // Change year via select; URL should update.
  await page.locator("select").first().selectOption("2023");
  await expect(page).toHaveURL(/year=2023/);
});

test("demografia share button copies current URL", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/dashboards/demografia?year=2024");
  await page.getByRole("button", { name: "Copiar enlace" }).click();
  await expect(page.getByText("Copiado")).toBeVisible();
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toContain("year=2024");
});
