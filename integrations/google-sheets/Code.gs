/**
 * @OnlyCurrentDoc
 * (скрипт бачить тільки цю таблицю — не весь Google Диск)
 *
 * marketingpro — заявки з сайту → Google Sheets.
 *
 * Скрипт живе всередині таблиці (Розширення → Apps Script) і робить дві речі:
 *   1. setup()  — один раз створює й гарно оформлює аркуш «Заявки»;
 *   2. doPost() — приймає заявки від сайту (Vercel, /api/lead) і дописує рядок.
 *
 * Інструкція із запуску: integrations/google-sheets/README.md
 */

var SHEET_NAME = 'Заявки';
var TIMEZONE = 'Europe/Kyiv';
var MAX_ROWS = 5000; // на скільки рядків розтягнуто оформлення, випадаючі списки й підсвітка
var HEADER_HEIGHT = 44;
var ROW_HEIGHT = 30;

var BRAND = '#FF2D7E';
var INK = '#17171C';
var TECH = '#5B6070';
var LINE = '#E7E8EE';

/** Статуси для менеджерів: назва → [колір фону, колір тексту]. */
var STATUSES = {
  'Новий': ['#FFE1EC', '#B0104F'],
  'Зв’язались': ['#FFF1C7', '#7A5A00'],
  'В роботі': ['#DCE8FF', '#1F4FA8'],
  'Клієнт': ['#D8F5E2', '#12683A'],
  'Відмова': ['#ECEDF1', '#6B7080'],
  'Спам': ['#ECEDF1', '#6B7080']
};

/**
 * Колонки. key — поле заявки, яке надсилає сайт. manual — колонка для ручного заповнення (сайт її не чіпає).
 * tech — технічні колонки: їх видно за кліком на «+» над таблицею, щоб основний вигляд лишався чистим.
 */
var COLUMNS = [
  { key: 'createdAt', title: 'Дата і час', width: 135, kind: 'date' },
  { key: 'status', title: 'Статус', width: 115, kind: 'status' },
  { key: 'type', title: 'Тип', width: 120 },
  { key: 'program', title: 'Курс', width: 220 },
  { key: 'name', title: 'Ім’я', width: 150 },
  { key: 'contact', title: 'Телефон / Telegram', width: 175, kind: 'contact' },
  { key: 'link', title: 'Instagram / сайт', width: 220, kind: 'link' },
  { key: 'niche', title: 'Ніша', width: 180 },
  { key: 'quality', title: 'Заповненість', width: 120 },
  { key: 'source', title: 'Джерело', width: 170 },
  { key: 'campaign', title: 'Кампанія', width: 170 },
  { key: 'manager', title: 'Коментар менеджера', width: 280, manual: true },

  // технічні (згорнуті) — для фільтрів, звітів і розбору, звідки прийшла заявка
  { key: 'id', title: 'ID заявки', width: 105, tech: true },
  { key: 'day', title: 'День', width: 100, tech: true },
  { key: 'week', title: 'Тиждень', width: 90, tech: true },
  { key: 'month', title: 'Місяць', width: 90, tech: true },
  { key: 'pageLabel', title: 'Сторінка з формою', width: 230, tech: true },
  { key: 'medium', title: 'UTM medium', width: 110, tech: true },
  { key: 'content', title: 'UTM content', width: 150, tech: true },
  { key: 'term', title: 'UTM term', width: 130, tech: true },
  { key: 'clickId', title: 'Click ID (fbclid/gclid)', width: 170, tech: true },
  { key: 'referrer', title: 'Звідки прийшов', width: 220, tech: true },
  { key: 'landing', title: 'Перша сторінка', width: 150, tech: true },
  { key: 'casesViewed', title: 'Які кейси дивився', width: 260, tech: true },
  { key: 'pagesViewed', title: 'Сторінок за візит', width: 120, tech: true },
  { key: 'timeOnSite', title: 'Час на сайті', width: 110, tech: true },
  { key: 'visit', title: 'Візит', width: 160, tech: true },
  { key: 'firstVisit', title: 'Перший візит', width: 150, tech: true },
  { key: 'country', title: 'Країна', width: 80, tech: true },
  { key: 'region', title: 'Регіон', width: 90, tech: true },
  { key: 'city', title: 'Місто', width: 120, tech: true },
  { key: 'device', title: 'Пристрій', width: 240, tech: true },
  { key: 'lang', title: 'Мова', width: 80, tech: true },
  { key: 'tz', title: 'Часовий пояс', width: 140, tech: true },
  { key: 'viewport', title: 'Екран', width: 90, tech: true },
  { key: 'fbp', title: 'Meta _fbp', width: 170, tech: true },
  { key: 'fbc', title: 'Meta _fbc', width: 170, tech: true },
  { key: 'ipHash', title: 'IP (хеш)', width: 110, tech: true },
  { key: 'ua', title: 'User-Agent', width: 320, tech: true }
];

/* ------------------------------------------------------------------ *
 *  Меню й початкове налаштування
 * ------------------------------------------------------------------ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('marketingpro')
    .addItem('Налаштувати / оновити оформлення', 'setup')
    .addItem('Нові зверху (відсортувати)', 'sortNewestFirst')
    .addItem('Показати секрет для сайту', 'showSecret')
    .addItem('Додати тестову заявку', 'addTestLead')
    .addToUi();
}

/** Створює аркуш, оформлення й секрет. Можна запускати повторно — дані заявок не чіпає. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(TIMEZONE);

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    // перший аркуш (порожній «Аркуш1» / «Sheet1») перейменовуємо, якщо в ньому нічого немає
    var first = ss.getSheets()[0];
    var empty = first.getLastRow() <= 1 && first.getLastColumn() <= 1 && !first.getRange(1, 1).getValue();
    sheet = empty ? first.setName(SHEET_NAME) : ss.insertSheet(SHEET_NAME, 0);
  }
  ss.setActiveSheet(sheet);

  var n = COLUMNS.length;
  ensureSize_(sheet, MAX_ROWS + 1, n);

  var all = sheet.getRange(1, 1, MAX_ROWS + 1, n);
  var body = sheet.getRange(2, 1, MAX_ROWS, n);

  // база
  all.setFontFamily('Nunito').setFontSize(10).setFontColor(INK).setVerticalAlignment('middle').setHorizontalAlignment('left')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sheet.setRowHeights(2, MAX_ROWS, ROW_HEIGHT);
  body.setBorder(null, null, true, null, null, true, LINE, SpreadsheetApp.BorderStyle.SOLID);

  // шапка
  var header = sheet.getRange(1, 1, 1, n);
  header.setValues([COLUMNS.map(function (c) { return c.title; })])
    .setFontWeight('bold').setFontSize(10).setFontColor('#FFFFFF').setHorizontalAlignment('left')
    .setBackground(INK);
  sheet.setRowHeight(1, HEADER_HEIGHT);
  COLUMNS.forEach(function (c, i) {
    var col = i + 1;
    sheet.setColumnWidth(col, c.width);
    var h = sheet.getRange(1, col);
    if (c.tech) h.setBackground(TECH);
    if (c.key === 'createdAt' || c.key === 'status') h.setBackground(BRAND);
    // текстові колонки: «звичайний текст» — телефон не перетворюється на число, «=» не стає формулою
    var colRange = sheet.getRange(2, col, MAX_ROWS, 1);
    if (c.kind === 'date') colRange.setNumberFormat('dd.mm.yyyy  HH:mm');
    else colRange.setNumberFormat('@');
    if (c.tech) colRange.setFontColor(TECH);
    if (c.manual) colRange.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  });

  // дата — по центру, статус — «чіпом»
  sheet.getRange(2, 1, MAX_ROWS, 1).setFontWeight('bold');
  sheet.getRange(2, colIndex_('status'), MAX_ROWS, 1).setHorizontalAlignment('center').setFontWeight('bold');

  // випадаючий список статусів
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.keys(STATUSES), true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, colIndex_('status'), MAX_ROWS, 1).setDataValidation(rule);

  // умовне форматування: колір статусу + приглушені рядки «Відмова» / «Спам»
  var rules = [];
  var statusRange = sheet.getRange(2, colIndex_('status'), MAX_ROWS, 1);
  Object.keys(STATUSES).forEach(function (name) {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(name).setBackground(STATUSES[name][0]).setFontColor(STATUSES[name][1])
      .setRanges([statusRange]).build());
  });
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=OR($' + colLetter_('status') + '2="Відмова",$' + colLetter_('status') + '2="Спам")')
    .setFontColor('#9A9EAD').setRanges([body]).build());
  sheet.setConditionalFormatRules(rules);

  // шапка завжди на екрані, перші дві колонки (дата, статус) теж
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);
  sheet.setTabColor(BRAND);

  // фільтр по всій таблиці
  var oldFilter = sheet.getFilter();
  if (oldFilter) oldFilter.remove();
  sheet.getRange(1, 1, MAX_ROWS + 1, n).createFilter();

  // технічні колонки — у згорнутій групі («+» над літерами колонок)
  var firstTech = colIndex_(COLUMNS.filter(function (c) { return c.tech; })[0].key);
  var techCount = n - firstTech + 1;
  var techRange = sheet.getRange(1, firstTech, 1, techCount);
  try {
    if (!sheet.getColumnGroup(firstTech, 1)) techRange.shiftColumnGroupDepth(1);
  } catch (e) {
    techRange.shiftColumnGroupDepth(1);
  }
  sheet.setColumnGroupControlPosition(SpreadsheetApp.GroupControlTogglePosition.BEFORE);
  try { sheet.getColumnGroup(firstTech, 1).collapse(); } catch (e2) { /* вже згорнуто */ }

  // зайві колонки праворуч і рядки знизу прибираємо — чиста таблиця
  if (sheet.getMaxColumns() > n) sheet.deleteColumns(n + 1, sheet.getMaxColumns() - n);
  if (sheet.getMaxRows() > MAX_ROWS + 1) sheet.deleteRows(MAX_ROWS + 2, sheet.getMaxRows() - MAX_ROWS - 1);

  buildStats_(ss);
  ss.setActiveSheet(sheet);

  // секрет для сайту
  var props = PropertiesService.getScriptProperties();
  var created = false;
  if (!props.getProperty('LEAD_SECRET')) {
    props.setProperty('LEAD_SECRET', (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, ''));
    created = true;
  }
  ss.toast('Оформлення готове.' + (created ? ' Секрет створено — меню marketingpro → «Показати секрет».' : ''), 'marketingpro', 8);
  if (created) showSecret();
}

/** Тиждень за ISO-8601 (пн–нд) у Київському часі: «2026-W40». */
function isoWeek_(date) {
  var ymd = Utilities.formatDate(date, TIMEZONE, 'yyyy-MM-dd').split('-');
  var d = new Date(Date.UTC(+ymd[0], +ymd[1] - 1, +ymd[2]));
  var day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return d.getUTCFullYear() + '-W' + (week < 10 ? '0' : '') + week;
}

/** Один клік: найновіші заявки зверху. Запускати вручну, коли зручно (автоматично не сортуємо, щоб рядки не «тікали» від менеджера). */
function sortNewestFirst() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var last = sheet.getLastRow();
  if (last > 2) sheet.getRange(2, 1, last - 1, COLUMNS.length).sort({ column: 1, ascending: false });
}

/** Показує секрет, який треба вписати у Vercel як LEAD_WEBHOOK_SECRET. */
function showSecret() {
  var secret = PropertiesService.getScriptProperties().getProperty('LEAD_SECRET');
  if (!secret) { setup(); return; }
  Logger.log('LEAD_WEBHOOK_SECRET = ' + secret);
  SpreadsheetApp.getUi().alert(
    'Секрет для сайту',
    'Вставте це значення у Vercel як змінну LEAD_WEBHOOK_SECRET (нікому не показуйте):\n\n' + secret,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/** Рядок для перевірки, що все працює (без сайту). */
function addTestLead() {
  var res = writeLead_({
    id: 'TEST' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    type: 'Консультація', program: '', name: 'Тест', contact: '@marketingpro_ua',
    link: 'instagram.com/marketingpro.company', niche: 'перевірка інтеграції',
    pageLabel: 'Головна', source: 'test', device: 'Комп’ютер · Chrome', country: 'UA', city: 'Київ'
  });
  SpreadsheetApp.getActiveSpreadsheet().toast('Тестову заявку додано (рядок ' + res.row + ')', 'marketingpro', 5);
}


/* ------------------------------------------------------------------ *
 *  Аркуш «Аналітика» — зведення формулами (оновлюється саме)
 * ------------------------------------------------------------------ */

var STATS_SHEET = 'Аналітика';

function buildStats_(ss) {
  var sh = ss.getSheetByName(STATS_SHEET) || ss.insertSheet(STATS_SHEET);
  sh.clear();
  sh.setHiddenGridlines(true);
  sh.setTabColor(INK);
  sh.getRange(1, 1, 60, 13).setFontFamily('Nunito').setFontSize(10).setFontColor(INK).setVerticalAlignment('middle');
  [190, 90, 90, 40, 190, 90, 90, 40, 190, 90, 90].forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });

  var L = "'" + SHEET_NAME + "'!";
  var lastCol = colLetter_(COLUMNS[COLUMNS.length - 1].key);
  var data = L + '$A$1:$' + lastCol + '$' + (MAX_ROWS + 1);
  var rng = function (key) { return L + '$' + colLetter_(key) + '$2:$' + colLetter_(key) + '$' + (MAX_ROWS + 1); };
  var created = rng('createdAt'), status = rng('status'), day = rng('day'), visit = rng('visit');

  sh.getRange('A1').setValue('Заявки marketingpro — зведення').setFontSize(16).setFontWeight('bold');
  sh.getRange('A2').setValue('Рахується автоматично з аркуша «' + SHEET_NAME + '». Нічого тут не редагуйте.').setFontColor(TECH);

  // Ключові цифри — плитки по 4 в ряд (колонки A, E, I…)
  var kpi = [
    ['Усього заявок', '=COUNTA(' + created + ')'],
    ['Нових (без обробки)', '=COUNTIF(' + status + ',"Новий")'],
    ['Сьогодні', '=COUNTIF(' + day + ',TEXT(TODAY(),"yyyy-mm-dd"))'],
    ['За 7 днів', '=COUNTIFS(' + created + ',">="&(NOW()-7))'],
    ['За 30 днів', '=COUNTIFS(' + created + ',">="&(NOW()-30))'],
    ['Стали клієнтами', '=COUNTIF(' + status + ',"Клієнт")'],
    ['Конверсія (без спаму)', '=IFERROR(COUNTIF(' + status + ',"Клієнт")/(COUNTA(' + created + ')-COUNTIF(' + status + ',"Спам")),0)'],
    ['Повторні візити', '=COUNTIF(' + visit + ',"Повторний*")']
  ];
  var tileCols = [1, 5, 9];
  kpi.forEach(function (t, i) {
    var r = 4 + Math.floor(i / 3) * 3, c = tileCols[i % 3];
    sh.getRange(r, c, 2, 3).setBackground('#F6F7FA');
    sh.getRange(r, c).setValue(t[0]).setFontColor(TECH).setFontSize(9);
    var v = sh.getRange(r + 1, c).setFormula(t[1]).setFontSize(20).setFontWeight('bold').setHorizontalAlignment('left');
    if (t[0].indexOf('Конверсія') === 0) v.setNumberFormat('0.0%');
  });

  // Розрізи: QUERY сам розтягується під кількість рядків; «Клієнтів» — окрема колонка формул
  var blocks = [
    { title: 'За джерелами', row: 13, col: 1, key: 'source', label: 'Джерело' },
    { title: 'За кампаніями', row: 13, col: 5, key: 'campaign', label: 'Кампанія' },
    { title: 'За курсами академії', row: 13, col: 9, key: 'program', label: 'Курс' },
    { title: 'За сторінками з формою', row: 30, col: 1, key: 'pageLabel', label: 'Сторінка' },
    { title: 'За типом заявки', row: 30, col: 5, key: 'type', label: 'Тип' },
    { title: 'За днями (останні 14)', row: 30, col: 9, key: 'day', label: 'День', days: true }
  ];
  var idL = colLetter_('id');
  blocks.forEach(function (b) {
    var k = colLetter_(b.key);
    sh.getRange(b.row, b.col).setValue(b.title).setFontWeight('bold').setFontSize(12);

    var q = b.days
      ? 'select ' + k + ', count(' + idL + ') where ' + k + " is not null and " + k + " <> '' group by " + k + ' order by ' + k + ' desc limit 14 label ' + k + " '" + b.label + "', count(" + idL + ") 'Заявок'"
      : 'select ' + k + ', count(' + idL + ') where ' + k + " is not null and " + k + " <> '' group by " + k + ' order by count(' + idL + ') desc limit 14 label ' + k + " '" + b.label + "', count(" + idL + ") 'Заявок'";
    sh.getRange(b.row + 1, b.col).setFormula('=IFERROR(QUERY(' + data + ',"' + q + '",1),"Поки немає даних")');

    var head = sh.getRange(b.row + 1, b.col, 1, b.days ? 2 : 3);
    head.setFontWeight('bold').setFontColor('#FFFFFF').setBackground(INK);
    if (!b.days) {
      sh.getRange(b.row + 1, b.col + 2).setValue('Клієнтів');
      var f = [];
      for (var i = 0; i < 14; i++) {
        var a1 = sh.getRange(b.row + 2 + i, b.col).getA1Notation();
        f.push(['=IF(' + a1 + '="","",COUNTIFS(' + rng(b.key) + ',' + a1 + ',' + status + ',"Клієнт"))']);
      }
      sh.getRange(b.row + 2, b.col + 2, 14, 1).setFormulas(f);
    }
    sh.getRange(b.row + 2, b.col, 14, b.days ? 2 : 3).setBorder(null, null, true, null, null, true, LINE, SpreadsheetApp.BorderStyle.SOLID);
  });
  sh.setFrozenRows(2);
  return sh;
}

/* ------------------------------------------------------------------ *
 *  Прийом заявок із сайту
 * ------------------------------------------------------------------ */

/** POST { secret, lead } → { ok: true, id } | { ok: false, error }. */
function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var secret = PropertiesService.getScriptProperties().getProperty('LEAD_SECRET');
    if (!secret || !safeEqual_(String(body.secret || ''), secret)) return json_({ ok: false, error: 'forbidden' });

    var lead = body.lead;
    if (!lead || typeof lead !== 'object' || !lead.contact) return json_({ ok: false, error: 'bad_lead' });

    var res = writeLead_(lead);
    return json_({ ok: true, id: lead.id, duplicate: res.duplicate });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return json_({ ok: false, error: 'server_error' });
  }
}

/** Перевірка, що розгортання живе: відкрити адресу /exec у браузері. */
function doGet() {
  return json_({ ok: true, service: 'marketingpro leads' });
}

/** Дописує заявку. Під замком, щоб дві одночасні заявки не потрапили в один рядок; повтор із тим самим ID ігнорується. */
function writeLead_(lead) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) { setup(); sheet = ss.getSheetByName(SHEET_NAME); }

    var idCol = colIndex_('id');
    var last = sheet.getLastRow();
    if (lead.id && last > 1) {
      var found = sheet.getRange(2, idCol, last - 1, 1).createTextFinder(String(lead.id)).matchEntireCell(true).findNext();
      if (found) return { row: found.getRow(), duplicate: true };
    }

    var row = last + 1;
    if (row > MAX_ROWS + 1) throw new Error('Таблиця заповнена (' + MAX_ROWS + ' заявок). Перенесіть старі в архів.');

    var created = lead.createdAt ? new Date(lead.createdAt) : new Date();
    var values = COLUMNS.map(function (c) {
      if (c.manual) return '';
      if (c.key === 'status') return 'Новий';
      if (c.key === 'createdAt') return created;
      if (c.key === 'day') return Utilities.formatDate(created, TIMEZONE, 'yyyy-MM-dd');
      if (c.key === 'month') return Utilities.formatDate(created, TIMEZONE, 'yyyy-MM');
      if (c.key === 'week') return isoWeek_(created);
      var v = lead[c.key];
      return v === undefined || v === null ? '' : String(v);
    });
    sheet.getRange(row, 1, 1, COLUMNS.length).setValues([values]);

    // клікабельні контакти й посилання
    linkCell_(sheet, row, 'contact', contactUrl_(lead.contact));
    linkCell_(sheet, row, 'link', siteUrl_(lead.link));
    return { row: row, duplicate: false };
  } finally {
    lock.releaseLock();
  }
}

/* ------------------------------------------------------------------ *
 *  Допоміжні
 * ------------------------------------------------------------------ */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Порівняння без раннього виходу — щоб секрет не вгадувався по часу відповіді. */
function safeEqual_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function colIndex_(key) {
  for (var i = 0; i < COLUMNS.length; i++) if (COLUMNS[i].key === key) return i + 1;
  throw new Error('Немає колонки ' + key);
}

function colLetter_(key) {
  var n = colIndex_(key), s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - m) / 26); }
  return s;
}

function ensureSize_(sheet, rows, cols) {
  if (sheet.getMaxRows() < rows) sheet.insertRowsAfter(sheet.getMaxRows(), rows - sheet.getMaxRows());
  if (sheet.getMaxColumns() < cols) sheet.insertColumnsAfter(sheet.getMaxColumns(), cols - sheet.getMaxColumns());
}

function linkCell_(sheet, row, key, url) {
  if (!url) return;
  var cell = sheet.getRange(row, colIndex_(key));
  var text = String(cell.getValue());
  if (!text) return;
  cell.setRichTextValue(SpreadsheetApp.newRichTextValue().setText(text).setLinkUrl(url).build());
}

/** @nick → Telegram, номер → tel:. Незрозумілий формат — просто текст. */
function contactUrl_(raw) {
  var s = String(raw || '').trim();
  if (!s) return '';
  var tg = s.match(/^(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([A-Za-z0-9_]{3,})/i);
  if (tg) return 'https://t.me/' + tg[1];
  if (/^@[A-Za-z0-9_]{3,}$/.test(s)) return 'https://t.me/' + s.slice(1);
  var digits = s.replace(/[^\d]/g, '');
  if (/^[+\d][\d\s().-]{8,}$/.test(s) && digits.length >= 10 && digits.length <= 15) {
    if (digits.length === 10 && digits.charAt(0) === '0') digits = '38' + digits; // 0637194373 → +380637194373
    return 'tel:+' + digits;
  }
  return '';
}

/** «instagram.com/x», «https://site.ua», «@handle» (Instagram) → https-посилання. */
function siteUrl_(raw) {
  var s = String(raw || '').trim();
  if (!s || /\s/.test(s)) return '';
  if (/^@[A-Za-z0-9._]{2,}$/.test(s)) return 'https://instagram.com/' + s.slice(1);
  if (/^https?:\/\//i.test(s)) return s;
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(s)) return 'https://' + s;
  return '';
}
