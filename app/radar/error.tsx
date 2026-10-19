"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function RadarError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  void error;
  return <><SiteHeader/><main className="radar-shell"><div className="radar-status"><h1>Não foi possível consultar as notícias.</h1><p>A busca no acervo falhou. Tente novamente em instantes.</p><button className="button" type="button" onClick={reset}>Tentar de novo</button></div></main><SiteFooter/></>;
}
