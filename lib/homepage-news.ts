import { previewText } from "@/lib/news-archive";
import { approvedNewsSources } from "@/lib/news-sources";
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
      return `<a class="blog-card blog-card-news" href="/radar/${escapeHtml(item.id)}">
        <div class="blog-card-head"><span class="blog-src">${escapeHtml(item.source)}</span><span class="blog-ref">${escapeHtml(formatDate(item.publishedAt))}</span></div>
        <h3 class="blog-card-title">${escapeHtml(item.title)}</h3>
        <p class="sector-preview">${escapeHtml(previewText(item.summary, 140))}</p>
        ${demo}
        <div class="blog-card-more">Ler resumo →</div>
      </a>`;
    })
    .join("");
}

export function renderNewsSourcesFooter() {
  const items = approvedNewsSources.map((source) => `<li><a href="${escapeHtml(source.siteUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.name)}</a></li>`).join("");
  return `<aside class="sources-footer" aria-label="Fontes de notícias"><details><summary>Ver todas as fontes</summary><p>Estes são os veículos acompanhados pelo Prospecta. O clique abre o site da fonte.</p><ul>${items}</ul></details></aside>`;
}

export function applyHomepageNews(markup: string, items: NewsItem[]) {
  const source = markup.replaceAll("\r\n", "\n");
  const marker = `<p class="section-lead">Acompanhe o que acontece no mundo e como isso se conecta à pesquisa do Prospecta 4.0.</p>`;
  const cards = renderRecentNewsCards(items);
  const injected = `${marker}
      <div class="blog-grid reveal" id="noticias-recentes">${cards}</div>
      <p class="section-lead sector-note">As mais recentes abrem o resumo dentro do Prospecta. No modo demonstração, os textos são simulados e não são matérias publicadas.</p>`;
  const withCards = source.includes(marker) ? source.replace(marker, injected) : source;
  return withCards.replace(
    `<div class="blog-ver-link reveal" style="animation-delay:0.2s">
        <a href="/blog" class="blog-ver-btn blog-ver-btn-news">Ver blog completo →</a>
      </div>`,
    `<div class="blog-ver-link reveal" style="animation-delay:0.2s;gap:10px;flex-wrap:wrap">
        <a href="/blog" class="blog-ver-btn">Conteúdo editorial →</a>
        <a href="/radar" class="blog-ver-btn blog-ver-btn-news">Ver blog completo →</a>
      </div>
      ${renderNewsSourcesFooter()}`
  );
}
