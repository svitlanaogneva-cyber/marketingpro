import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { cases } from "@/lib/site";

/**
 * Превʼю для соцмереж (Telegram, Facebook, Instagram, LinkedIn, Slack, iMessage…): 1200×630 PNG.
 * Кожна картинка — окремий статичний файл, який генерується під час збірки з тих самих даних, що й
 * метадані сторінок, тож текст на превʼю завжди збігається з сайтом. Під час запитів нічого не рахується.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

const W = 1200;
const H = 630;
const INK = "#18181A";
const SIGNAL = "#FF2D7E";
const SOFT = "#C9C9C6";

type Page = { headline: string; sub: string };

const PAGES: Record<string, Page> = {
  home: {
    headline: "Допомагаємо бізнесу заробляти більше",
    sub: "Стабільний ріст і більше прибутку. Купуємо лідів дешевше за конкурентів.",
  },
  academy: {
    headline: "Академія таргету",
    sub: "Системне розуміння Meta Ads і навички запуску реклами. Для власників бізнесу — 5 тижнів, для таргетологів — 10.",
  },
  cases: {
    headline: "Кейси в цифрах",
    sub: "ROAS, вартість клієнта і дохід — реальні результати з рекламних кабінетів.",
  },
};

export function generateStaticParams() {
  return [...Object.keys(PAGES), ...cases.map((c) => c.slug)].map((k) => ({ file: `${k}.png` }));
}

const fontDir = path.join(process.cwd(), "node_modules/@fontsource");
const font = (pkg: string, file: string) => readFile(path.join(fontDir, pkg, "files", file));

async function loadFonts() {
  const [uc5, ul5, uc7, ul7, nc, nl] = await Promise.all([
    font("unbounded", "unbounded-cyrillic-500-normal.woff"),
    font("unbounded", "unbounded-latin-500-normal.woff"),
    font("unbounded", "unbounded-cyrillic-700-normal.woff"),
    font("unbounded", "unbounded-latin-700-normal.woff"),
    font("nunito-sans", "nunito-sans-cyrillic-600-normal.woff"),
    font("nunito-sans", "nunito-sans-latin-600-normal.woff"),
  ]);
  // кирилична і латинська частини — окремі файли, satori підбирає гліф з того, де він є
  return [
    { name: "Unbounded", data: uc7, weight: 700 as const, style: "normal" as const },
    { name: "Unbounded", data: ul7, weight: 700 as const, style: "normal" as const },
    { name: "Unbounded", data: uc5, weight: 500 as const, style: "normal" as const },
    { name: "Unbounded", data: ul5, weight: 500 as const, style: "normal" as const },
    { name: "Nunito", data: nc, weight: 600 as const, style: "normal" as const },
    { name: "Nunito", data: nl, weight: 600 as const, style: "normal" as const },
  ];
}

async function dataUri(publicPath: string) {
  const buf = await readFile(path.join(process.cwd(), "public", publicPath));
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

/** «2584% roas · 29$ клієнт · 125 250$ дохід/міс» → [{value:"2584%", label:"ROAS"}, …] */
function metricsOf(description: string) {
  const tail = description.split(". ").pop() || "";
  return tail
    .split(" · ")
    .map((part) => part.trim().match(/^([+×]?\d[\d\s,]*[%$]?)\s+(.+)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .slice(0, 3)
    .map((m) => ({ value: m[1].trim(), label: /^roas$/i.test(m[2]) ? "ROAS" : m[2] }));
}

const Brand = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <div style={{ display: "flex", width: 46, height: 46, borderRadius: 11, background: SIGNAL, color: "#fff", fontSize: 32, fontWeight: 700, fontFamily: "Unbounded", alignItems: "center", justifyContent: "center", paddingBottom: 4 }}>m</div>
    <div style={{ display: "flex", fontFamily: "Unbounded", fontWeight: 500, fontSize: 28, color: "#fff", letterSpacing: -0.5 }}>marketingpro</div>
  </div>
);

const Footer = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "Nunito", fontWeight: 600, fontSize: 24, color: SOFT }}>
    <div style={{ display: "flex", width: 34, height: 4, background: SIGNAL, borderRadius: 2 }} />
    marketingpro.company
  </div>
);

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const key = (await params).file.replace(/\.png$/, "");
  const fonts = await loadFonts();
  const opts = { width: W, height: H, fonts, headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" } };

  const kase = cases.find((c) => c.slug === key);
  if (kase) {
    const photo = await dataUri(`/assets/img/cases/${kase.slug}/cover.jpg`);
    const title = kase.title.replace(/\s+—\s+кейс marketingpro$/i, "");
    const metrics = metricsOf(kase.description);
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: W, height: H, background: INK, position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" width={540} height={H} style={{ position: "absolute", right: 0, top: 0, width: 540, height: H, objectFit: "cover" }} />
          <div style={{ display: "flex", position: "absolute", right: 0, top: 0, width: 540, height: H, background: `linear-gradient(90deg, ${INK} 0%, rgba(24,24,26,0.55) 38%, rgba(24,24,26,0.05) 100%)` }} />
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 760, height: H, padding: "54px 0 54px 64px", position: "relative" }}>
            <Brand />
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div style={{ display: "flex", fontFamily: "Unbounded", fontWeight: 500, fontSize: 22, letterSpacing: 3, color: SIGNAL }}>КЕЙС</div>
              <div style={{ display: "flex", fontFamily: "Unbounded", fontWeight: 700, fontSize: title.length > 40 ? 40 : 46, lineHeight: 1.16, color: "#fff", letterSpacing: -1 }}>{title}</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 40 }}>
              {metrics.map((m) => (
                <div key={m.label} style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: 6 }}>
                  <div style={{ display: "flex", fontFamily: "Unbounded", fontWeight: 700, fontSize: m.value.length > 6 ? 32 : 40, lineHeight: "48px", height: 48, color: SIGNAL, letterSpacing: -1 }}>{m.value}</div>
                  <div style={{ display: "flex", fontFamily: "Nunito", fontWeight: 600, fontSize: 24, lineHeight: "30px", height: 30, color: SOFT }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      opts,
    );
  }

  const page = PAGES[key];
  const bg = await dataUri("/assets/og-image.jpg");
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: W, height: H, background: INK, position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bg} alt="" width={W} height={H} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover" }} />
        <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width: W, height: H, background: "linear-gradient(90deg, rgba(24,24,26,0.96) 0%, rgba(24,24,26,0.86) 52%, rgba(24,24,26,0.25) 100%)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 880, height: H, padding: "54px 64px", position: "relative" }}>
          <Brand />
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div style={{ display: "flex", fontFamily: "Unbounded", fontWeight: 700, fontSize: 60, lineHeight: 1.12, color: "#fff", letterSpacing: -1.5 }}>{page.headline}</div>
            <div style={{ display: "flex", fontFamily: "Nunito", fontWeight: 600, fontSize: 30, lineHeight: 1.35, color: SOFT, maxWidth: 760 }}>{page.sub}</div>
          </div>
          <Footer />
        </div>
      </div>
    ),
    opts,
  );
}
