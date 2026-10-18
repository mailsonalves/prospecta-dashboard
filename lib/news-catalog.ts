import type { NewsCategory } from "./types.ts";

// Pure catalog logic shared by `scripts/news-catalog-sql.ts` (run directly by Node) and the tests:
// keep imports relative and type-only so Node's type stripping can execute this file.

export const newsCategories: NewsCategory[] = ["mercado", "tecnologia", "sustentabilidade", "politica", "exploracao"];
export const collectionMethods = ["rss", "scraping", "manual", "referencia"] as const;
export const sourceTypes = [
  "veiculo_especializado", "jornal_generalista", "jornal_economico", "jornal_regional", "agencia_noticias", "orgao_oficial",
  "instituicao_cientifica", "fomento", "organizacao_internacional", "think_tank", "consultoria_dados", "associacao_evento"
] as const;

export type CollectionMethod = (typeof collectionMethods)[number];
export type SourceType = (typeof sourceTypes)[number];

export interface NewsObjective { slug: string; label: string; description: string; originalNames: string[] }

export interface NewsSourceEntry {
  slug: string;
  name: string;
  siteUrl: string;
  feedUrl: string | null;
  collectionMethod: CollectionMethod;
  language: string;
  sourceType: SourceType;
  scope: string;
  reliability: number;
  priority: number;
  regionPriorityUf: string | null;
  regionPriority: number | null;
  categories: NewsCategory[];
  tableObjectives: string[];
  inferredObjectives: string[];
  origin: string[];
  bestUse: string;
}

export interface NewsCatalog { objectives: NewsObjective[]; sources: NewsSourceEntry[] }

export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = []; let cell = ""; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(cell); cell = ""; }
    else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.some((value) => value.trim()));
  if (!header) return [];
  return body.map((values, index) => {
    if (values.length !== header.length) throw new Error(`Linha ${index + 2}: ${values.length} colunas, esperado ${header.length}`);
    return Object.fromEntries(header.map((key, column) => [key, values[column].trim()]));
  });
}

const list = (value: string) => value.split("|").map((item) => item.trim()).filter(Boolean);

function level(value: string, field: string, errors: string[], slug: string) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 4) errors.push(`${slug}: ${field} deve ser inteiro de 1 a 4`);
  return parsed;
}

export function readCatalog(sourcesCsv: string, objectivesCsv: string): NewsCatalog {
  const errors: string[] = [];
  const objectives = parseCsv(objectivesCsv).map((row) => ({ slug: row.slug, label: row.rotulo, description: row.descricao, originalNames: list(row.nomes_originais) }));
  const objectiveSlugs = new Set(objectives.map((objective) => objective.slug));
  for (const objective of objectives) {
    if (!/^[a-z0-9_]+$/.test(objective.slug)) errors.push(`objetivo ${objective.slug}: slug inválido`);
    if (!objective.label) errors.push(`objetivo ${objective.slug}: rótulo vazio`);
  }
  if (objectiveSlugs.size !== objectives.length) errors.push("objetivos com slug repetido");

  const seen = new Set<string>();
  const sources = parseCsv(sourcesCsv).map((row): NewsSourceEntry => {
    const slug = row.slug;
    if (!/^[a-z0-9-]+$/.test(slug)) errors.push(`${slug}: slug inválido`);
    if (seen.has(slug)) errors.push(`${slug}: slug repetido`);
    seen.add(slug);
    for (const url of [row.site_url, row.feed_url].filter(Boolean)) {
      if (!url.startsWith("https://")) errors.push(`${slug}: URL sem https (${url})`);
    }
    const collectionMethod = row.metodo_coleta as CollectionMethod;
    if (!collectionMethods.includes(collectionMethod)) errors.push(`${slug}: metodo_coleta inválido (${row.metodo_coleta})`);
    if (collectionMethod === "rss" && !row.feed_url) errors.push(`${slug}: metodo_coleta rss exige feed_url`);
    const sourceType = row.tipo as SourceType;
    if (!sourceTypes.includes(sourceType)) errors.push(`${slug}: tipo inválido (${row.tipo})`);
    const categories = list(row.categorias) as NewsCategory[];
    if (!categories.length) errors.push(`${slug}: sem categoria`);
    for (const category of categories) if (!newsCategories.includes(category)) errors.push(`${slug}: categoria inválida (${category})`);
    const tableObjectives = list(row.objetivos_tabela);
    const inferredObjectives = list(row.objetivos_inferidos);
    if (!tableObjectives.length && !inferredObjectives.length) errors.push(`${slug}: sem objetivo`);
    for (const objective of [...tableObjectives, ...inferredObjectives]) {
      if (!objectiveSlugs.has(objective)) errors.push(`${slug}: objetivo desconhecido (${objective})`);
    }
    if (tableObjectives.some((objective) => inferredObjectives.includes(objective))) errors.push(`${slug}: objetivo em tabela e inferido ao mesmo tempo`);
    const regionPriorityUf = row.prioridade_regiao_uf || null;
    if (regionPriorityUf && !/^[A-Z]{2}$/.test(regionPriorityUf)) errors.push(`${slug}: UF inválida (${regionPriorityUf})`);
    if (Boolean(regionPriorityUf) !== Boolean(row.prioridade_regiao)) errors.push(`${slug}: prioridade_regiao exige UF e valor juntos`);
    return {
      slug, name: row.nome, siteUrl: row.site_url, feedUrl: row.feed_url || null, collectionMethod, language: row.idioma, sourceType,
      scope: row.escopo, reliability: level(row.confiabilidade, "confiabilidade", errors, slug), priority: level(row.prioridade, "prioridade", errors, slug),
      regionPriorityUf, regionPriority: row.prioridade_regiao ? level(row.prioridade_regiao, "prioridade_regiao", errors, slug) : null,
      categories, tableObjectives, inferredObjectives, origin: list(row.origem), bestUse: row.melhor_uso
    };
  });
  if (errors.length) throw new Error(`Catálogo de fontes inválido:\n- ${errors.join("\n- ")}`);
  return { objectives, sources };
}

const sql = (value: string | number | null) => value === null ? "null" : typeof value === "number" ? String(value) : `'${value.replace(/'/g, "''")}'`;
const sqlArray = (values: string[], type: string) => values.length ? `array[${values.map(sql).join(",")}]::${type}[]` : `'{}'::${type}[]`;

export function buildCatalogSql({ objectives, sources }: NewsCatalog) {
  const objectiveRows = objectives.map((o) => `(${[sql(o.slug), sql(o.label), sql(o.description), sqlArray(o.originalNames, "text")].join(",")})`);
  const sourceRows = sources.map((s) => `(${[
    sql(s.slug), sql(s.name), sql(s.siteUrl), sql(s.feedUrl), `${sql(s.collectionMethod)}::public.news_collection_method`, sql(s.language),
    sql(s.sourceType), sql(s.scope), s.reliability, s.priority, sql(s.regionPriorityUf), sql(s.regionPriority),
    sqlArray(s.categories, "public.news_category"), sqlArray(s.origin, "text"), sql(s.bestUse), "false"
  ].join(",")})`);
  const links = sources.flatMap((s) => [
    ...s.tableObjectives.map((objective) => `(${sql(s.slug)},${sql(objective)},'tabela')`),
    ...s.inferredObjectives.map((objective) => `(${sql(s.slug)},${sql(objective)},'inferida')`)
  ]);
  return `-- Gerado por \`npm run news:catalog-sql\` a partir de data/news_sources.csv e data/news_objectives.csv. Não editar à mão.
-- Fontes novas entram inativas; feed_url e active de fontes já existentes não são alterados.
begin;

insert into public.news_objectives(slug,label,description,original_names) values
${objectiveRows.join(",\n")}
on conflict(slug) do update set label=excluded.label, description=excluded.description, original_names=excluded.original_names;

insert into public.news_sources(slug,name,site_url,feed_url,collection_method,language,source_type,scope,reliability,priority,region_priority_uf,region_priority,categories,origin,best_use,active) values
${sourceRows.join(",\n")}
on conflict(slug) do update set name=excluded.name, site_url=excluded.site_url, feed_url=coalesce(public.news_sources.feed_url, excluded.feed_url),
  collection_method=case when public.news_sources.feed_url is null then excluded.collection_method else 'rss'::public.news_collection_method end,
  language=excluded.language, source_type=excluded.source_type, scope=excluded.scope, reliability=excluded.reliability, priority=excluded.priority,
  region_priority_uf=excluded.region_priority_uf, region_priority=excluded.region_priority, categories=excluded.categories, origin=excluded.origin, best_use=excluded.best_use;

delete from public.news_source_objectives where source_id in (select id from public.news_sources where slug in (${sources.map((s) => sql(s.slug)).join(",")}));
insert into public.news_source_objectives(source_id,objective_slug,classification_origin)
select s.id, v.objective_slug, v.classification_origin::public.news_classification_origin
from (values
${links.join(",\n")}
) as v(source_slug,objective_slug,classification_origin)
join public.news_sources s on s.slug=v.source_slug;

commit;
`;
}
