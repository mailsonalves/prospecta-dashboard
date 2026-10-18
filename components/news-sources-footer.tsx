import { ChartLine, Globe, Landmark, Lightbulb, Microscope, Newspaper, Pickaxe, Users, type LucideIcon } from "lucide-react";
import { sourceGroups, type CatalogSourceLink, type SourceGroupIcon } from "@/lib/news-source-groups";

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

export function NewsSourcesFooter({ sources }: { sources: CatalogSourceLink[] }) {
  return (
    <section className="sources-footer" aria-label="Catálogo de fontes">
      <div className="catalog-cta">
        <div>
          <h2>Catálogo de fontes</h2>
          <p>Grupos, ícones, objetivos e categorias de cada veículo.</p>
        </div>
        <a className="catalog-cta-button" href="/radar/fontes">Abrir catálogo de fontes</a>
      </div>
      <details className="sources-disclosure">
        <summary>Mostrar {sources.length} fontes</summary>
      <div className="source-groups">
        {sourceGroups.map((group) => {
          const items = sources.filter((source) => source.group === group.slug);
          const Icon = groupIcons[group.icon];
          return (
            <article key={group.slug}>
              <h3 style={{ color: group.color }}><Icon size={16} aria-hidden="true" />{group.label}</h3>
              <ul>
                {items.map((source) => (
                  <li key={source.slug}>
                    <a href={source.siteUrl} target="_blank" rel="noopener noreferrer">{source.name}</a>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      </details>
    </section>
  );
}
