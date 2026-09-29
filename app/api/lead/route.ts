import { NextResponse } from "next/server";
import { buildLead, clean, validateContact, type Lead, type LeadInput } from "@/lib/lead";
import { cases } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 20;

const MAX_BODY = 10_000;
const caseTitles = Object.fromEntries(cases.map((c) => [c.slug, c.title.replace(/ — кейс marketingpro$/, "")]));

/* Легкий захист від спаму. Памʼять інстансу serverless не спільна, тож це «швидка» перша лінія
   (відсікає цикл із одного клієнта); від справжнього флуду захищає honeypot + перевірка Origin. */
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 10 * 60_000) {
    if (hits.size > 5000) hits.clear();
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  return ++h.n > 6;
}

/** Хеш IP із сіллю — щоб бачити повторні заявки/спам з однієї адреси, не зберігаючи сам IP. */
async function hashIp(ip: string): Promise<string> {
  if (ip === "unknown") return "";
  const data = new TextEncoder().encode(`${process.env.LEAD_WEBHOOK_SECRET || ""}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest).slice(0, 5), (b) => b.toString(16).padStart(2, "0")).join("");
}

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store" } });

/** Заявка → Apps Script (Google Sheets). Одна повторна спроба; таймаут, щоб не тримати клієнта. */
async function sendToSheet(lead: Lead): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL;
  const secret = process.env.LEAD_WEBHOOK_SECRET;
  if (!url || !secret) throw new Error("LEAD_WEBHOOK_URL / LEAD_WEBHOOK_SECRET не задані");

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        // text/plain — щоб Apps Script не вимагав preflight; тіло все одно JSON
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ secret, lead }),
        redirect: "follow",
        cache: "no-store",
        signal: AbortSignal.timeout(9000),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) return;
      lastError = new Error(`Apps Script: ${data.error || res.status}`);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

export async function POST(req: Request) {
  // 1. Лише з нашого ж сайту (браузер завжди додає Origin до POST)
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  let originHost = "";
  try {
    originHost = origin ? new URL(origin).host : "";
  } catch {
    /* некоректний Origin */
  }
  if (!originHost || originHost !== host) return fail("forbidden", 403);

  // 2. Тіло: розмір і JSON
  const raw = await req.text();
  if (raw.length > MAX_BODY) return fail("too_large", 413);
  let input: LeadInput;
  try {
    input = JSON.parse(raw);
    if (!input || typeof input !== "object") throw new Error();
  } catch {
    return fail("bad_json", 400);
  }

  // 3. Honeypot: бот заповнив приховане поле — вдаємо успіх і мовчки відкидаємо
  if (clean(input.company, 50)) return NextResponse.json({ ok: true });

  // 4. Ліміт частоти
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return fail("rate_limited", 429);

  // 5. Валідація й збагачення
  const lead = buildLead(input, {
    now: new Date(),
    userAgent: req.headers.get("user-agent") || "",
    country: req.headers.get("x-vercel-ip-country"),
    region: req.headers.get("x-vercel-ip-country-region"),
    city: req.headers.get("x-vercel-ip-city"),
    ipHash: await hashIp(ip),
    caseTitles,
  });
  const invalid = validateContact(lead.contact);
  if (invalid) return fail(invalid, 400);

  // 6. У таблицю. Якщо не вийшло — повна заявка лишається в логах Vercel, щоб її не втратити
  try {
    await sendToSheet(lead);
  } catch (e) {
    console.error("[lead:FAILED]", (e as Error).message, JSON.stringify(lead));
    return fail("delivery_failed", 502);
  }
  return NextResponse.json({ ok: true, id: lead.id }, { headers: { "Cache-Control": "no-store" } });
}
