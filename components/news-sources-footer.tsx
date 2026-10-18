import { approvedNewsSources } from "@/lib/news-sources";

export function NewsSourcesFooter() {
  return (
    <aside className="sources-footer" aria-label="Fontes de notícias">
      <details>
        <summary>Ver todas as fontes</summary>
        <p>Estes são os veículos acompanhados pelo Prospecta. O clique abre o site da fonte. O filtro do acervo continua mostrando apenas as fontes que já têm notícias.</p>
        <ul>
          {approvedNewsSources.map((source) => (
            <li key={source.domain}>
              <a href={source.siteUrl} target="_blank" rel="noopener noreferrer">{source.name}</a>
            </li>
          ))}
        </ul>
      </details>
    </aside>
  );
}
