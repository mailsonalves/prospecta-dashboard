import { NextResponse } from "next/server";
import { getPublishedNews } from "@/lib/repository";

/**
 * Contrato lido pelo frontend. Cada item publicado em news_items_public chega como:
 * id, title (title_pt), summary (summary_pt), source (source_name), sourceUrl (source_url),
 * publishedAt, category, minerals, keywords, relevance.
 * O banco preserva o histórico: a coleta existente ignora source_url repetida e não apaga itens antigos.
 */
export async function GET() {
  const news = await getPublishedNews();
  return NextResponse.json(
    { data: news.items, origin: news.origin },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } }
  );
}
