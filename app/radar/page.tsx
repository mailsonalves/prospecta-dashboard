import type { Metadata } from "next";
import { NewsRadar } from "@/components/news-radar";
import { NewsSourcesFooter } from "@/components/news-sources-footer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { loadNewsCatalog } from "@/lib/load-news-catalog";
import { getPublishedNews } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Radar Mineral",
  description: "Acervo de notícias do setor mineral, com resumos e link para a matéria original."
};

export default async function RadarPage() {
  const [news, catalog] = await Promise.all([getPublishedNews(), loadNewsCatalog()]);
  const sources = new Set(news.items.map((item) => item.source)).size;
  const keywords = new Set(news.items.flatMap((item) => item.keywords)).size;
  return <><SiteHeader/><main className="radar-shell"><header className="radar-hero"><div className="eyebrow">Inteligência mineral · atualização programada</div><h1>Radar<br/><em>Prospecta.</em></h1><p>Notícias do setor mineral reunidas no acervo do Prospecta. A página inicial mostra as mais recentes; aqui dá para buscar, filtrar e percorrer o histórico. O resumo abre neste site e a matéria original continua na fonte.</p><a className="catalog-cta-button" href="/radar/fontes">Abrir catálogo de fontes</a><div className="radar-stats"><span><b>{news.items.length}</b> notícias no acervo</span><span><b>{keywords}</b> sinais monitorados</span><span><b>{sources}</b> fontes com itens</span></div></header><NewsRadar items={news.items} demonstration={news.origin === "demonstration"} catalog={catalog}/></main><NewsSourcesFooter sources={catalog}/><SiteFooter/></>;
}
