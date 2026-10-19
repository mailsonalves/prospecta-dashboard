import { readFile } from "node:fs/promises";
import path from "node:path";
import { readCatalog } from "@/lib/news-catalog";
import { groupForSourceType, type CatalogSourceLink } from "@/lib/news-source-groups";

export async function loadNewsCatalog(): Promise<CatalogSourceLink[]> {
  const directory = path.join(process.cwd(), "data");
  const catalog = readCatalog(
    await readFile(path.join(directory, "news_sources.csv"), "utf8"),
    await readFile(path.join(directory, "news_objectives.csv"), "utf8")
  );
  return catalog.sources.map((source) => ({
    slug: source.slug,
    name: source.name,
    siteUrl: source.siteUrl,
    group: groupForSourceType(source.sourceType)
  }));
}
