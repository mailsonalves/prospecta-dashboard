import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { NewsSourcesFooter } from "@/components/news-sources-footer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { loadNewsCatalog } from "@/lib/load-news-catalog";
import { getNewsById, getPublishedNews } from "@/lib/repository";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const news = await getPublishedNews();
  return news.items.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { item } = await getNewsById((await params).id);
  return item ? { title: item.title, description: item.summary } : {};
}

export default async function NewsSummaryPage({ params }: Props) {
  const [{ item, origin }, catalog] = await Promise.all([getNewsById((await params).id), loadNewsCatalog()]);
  if (!item) notFound();
  const simulated = item.simulated || origin === "demonstration";
  const published = new Date(item.publishedAt).toLocaleDateString("pt-BR", { timeZone: "UTC" });

  return <><SiteHeader/><main className="article-shell">
    <Link className="text-link" href="/radar">← Voltar ao acervo</Link>
    <div className="article-meta" style={{ marginTop: 55 }}>{item.source} · {published}</div>
    <h1>{item.title}</h1>
    {simulated && <p className="demo-banner">Modo demonstração. Este resumo é simulado para validar a interface e não é uma notícia publicada. O botão abaixo abre o site da fonte cadastrada.</p>}
    <p className="lead">Resumo</p>
    <div className="article-body"><p>{item.summary}</p></div>
    {item.minerals.length > 0 && <div className="article-tags">{item.minerals.map((mineral) => <span className="tag" key={mineral}>{mineral}</span>)}</div>}
    <p className="summary-actions"><a className="button" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Ler notícia original <ExternalLink size={16}/></a></p>
  </main><NewsSourcesFooter sources={catalog}/><SiteFooter/></>;
}
