import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildCatalogSql, parseCsv, readCatalog } from "@/lib/news-catalog";

const data = (name: string) => readFileSync(path.join(__dirname, "..", "data", name), "utf8");
const objectivesCsv = "slug,rotulo,descricao,nomes_originais\nnoticias_setor,Notícias do setor mineral,Cobertura diária,Notícias diárias do setor\n";
const header = "slug,nome,site_url,feed_url,metodo_coleta,idioma,tipo,escopo,confiabilidade,prioridade,prioridade_regiao_uf,prioridade_regiao,categorias,objetivos_tabela,objetivos_inferidos,origem,melhor_uso";

describe("parseCsv", () => {
  it("handles quoted commas, escaped quotes and CRLF", () => {
    expect(parseCsv('a,b\r\n"x, y","diz ""oi"""\r\n')).toEqual([{ a: "x, y", b: 'diz "oi"' }]);
  });
});

describe("readCatalog", () => {
  it("accepts the versioned catalog and keeps every source classified", () => {
    const catalog = readCatalog(data("news_sources.csv"), data("news_objectives.csv"));
    expect(catalog.sources.length).toBeGreaterThan(60);
    for (const source of catalog.sources) expect(source.tableObjectives.length + source.inferredObjectives.length).toBeGreaterThan(0);
    expect(catalog.sources.find((source) => source.slug === "cbpm")).toMatchObject({ regionPriorityUf: "BA", regionPriority: 4, tableObjectives: ["bahia", "dados_oficiais_regulacao"] });
  });

  it("reports invalid rows in pt-BR", () => {
    const row = "fonte-x,Fonte X,http://x.com,,rss,pt,blog,Brasil,5,3,,,mercado|cripto,desconhecido,,brasil,uso";
    expect(() => readCatalog(`${header}\n${row}\n`, objectivesCsv)).toThrow(/URL sem https[\s\S]*rss exige feed_url[\s\S]*tipo inválido[\s\S]*categoria inválida \(cripto\)[\s\S]*objetivo desconhecido[\s\S]*confiabilidade deve ser inteiro/);
  });
});

describe("buildCatalogSql", () => {
  it("escapes quotes and inserts new sources inactive", () => {
    const row = "dagua,Olho d'Água,https://dagua.com.br,https://dagua.com.br/feed/,rss,pt,jornal_regional,Bahia,2,2,BA,3,politica,noticias_setor,,brasil,Notícias";
    const output = buildCatalogSql(readCatalog(`${header}\n${row}\n`, objectivesCsv));
    expect(output).toContain("'Olho d''Água'");
    expect(output).toMatch(/'BA',3,array\['politica'\]::public\.news_category\[\],array\['brasil'\]::text\[\],'Notícias',false\)/);
    expect(output).toContain("('dagua','noticias_setor','tabela')");
  });
});
