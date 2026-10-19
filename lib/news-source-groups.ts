import type { SourceType } from "@/lib/news-catalog";
import { sourceHost } from "@/lib/news-sources";

export const sourceGroups = [
  { slug: "midia", label: "Mídia especializada", icon: "pickaxe", color: "#5b8def", types: ["veiculo_especializado"] },
  { slug: "imprensa", label: "Imprensa e jornais", icon: "newspaper", color: "#e0703a", types: ["jornal_generalista", "jornal_economico", "jornal_regional", "agencia_noticias"] },
  { slug: "governo", label: "Governo e regulação", icon: "landmark", color: "#3fb984", types: ["orgao_oficial", "fomento"] },
  { slug: "ciencia", label: "Ciência e geologia", icon: "microscope", color: "#d9a520", types: ["instituicao_cientifica"] },
  { slug: "internacional", label: "Organizações internacionais", icon: "globe", color: "#e0567f", types: ["organizacao_internacional"] },
  { slug: "dados", label: "Dados e consultorias", icon: "chart", color: "#4caf50", types: ["consultoria_dados"] },
  { slug: "think_tank", label: "Think tanks", icon: "lightbulb", color: "#8b8bf5", types: ["think_tank"] },
  { slug: "associacoes", label: "Associações e eventos", icon: "users", color: "#e06666", types: ["associacao_evento"] }
] as const;

export type SourceGroupSlug = (typeof sourceGroups)[number]["slug"];
export type SourceGroupIcon = (typeof sourceGroups)[number]["icon"];

export interface CatalogSourceLink {
  slug: string;
  name: string;
  siteUrl: string;
  group: SourceGroupSlug;
}

export function groupForSourceType(type: SourceType): SourceGroupSlug {
  switch (type) {
    case "veiculo_especializado":
      return "midia";
    case "jornal_generalista":
    case "jornal_economico":
    case "jornal_regional":
    case "agencia_noticias":
      return "imprensa";
    case "orgao_oficial":
    case "fomento":
      return "governo";
    case "instituicao_cientifica":
      return "ciencia";
    case "organizacao_internacional":
      return "internacional";
    case "consultoria_dados":
      return "dados";
    case "think_tank":
      return "think_tank";
    case "associacao_evento":
      return "associacoes";
    default: {
      const exhaustive: never = type;
      return exhaustive;
    }
  }
}

function fold(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("pt-BR");
}

export function catalogSourceForItem(item: { source: string; sourceUrl: string }, sources: CatalogSourceLink[]) {
  const name = fold(item.source);
  const host = sourceHost(item.sourceUrl);
  return sources.find((source) => {
    const catalogName = fold(source.name);
    const catalogHost = sourceHost(source.siteUrl);
    if (catalogName === name) return true;
    if (host && catalogHost && (host === catalogHost || host.endsWith(`.${catalogHost}`) || catalogHost.endsWith(`.${host}`))) return true;
    return catalogName.startsWith(`${name}/`) || catalogName.startsWith(`${name} `);
  });
}
