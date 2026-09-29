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
  { key: 'program', title: 'Цікавить навчання?', width: 230 },
  { key: 'name', title: 'Імʼя', width: 150 },
  { key: 'contact', title: 'Телефон або Telegram для звʼязку', width: 230, kind: 'contact' },
  { key: 'link', title: 'Лінк на Instagram або сайт', width: 230, kind: 'link' },
  { key: 'niche', title: 'Ніша бізнесу', width: 190 },
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
    .addItem('Додати демо-дані (80 заявок)', 'seedDemoData')
    .addItem('Видалити тестові заявки', 'deleteTestLeads')
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
    .setBackground(INK).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
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
    .whenFormulaSatisfied('=(($' + colLetter_('status') + '2="Відмова")+($' + colLetter_('status') + '2="Спам"))>0')
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

/**
 * Роздільник аргументів у формулах залежить від локалі таблиці: у США — кома, в Україні та більшості
 * європейських локалей — крапка з комою. Визначаємо пробною формулою (надійніше за список локалей).
 */
function argSep_(sh) {
  var probe = sh.getRange('A60');
  probe.setFormula('=IF(TRUE,1,2)');
  SpreadsheetApp.flush();
  var ok = probe.getValue() === 1;
  probe.clear();
  return ok ? ',' : ';';
}

function buildStats_(ss) {
  var sh = ss.getSheetByName(STATS_SHEET) || ss.insertSheet(STATS_SHEET);
  sh.getCharts().forEach(function (ch) { sh.removeChart(ch); });
  sh.clear();
  if (sh.getMaxColumns() < 30) sh.insertColumnsAfter(sh.getMaxColumns(), 30 - sh.getMaxColumns());
  sh.setHiddenGridlines(true);
  sh.setTabColor(INK);
  sh.getRange(1, 1, 90, 30).setFontFamily('Nunito').setFontSize(10).setFontColor(INK).setVerticalAlignment('middle');
  [190, 90, 90, 40, 190, 90, 90, 40, 190, 90, 90].forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });

  // у формулах аргументи розділяємо знаком «¦» — fx() замінює його на роздільник локалі таблиці
  var SEP = argSep_(sh);
  var fx = function (f) { return f.split('¦').join(SEP); };

  var L = "'" + SHEET_NAME + "'!";
  var lastCol = colLetter_(COLUMNS[COLUMNS.length - 1].key);
  var data = L + '$A$1:$' + lastCol + '$' + (MAX_ROWS + 1);
  var rng = function (key) { return L + '$' + colLetter_(key) + '$2:$' + colLetter_(key) + '$' + (MAX_ROWS + 1); };
  var created = rng('createdAt'), status = rng('status'), visit = rng('visit');

  sh.getRange('A1').setValue('Заявки marketingpro — зведення').setFontSize(16).setFontWeight('bold');
  sh.getRange('A2').setValue('Рахується автоматично з аркуша «' + SHEET_NAME + '». Нічого тут не редагуйте.').setFontColor(TECH);

  // Ключові цифри — плитки по 3 в ряд (колонки A, E, I)
  var kpi = [
    ['Усього заявок', '=COUNTA(' + created + ')'],
    ['Нових (без обробки)', '=COUNTIF(' + status + '¦"Новий")'],
    ['Сьогодні', '=COUNTIF(' + created + '¦">="&TODAY())'],
    ['За 7 днів', '=COUNTIF(' + created + '¦">="&(TODAY()-6))'],
    ['За 30 днів', '=COUNTIF(' + created + '¦">="&(TODAY()-29))'],
    ['Стали клієнтами', '=COUNTIF(' + status + '¦"Клієнт")'],
    ['Конверсія (без спаму)', '=IFERROR(COUNTIF(' + status + '¦"Клієнт")/(COUNTA(' + created + ')-COUNTIF(' + status + '¦"Спам"))¦0)'],
    ['Повторні візити', '=COUNTIF(' + visit + '¦"Повторний*")']
  ];
  var tileCols = [1, 5, 9];
  kpi.forEach(function (t, i) {
    var r = 4 + Math.floor(i / 3) * 3, c = tileCols[i % 3];
    sh.getRange(r, c, 2, 3).setBackground('#F6F7FA');
    sh.getRange(r, c).setValue(t[0]).setFontColor(TECH).setFontSize(9);
    var v = sh.getRange(r + 1, c).setFormula(fx(t[1])).setFontSize(20).setFontWeight('bold').setHorizontalAlignment('left');
    if (t[0].indexOf('Конверсія') === 0) v.setNumberFormat('0.0%');
  });

  // Розрізи: QUERY сам розтягується під кількість рядків; «Клієнтів» — окрема колонка формул
  var blocks = [
    { title: 'За джерелами', row: 39, col: 1, key: 'source', label: 'Джерело' },
    { title: 'За кампаніями', row: 39, col: 5, key: 'campaign', label: 'Кампанія' },
    { title: 'За курсами академії', row: 39, col: 9, key: 'program', label: 'Навчання' },
    { title: 'За сторінками з формою', row: 56, col: 1, key: 'pageLabel', label: 'Сторінка' },
    { title: 'За типом заявки', row: 56, col: 5, key: 'type', label: 'Тип' },
    { title: 'За днями (останні 14)', row: 56, col: 9, key: 'day', label: 'День', days: true }
  ];
  var idL = colLetter_('id');
  blocks.forEach(function (b) {
    var k = colLetter_(b.key);
    sh.getRange(b.row, b.col).setValue(b.title).setFontWeight('bold').setFontSize(12);

    // рядок запиту QUERY — окрема мова: коми в ньому лишаються комами за будь-якої локалі
    var order = b.days ? k + ' desc' : 'count(' + idL + ') desc';
    var q = 'select ' + k + ', count(' + idL + ') where ' + k + " is not null and " + k + " <> '' group by " + k +
      ' order by ' + order + ' limit 14 label ' + k + " '" + b.label + "', count(" + idL + ") 'Заявок'";
    sh.getRange(b.row + 1, b.col).setFormula(fx('=IFERROR(QUERY(' + data + '¦"' + q + '"¦1)¦"Поки немає даних")'));

    var head = sh.getRange(b.row + 1, b.col, 1, b.days ? 2 : 3);
    head.setFontWeight('bold').setFontColor('#FFFFFF').setBackground(INK);
    if (!b.days) {
      sh.getRange(b.row + 1, b.col + 2).setValue('Клієнтів');
      var f = [];
      for (var i = 0; i < 14; i++) {
        var a1 = sh.getRange(b.row + 2 + i, b.col).getA1Notation();
        f.push([fx('=IF(' + a1 + '=""¦""¦COUNTIFS(' + rng(b.key) + '¦' + a1 + '¦' + status + '¦"Клієнт"))')]);
      }
      sh.getRange(b.row + 2, b.col + 2, 14, 1).setFormulas(f);
    }
    sh.getRange(b.row + 2, b.col, 14, b.days ? 2 : 3).setBorder(null, null, true, null, null, true, LINE, SpreadsheetApp.BorderStyle.SOLID);
  });
  buildCharts_(sh, blocks, created, status, fx);
  sh.setFrozenRows(2);
  return sh;
}

/**
 * Графіки. Дані для двох з них (заявки по днях, статуси) рахуються в службових колонках W:AB праворуч,
 * решта беруть готові таблиці розрізів нижче.
 */
function buildCharts_(sh, blocks, created, status, fx) {
  var W = 23; // колонка W
  sh.getRange(3, W).setValue('Дані для графіків (не редагувати)').setFontColor(TECH).setFontSize(9).setFontWeight('bold');
  sh.getRange(4, W, 1, 3).setValues([['Дата', 'День', 'Заявок']]);
  sh.getRange(4, W + 4, 1, 2).setValues([['Статус', 'Заявок']]);
  sh.getRange(4, W, 1, 6).setFontColor(TECH).setFontSize(9).setFontWeight('bold');
  var dayRows = [];
  for (var i = 0; i < 30; i++) {
    var r = 5 + i, d = 'W' + r;
    dayRows.push([
      '=TODAY()-' + (29 - i),
      fx('=RIGHT("0"&DAY(' + d + ')¦2)&"."&RIGHT("0"&MONTH(' + d + ')¦2)'),
      fx('=COUNTIFS(' + created + '¦">="&' + d + '¦' + created + '¦"<"&(' + d + '+1))')
    ]);
  }
  sh.getRange(5, W, 30, 3).setFormulas(dayRows);
  sh.getRange(5, W, 30, 1).setNumberFormat('dd.mm.yyyy');
  var stNames = Object.keys(STATUSES);
  var stRows = stNames.map(function (n, k) { return [n, fx('=COUNTIF(' + status + '¦AA' + (5 + k) + ')')]; });
  sh.getRange(5, W + 4, stNames.length, 2).setValues(stRows.map(function (x) { return [x[0], '']; }));
  sh.getRange(5, W + 5, stNames.length, 1).setFormulas(stRows.map(function (x) { return [x[1]]; }));
  sh.getRange(5, W, 30, 6).setFontColor(TECH).setFontSize(9);
  [90, 60, 70, 20, 110, 70].forEach(function (w, k) { sh.setColumnWidth(W + k, w); });

  var base = { titleTextStyle: { color: INK, fontSize: 13, bold: true }, legend: { position: 'none' }, backgroundColor: '#FFFFFF',
               chartArea: { left: 44, top: 44, right: 16, bottom: 34 } };
  function opts(chart, o) {
    var all = {}; Object.keys(base).forEach(function (k) { all[k] = base[k]; }); Object.keys(o).forEach(function (k) { all[k] = o[k]; });
    Object.keys(all).forEach(function (k) { chart.setOption(k, all[k]); });
    return chart;
  }
  function put(chart, row, col, w, h) { sh.insertChart(chart.setPosition(row, col, 4, 4).setOption('width', w).setOption('height', h).build()); }
  function block(key) { return blocks.filter(function (b) { return b.key === key; })[0]; }
  function top(b, n) { return sh.getRange(b.row + 1, b.col, n + 1, 2); }

  // ряд 1: динаміка (широкий) + статуси (бублик)
  put(opts(sh.newChart().asColumnChart().addRange(sh.getRange(4, W + 1, 31, 2)).setNumHeaders(1),
    { title: 'Заявки по днях (30 днів)', colors: [BRAND], vAxis: { minValue: 0, format: '0', gridlines: { color: LINE } }, hAxis: { textStyle: { fontSize: 9 }, showTextEvery: 2 }, bar: { groupWidth: '70%' } }),
    13, 1, 820, 250);
  put(opts(sh.newChart().asPieChart().addRange(sh.getRange(4, W + 4, stNames.length + 1, 2)).setNumHeaders(1),
    { title: 'Статуси заявок', pieHole: 0.55, legend: { position: 'right', textStyle: { fontSize: 10 } }, pieSliceText: 'value', chartArea: { left: 12, top: 44, right: 12, bottom: 12 },
      colors: ['#FF2D7E', '#F5B301', '#3D7BFF', '#1FB56B', '#A7ABBA', '#6B7080'] }),
    13, 9, 400, 250);

  // ряд 2: розрізи
  put(opts(sh.newChart().asBarChart().addRange(top(block('source'), 8)).setNumHeaders(1),
    { title: 'Заявки за джерелами', colors: [BRAND], hAxis: { minValue: 0, format: '0', gridlines: { color: LINE } }, chartArea: { left: 150, top: 44, right: 16, bottom: 24 } }),
    26, 1, 400, 250);
  put(opts(sh.newChart().asBarChart().addRange(top(block('campaign'), 8)).setNumHeaders(1),
    { title: 'Заявки за кампаніями', colors: ['#3D7BFF'], hAxis: { minValue: 0, format: '0', gridlines: { color: LINE } }, chartArea: { left: 150, top: 44, right: 16, bottom: 24 } }),
    26, 5, 400, 250);
  put(opts(sh.newChart().asBarChart().addRange(top(block('pageLabel'), 8)).setNumHeaders(1),
    { title: 'Звідки заявки (сторінка з формою)', colors: ['#1FB56B'], hAxis: { minValue: 0, format: '0', gridlines: { color: LINE } }, chartArea: { left: 170, top: 44, right: 16, bottom: 24 } }),
    26, 9, 400, 250);
}

/** Вигадані заявки за 30 днів — щоб побачити, як виглядають таблиця, фільтри, «Аналітика» й графіки. ID = TEST…, тому видаляються кнопкою нижче. */
function seedDemoData() {
  var ui = SpreadsheetApp.getUi();
  var N = 80;
  if (ui.alert('Демо-дані', 'Додати ' + N + ' вигаданих заявок за останні 30 днів для перевірки таблиці, «Аналітики» й графіків?\n\nЇх можна прибрати меню «Видалити тестові заявки».', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) { setup(); sheet = ss.getSheetByName(SHEET_NAME); }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var leads = demoLeads_(N);
    var start = sheet.getLastRow() + 1;
    if (start + N - 1 > MAX_ROWS + 1) throw new Error('Не вистачає місця в таблиці.');
    var rows = leads.map(leadToRow_);
    sheet.getRange(start, 1, N, COLUMNS.length).setValues(rows);
    // клікабельні контакти й посилання — одним викликом на колонку
    ['contact', 'link'].forEach(function (key) {
      var rich = leads.map(function (l) {
        var text = l[key] || '';
        var url = key === 'contact' ? contactUrl_(text) : siteUrl_(text);
        var b = SpreadsheetApp.newRichTextValue().setText(text);
        if (url && text) { try { b.setLinkUrl(url); } catch (e) { /* лишаємо текстом */ } }
        return [b.build()];
      });
      sheet.getRange(start, colIndex_(key), N, 1).setRichTextValues(rich);
    });
  } finally {
    lock.releaseLock();
  }
  ss.toast('Додано ' + N + ' демо-заявок. Перегляньте аркуш «' + STATS_SHEET + '».', 'marketingpro', 8);
}

function demoLeads_(n) {
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var chance = function (p) { return Math.random() < p; };
  var digits = function (k) { var s = ''; for (var i = 0; i < k; i++) s += Math.floor(Math.random() * 10); return s; };
  var names = ['Олена', 'Марія', 'Андрій', 'Ірина', 'Дмитро', 'Наталя', 'Олексій', 'Юлія', 'Катерина', 'Віталій', 'Оксана', 'Сергій', 'Анна', 'Тарас', 'Вікторія', 'Максим'];
  var niches = ['бьюті-студія', 'інтернет-магазин одягу', 'стоматологія', 'фітнес-клуб', 'меблі на замовлення', 'школа англійської', 'квіти', 'нерухомість', 'кав’ярня', 'автосервіс', 'косметологія', 'онлайн-курси'];
  var geo = [['UA', 'Київ', '30'], ['UA', 'Київ', '30'], ['UA', 'Львів', '46'], ['UA', 'Дніпро', '12'], ['UA', 'Одеса', '51'], ['UA', 'Харків', '63'], ['PL', 'Warszawa', '14'], ['DE', 'Berlin', 'BE']];
  var devices = ['Телефон · iOS · Instagram (застосунок)', 'Телефон · Android · Chrome', 'Телефон · iOS · Safari', 'Комп’ютер · Windows · Chrome', 'Комп’ютер · macOS · Safari', 'Телефон · Android · Facebook (застосунок)'];
  var cases = ['Стоматологічна клініка', 'Студія краси повного циклу', 'Мережа магазинів квітів', 'Виробництво меблів', 'Український бренд одягу з власним виробництвом', 'Школа іноземних мов'];
  var programs = ['Для власників бізнесу · 5 тижнів', 'Карʼєра в таргеті · 10 тижнів'];
  var sources = [
    { w: 38, source: 'meta', medium: 'cpc', campaigns: ['sept_leadgen', 'sept_retarget', 'academy_launch'], click: true },
    { w: 16, source: 'instagram', medium: 'social', campaigns: ['bio_link', 'stories'] },
    { w: 14, source: 'google', medium: 'organic', campaigns: [''] },
    { w: 12, source: 'telegram', medium: 'social', campaigns: ['channel_post'] },
    { w: 14, source: 'direct', medium: '', campaigns: [''] },
    { w: 6, source: 'partner.ua', medium: 'referral', campaigns: [''] }
  ];
  var totalW = sources.reduce(function (a, x) { return a + x.w; }, 0);
  var pickSource = function () { var r = Math.random() * totalW; for (var i = 0; i < sources.length; i++) { r -= sources[i].w; if (r <= 0) return sources[i]; } return sources[0]; };
  var statusFor = function (age) {
    var r = Math.random();
    if (age < 1.5) return r < 0.7 ? 'Новий' : r < 0.9 ? 'Зв’язались' : 'В роботі';
    if (age < 7) return r < 0.2 ? 'Новий' : r < 0.4 ? 'Зв’язались' : r < 0.7 ? 'В роботі' : r < 0.82 ? 'Клієнт' : r < 0.95 ? 'Відмова' : 'Спам';
    return r < 0.05 ? 'Новий' : r < 0.15 ? 'Зв’язались' : r < 0.3 ? 'В роботі' : r < 0.5 ? 'Клієнт' : r < 0.85 ? 'Відмова' : 'Спам';
  };
  var used = {}, list = [];
  for (var i = 0; i < n; i++) {
    var age = Math.pow(Math.random(), 0.8) * 30; // трохи більше свіжих
    var src = pickSource(), g = pick(geo), academy = chance(0.28);
    var name = chance(0.9) ? pick(names) : '';
    var link = chance(0.7) ? (chance(0.8) ? 'instagram.com/' + pick(['beauty', 'shop', 'studio', 'clinic', 'fit', 'flowers']) + '_' + digits(3) : 'https://' + pick(['moda', 'dent', 'mebli', 'kava']) + digits(2) + '.com.ua') : '';
    var niche = chance(0.65) ? pick(niches) : '';
    var pages = 1 + Math.floor(Math.random() * 9), secs = 20 + Math.floor(Math.random() * 500);
    var id; do { id = 'TEST' + digits(4); } while (used[id]); used[id] = 1;
    var seen = []; for (var k = 0, m = Math.floor(Math.random() * 4); k < m; k++) { var c = pick(cases); if (seen.indexOf(c) < 0) seen.push(c); }
    var returning = chance(0.25);
    list.push({
      id: id,
      createdAt: new Date(Date.now() - age * 86400000).toISOString(),
      status: statusFor(age),
      type: academy ? 'Академія' : 'Консультація',
      program: academy ? pick(programs) : '',
      name: name,
      contact: chance(0.6) ? '+38 0' + pick(['50', '63', '66', '67', '68', '73', '93', '95', '96', '97', '98']) + ' ' + digits(3) + ' ' + digits(2) + ' ' + digits(2) : '@' + pick(['olena', 'andrii', 'maria', 'dima', 'iryna', 'taras', 'yulia']) + '_' + digits(3),
      link: link,
      niche: niche,
      quality: [name, link, niche].filter(Boolean).length === 3 ? 'Повна' : [name, link, niche].filter(Boolean).length ? 'Часткова' : 'Лише контакт',
      source: src.source,
      medium: src.medium,
      campaign: pick(src.campaigns),
      clickId: src.click ? 'IwAR' + digits(6) : '',
      pageLabel: academy ? 'Академія' : pick(['Головна', 'Головна', 'Кейси', 'Кейс: ' + pick(cases)]),
      referrer: src.source === 'direct' ? '' : 'https://' + (src.source === 'meta' ? 'l.facebook.com' : src.source + '.com') + '/',
      landing: pick(['/', '/', '/cases', '/academy']),
      casesViewed: seen.join(', '),
      pagesViewed: String(pages),
      timeOnSite: secs < 60 ? secs + ' с' : Math.floor(secs / 60) + ' хв ' + (secs % 60) + ' с',
      visit: returning ? 'Повторний (2-й візит)' : 'Перший візит',
      country: g[0], region: g[2], city: g[1],
      device: pick(devices),
      lang: g[0] === 'UA' ? 'uk-UA' : g[0] === 'PL' ? 'pl-PL' : 'de-DE',
      tz: g[0] === 'UA' ? 'Europe/Kyiv' : g[0] === 'PL' ? 'Europe/Warsaw' : 'Europe/Berlin',
      viewport: pick(['390x844', '412x915', '1440x900', '1920x1080', '375x812']),
      ipHash: digits(10)
    });
  }
  list.sort(function (a, b) { return a.createdAt < b.createdAt ? -1 : 1; });
  return list;
}

/**
 * Видаляє тестові заявки: ті, що додані меню «Додати тестову заявку» / перевірками вебхука
 * (ID починається з TEST або джерело = test). Справжні заявки не чіпає.
 */
function deleteTestLeads() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  var ui = SpreadsheetApp.getUi();
  var last = sheet ? sheet.getLastRow() : 0;
  if (last < 2) { ui.alert('Заявок ще немає.'); return; }

  var ids = sheet.getRange(2, colIndex_('id'), last - 1, 1).getValues();
  var sources = sheet.getRange(2, colIndex_('source'), last - 1, 1).getValues();
  var rows = [];
  for (var i = 0; i < ids.length; i++) {
    if (/^TEST/i.test(String(ids[i][0])) || String(sources[i][0]).toLowerCase() === 'test') rows.push(i + 2);
  }
  if (!rows.length) { ui.alert('Тестових заявок не знайдено.'); return; }
  if (ui.alert('Видалити тестові заявки', 'Знайдено ' + rows.length + ' шт. Видалити їх безповоротно?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    for (var j = rows.length - 1; j >= 0; j--) sheet.deleteRow(rows[j]); // знизу вгору, щоб номери не зсувались
    setup(); // повертає таблиці повний розмір оформлення й перераховує «Аналітику»
  } finally {
    lock.releaseLock();
  }
  ss.toast('Видалено тестових заявок: ' + rows.length, 'marketingpro', 6);
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

    var values = leadToRow_(lead);
    sheet.getRange(row, 1, 1, COLUMNS.length).setValues([values]);

    // клікабельні контакти й посилання — косметика: заявка вже записана, тому збій тут не має її «провалювати»
    try {
      linkCell_(sheet, row, 'contact', contactUrl_(lead.contact));
      linkCell_(sheet, row, 'link', siteUrl_(lead.link));
    } catch (linkErr) {
      console.warn('Не вдалося зробити посилання: ' + linkErr);
    }
    return { row: row, duplicate: false };
  } finally {
    lock.releaseLock();
  }
}

/** Заявка → масив значень у порядку колонок COLUMNS (спільний для запису з сайту й демо-даних). */
function leadToRow_(lead) {
  var created = lead.createdAt ? new Date(lead.createdAt) : new Date();
  return COLUMNS.map(function (c) {
    if (c.manual) return '';
    if (c.key === 'status') return lead.status || 'Новий';
    if (c.key === 'createdAt') return created;
    if (c.key === 'day') return Utilities.formatDate(created, TIMEZONE, 'yyyy-MM-dd');
    if (c.key === 'month') return Utilities.formatDate(created, TIMEZONE, 'yyyy-MM');
    if (c.key === 'week') return isoWeek_(created);
    var v = lead[c.key];
    return v === undefined || v === null ? '' : String(v);
  });
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

/**
 * @nick або t.me/nick → посилання на Telegram. Номер телефону лишається звичайним текстом:
 * Google Sheets не приймає посилань зі схемою tel: (setLinkUrl кидає помилку).
 */
function contactUrl_(raw) {
  var s = String(raw || '').trim();
  if (!s) return '';
  var tg = s.match(/^(?:https?:\/\/)?(?:t\.me|telegram\.me)\/([A-Za-z0-9_]{3,})/i);
  if (tg) return 'https://t.me/' + tg[1];
  if (/^@[A-Za-z0-9_]{3,}$/.test(s)) return 'https://t.me/' + s.slice(1);
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
