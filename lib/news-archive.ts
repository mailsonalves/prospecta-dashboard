import type { NewsCategory, NewsItem } from "@/lib/types";

export const NEWS_PAGE_SIZE = 6;

export type NewsSort = "recent" | "oldest";

export interface NewsArchiveQuery {
  query?: string;
  source?: string;
  from?: string;
  to?: string;
  sort?: NewsSort;
  category?: NewsCategory | "todas";
  page?: number;
  pageSize?: number;
}

export interface NewsArchiveResult {
  items: NewsItem[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function publishedDay(value: string) {
  const time = Date.parse(value);
  if (Number.isNaN(time)) return "";
  return new Date(time).toISOString().slice(0, 10);
}

function compareNews(sort: NewsSort) {
  switch (sort) {
    case "recent":
      return (left: NewsItem, right: NewsItem) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt);
    case "oldest":
      return (left: NewsItem, right: NewsItem) => Date.parse(left.publishedAt) - Date.parse(right.publishedAt);
    default: {
      const exhaustive: never = sort;
      return exhaustive;
    }
  }
}

export function newsSourcesInUse(items: NewsItem[]) {
  return [...new Set(items.map((item) => item.source))].sort((left, right) => left.localeCompare(right, "pt-BR"));
}

export function previewText(value: string, max = 180) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max).trimEnd()}…`;
}

export function queryNewsArchive(items: NewsItem[], query: NewsArchiveQuery = {}): NewsArchiveResult {
  const term = (query.query ?? "").trim().toLocaleLowerCase("pt-BR");
  const source = (query.source ?? "").trim();
  const from = datePattern.test(query.from ?? "") ? query.from : "";
  const to = datePattern.test(query.to ?? "") ? query.to : "";
  const sort = query.sort ?? "recent";
  const category = query.category ?? "todas";
  const pageSize = Math.max(1, query.pageSize ?? NEWS_PAGE_SIZE);

  const matched = items.filter((item) => {
    if (category !== "todas" && item.category !== category) return false;
    if (source && source !== "todas" && item.source !== source) return false;
    const day = publishedDay(item.publishedAt);
    if (from && day < from) return false;
    if (to && day > to) return false;
    if (!term) return true;
    const haystack = [item.title, item.summary, item.source, ...item.minerals, ...item.keywords].join(" ").toLocaleLowerCase("pt-BR");
    return haystack.includes(term);
  });

  const sorted = [...matched].sort(compareNews(sort));
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const requested = Number.isFinite(query.page) ? Math.floor(query.page ?? 1) : 1;
  const page = Math.min(Math.max(1, requested), pageCount);
  const start = (page - 1) * pageSize;

  return {
    items: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page,
    pageCount,
    pageSize
  };
}
