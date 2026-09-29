import type { MetadataRoute } from "next";
import { SITE_URL, cases } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/cases", "/academy", ...cases.map((c) => `/cases/${c.slug}`)];
  return routes.map((path) => ({
    url: SITE_URL + path,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/cases/") ? 0.7 : 0.8,
  }));
}
