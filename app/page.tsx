import fs from "node:fs";
import path from "node:path";
import { LegacyHomeScripts } from "@/components/legacy-home-scripts";
import { applyHomepageNews } from "@/lib/homepage-news";
import { loadNewsCatalog } from "@/lib/load-news-catalog";
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
  const [news, catalog] = await Promise.all([getPublishedNews(), loadNewsCatalog()]);
  const markup = applyHomepageNews(getLegacyHomepageMarkup(), news.items, catalog);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/legacy/css/index.css" />
      <style>{`
        a.blog-card{color:inherit;text-decoration:none}
        .sector-note{margin-top:22px}
        .legacy-home .news-entry{display:flex;flex-direction:column;background:#f7f3e8;color:#16231d;border:1px solid #eadcbe;border-radius:10px;box-shadow:0 16px 36px rgba(0,0,0,.22);overflow:hidden;transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
        .legacy-home .news-entry:hover{background:#fffdf8;transform:translateY(-6px);box-shadow:0 22px 44px rgba(0,0,0,.28)}
        .legacy-home a.blog-card-news{background:#f7f3e8;color:#16231d;border:1px solid #eadcbe;box-shadow:0 16px 36px rgba(0,0,0,.22)}
        .legacy-home .news-entry a.blog-card-news{background:transparent;border:0;box-shadow:none;border-radius:0}
        .legacy-home a.blog-card-news:hover{background:#fffdf8;transform:translateY(-6px);box-shadow:0 22px 44px rgba(0,0,0,.28)}
        .legacy-home .news-entry a.blog-card-news:hover,.legacy-home .news-entry:hover a.blog-card-news{background:transparent;transform:none;box-shadow:none}
        .legacy-home .news-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 16px 16px}
        .legacy-home .news-summary,.legacy-home .news-direct{display:flex;align-items:center;justify-content:center;min-height:44px;padding:8px 10px;border-radius:8px;font-size:.78rem;font-weight:800;line-height:1.2;text-align:center;text-decoration:none}
        .legacy-home .news-summary{background:#16231d;color:#f8f4e9}
        .legacy-home .news-summary:hover{background:#0c1612;color:#fff}
        .legacy-home .news-direct{margin:0;background:transparent;color:#16231d;border:1px solid #16231d}
        .legacy-home .news-direct:hover{background:#16231d;color:#f8f4e9}
        .legacy-home a.blog-card-news .blog-card-title{color:#16231d;font-size:1.22rem}
        .legacy-home a.blog-card-news .blog-src{color:#16231d}
        .legacy-home a.blog-card-news .blog-ref,.legacy-home a.blog-card-news .blog-card-more{color:#3c4842}
        .legacy-home a.blog-card-news .sector-preview{margin:0;font-size:.98rem;line-height:1.5;color:#3c4842;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .legacy-home article.blog-card-news .blog-card-title{color:#f8f4e9}
        .legacy-home article.blog-card-news .blog-src{color:#e7c98a}
        .legacy-home article.blog-card-news .blog-ref,.legacy-home article.blog-card-news .blog-card-more{color:#f5f1e7}
        .legacy-home article.blog-card-news .blog-card-tags span{color:#f4e2bc;border-color:rgba(244,226,188,.55)}
        .legacy-home .news-mark{width:28px;height:28px;border-radius:8px;background:#16231d;flex:none;background-image:linear-gradient(#f7f3e8,#f7f3e8),linear-gradient(#f7f3e8,#f7f3e8);background-size:12px 2px,2px 12px;background-position:center;background-repeat:no-repeat}
        .legacy-home .news-routes{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:flex-start}
        .legacy-home .news-routes-note{flex-basis:100%;margin:0;color:rgba(244,240,229,.72);font-size:.92rem}
        .legacy-home .blog-ver-btn-news{background:#f4f0e5;color:#16231d;border-color:#f4f0e5;font-weight:800}
        .legacy-home .blog-ver-btn-news:hover{background:#fff;color:#16231d}
        .legacy-home .sources-footer{margin-top:28px;padding:18px;border:1px solid rgba(183,211,107,.35);border-radius:14px}
        .legacy-home .sources-footer h2{font-size:1.6rem;line-height:1.1;margin:0 0 6px;color:#f7f3e8}
        .legacy-home .catalog-cta{display:flex;justify-content:space-between;gap:16px;align-items:center}
        .legacy-home .catalog-cta p{margin:0;color:rgba(244,240,229,.72)}
        .legacy-home .catalog-cta-button{display:inline-flex;padding:14px 18px;border-radius:10px;background:#b7d36b;color:#102015;font-weight:900;text-decoration:none}
        .legacy-home .catalog-cta-button:hover{transform:translateY(-3px);background:#d0e59a}
        .legacy-home .sources-disclosure summary{display:inline-flex;margin-top:14px;cursor:pointer;color:#f7f3e8;border:1px solid rgba(247,243,232,.3);border-radius:999px;padding:8px 14px}
        .legacy-home .mineral-card,.legacy-home .tech-item,.legacy-home .team-card,.legacy-home .mission-card{transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
        .legacy-home .mineral-card:hover,.legacy-home .tech-item:hover,.legacy-home .team-card:hover,.legacy-home .mission-card:hover{transform:translateY(-4px)}
        .legacy-home a:focus-visible,.legacy-home button:focus-visible{outline:3px solid #b7d36b;outline-offset:3px}
        @media(max-width:700px){.legacy-home .catalog-cta{flex-direction:column;align-items:stretch}}
        @media(prefers-reduced-motion:reduce){.legacy-home .mineral-card,.legacy-home .tech-item,.legacy-home .team-card,.legacy-home .mission-card,.legacy-home a.blog-card-news,.legacy-home .news-entry,.legacy-home .catalog-cta-button{transition:none}.legacy-home .mineral-card:hover,.legacy-home .tech-item:hover,.legacy-home .team-card:hover,.legacy-home .mission-card:hover,.legacy-home a.blog-card-news:hover,.legacy-home .news-entry:hover,.legacy-home .catalog-cta-button:hover{transform:none}}
      `}</style>
      <div
        className="legacy-home"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      <LegacyHomeScripts />
    </>
  );
}
