export interface ApprovedNewsSource {
  name: string;
  siteUrl: string;
  domain: string;
}

/** Fontes aprovadas para o acervo. O filtro exibe só as que tiverem notícias. */
export const approvedNewsSources: ApprovedNewsSource[] = [
  { name: "Brasil Mineral", siteUrl: "https://brasilmineral.com.br", domain: "brasilmineral.com.br" },
  { name: "Notícias de Mineração", siteUrl: "https://noticiasdemineracao.com", domain: "noticiasdemineracao.com" },
  { name: "IBRAM", siteUrl: "https://ibram.org.br", domain: "ibram.org.br" },
  { name: "Revista Minérios", siteUrl: "https://revistaminerios.com.br", domain: "revistaminerios.com.br" },
  { name: "epbr", siteUrl: "https://epbr.com.br", domain: "epbr.com.br" },
  { name: "Movimento Econômico", siteUrl: "https://movimentoeconomico.com.br", domain: "movimentoeconomico.com.br" },
  { name: "In the Mine", siteUrl: "https://inthemine.com.br", domain: "inthemine.com.br" },
  { name: "Bahia Econômica", siteUrl: "https://bahiaeconomica.com.br", domain: "bahiaeconomica.com.br" },
  { name: "A Tarde", siteUrl: "https://atarde.com.br", domain: "atarde.com.br" },
  { name: "Correio", siteUrl: "https://correio24horas.com.br", domain: "correio24horas.com.br" },
  { name: "Tribuna da Bahia", siteUrl: "https://trbn.com.br", domain: "trbn.com.br" },
  { name: "Bahia Notícias", siteUrl: "https://bahianoticias.com.br", domain: "bahianoticias.com.br" },
  { name: "Alô Alô Bahia", siteUrl: "https://aloalobahia.com", domain: "aloalobahia.com" },
  { name: "CBPM", siteUrl: "https://cbpm.ba.gov.br", domain: "cbpm.ba.gov.br" },
  { name: "Governo da Bahia", siteUrl: "https://ba.gov.br", domain: "ba.gov.br" },
  { name: "Governo Federal", siteUrl: "https://gov.br", domain: "gov.br" },
  { name: "SGB", siteUrl: "https://sgb.gov.br", domain: "sgb.gov.br" },
  { name: "BNDES", siteUrl: "https://bndes.gov.br", domain: "bndes.gov.br" },
  { name: "Finep", siteUrl: "https://finep.gov.br", domain: "finep.gov.br" },
  { name: "G1", siteUrl: "https://g1.globo.com", domain: "g1.globo.com" },
  { name: "Valor Econômico", siteUrl: "https://valor.globo.com", domain: "valor.globo.com" },
  { name: "CNN Brasil", siteUrl: "https://cnnbrasil.com.br", domain: "cnnbrasil.com.br" },
  { name: "Folha de S.Paulo", siteUrl: "https://folha.uol.com.br", domain: "folha.uol.com.br" },
  { name: "Estadão", siteUrl: "https://estadao.com.br", domain: "estadao.com.br" },
  { name: "Exame", siteUrl: "https://exame.com", domain: "exame.com" },
  { name: "InfoMoney", siteUrl: "https://infomoney.com.br", domain: "infomoney.com.br" },
  { name: "Poder360", siteUrl: "https://poder360.com.br", domain: "poder360.com.br" }
];

export function sourceHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function isApprovedSource(sourceName: string, sourceUrl: string) {
  const host = sourceHost(sourceUrl);
  return approvedNewsSources.some((source) => source.name === sourceName || host === source.domain || host.endsWith(`.${source.domain}`));
}
