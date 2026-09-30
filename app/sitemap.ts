import type { MetadataRoute } from "next";
import { SITE_URL, cases, pages } from "@/lib/site";

/** lastmod беремо з `updated` у content/meta.json — змінюйте дату, коли міняєте текст сторінки. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; updated: string }[] = [
    { path: "/", updated: pages.home.updated },
    { path: "/cases", updated: pages["cases-index"].updated },
    { path: "/academy", updated: pages.academy.updated },
    ...cases.map((c) => ({ path: `/cases/${c.slug}`, updated: c.updated })),
  ];
  return routes.map(({ path, updated }) => ({
    url: SITE_URL + path,
    lastModified: updated,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/cases/") ? 0.7 : 0.8,
  }));
}
