import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function RadarLoading() {
  return <><SiteHeader/><main className="radar-shell"><p className="radar-status" role="status">Carregando notícias…</p></main><SiteFooter/></>;
}
