import { describe, expect, it } from "vitest";
import { applyHomepageNews } from "@/lib/homepage-news";
import { queryNewsArchive } from "@/lib/news-archive";
import { approvedNewsSources } from "@/lib/news-sources";
import { seedNews } from "@/lib/seed";

const homepage = `<section id="noticias"><p class="section-lead">Acompanhe o que acontece no mundo e como isso se conecta à pesquisa do Prospecta 4.0.</p>
      <div class="blog-grid blog-grid-2 reveal"><article class="blog-card blog-card-news" data-id="news1"></article></div>
      <div class="blog-ver-link reveal" style="animation-delay:0.2s">
        <a href="/blog" class="blog-ver-btn blog-ver-btn-news">Ver blog completo →</a>
      </div></section>`;

describe("acervo de notícias", () => {
  it("cadastra as 27 fontes aprovadas", () => {
    expect(approvedNewsSources).toHaveLength(27);
    expect(new Set(approvedNewsSources.map((source) => source.domain)).size).toBe(27);
  });

  it("busca, filtra, ordena e pagina sem apagar o histórico", () => {
    const original = seedNews.length;
    const byTerm = queryNewsArchive(seedNews, { query: "inteligência artificial" });
    expect(byTerm.items.map((item) => item.id)).toEqual(["demo-ai-exploration"]);

    const bySource = queryNewsArchive(seedNews, { source: "Finep" });
    expect(bySource.items.every((item) => item.source === "Finep")).toBe(true);

    const byDate = queryNewsArchive(seedNews, { from: "2026-09-01", to: "2026-10-16", sort: "oldest" });
    expect(byDate.items[0]?.publishedAt < byDate.items.at(-1)!.publishedAt).toBe(true);
    expect(byDate.items.every((item) => item.publishedAt >= "2026-09-01" && item.publishedAt <= "2026-10-17")).toBe(true);

    const combined = queryNewsArchive(seedNews, { query: "fosfato", source: "Bahia Econômica", from: "2026-10-01" });
    expect(combined.total).toBe(1);

    const first = queryNewsArchive(seedNews, { page: 1, pageSize: 4 });
    const second = queryNewsArchive(seedNews, { page: 2, pageSize: 4 });
    expect(first.items).toHaveLength(4);
    expect(second.items[0]?.id).not.toBe(first.items[0]?.id);
    expect(seedNews).toHaveLength(original);
  });

  it("coloca as recentes na home e leva o blog completo ao radar", () => {
    const html = applyHomepageNews(homepage, seedNews);
    expect(html).toContain('href="/radar/demo-fosfato-bahia"');
    expect(html).toContain("Ver blog completo");
    expect(html).toContain('href="/radar" class="blog-ver-btn blog-ver-btn-news"');
    expect(html).toContain('data-id="news1"');
    expect(html).toContain('href="/blog"');
    expect(html).toContain("Demonstração");
    expect(html).toContain("Ver todas as fontes");
    expect(html).toContain("https://poder360.com.br");
    expect(html).toContain("Brasil Mineral");
    const fromWindows = applyHomepageNews(homepage.replaceAll("\n", "\r\n"), seedNews);
    expect(fromWindows).toContain("Ver todas as fontes");
  });
});