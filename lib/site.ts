import type { Metadata } from "next";
import meta from "@/content/meta.json";

/** Продакшн-домен. Можна перевизначити змінною середовища (превʼю, стейджинг). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://marketingpro.company").replace(/\/$/, "");
export const SITE_NAME = "marketingpro";

type PageMeta = { title: string; description: string; canonical: string; ogImage: string; ogType: string; ld: object[]; updated: string };

export type CaseMeta = PageMeta & {
  slug: string;
  label: string;
  prev: { slug: string; name: string } | null;
  next: { slug: string; name: string } | null;
};

export const pages = meta.pages as Record<"home" | "academy" | "cases-index", PageMeta>;
/** Кейси у порядку навігації «попередній → наступний» (від першого до останнього). */
export const cases: CaseMeta[] = (() => {
  const all = meta.cases as CaseMeta[];
  const bySlug = new Map(all.map((c) => [c.slug, c]));
  let cur = all.find((c) => !c.prev);
  const ordered: CaseMeta[] = [];
  while (cur) {
    ordered.push(cur);
    cur = cur.next ? bySlug.get(cur.next.slug) : undefined;
  }
  return ordered.length === all.length ? ordered : all;
})();

/** Відносний шлях із абсолютного канонічного URL. */
const pathOf = (canonical: string) => new URL(canonical).pathname;

export function buildMetadata(p: PageMeta): Metadata {
  const path = pathOf(p.canonical);
  const image = p.ogImage.replace("https://marketingpro.company", "");
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: path },
    openGraph: {
      type: p.ogType === "article" ? "article" : "website",
      locale: "uk_UA",
      siteName: SITE_NAME,
      title: p.title,
      description: p.description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, type: "image/png", alt: p.title }],
    },
    twitter: { card: "summary_large_image", title: p.title, description: p.description, images: [{ url: image, alt: p.title }] },
  };
}
