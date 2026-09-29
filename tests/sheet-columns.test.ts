import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildLead } from "../lib/lead.ts";

/* Схема таблиці (Code.gs) має збігатися зі структурою заявки, яку шле сайт. */
const code = fs.readFileSync(new URL("../integrations/google-sheets/Code.gs", import.meta.url), "utf8");
const block = code.slice(code.indexOf("var COLUMNS = ["), code.indexOf("];", code.indexOf("var COLUMNS = [")));
const columns = block
  .split(/\n\s*\{ key: /)
  .slice(1)
  .map((chunk) => "{ key: " + chunk)
  .map((chunk) => ({
    key: chunk.match(/key: '(\w+)'/)?.[1] ?? "",
    title: chunk.match(/title: '([^']+)'/)?.[1] ?? "",
    hint: chunk.match(/hint: '([^']*)'/)?.[1],
  }));

const lead = buildLead({ contact: "@nick", attr: { utm_source: "x" } }, { now: new Date(), userAgent: "ua" });
const leadKeys = Object.keys(lead);
const COMPUTED_OR_MANUAL = ["status", "day", "week", "month", "responsible", "nextContact", "manager"];

test("кожне поле заявки має колонку в таблиці", () => {
  const cols = new Set(columns.map((c) => c.key));
  assert.deepEqual(leadKeys.filter((k) => !cols.has(k)), []);
});

test("кожна колонка або приходить із сайту, або обчислюється/заповнюється вручну", () => {
  const orphan = columns.map((c) => c.key).filter((k) => !leadKeys.includes(k) && !COMPUTED_OR_MANUAL.includes(k));
  assert.deepEqual(orphan, []);
});

test("колонки з форм названі так само, як поля на сайті", () => {
  const title = (k: string) => columns.find((c) => c.key === k)?.title;
  assert.equal(title("link"), "Лінк на Instagram або сайт");
  assert.equal(title("contact"), "Телефон або Telegram для звʼязку");
  assert.equal(title("name"), "Імʼя");
  assert.equal(title("niche"), "Ніша бізнесу");
  assert.equal(title("program"), "Цікавить навчання?");
  // ті самі підписи, що в розмітці форм
  const form = fs.readFileSync(new URL("../components/ContactAcademy.tsx", import.meta.url), "utf8");
  for (const label of ["Лінк на Instagram або сайт", "Телефон або Telegram для звʼязку", "Імʼя", "Ніша бізнесу", "Цікавить навчання?"]) {
    assert.ok(form.includes(label), `на сайті немає підпису «${label}»`);
  }
});

test("у кожної колонки є підказка для нетехнічного читача, назви унікальні", () => {
  assert.ok(columns.length >= 40, `розпарсено лише ${columns.length} колонок`);
  assert.deepEqual(columns.filter((c) => !c.hint || c.hint.length < 15).map((c) => c.key), []);
  assert.equal(new Set(columns.map((c) => c.title)).size, columns.length);
  assert.equal(new Set(columns.map((c) => c.key)).size, columns.length);
});

test("у заголовках немає технічного жаргону", () => {
  const jargon = /UTM|Click ID|fbclid|gclid|_fbp|_fbc|User-Agent|хеш|hash|viewport|referrer|IP\b/i;
  assert.deepEqual(columns.filter((c) => jargon.test(c.title)).map((c) => c.title), []);
});
