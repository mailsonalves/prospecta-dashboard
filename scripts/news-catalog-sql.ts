import { readFile } from "node:fs/promises";
import path from "node:path";
import { buildCatalogSql, readCatalog } from "../lib/news-catalog.ts";

const dataDir = path.join(process.cwd(), "data");
const catalog = readCatalog(await readFile(path.join(dataDir, "news_sources.csv"), "utf8"), await readFile(path.join(dataDir, "news_objectives.csv"), "utf8"));
process.stdout.write(buildCatalogSql(catalog));
