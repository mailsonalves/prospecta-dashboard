import { expect, test } from "@playwright/test";

test("public experience is available", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /prospecta 4\.0/i })).toBeVisible();
  await page.getByRole("link", { name: /abrir dashboard completo/i }).click();
  await expect(page.getByText("GeoLab", { exact: true })).toBeVisible();
});

test("blog renders published content", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("heading", { name: /publicações & notícias/i })).toBeVisible();
  await expect(page.locator(".post-card").first()).toBeVisible();
});

test("news radar supports curated cards and filters", async ({ page }) => {
  await page.goto("/radar");
  await expect(page.getByRole("heading", { name: /radar prospecta/i })).toBeVisible();
  await expect(page.locator(".news-card").first()).toBeVisible();
  await page.getByPlaceholder(/busque mineral/i).fill("inteligência artificial");
  await expect(page.getByRole("heading", { name: /ia acelera/i })).toBeVisible();
  await page.getByRole("link", { name: /ia acelera/i }).click();
  await expect(page.getByRole("link", { name: /ler notícia original/i })).toHaveAttribute("target", "_blank");
});

test("homepage opens a simulated summary and the full archive", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /ver blog completo/i })).toHaveAttribute("href", "/radar");
  await page.getByRole("link", { name: /fosfato baiano/i }).click();
  await expect(page.getByText(/modo demonstração/i)).toBeVisible();
  await page.getByRole("link", { name: /voltar ao acervo/i }).click();
  await page.getByRole("button", { name: /filtros/i }).click();
  await page.getByRole("button", { name: /próxima/i }).click();
  await expect(page.getByText(/página 2 de 2/i).first()).toBeVisible();
  await page.getByLabel("Fonte").selectOption("Finep");
  await expect(page.getByRole("heading", { name: /fomento à pesquisa mineral/i })).toBeVisible();
  await page.getByLabel(/^de$/i).fill("2026-10-01");
  await expect(page.getByText(/nenhuma notícia corresponde aos filtros/i).first()).toBeVisible();
  await page.getByRole("button", { name: /limpar filtros/i }).click();
  await expect(page.getByRole("heading", { name: /fosfato baiano/i })).toBeVisible();
});
