import { describe, expect, it } from "vitest";
import { applyHomepageNews } from "@/lib/homepage-news";
import { queryNewsArchive } from "@/lib/news-archive";
import { approvedNewsSources } from "@/lib/news-sources";
import { catalogSourceForItem, type CatalogSourceLink } from "@/lib/news-source-groups";
import { seedNews } from "@/lib/seed";

const catalog: CatalogSourceLink[] = [
  { slug: "brasil-mineral", name: "Brasil Mineral", siteUrl: "https://brasilmineral.com.br", group: "midia" },
  { slug: "poder360", name: "Poder360", siteUrl: "https://www.poder360.com.br", group: "imprensa" },
  { slug: "ibram", name: "IBRAM", siteUrl: "https://ibram.org.br", group: "associacoes" },
  { slug: "sgb-cprm", name: "SGB/CPRM", siteUrl: "https://www.sgb.gov.br", group: "ciencia" },
  { slug: "finep", name: "Finep", siteUrl: "https://finep.gov.br", group: "governo" }
];

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
    const html = applyHomepageNews(homepage, seedNews, catalog);
    expect(html).toContain('href="/radar/demo-fosfato-bahia"');
    expect(html).toContain("Ver acervo de notícias");
    expect(html).toContain("Publicações da equipe");
    expect(html).toContain("Abrir catálogo de fontes");
    expect(html).toContain("Mostrar 5 fontes");
    expect(html).toContain('href="/radar" class="blog-ver-btn blog-ver-btn-news"');
    expect(html).toContain('data-id="news1"');
    expect(html).toContain('href="/blog"');
    expect(html).toContain("Demonstração");
    expect(html).toContain("Catálogo de fontes");
    expect(html).toContain("Imprensa e jornais");
    expect(html).toContain("Associações e eventos");
    expect(html).toContain("https://www.poder360.com.br");
    expect(html).toContain("Brasil Mineral");
    const fromWindows = applyHomepageNews(homepage.replaceAll("\n", "\r\n"), seedNews, catalog);
    expect(fromWindows).toContain("Catálogo de fontes");
  });

  it("liga a notícia ao grupo do catálogo do professor", () => {
    expect(catalogSourceForItem(seedNews.find((item) => item.source === "IBRAM")!, catalog)?.group).toBe("associacoes");
    expect(catalogSourceForItem(seedNews.find((item) => item.source === "SGB")!, catalog)?.group).toBe("ciencia");
    expect(catalogSourceForItem(seedNews.find((item) => item.source === "Finep")!, catalog)?.group).toBe("governo");
    expect(catalogSourceForItem({ source: "EPBR", sourceUrl: "https://epbr.com.br" }, catalog)).toBeUndefined();
    expect(catalogSourceForItem({ source: "Poder360", sourceUrl: "https://poder360.com.br" }, catalog)?.group).toBe("imprensa");
  });
});