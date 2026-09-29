/**
 * Логіка заявок: валідація, очищення, збагачення технічними даними.
 * Без залежностей від Next.js — тестується напряму (`npm test`).
 */

export const MAX = { short: 120, contact: 120, link: 300, referrer: 300, ua: 400, id: 8 } as const;

/** Що приходить із браузера. Усе untrusted — проходить через `buildLead`. */
export type LeadInput = {
  id?: unknown;
  contact?: unknown;
  name?: unknown;
  link?: unknown;
  niche?: unknown;
  prog?: unknown;
  company?: unknown; // honeypot
  page?: unknown;
  referrer?: unknown;
  lang?: unknown;
  tz?: unknown;
  viewport?: unknown;
  attr?: unknown;
};

/** Рядок заявки в тому вигляді, в якому його приймає Apps Script. */
export type Lead = {
  id: string;
  createdAt: string; // ISO, час сервера (довіряємо йому, а не годиннику клієнта)
  type: "Академія" | "Консультація";
  program: string;
  name: string;
  contact: string;
  link: string;
  niche: string;
  page: string;
  pageLabel: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  clickId: string;
  referrer: string;
  landing: string;
  casesViewed: string;
  pagesViewed: string;
  timeOnSite: string;
  visit: string;
  firstVisit: string;
  quality: string;
  country: string;
  region: string;
  city: string;
  device: string;
  lang: string;
  tz: string;
  viewport: string;
  fbp: string;
  fbc: string;
  ipHash: string;
  ua: string;
};

/** Підписи сторінок для колонки «Сторінка». */
export type PageTitles = Record<string, string>;

export type ServerContext = {
  now: Date;
  userAgent: string;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  ipHash?: string;
  caseTitles?: PageTitles; // slug → назва кейсу
};

/** Керуючі й невидимі символи (zero-width, BOM, роздільники рядків), які не мають потрапити в таблицю. */
const INVISIBLE = new RegExp("[\\u0000-\\u001f\\u007f\\u200b-\\u200f\\u2028\\u2029\\ufeff]", "g");

/** Рядок → безпечний текст: без керуючих символів і зайвих пробілів, з обмеженням довжини. */
export function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(INVISIBLE, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export type ValidationError = "contact_required" | "contact_too_short";

/** Контакт — єдине обовʼязкове поле. Повертає код помилки або null. */
export function validateContact(contact: string): ValidationError | null {
  if (!contact) return "contact_required";
  if (contact.length < 4) return "contact_too_short";
  return null;
}

/** ID заявки: 8 символів A–Z/0–9. Від клієнта приймаємо, лише якщо формат вірний (дедуплікація повторних відправок). */
export function normalizeId(v: unknown, fallback: () => string): string {
  const s = typeof v === "string" ? v.trim().toUpperCase() : "";
  return /^[A-Z0-9]{8}$/.test(s) ? s : fallback();
}

export function randomId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // без 0/O/1/I
  const bytes = crypto.getRandomValues(new Uint8Array(MAX.id));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "fbclid", "gclid", "ttclid", "landing", "referrer", "fbp", "fbc", "firstVisit"] as const;
type Attr = Partial<Record<(typeof ATTR_KEYS)[number], string>> & { pages?: number; visits?: number; startedAt?: number; cases?: string[] };

function num(v: unknown, max: number): number | undefined {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= max ? Math.floor(v) : undefined;
}

function readAttr(raw: unknown): Attr {
  if (!raw || typeof raw !== "object") return {};
  const o = raw as Record<string, unknown>;
  const out: Attr = {};
  for (const k of ATTR_KEYS) {
    const v = clean(o[k], k === "landing" || k === "referrer" ? MAX.referrer : MAX.short);
    if (v) out[k] = v;
  }
  out.pages = num(o.pages, 10_000);
  out.visits = num(o.visits, 100_000);
  out.startedAt = num(o.startedAt, 4_102_444_800_000);
  if (Array.isArray(o.cases)) out.cases = o.cases.slice(0, 20).map((c) => clean(c, 40)).filter((c) => /^[\w-]+$/.test(c));
  return out;
}

/** «3 хв 20 с» */
export function formatDuration(sec: number): string {
  if (sec < 60) return `${sec} с`;
  const m = Math.floor(sec / 60);
  return m < 60 ? `${m} хв ${sec % 60} с` : `${Math.floor(m / 60)} год ${m % 60} хв`;
}

/** Наскільки заявка «повна» — щоб менеджер відразу бачив, кому дзвонити першому. */
export function leadQuality(l: { name: string; link: string; niche: string }): string {
  const n = [l.name, l.link, l.niche].filter(Boolean).length;
  return n === 3 ? "Повна" : n >= 1 ? "Часткова" : "Лише контакт";
}

/** Читабельне джерело: явний utm_source → рекламний клік → домен реферера → direct. */
export function describeSource(attr: Attr, ua: string): string {
  if (attr.utm_source) return attr.utm_source;
  if (attr.fbclid) return "facebook / instagram (реклама)";
  if (attr.gclid) return "google (реклама)";
  if (attr.ttclid) return "tiktok (реклама)";
  if (attr.referrer) {
    try {
      return new URL(attr.referrer).hostname.replace(/^www\./, "");
    } catch {
      /* не URL — ігноруємо */
    }
  }
  if (/Instagram/i.test(ua)) return "instagram (застосунок)";
  if (/FBAN|FBAV/i.test(ua)) return "facebook (застосунок)";
  if (/Telegram/i.test(ua)) return "telegram (застосунок)";
  return "direct";
}

/** «iPhone · iOS · Safari» — достатньо, щоб зрозуміти, з чого людина прийшла. */
export function describeDevice(ua: string): string {
  if (!ua) return "";
  const kind = /iPad|Tablet/i.test(ua) ? "Планшет" : /Mobi|iPhone|Android/i.test(ua) ? "Телефон" : "Комп’ютер";
  const os = /iPhone|iPad|iPod/i.test(ua) ? "iOS" : /Android/i.test(ua) ? "Android" : /Mac OS X/i.test(ua) ? "macOS" : /Windows/i.test(ua) ? "Windows" : /Linux/i.test(ua) ? "Linux" : "";
  const inApp = /Instagram/i.test(ua) ? "Instagram" : /FBAN|FBAV/i.test(ua) ? "Facebook" : /Telegram/i.test(ua) ? "Telegram" : "";
  const browser = inApp || (/Edg\//.test(ua) ? "Edge" : /OPR\/|Opera/.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /(CriOS|Chrome)\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "");
  return [kind, os, browser && (inApp ? `${browser} (застосунок)` : browser)].filter(Boolean).join(" · ");
}

export function pageLabel(path: string, caseTitles: PageTitles = {}): string {
  if (path === "/" || path === "") return "Головна";
  if (path === "/cases") return "Кейси";
  if (path === "/academy") return "Академія";
  const m = path.match(/^\/cases\/([\w-]+)$/);
  if (m) return `Кейс: ${caseTitles[m[1]] || m[1]}`;
  return path;
}

function safePath(v: unknown): string {
  const s = clean(v, 200);
  return s.startsWith("/") ? s.split(/[?#]/)[0] : "/";
}

function safeCity(v: string | null | undefined): string {
  if (!v) return "";
  try {
    return clean(decodeURIComponent(v), 80);
  } catch {
    return clean(v, 80);
  }
}

/** Клієнтський payload + серверний контекст → готова заявка. Кидає лише через validateContact на боці виклику. */
export function buildLead(input: LeadInput, ctx: ServerContext): Lead {
  const attr = readAttr(input.attr);
  const ua = clean(ctx.userAgent, MAX.ua);
  const page = safePath(input.page);
  const program = clean(input.prog, MAX.short);
  const name = clean(input.name, MAX.short);
  const link = clean(input.link, MAX.link);
  const niche = clean(input.niche, MAX.short);
  const sinceStart = attr.startedAt ? Math.round((ctx.now.getTime() - attr.startedAt) / 1000) : undefined;
  const titles = ctx.caseTitles || {};
  return {
    id: normalizeId(input.id, randomId),
    createdAt: ctx.now.toISOString(),
    type: program || page.startsWith("/academy") ? "Академія" : "Консультація",
    program,
    name,
    contact: clean(input.contact, MAX.contact),
    link,
    niche,
    quality: leadQuality({ name, link, niche }),
    page,
    pageLabel: pageLabel(page, titles),
    source: describeSource(attr, ua),
    medium: attr.utm_medium || "",
    campaign: attr.utm_campaign || "",
    content: attr.utm_content || "",
    term: attr.utm_term || "",
    clickId: attr.fbclid || attr.gclid || attr.ttclid || attr.utm_id || "",
    referrer: clean(input.referrer, MAX.referrer) || attr.referrer || "",
    landing: attr.landing ? safePath(attr.landing) : "",
    casesViewed: (attr.cases || []).map((s) => titles[s] || s).join(", "),
    pagesViewed: attr.pages ? String(attr.pages) : "",
    timeOnSite: sinceStart !== undefined && sinceStart >= 0 && sinceStart < 86_400 ? formatDuration(sinceStart) : "",
    visit: attr.visits ? (attr.visits > 1 ? `Повторний (${attr.visits}-й візит)` : "Перший візит") : "",
    firstVisit: attr.firstVisit || "",
    country: clean(ctx.country ?? "", 2).toUpperCase(),
    region: safeCity(ctx.region),
    city: safeCity(ctx.city),
    device: describeDevice(ua),
    lang: clean(input.lang, 16),
    tz: clean(input.tz, 64),
    viewport: clean(input.viewport, 16),
    fbp: attr.fbp || "",
    fbc: attr.fbc || "",
    ipHash: ctx.ipHash || "",
    ua,
  };
}
