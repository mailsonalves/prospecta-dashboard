import fs from "node:fs";
import path from "node:path";
import { LegacyHomeScripts } from "@/components/legacy-home-scripts";
import { applyHomepageNews } from "@/lib/homepage-news";
import { getPublishedNews } from "@/lib/repository";

function getLegacyHomepageMarkup() {
  const source = fs.readFileSync(
    path.join(process.cwd(), "prospecta", "index.html"),
    "utf8",
  );
  const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];

  if (!body) {
    throw new Error("Não foi possível carregar o frontend original do Prospecta.");
  }

  return body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replaceAll('href="blog.html?f=publicacao"', 'href="/blog?f=publicacao"')
    .replaceAll('href="blog.html"', 'href="/blog"')
    .replaceAll('href="dashboard.html"', 'href="/dashboard"')
    .replaceAll('src="assets/img/', 'src="/legacy/img/')
    .replaceAll("url('assets/img/", "url('/legacy/img/");
}

export default async function HomePage() {
  const news = await getPublishedNews();
  const markup = applyHomepageNews(getLegacyHomepageMarkup(), news.items);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/legacy/css/index.css" />
      <style>{`a.blog-card{color:inherit;text-decoration:none}.sector-preview{margin:0;font-size:.86rem;line-height:1.5;color:rgba(244,240,229,.72);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.sector-note{margin-top:22px}.legacy-home .sources-footer{margin-top:28px;padding:4px 18px 18px;border:1px solid rgba(199,164,106,.28);border-radius:10px}.legacy-home .sources-footer ul{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px 16px;list-style:none;margin:0;padding:0 0 8px}.legacy-home .sources-footer a{color:#f5f1e7;text-decoration:none}`}</style>
      <div
        className="legacy-home"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      <LegacyHomeScripts />
    </>
  );
}
