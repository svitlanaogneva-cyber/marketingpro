/**
 * Перевірка зібраного сайту (запускати після `next build`).
 * Гарантує, що кожна сторінка вже в статичному HTML має все потрібне для індексації:
 * title, description, canonical, og-теги, рівно один h1 і не порожній контент.
 * Також перевіряє, що sitemap містить усі сторінки, а robots посилається на sitemap.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(".next/server/app");
const meta = JSON.parse(fs.readFileSync("content/meta.json", "utf8"));

const routes = [
  ["/", "index.html"],
  ["/cases", "cases.html"],
  ["/academy", "academy.html"],
  ...meta.cases.map((c) => [`/cases/${c.slug}`, `cases/${c.slug}.html`]),
];

const errors = [];
const fail = (route, msg) => errors.push(`${route}: ${msg}`);
const titles = new Set();
const descriptions = new Set();

for (const [route, file] of routes) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) { fail(route, `немає статичного HTML (${file}) — сторінка не пререндерена`); continue; }
  const html = fs.readFileSync(p, "utf8");
  const pick = (re) => (html.match(re) || [])[1];

  const title = pick(/<title>([^<]+)<\/title>/);
  const desc = pick(/<meta name="description" content="([^"]+)"/);
  const canonical = pick(/<link rel="canonical" href="([^"]+)"/);
  const h1s = html.match(/<h1[\s>]/g) || [];

  if (!title || title.length < 10) fail(route, "порожній або надто короткий <title>");
  if (title && title.length > 100) fail(route, `надто довгий <title> (${title.length} символів): ${title.slice(0, 60)}…`);
  if (!desc || desc.length < 50) fail(route, "порожній або надто короткий meta description");
  if (!canonical) fail(route, "немає canonical");
  else if (!canonical.startsWith("https://") || canonical.endsWith(".html")) fail(route, `некоректний canonical: ${canonical}`);
  if (!/<meta property="og:title"/.test(html) || !/<meta property="og:image"/.test(html)) fail(route, "немає og:title/og:image");
  const ogImg = pick(/<meta property="og:image" content="https:\/\/[^/]+(\/[^"]+)"/);
  if (!ogImg) fail(route, "og:image має бути абсолютним https-URL");
  else if (ogImg.startsWith("/og/") && !fs.existsSync(path.join(root, ogImg + ".body"))) fail(route, `не згенеровано превʼю ${ogImg}`);
  if (!/<html lang="uk"/.test(html)) fail(route, "немає lang=uk");
  if (h1s.length !== 1) fail(route, `має бути рівно один <h1>, знайдено ${h1s.length}`);
  if (/noindex/i.test(html)) fail(route, "знайдено noindex");
  if (html.length < 20_000) fail(route, `підозріло малий HTML (${html.length} B) — контент не відрендерився`);

  if (titles.has(title)) fail(route, `дубль title: ${title}`);
  if (descriptions.has(desc)) fail(route, "дубль meta description");
  titles.add(title); descriptions.add(desc);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(route, "невалідний JSON-LD"); }
  }
}

const sitemapPath = path.join(root, "sitemap.xml.body");
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : "";
for (const [route] of routes) {
  if (sitemap && !sitemap.includes(`<loc>https://marketingpro.company${route === "/" ? "/" : route}</loc>`)) {
    fail(route, "відсутня в sitemap.xml");
  }
}
const robotsPath = path.join(root, "robots.txt.body");
if (fs.existsSync(robotsPath) && !/Sitemap:/i.test(fs.readFileSync(robotsPath, "utf8"))) fail("/robots.txt", "немає рядка Sitemap");
if (!sitemap) fail("/sitemap.xml", "не знайдено у збірці");

if (errors.length) {
  console.error(`\n✖ Перевірка збірки: ${errors.length} проблем(и)\n` + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`✔ Перевірка збірки: ${routes.length} сторінок, sitemap і robots — все гаразд`);
