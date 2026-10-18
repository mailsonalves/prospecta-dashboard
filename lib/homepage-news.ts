import { previewText } from "@/lib/news-archive";
import { sourceGroups, type CatalogSourceLink } from "@/lib/news-source-groups";
import type { NewsItem } from "@/lib/types";

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(value: string) {
  const time = Date.parse(value);
  if (Number.isNaN(time)) return "";
  return new Date(time).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function renderRecentNewsCards(items: NewsItem[], limit = 3) {
  return [...items]
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt))
    .slice(0, limit)
    .map((item) => {
      const demo = item.simulated ? `<div class="blog-card-tags"><span>Demonstração</span></div>` : "";
      const summaryHref = `/radar/${escapeHtml(item.id)}`;
      const rememberPlace = `onclick="try{sessionStorage.setItem('prospecta-home-return',String(window.scrollY))}catch(e){}"`;
      return `<div class="news-entry">
        <a class="blog-card blog-card-news" href="${summaryHref}" ${rememberPlace}>
        <div class="blog-card-head"><span class="news-mark" aria-hidden="true"></span><span class="blog-src">${escapeHtml(item.source)}</span><span class="blog-ref">${escapeHtml(formatDate(item.publishedAt))}</span></div>
        <h3 class="blog-card-title">${escapeHtml(item.title)}</h3>
        <p class="sector-preview">${escapeHtml(previewText(item.summary, 140))}</p>
        ${demo}
      </a>
        <div class="news-actions">
          <a class="news-summary" href="${summaryHref}" ${rememberPlace}>Abrir o resumo</a>
          <a class="news-direct" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Ler notícia original</a>
        </div>
      </div>`;
    })
    .join("");
}

export function renderNewsSourcesFooter(sources: CatalogSourceLink[]) {
  const groups = sourceGroups.map((group) => {
    const items = sources.filter((source) => source.group === group.slug).map((source) => `<li><a href="${escapeHtml(source.siteUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.name)}</a></li>`).join("");
    if (!items) return "";
    return `<section class="source-group"><h3>${escapeHtml(group.label)}</h3><ul>${items}</ul></section>`;
  }).join("");
  return `<aside class="sources-footer" aria-label="Catálogo de fontes"><div class="catalog-cta"><div><h2>Catálogo de fontes</h2><p>Grupos, ícones, objetivos e categorias de cada veículo. É a página do radar de fontes.</p></div><a class="catalog-cta-button" href="/radar/fontes">Abrir catálogo de fontes</a></div><details class="sources-disclosure"><summary>Mostrar ${sources.length} fontes</summary><div class="source-groups">${groups}</div></details></aside>`;
}

export function applyHomepageNews(markup: string, items: NewsItem[], sources: CatalogSourceLink[] = []) {
  const source = markup.replaceAll("\r\n", "\n");
  const marker = `<p class="section-lead">Acompanhe o que acontece no mundo e como isso se conecta à pesquisa do Prospecta 4.0.</p>`;
  const cards = renderRecentNewsCards(items);
  const injected = `${marker}
      <div class="blog-grid reveal" id="noticias-recentes">${cards}</div>
      <p class="section-lead sector-note">Abrir o resumo mostra o texto dentro do Prospecta. Ler notícia original abre a fonte em um clique. No modo demonstração, os textos são simulados e não são matérias publicadas.</p>`;
  const withCards = source.includes(marker) ? source.replace(marker, injected) : source;
  return withCards.replace(
    `<div class="blog-ver-link reveal" style="animation-delay:0.2s">
        <a href="/blog" class="blog-ver-btn blog-ver-btn-news">Ver blog completo →</a>
      </div>`,
    `<div class="blog-ver-link reveal news-routes" style="animation-delay:0.2s">
        <a href="/blog" class="blog-ver-btn">Publicações da equipe</a>
        <a href="/radar" class="blog-ver-btn blog-ver-btn-news">Ver acervo de notícias</a>
        <p class="news-routes-note">Publicações da equipe são textos do Prospecta. O acervo reúne notícias de outras fontes.</p>
      </div>
      ${renderNewsSourcesFooter(sources)}`
  );
}
