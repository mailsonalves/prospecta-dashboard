"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChartLine, ExternalLink, Globe, Landmark, Lightbulb, Microscope, Newspaper, Pickaxe, Search, Sparkles, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { NEWS_PAGE_SIZE, newsSourcesInUse, previewText, queryNewsArchive, type NewsSort } from "@/lib/news-archive";
import { catalogSourceForItem, sourceGroups, type CatalogSourceLink, type SourceGroupIcon, type SourceGroupSlug } from "@/lib/news-source-groups";
import type { NewsCategory, NewsItem } from "@/lib/types";

const groupIcons: Record<SourceGroupIcon, LucideIcon> = {
  pickaxe: Pickaxe,
  newspaper: Newspaper,
  landmark: Landmark,
  microscope: Microscope,
  globe: Globe,
  chart: ChartLine,
  lightbulb: Lightbulb,
  users: Users
};

const categoryLabels: Record<NewsCategory, string> = {
  mercado: "Mercado",
  tecnologia: "Tecnologia",
  sustentabilidade: "Sustentabilidade",
  politica: "Política mineral",
  exploracao: "Exploração"
};

function formatDate(value: string) {
  const time = Date.parse(value);
  if (Number.isNaN(time)) return "Data indisponível";
  return new Date(time).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function NewsRadar({ items, demonstration, catalog }: { items: NewsItem[]; demonstration: boolean; catalog: CatalogSourceLink[] }) {
  const [category, setCategory] = useState<NewsCategory | "todas">("todas");
  const [group, setGroup] = useState<SourceGroupSlug | "todos">("todos");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<NewsSort>("recent");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const groupedItems = useMemo(
    () => group === "todos" ? items : items.filter((item) => catalogSourceForItem(item, catalog)?.group === group),
    [catalog, group, items]
  );
  const sources = useMemo(() => newsSourcesInUse(groupedItems), [groupedItems]);
  const result = useMemo(
    () => queryNewsArchive(groupedItems, { query, source, from, to, sort, category, page, pageSize: NEWS_PAGE_SIZE }),
    [category, from, groupedItems, page, query, sort, source, to]
  );
  const terms = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((item) => item.keywords.forEach((term) => counts.set(term, (counts.get(term) ?? 0) + 1)));
    return [...counts].sort((left, right) => right[1] - left[1]).slice(0, 8);
  }, [items]);
  const filtersActive = Boolean(query || source || from || to || category !== "todas" || sort !== "recent" || group !== "todos");

  function resetPage() {
    setPage(1);
  }

  function clearFilters() {
    setQuery("");
    setSource("");
    setFrom("");
    setTo("");
    setSort("recent");
    setCategory("todas");
    setGroup("todos");
    setPage(1);
  }

  return <>
    <section className="radar-controls" aria-label="Filtros do acervo">
      <label className="radar-search"><Search size={17}/><span className="sr-only">Buscar notícias</span><input value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} placeholder="Busque mineral, tema ou tecnologia"/></label>
      <div className="source-group-filters" role="group" aria-label="Grupo da fonte">
        <button type="button" className={group === "todos" ? "active" : ""} onClick={() => { setGroup("todos"); resetPage(); }}>Todos os grupos</button>
        {sourceGroups.map((entry) => {
          const Icon = groupIcons[entry.icon];
          return <button type="button" className={group === entry.slug ? "active" : ""} key={entry.slug} onClick={() => { setGroup(entry.slug); setSource(""); resetPage(); }}><Icon size={14} aria-hidden="true" />{entry.label}</button>;
        })}
      </div>
      <button type="button" className="filter-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>{filtersOpen ? "Ocultar filtros" : filtersActive ? "Filtros ativos" : "Filtros"}</button>
      {filtersOpen && <div className="radar-filter-panel">
        <label className="radar-field">Fonte
          <select value={source} onChange={(event) => { setSource(event.target.value); resetPage(); }}>
            <option value="">Todas as fontes</option>
            {sources.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
        <label className="radar-field">De
          <input type="date" value={from} max={to || undefined} onChange={(event) => { setFrom(event.target.value); resetPage(); }}/>
        </label>
        <label className="radar-field">Até
          <input type="date" value={to} min={from || undefined} onChange={(event) => { setTo(event.target.value); resetPage(); }}/>
        </label>
        <label className="radar-field">Ordenação
          <select value={sort} onChange={(event) => { setSort(event.target.value as NewsSort); resetPage(); }}>
            <option value="recent">Mais recentes</option>
            <option value="oldest">Mais antigas</option>
          </select>
        </label>
        <div className="radar-filters">
          <button type="button" className={category === "todas" ? "active" : ""} onClick={() => { setCategory("todas"); resetPage(); }}>Tudo</button>
          {(Object.keys(categoryLabels) as NewsCategory[]).map((key) => <button type="button" className={category === key ? "active" : ""} onClick={() => { setCategory(key); resetPage(); }} key={key}>{categoryLabels[key]}</button>)}
          <button type="button" onClick={clearFilters} disabled={!filtersActive}>Limpar filtros</button>
        </div>
      </div>}
    </section>

    <section className="radar-section" aria-live="polite">
      <div className="radar-section-heading">
        <div>
          <span className="eyebrow"><Sparkles size={13}/> Curadoria por IA</span>
          <h2>Acervo completo</h2>
        </div>
      </div>
      {demonstration && <p className="demo-banner">Modo demonstração. Estes resumos são simulados para validar a interface e não são notícias publicadas. O link externo abre apenas o site da fonte cadastrada.</p>}
      <div className="archive-toolbar">
        <p>{items.length === 0 ? "Nenhuma notícia publicada ainda." : result.total === 0 ? "Nenhuma notícia corresponde aos filtros." : `${result.total} ${result.total === 1 ? "notícia" : "notícias"} · página ${result.page} de ${result.pageCount}`}</p>
      </div>
      {result.items.length ? <div className="news-archive">{result.items.map((item) => <article className="news-card archive-card" key={item.id}>
        <Link className="archive-card-link" href={`/radar/${item.id}`}>
          <div className="news-card-top"><span>{categoryLabels[item.category]}</span>{item.simulated ? <b>Demonstração</b> : <b>{item.relevance}% relevante</b>}</div>
          <div className="news-source">{item.source} · {formatDate(item.publishedAt)}</div>
          <h3>{item.title}</h3>
          <p>{previewText(item.summary)}</p>
        </Link>
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Ler notícia original <ExternalLink size={14}/></a>
      </article>)}</div> : <div className="radar-empty">{items.length === 0 ? "O acervo ainda não recebeu notícias. A coleta programada da equipe de backend passa a aparecer aqui sem um novo deploy." : "Nenhuma notícia corresponde aos filtros. Limpe ou combine outros critérios."}</div>}
      {result.pageCount > 1 && <nav className="pager" aria-label="Paginação do acervo">
        <button type="button" onClick={() => setPage(result.page - 1)} disabled={result.page <= 1}>Anterior</button>
        <span>Página {result.page} de {result.pageCount}</span>
        <button type="button" onClick={() => setPage(result.page + 1)} disabled={result.page >= result.pageCount}>Próxima</button>
      </nav>}
    </section>

    <section className="signals-panel"><div><span className="eyebrow"><TrendingUp size={13}/> Base de conhecimento</span><h2>Sinais em movimento</h2><p>Os termos recorrentes formam uma memória temática do setor e ajudam a revelar assuntos que ganham tração ao longo do tempo.</p></div><div className="term-cloud">{terms.map(([term, count], index) => <button key={term} type="button" style={{ fontSize: `${Math.max(0.82, 1.45 - index * .07)}rem` }} onClick={() => { setQuery(term); resetPage(); }}>{term}<sup>{count}</sup></button>)}</div></section>
  </>;
}
