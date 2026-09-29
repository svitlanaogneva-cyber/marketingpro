import test from "node:test";
import assert from "node:assert/strict";
import { buildLead, clean, describeDevice, describeSource, normalizeId, pageLabel, randomId, validateContact } from "../lib/lead.ts";

const ctx = { now: new Date("2026-09-29T10:00:00Z"), userAgent: "", caseTitles: { dental: "Стоматологічна клініка" } };
const IOS_IG = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Instagram 300.0";
const MAC_CHROME = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

test("clean: прибирає керуючі символи, зайві пробіли, обмежує довжину", () => {
  assert.equal(clean("  Олена\n\t К  ", 50), "Олена К");
  assert.equal(clean("a\u0000b​c", 50), "a b c");
  assert.equal(clean("x".repeat(500), 10).length, 10);
  assert.equal(clean(123, 10), "");
  assert.equal(clean({ a: 1 }, 10), "");
});

test("clean: формули лишаються текстом (колонки в таблиці мають формат «звичайний текст»)", () => {
  assert.equal(clean('=HYPERLINK("http://evil")', 100), '=HYPERLINK("http://evil")');
});

test("validateContact", () => {
  assert.equal(validateContact(""), "contact_required");
  assert.equal(validateContact("+38"), "contact_too_short");
  assert.equal(validateContact("@nick"), null);
  assert.equal(validateContact("+380637194373"), null);
});

test("normalizeId: приймає лише 8 символів A-Z0-9, інакше генерує", () => {
  assert.equal(normalizeId("ab12cd34", () => "X"), "AB12CD34");
  assert.equal(normalizeId("bad id!", () => "FALLBACK"), "FALLBACK");
  assert.equal(normalizeId(undefined, () => "FALLBACK"), "FALLBACK");
  assert.match(randomId(), /^[A-Z2-9]{8}$/);
});

test("pageLabel", () => {
  assert.equal(pageLabel("/"), "Головна");
  assert.equal(pageLabel("/cases"), "Кейси");
  assert.equal(pageLabel("/academy"), "Академія");
  assert.equal(pageLabel("/cases/dental", { dental: "Стоматологічна клініка" }), "Кейс: Стоматологічна клініка");
  assert.equal(pageLabel("/cases/nope"), "Кейс: nope");
});

test("describeSource: пріоритети", () => {
  assert.equal(describeSource({ utm_source: "fb", fbclid: "x" }, ""), "fb");
  assert.equal(describeSource({ fbclid: "x" }, ""), "facebook / instagram (реклама)");
  assert.equal(describeSource({ referrer: "https://www.google.com/search?q=x" }, ""), "google.com");
  assert.equal(describeSource({}, IOS_IG), "instagram (застосунок)");
  assert.equal(describeSource({}, MAC_CHROME), "direct");
});

test("describeDevice", () => {
  assert.equal(describeDevice(IOS_IG), "Телефон · iOS · Instagram (застосунок)");
  assert.equal(describeDevice(MAC_CHROME), "Комп’ютер · macOS · Chrome");
  assert.equal(describeDevice(""), "");
});

test("buildLead: консультація з головної з UTM", () => {
  const l = buildLead(
    { contact: " +38 063 719 43 73 ", name: "Олена", page: "/?utm_source=x", attr: { utm_source: "meta", utm_campaign: "sept", fbclid: "abc", landing: "/cases/dental?x=1" }, id: "ab12cd34" },
    { ...ctx, userAgent: MAC_CHROME, country: "ua", city: "%D0%9A%D0%B8%D1%97%D0%B2" },
  );
  assert.equal(l.id, "AB12CD34");
  assert.equal(l.type, "Консультація");
  assert.equal(l.contact, "+38 063 719 43 73");
  assert.equal(l.page, "/");
  assert.equal(l.pageLabel, "Головна");
  assert.equal(l.source, "meta");
  assert.equal(l.campaign, "sept");
  assert.equal(l.clickId, "abc");
  assert.equal(l.landing, "/cases/dental");
  assert.equal(l.country, "UA");
  assert.equal(l.city, "Київ");
  assert.equal(l.createdAt, "2026-09-29T10:00:00.000Z");
});

test("buildLead: академія з вибраним курсом", () => {
  const l = buildLead({ contact: "@nick", prog: "Карʼєра в таргеті · 10 тижнів", page: "/academy" }, ctx);
  assert.equal(l.type, "Академія");
  assert.equal(l.program, "Карʼєра в таргеті · 10 тижнів");
  assert.equal(l.pageLabel, "Академія");
});

test("buildLead: сторінка академії без вибору курсу — все одно «Академія»", () => {
  assert.equal(buildLead({ contact: "@nick", page: "/academy" }, ctx).type, "Академія");
});

test("buildLead: сміття на вході не ламає і не проходить далі", () => {
  const l = buildLead({ contact: { x: 1 }, page: "http://evil.com/x", attr: "str", id: 5 } as never, ctx);
  assert.equal(l.contact, "");
  assert.equal(l.page, "/");
  assert.equal(l.source, "direct");
  assert.match(l.id, /^[A-Z2-9]{8}$/);
});

test("formatDuration і leadQuality", async () => {
  const { formatDuration, leadQuality } = await import("../lib/lead.ts");
  assert.equal(formatDuration(42), "42 с");
  assert.equal(formatDuration(200), "3 хв 20 с");
  assert.equal(formatDuration(3720), "1 год 2 хв");
  assert.equal(leadQuality({ name: "a", link: "b", niche: "c" }), "Повна");
  assert.equal(leadQuality({ name: "a", link: "", niche: "" }), "Часткова");
  assert.equal(leadQuality({ name: "", link: "", niche: "" }), "Лише контакт");
});

test("buildLead: трекінг візиту — кейси, час на сайті, повторний візит, Meta-cookies", () => {
  const started = ctx.now.getTime() - 200_000;
  const l = buildLead(
    {
      contact: "@nick",
      page: "/cases/dental",
      attr: { startedAt: started, pages: 4, cases: ["dental", "beauty", "bad slug!"], visits: 3, firstVisit: "2026-09-01T10:00:00Z", fbp: "fb.1.1.2", fbc: "fb.1.1.abc", utm_id: "77" },
    },
    { ...ctx, region: "30", ipHash: "abcdef0123" },
  );
  assert.equal(l.casesViewed, "dental, beauty".replace("dental", "Стоматологічна клініка"));
  assert.equal(l.pagesViewed, "4");
  assert.equal(l.timeOnSite, "3 хв 20 с");
  assert.equal(l.visit, "Повторний (3-й візит)");
  assert.equal(l.fbp, "fb.1.1.2");
  assert.equal(l.fbc, "fb.1.1.abc");
  assert.equal(l.clickId, "77");
  assert.equal(l.region, "30");
  assert.equal(l.ipHash, "abcdef0123");
  assert.equal(l.quality, "Лише контакт");
});

test("buildLead: некоректні числа з клієнта відкидаються", () => {
  const l = buildLead({ contact: "@nick", attr: { startedAt: -5, pages: "many", visits: 1e12 } }, ctx);
  assert.equal(l.timeOnSite, "");
  assert.equal(l.pagesViewed, "");
  assert.equal(l.visit, "");
});
