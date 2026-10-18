import type { DashboardData, ImageryPeriod, NewsItem, Occurrence, Post, Region } from "@/lib/types";

function demoNews(item: Omit<NewsItem, "simulated">): NewsItem {
  return { ...item, simulated: true };
}

export const seedNews: NewsItem[] = [
  demoNews({
    id: "demo-fosfato-bahia",
    title: "Fosfato baiano entra em pauta de pesquisa mineral",
    summary: "Texto simulado para demonstração da interface. Um resumo real condensaria o fato principal sobre fosfato, a fonte e a relação com a pesquisa geológica na Bahia.",
    source: "Bahia Econômica",
    sourceUrl: "https://bahiaeconomica.com.br",
    publishedAt: "2026-10-16T12:00:00.000Z",
    category: "exploracao",
    minerals: ["Fosfato"],
    keywords: ["fosfato", "Bahia", "pesquisa mineral"],
    relevance: 90
  }),
  demoNews({
    id: "demo-litio",
    title: "Lítio segue entre os minerais acompanhados pela pesquisa",
    summary: "Texto simulado para demonstração da interface. Quando houver matéria real, o resumo descreverá o contexto do lítio sem copiar a reportagem.",
    source: "Brasil Mineral",
    sourceUrl: "https://brasilmineral.com.br",
    publishedAt: "2026-10-12T12:00:00.000Z",
    category: "mercado",
    minerals: ["Lítio"],
    keywords: ["lítio", "minerais estratégicos", "mercado"],
    relevance: 88
  }),
  demoNews({
    id: "demo-cobre",
    title: "Cobre aparece em discussões sobre tecnologia mineral",
    summary: "Texto simulado para demonstração da interface. Serve para testar cards, ordenação e abertura do resumo dentro do Prospecta.",
    source: "Revista Minérios",
    sourceUrl: "https://revistaminerios.com.br",
    publishedAt: "2026-10-02T12:00:00.000Z",
    category: "tecnologia",
    minerals: ["Cobre"],
    keywords: ["cobre", "tecnologia mineral"],
    relevance: 84
  }),
  demoNews({
    id: "demo-niquel",
    title: "Níquel permanece no radar de minerais estratégicos",
    summary: "Texto simulado para demonstração da interface. Não representa uma publicação do IBRAM nem substitui o conteúdo original de uma fonte.",
    source: "IBRAM",
    sourceUrl: "https://ibram.org.br",
    publishedAt: "2026-09-18T12:00:00.000Z",
    category: "politica",
    minerals: ["Níquel"],
    keywords: ["níquel", "minerais estratégicos"],
    relevance: 83
  }),
  demoNews({
    id: "demo-terras-raras-sgb",
    title: "Terras-raras seguem como tema de mapeamento geológico",
    summary: "Texto simulado para demonstração da interface. O acervo real deve guardar o resumo da IA e o endereço da matéria, sem apagar itens antigos.",
    source: "SGB",
    sourceUrl: "https://sgb.gov.br",
    publishedAt: "2026-09-02T12:00:00.000Z",
    category: "exploracao",
    minerals: ["Terras-raras"],
    keywords: ["terras-raras", "mapeamento", "geologia"],
    relevance: 92
  }),
  demoNews({
    id: "demo-valor-politica",
    title: "Política mineral entra no noticiário econômico",
    summary: "Texto simulado para demonstração da interface. O link externo abre o site da fonte cadastrada, não uma matéria específica inventada.",
    source: "Valor Econômico",
    sourceUrl: "https://valor.globo.com",
    publishedAt: "2026-08-20T12:00:00.000Z",
    category: "politica",
    minerals: ["Terras-raras", "Lítio"],
    keywords: ["política mineral", "economia"],
    relevance: 80
  }),
  demoNews({
    id: "demo-critical-minerals",
    title: "Minerais críticos ganham espaço nas estratégias de transição energética",
    summary: "Texto simulado para demonstração da interface. Novos investimentos aproximam pesquisa geológica, cadeias de suprimento e tecnologias de baixo carbono.",
    source: "Exame",
    sourceUrl: "https://exame.com",
    publishedAt: "2026-08-08T12:00:00.000Z",
    category: "mercado",
    minerals: ["Terras-raras", "Níquel", "Cobre"],
    keywords: ["transição energética", "minerais críticos", "cadeia de suprimento"],
    relevance: 94
  }),
  demoNews({
    id: "demo-ai-exploration",
    title: "IA acelera a seleção de alvos na exploração mineral",
    summary: "Texto simulado para demonstração da interface. Modelos que combinam dados geológicos e imagens de satélite ilustram o tema de inteligência artificial na exploração mineral.",
    source: "Notícias de Mineração",
    sourceUrl: "https://noticiasdemineracao.com",
    publishedAt: "2026-08-06T12:00:00.000Z",
    category: "tecnologia",
    minerals: ["Cobre"],
    keywords: ["inteligência artificial", "exploração mineral", "sensoriamento remoto"],
    relevance: 91
  }),
  demoNews({
    id: "demo-water-mining",
    title: "Gestão hídrica passa a orientar novos projetos de mineração",
    summary: "Texto simulado para demonstração da interface. O exemplo trata de monitoramento ambiental e licenciamento, sem apresentar uma reportagem real.",
    source: "epbr",
    sourceUrl: "https://epbr.com.br",
    publishedAt: "2026-08-03T12:00:00.000Z",
    category: "sustentabilidade",
    minerals: ["Fosfato"],
    keywords: ["água", "monitoramento ambiental", "licenciamento"],
    relevance: 86
  }),
  demoNews({
    id: "demo-cbpm",
    title: "Pesquisa geológica na Bahia continua como eixo do projeto",
    summary: "Texto simulado para demonstração da interface. Permite testar o filtro por fonte institucional e o intervalo de datas mais antigo.",
    source: "CBPM",
    sourceUrl: "https://cbpm.ba.gov.br",
    publishedAt: "2026-07-15T12:00:00.000Z",
    category: "exploracao",
    minerals: ["Fosfato", "Terras-raras"],
    keywords: ["Bahia", "pesquisa geológica", "CBPM"],
    relevance: 87
  }),
  demoNews({
    id: "demo-finep",
    title: "Fomento à pesquisa mineral aparece como tema de demonstração",
    summary: "Texto simulado para demonstração da interface. Quando a coleta programada estiver ativa, este espaço receberá o resumo persistido no banco.",
    source: "Finep",
    sourceUrl: "https://finep.gov.br",
    publishedAt: "2026-06-20T12:00:00.000Z",
    category: "tecnologia",
    minerals: ["Terras-raras"],
    keywords: ["fomento", "pesquisa", "Finep"],
    relevance: 79
  }),
  demoNews({
    id: "demo-g1-contexto",
    title: "Imprensa nacional entra no conjunto de fontes acompanhadas",
    summary: "Texto simulado para demonstração da interface. A presença do item antigo mostra que o acervo não descarta notícias quando chegam registros mais novos.",
    source: "G1",
    sourceUrl: "https://g1.globo.com",
    publishedAt: "2026-05-12T12:00:00.000Z",
    category: "mercado",
    minerals: ["Terras-raras", "Lítio", "Cobre", "Níquel", "Fosfato"],
    keywords: ["imprensa", "minerais críticos", "acervo"],
    relevance: 77
  })
];

export const seedPosts: Post[] = [
  {
    id: "lula-trump-minerais-2026",
    slug: "lula-trump-minerais-2026",
    type: "noticia",
    status: "published",
    publishedAt: "2026-05-07T12:00:00.000Z",
    source: "G1 · Globo",
    reference: "07 Mai 2026",
    title: "Lula e Trump discutem potencial brasileiro em terras raras e minerais críticos",
    excerpt: "O potencial brasileiro em minerais críticos entrou no centro da agenda econômica e geopolítica global.",
    body: "O Brasil pretende ampliar o conhecimento sobre o próprio território e avançar na exploração de minerais críticos de forma planejada. O Prospecta 4.0 contribui para esse objetivo ao integrar ciência de dados, sensoriamento remoto e conhecimento geológico.",
    tags: ["Terras-raras", "Política mineral", "Brasil"],
    featured: true
  },
  {
    id: "prospecta-antecipa-demanda",
    slug: "prospecta-antecipa-demanda",
    type: "noticia",
    status: "published",
    publishedAt: "2026-04-20T12:00:00.000Z",
    source: "Prospecta 4.0",
    title: "A pesquisa que antecipa o que o mundo vai precisar",
    excerpt: "IA e geotecnologias ajudam a mapear o potencial mineral da Bahia antes que a demanda chegue.",
    body: "Enquanto governos negociam acesso a minerais críticos e estratégicos, o Prospecta 4.0 mapeia e modela o potencial mineral da Bahia com inteligência artificial e geotecnologias.",
    tags: ["Prospecta 4.0", "Bahia", "IA & Geotecnologias"],
    featured: true
  },
  {
    id: "fosfogenese-proterozoica-2025",
    slug: "fosfogenese-proterozoica-2025",
    type: "publicacao",
    status: "published",
    publishedAt: "2025-11-15T12:00:00.000Z",
    source: "XII SimeXmin · 2025",
    reference: "AT1-01-189",
    title: "Fosfogênese Proterozoica do Cráton do São Francisco",
    excerpt: "Conexões com eventos globais e implicações exploratórias para depósitos fosforíticos na Bahia.",
    body: "A pesquisa revisa as condições paleoambientais das mineralizações de fosfato no Cráton do São Francisco e conecta eventos glaciais e biogeoquímicos a janelas de formação de depósitos fosforíticos.",
    authors: "Ribeiro, T.S. · Franca-Rocha, W.S. · Oliveira, L.R. · Santana, A.V.A. · Misi, A.",
    tags: ["Fosfato", "Cráton do São Francisco", "Bahia"]
  }
];

export const seedRegions: Region[] = [
  { id: "bahia", slug: "all", name: "Bahia", center: [-41.8, -12.5], zoom: 6, areaKm2: 4842, description: "Área integrada de pesquisa do Prospecta 4.0." },
  { id: "irece", slug: "irece", name: "Bacia de Irecê", center: [-41.85, -11.3], zoom: 8, areaKm2: 1240, description: "Formação carbonática com potencial para fosfato sedimentar." },
  { id: "chapada", slug: "chapada", name: "Chapada Diamantina", center: [-41.5, -12.5], zoom: 8, areaKm2: 1580, description: "Ocorrências de ETR associadas a carbonatitos e rochas alcalinas." },
  { id: "caetite", slug: "caetite", name: "Caetité", center: [-42.48, -14.07], zoom: 9, areaKm2: 680, description: "Formação Lagoa Real com mineralização uranífera." },
  { id: "brumado", slug: "brumado", name: "Brumado", center: [-41.66, -14.2], zoom: 9, areaKm2: 520, description: "Depósito de magnesita metamórfica de classe mundial." },
  { id: "jacobina", slug: "jacobina", name: "Jacobina", center: [-40.52, -11.18], zoom: 9, areaKm2: 440, description: "Complexo máfico-ultramáfico com potencial para cromo e platinoides." },
  { id: "serrinha", slug: "serrinha", name: "Serrinha", center: [-39.0, -11.66], zoom: 9, areaKm2: 382, description: "Granitoides e ortognaisses com anomalias de ETR." }
];

export const seedOccurrences: Occurrence[] = [
  { id: "irece", regionSlug: "irece", name: "Bacia de Irecê", coordinates: [-41.85, -11.3], category: "estrategico", mineral: "Fosfato", status: "Em estudo", description: "Principal alvo de fosfato sedimentar." },
  { id: "chapada", regionSlug: "chapada", name: "Chapada Diamantina", coordinates: [-41.5, -12.5], category: "critico", mineral: "Terras-raras", status: "Identificado", description: "ETR associadas a carbonatitos e rochas alcalinas." },
  { id: "caetite", regionSlug: "caetite", name: "Caetité", coordinates: [-42.48, -14.07], category: "estrategico", mineral: "Urânio", status: "Mapeado", description: "Mineralização uranífera de expressão regional." },
  { id: "brumado", regionSlug: "brumado", name: "Brumado", coordinates: [-41.66, -14.2], category: "critico", mineral: "Magnesita", status: "Mapeado", description: "Depósito de magnesita metamórfica." },
  { id: "jacobina", regionSlug: "jacobina", name: "Jacobina", coordinates: [-40.52, -11.18], category: "estrategico", mineral: "Cromo", status: "Identificado", description: "Potencial para cromo e platinoides." },
  { id: "serrinha", regionSlug: "serrinha", name: "Serrinha", coordinates: [-39, -11.66], category: "critico", mineral: "Terras-raras", status: "Em estudo", description: "Anomalias de elementos terras-raras." },
  { id: "hub", regionSlug: null, name: "LAPIG · UEFS", coordinates: [-38.96, -12.26], category: "hub", mineral: "Hub", status: "Ativo", description: "Base de pesquisa do Prospecta 4.0." }
];

const qualities = [84, 57, 79, 52, 76, 61, 83, 74, 49, 80, 55, 77, 63, 85, 48, 78, 60, 82, 64, 87, 59, 84, 62, 81];
const labels = ["2000-2008", "2009_1", "2009_2", "2010_1", "2010_2", "2011_1", "2011_2", "2012_2", "2013_1", "2013_2", "2014_1", "2014_2", "2015_1", "2015_2", "2016_1", "2016_2", "2017_1", "2017_2", "2018_1", "2018_2", "2019_1", "2019_2", "2020_1", "2020_2"];

export const seedPeriods: ImageryPeriod[] = labels.map((label, index) => ({
  id: label,
  label,
  startsAt: label === "2000-2008" ? "2000-01-01" : `${label.slice(0, 4)}-${label.endsWith("_1") ? "01" : "07"}-01`,
  endsAt: label === "2000-2008" ? "2008-12-31" : `${label.slice(0, 4)}-${label.endsWith("_1") ? "06-30" : "12-31"}`,
  quality: qualities[index],
  cloudCoverage: Math.max(2, 35 - Math.round(qualities[index] / 3)),
  sceneCount: Math.max(6, Math.round(qualities[index] / 7)),
  tileUrl: `${process.env.NEXT_PUBLIC_GEO_TILES_URL ?? "https://storage.googleapis.com/prospecta40-tiles"}/${label}/{z}/{x}/{y}.png`,
  status: "ready"
}));

export const seedDashboard: DashboardData = {
  regions: seedRegions,
  occurrences: seedOccurrences,
  periods: seedPeriods,
  generatedAt: new Date().toISOString(),
  source: "seed"
};
