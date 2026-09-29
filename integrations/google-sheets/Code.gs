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
var EDIT_TINT = '#FFEAF3'; // світло-рожевий фон колонок, які заповнює команда

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
/** Колонка, яку заповнює команда вручну (рожева шапка). Статус теж: його ставить сайт, а далі міняє менеджер. */
function isEdit_(c) { return !!c.manual || c.key === 'status'; }

var COLUMNS = [
  { key: 'createdAt', title: 'Коли надійшла заявка', width: 150, kind: 'date',
    hint: 'Дата й година, коли людина натиснула «Надіслати». Київський час.' },
  { key: 'status', title: 'Статус', width: 120, kind: 'status',
    hint: 'Оберіть зі списку:\n• Новий — ще ніхто не писав\n• Зв’язались — вже написали або подзвонили\n• В роботі — йдуть перемовини\n• Клієнт — купили\n• Відмова — не підійшло\n• Спам — помилкова або фейкова заявка' },
  { key: 'type', title: 'Тип заявки', width: 130,
    hint: 'Консультація — форма «Безкоштовна консультація» на сайті.\nАкадемія — форма на сторінці навчання.' },
  { key: 'program', title: 'Цікавить навчання?', width: 230,
    hint: 'Який напрям навчання людина вибрала у формі на сторінці Академії. Порожньо — не вибрала або це заявка на консультацію.' },
  { key: 'name', title: 'Імʼя', width: 150, hint: 'Як людина себе назвала у формі.' },
  { key: 'contact', title: 'Телефон або Telegram для звʼязку', width: 230, kind: 'contact',
    hint: 'Єдине обовʼязкове поле форми. Якщо це Telegram-нікнейм (@нік) — на нього можна натиснути й відкрити чат.' },
  { key: 'link', title: 'Лінк на Instagram або сайт', width: 230, kind: 'link',
    hint: 'Посилання на бізнес людини. На нього можна натиснути й відкрити.' },
  { key: 'niche', title: 'Ніша бізнесу', width: 190, hint: 'Чим займається бізнес — так, як людина написала у формі.' },
  { key: 'quality', title: 'Наскільки заповнена заявка', width: 170,
    hint: 'Повна — є імʼя, лінк і ніша.\nЧасткова — заповнено одне чи два поля.\nЛише контакт — тільки телефон або Telegram.\nЗручно першими обробляти повні заявки.' },
  { key: 'source', title: 'Звідки прийшла людина', width: 190,
    hint: 'Головне джерело заявки: реклама Meta, Instagram, Google, Telegram, прямий візит тощо. Визначається автоматично за посиланням, з якого людина потрапила на сайт.' },
  { key: 'campaign', title: 'З якої реклами', width: 170,
    hint: 'Назва рекламної кампанії, якщо людина прийшла з реклами з міткою (utm_campaign). Порожньо — реклама без мітки або не з реклами.' },
  { key: 'responsible', title: 'Відповідальний', width: 150, manual: true,
    hint: 'Заповнюється вручну: хто з команди веде цю заявку.' },
  { key: 'nextContact', title: 'Наступний контакт', width: 150, manual: true, kind: 'day',
    hint: 'Заповнюється вручну: коли треба повернутися до людини (дата).' },
  { key: 'manager', title: 'Коментар менеджера', width: 280, manual: true,
    hint: 'Заповнюється вручну: нотатки по розмові, домовленості, причина відмови.' },

  // Далі — службові колонки (згорнуті: натисніть «+» над літерами колонок). Для фільтрів і розбору, звідки прийшла заявка.
  { key: 'id', title: 'Номер заявки', width: 120, tech: true,
    hint: 'Унікальний код заявки. Потрібен, щоб одну й ту саму заявку не записати двічі.' },
  { key: 'day', title: 'Дата (для фільтра)', width: 130, tech: true, hint: 'День заявки. Зручно фільтрувати й групувати за днями.' },
  { key: 'week', title: 'Тиждень (для фільтра)', width: 140, tech: true, hint: 'Номер тижня року. Зручно рахувати заявки за тижнями.' },
  { key: 'month', title: 'Місяць (для фільтра)', width: 140, tech: true, hint: 'Місяць заявки. Зручно рахувати заявки за місяцями.' },
  { key: 'pageLabel', title: 'Де заповнили форму', width: 240, tech: true,
    hint: 'На якій сторінці сайту людина залишила заявку: головна, кейси, конкретний кейс, академія.' },
  { key: 'page', title: 'Адреса сторінки', width: 190, tech: true, hint: 'Технічна адреса сторінки, де була форма (наприклад /cases/dental).' },
  { key: 'medium', title: 'Тип джерела', width: 130, tech: true,
    hint: 'Вид трафіку з мітки реклами (utm_medium): платна реклама, соцмережі, пошук, розсилка.' },
  { key: 'content', title: 'Яке оголошення', width: 170, tech: true, hint: 'Мітка конкретного оголошення чи креативу (utm_content), якщо була.' },
  { key: 'term', title: 'Аудиторія або ключове слово', width: 190, tech: true, hint: 'Мітка аудиторії або ключового слова (utm_term), якщо була.' },
  { key: 'clickId', title: 'Код рекламного кліку', width: 180, tech: true,
    hint: 'Технічний код, який реклама Meta/Google додає до посилання. Показує, що людина прийшла саме з рекламного кліку.' },
  { key: 'referrer', title: 'З якого сайту прийшли', width: 230, tech: true, hint: 'Адреса сайту або застосунку, з якого людина перейшла на наш сайт.' },
  { key: 'landing', title: 'З якої сторінки почали', width: 170, tech: true, hint: 'Перша сторінка, яку людина відкрила за цей візит.' },
  { key: 'casesViewed', title: 'Переглянуті кейси', width: 270, tech: true,
    hint: 'Які кейси людина відкривала до заявки. Показує, що її зацікавило.' },
  { key: 'pagesViewed', title: 'Переглянуто сторінок', width: 150, tech: true, hint: 'Скільки сторінок сайту людина відкрила за цей візит.' },
  { key: 'timeOnSite', title: 'Час на сайті до заявки', width: 170, tech: true, hint: 'Скільки минуло від початку візиту до надсилання форми.' },
  { key: 'visit', title: 'Перший чи повторний візит', width: 190, tech: true,
    hint: 'Чи заходила людина на сайт раніше. Повторні візити — сильніший інтерес.' },
  { key: 'firstVisit', title: 'Перший візит на сайт', width: 160, tech: true, hint: 'Коли людина вперше зайшла на сайт (з цього браузера).' },
  { key: 'country', title: 'Країна', width: 90, tech: true, hint: 'Визначається автоматично за адресою в інтернеті. Може бути неточною (VPN).' },
  { key: 'region', title: 'Область / регіон', width: 130, tech: true, hint: 'Визначається автоматично. Може бути неточним.' },
  { key: 'city', title: 'Місто', width: 130, tech: true, hint: 'Визначається автоматично. Може бути неточним.' },
  { key: 'device', title: 'З чого зайшли (пристрій і браузер)', width: 270, tech: true,
    hint: 'Телефон чи комп’ютер, система і браузер. Позначка «Instagram (застосунок)» означає, що людина відкрила сайт всередині Instagram.' },
  { key: 'lang', title: 'Мова браузера', width: 120, tech: true, hint: 'Мова, налаштована в браузері людини.' },
  { key: 'tz', title: 'Часовий пояс', width: 150, tech: true, hint: 'Часовий пояс пристрою людини. Допомагає зрозуміти, з якої країни вона.' },
  { key: 'viewport', title: 'Розмір екрана', width: 120, tech: true, hint: 'Розмір вікна браузера в пікселях (ширина × висота).' },
  { key: 'fbp', title: 'Технічна мітка Meta (1)', width: 190, tech: true,
    hint: 'Потрібна лише якщо підключимо Meta Pixel / Conversions API, щоб звʼязати заявку з рекламним кліком. Зараз можна ігнорувати.' },
  { key: 'fbc', title: 'Технічна мітка Meta (2)', width: 190, tech: true, hint: 'Те саме, що й попередня: лише для майбутнього підключення Meta Pixel.' },
  { key: 'ipHash', title: 'Відбиток адреси (пошук спаму)', width: 190, tech: true,
    hint: 'Зашифрований відбиток інтернет-адреси. Саму адресу ми не зберігаємо. Однакові відбитки в різних заявках — ознака спаму чи повторної заявки.' },
  { key: 'ua', title: 'Технічний опис браузера', width: 340, tech: true, hint: 'Службовий рядок браузера. Потрібен лише розробнику для розбору проблем.' }
];

/* ------------------------------------------------------------------ *
 *  Меню й початкове налаштування
 * ------------------------------------------------------------------ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('marketingpro')
    .addItem('Нові зверху (відсортувати)', 'sortNewestFirst')
    .addItem('Оновити аналітику й інструкцію', 'refreshDocs')
    .addSeparator()
    .addItem('Додати тестову заявку', 'addTestLead')
    .addItem('Додати демо-дані (80 заявок)', 'seedDemoData')
    .addItem('Видалити тестові заявки', 'deleteTestLeads')
    .addSeparator()
    .addItem('Показати секрет для сайту', 'showSecret')
    .addItem('Скинути оформлення до стандартного', 'resetFormatting')
    .addToUi();
}

/** Створює аркуш, оформлення й секрет. Можна запускати повторно — дані заявок не чіпає. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(TIMEZONE);

  var sheet = findSheet_(ss, 'leads', SHEET_NAME);
  if (!sheet) {
    // перший аркуш (порожній «Аркуш1» / «Sheet1») перейменовуємо, якщо в ньому нічого немає
    var first = ss.getSheets()[0];
    var empty = first.getLastRow() <= 1 && first.getLastColumn() <= 1 && !first.getRange(1, 1).getValue();
    sheet = empty ? first.setName(SHEET_NAME) : ss.insertSheet(SHEET_NAME, 0);
  }
  tagSheet_(sheet, 'leads');

  // Розкладка колонок: що вже є (за мітками) лишається на своєму місці, відсутні стандартні колонки додаються праворуч.
  LAYOUT_ = null;
  var existing = readTags_(sheet);
  var fresh = Object.keys(existing).length === 0;
  var layout = {};
  var next = fresh ? 1 : Math.max(sheet.getLastColumn(), maxOf_(existing)) + 1;
  COLUMNS.forEach(function (c, i) {
    if (fresh) layout[c.key] = i + 1;
    else if (existing[c.key]) layout[c.key] = existing[c.key];
    else layout[c.key] = next++;
  });
  LAYOUT_ = layout;
  var width = Math.max(sheet.getLastColumn(), maxOf_(layout));

  var totalRows = Math.max(sheet.getMaxRows(), MAX_ROWS + 1);
  ensureSize_(sheet, totalRows, width);
  var rows = totalRows - 1;
  var all = sheet.getRange(1, 1, totalRows, width);
  var body = sheet.getRange(2, 1, rows, width);

  // база
  all.setFontFamily('Nunito').setFontSize(10).setFontColor(INK).setVerticalAlignment('middle').setHorizontalAlignment('left')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sheet.setRowHeights(2, rows, ROW_HEIGHT);
  body.setBorder(null, null, true, null, null, true, LINE, SpreadsheetApp.BorderStyle.SOLID);

  // шапка
  sheet.getRange(1, 1, 1, width).setFontWeight('bold').setFontSize(10).setFontColor('#FFFFFF').setHorizontalAlignment('left')
    .setBackground(INK).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.setRowHeight(1, HEADER_HEIGHT);
  COLUMNS.forEach(function (c) {
    var col = layout[c.key];
    sheet.setColumnWidth(col, c.width);
    var h = sheet.getRange(1, col).setValue(c.title);
    // рожева шапка — заповнює команда (статус, відповідальний, дата, коментар); чорна — заповнюється автоматично
    h.setBackground(isEdit_(c) ? BRAND : INK);
    // текстові колонки: «звичайний текст» — телефон не перетворюється на число, «=» не стає формулою
    var colRange = sheet.getRange(2, col, rows, 1);
    if (c.kind === 'date') colRange.setNumberFormat('dd.mm.yyyy  HH:mm');
    else if (c.kind === 'day') colRange.setNumberFormat('dd.mm.yyyy');
    else colRange.setNumberFormat('@');
    h.setNote(c.hint || '');
    if (c.tech) colRange.setFontColor(TECH);
    if (c.manual) colRange.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
    if (isEdit_(c)) colRange.setBackground(EDIT_TINT);
  });

  // дата — жирним, статус — «чіпом»
  sheet.getRange(2, layout.createdAt, rows, 1).setFontWeight('bold');
  var statusRange = sheet.getRange(2, layout.status, rows, 1);
  statusRange.setHorizontalAlignment('center').setFontWeight('bold');

  // випадаючий список статусів. Можна вписати й свій статус (з’явиться лише позначка-попередження)
  statusRange.setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.keys(STATUSES), true)
    .setAllowInvalid(true)
    .build());

  // умовне форматування: колір статусу + приглушені рядки «Відмова» / «Спам»
  var rules = [];
  Object.keys(STATUSES).forEach(function (name) {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(name).setBackground(STATUSES[name][0]).setFontColor(STATUSES[name][1])
      .setRanges([statusRange]).build());
  });
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=(($' + colLetter_('status') + '2="Відмова")+($' + colLetter_('status') + '2="Спам"))>0')
    .setFontColor('#9A9EAD').setRanges([body]).build());
  sheet.setConditionalFormatRules(rules);

  sheet.setFrozenRows(1);
  if (fresh) sheet.setFrozenColumns(2);
  sheet.setTabColor(BRAND);

  // фільтр по всій таблиці
  var oldFilter = sheet.getFilter();
  if (oldFilter) oldFilter.remove();
  sheet.getRange(1, 1, totalRows, width).createFilter();

  regroupTechColumns_(sheet, layout, width);
  if (fresh) {
    // зайві колонки праворуч і рядки знизу прибираємо — чиста таблиця
    if (sheet.getMaxColumns() > width) sheet.deleteColumns(width + 1, sheet.getMaxColumns() - width);
    if (sheet.getMaxRows() > MAX_ROWS + 1) sheet.deleteRows(MAX_ROWS + 2, sheet.getMaxRows() - MAX_ROWS - 1);
  }

  tagColumns_(sheet, layout);

  var stats = buildStats_(ss);
  var guide = buildGuide_(ss);
  buildTech_(ss);
  if (fresh) {
    ss.setActiveSheet(guide); ss.moveActiveSheet(ss.getNumSheets() - 1); // Інструкція — передостання (остання — «Технічні дані»)
    ss.setActiveSheet(stats); ss.moveActiveSheet(2);                    // Аналітика — друга
  }
  ss.setActiveSheet(sheet); if (fresh) ss.moveActiveSheet(1);          // Заявки — перша й активна

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

/**
 * Службові колонки — у згорнутій групі («+» над літерами колонок). Стару групу (з попередньої розкладки) спершу знімаємо,
 * інакше вона ховала б не ті колонки. Якщо службові колонки розкидані (користувач їх переставив), не групуємо.
 */
function regroupTechColumns_(sheet, layout, width) {
  try {
    try { sheet.expandAllColumnGroups(); } catch (e0) { /* груп нема */ }
    for (var c = 1; c <= width; c++) {
      var guard = 0;
      while (sheet.getColumnGroupDepth(c) > 0 && guard++ < 8) sheet.getRange(1, c).shiftColumnGroupDepth(-1);
    }
    sheet.showColumns(1, width);
    var techCols = COLUMNS.filter(function (x) { return x.tech; }).map(function (x) { return layout[x.key]; });
    var first = Math.min.apply(null, techCols), last = Math.max.apply(null, techCols);
    if (last - first + 1 !== techCols.length) return;
    sheet.getRange(1, first, 1, last - first + 1).shiftColumnGroupDepth(1);
    sheet.setColumnGroupControlPosition(SpreadsheetApp.GroupControlTogglePosition.BEFORE);
    sheet.getColumnGroup(first, 1).collapse();
  } catch (e) {
    console.warn('Групування службових колонок не виконано: ' + e);
  }
}

/** Кнопка меню: повертає стандартні кольори, список статусів, ширини й заголовки. Заявки й порядок колонок не чіпає. */
function resetFormatting() {
  var ui = SpreadsheetApp.getUi();
  if (ui.alert('Скинути оформлення',
    'Буде повернуто стандартні заголовки, кольори статусів, список статусів і ширину колонок. Ваші заявки, коментарі й порядок колонок лишаться.\n\nПродовжити?',
    ui.ButtonSet.YES_NO) === ui.Button.YES) setup();
}

/** Кнопка меню: перебудовує аркуші «Аналітика» та «Інструкція» під поточний вигляд таблиці (після переставлення колонок). */
function refreshDocs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  buildStats_(ss);
  buildGuide_(ss);
  ss.toast('Аналітику й інструкцію оновлено.', 'marketingpro', 5);
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
  var sheet = findSheet_(SpreadsheetApp.getActiveSpreadsheet(), 'leads', SHEET_NAME);
  var layout = loadLayout_(sheet);
  var last = sheet.getLastRow();
  if (last > 2 && layout.createdAt) sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).sort({ column: layout.createdAt, ascending: false });
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
  var leads = findSheet_(ss, 'leads', SHEET_NAME);
  var sh = findSheet_(ss, 'stats', STATS_SHEET) || ss.insertSheet(STATS_SHEET);
  tagSheet_(sh, 'stats');
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

  if (!leads) { sh.getRange('A1').setValue('Аркуш із заявками не знайдено. Меню marketingpro → «Скинути оформлення до стандартного».'); return sh; }
  loadLayout_(leads);
  var need = ['createdAt', 'status', 'visit', 'source', 'campaign', 'program', 'pageLabel', 'type', 'day', 'id'];
  var missing = need.filter(function (k) { return !colIndex_(k); });
  if (missing.length) {
    sh.getRange('A1').setValue('Аналітика не може порахувати цифри: у таблиці заявок немає потрібних колонок.').setFontWeight('bold');
    sh.getRange('A2').setValue('Поверніть колонки (наприклад, меню marketingpro → «Скинути оформлення до стандартного»), потім «Оновити аналітику й інструкцію». Не вистачає: ' +
      missing.map(function (k) { return COLUMNS.filter(function (c) { return c.key === k; })[0].title; }).join(', '));
    return sh;
  }
  var L = "'" + leads.getName().replace(/'/g, "''") + "'!";
  var lastCol = letterOf_(Math.max(leads.getLastColumn(), maxOf_(LAYOUT_)));
  var data = L + '$A$1:$' + lastCol + '$' + (MAX_ROWS + 1);
  var rng = function (key) { return L + '$' + colLetter_(key) + '$2:$' + colLetter_(key) + '$' + (MAX_ROWS + 1); };
  var created = rng('createdAt'), status = rng('status'), visit = rng('visit');

  sh.getRange('A1').setValue('Заявки marketingpro — зведення').setFontSize(16).setFontWeight('bold');
  sh.getRange('A2').setValue('Рахується автоматично з аркуша «' + leads.getName() + '». Нічого тут не редагуйте.').setFontColor(TECH);

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
               chartArea: { left: 44, top: 44 } };
  function opts(chart, o) {
    var all = {}; Object.keys(base).forEach(function (k) { all[k] = base[k]; }); Object.keys(o).forEach(function (k) { all[k] = o[k]; });
    Object.keys(all).forEach(function (k) { chart.setOption(k, all[k]); });
    return chart;
  }
  // графіки — приємний додаток: якщо Google не прийме якусь опцію, це не має ламати решту налаштування
  function put(make, row, col, w, h) {
    try { sh.insertChart(make().setPosition(row, col, 4, 4).setOption('width', w).setOption('height', h).build()); }
    catch (e) { console.warn('Графік не побудовано: ' + e); }
  }
  function block(key) { return blocks.filter(function (b) { return b.key === key; })[0]; }
  function top(b, n) { return sh.getRange(b.row + 1, b.col, n + 1, 2); }

  // ряд 1: динаміка (широкий) + статуси (бублик)
  put(function () { return opts(sh.newChart().asColumnChart().addRange(sh.getRange(4, W + 1, 31, 2)).setNumHeaders(1),
    { title: 'Заявки по днях (30 днів)', colors: [BRAND], vAxis: { minValue: 0, format: '0', gridlines: { color: LINE } }, hAxis: { textStyle: { fontSize: 9 } } }); },
    13, 1, 820, 250);
  put(function () { return opts(sh.newChart().asPieChart().addRange(sh.getRange(4, W + 4, stNames.length + 1, 2)).setNumHeaders(1),
    { title: 'Статуси заявок', pieHole: 0.55, legend: { position: 'right', textStyle: { fontSize: 10 } }, pieSliceText: 'value', chartArea: { left: 12, top: 44 },
      colors: ['#FF2D7E', '#F5B301', '#3D7BFF', '#1FB56B', '#A7ABBA', '#6B7080'] }); },
    13, 9, 400, 250);

  // ряд 2: розрізи
  put(function () { return opts(sh.newChart().asBarChart().addRange(top(block('source'), 8)).setNumHeaders(1),
    { title: 'Заявки за джерелами', colors: [BRAND], hAxis: { minValue: 0, format: '0', gridlines: { color: LINE } }, chartArea: { left: 150, top: 44 } }); },
    26, 1, 400, 250);
  put(function () { return opts(sh.newChart().asBarChart().addRange(top(block('campaign'), 8)).setNumHeaders(1),
    { title: 'Заявки за кампаніями', colors: ['#3D7BFF'], hAxis: { minValue: 0, format: '0', gridlines: { color: LINE } }, chartArea: { left: 150, top: 44 } }); },
    26, 5, 400, 250);
  put(function () { return opts(sh.newChart().asBarChart().addRange(top(block('pageLabel'), 8)).setNumHeaders(1),
    { title: 'Звідки заявки (сторінка з формою)', colors: ['#1FB56B'], hAxis: { minValue: 0, format: '0', gridlines: { color: LINE } }, chartArea: { left: 170, top: 44 } }); },
    26, 9, 400, 250);
}

/** Вигадані заявки за 30 днів — щоб побачити, як виглядають таблиця, фільтри, «Аналітика» й графіки. ID = TEST…, тому видаляються кнопкою нижче. */
function seedDemoData() {
  var ui = SpreadsheetApp.getUi();
  var N = 80;
  if (ui.alert('Демо-дані', 'Додати ' + N + ' вигаданих заявок за останні 30 днів для перевірки таблиці, «Аналітики» й графіків?\n\nЇх можна прибрати меню «Видалити тестові заявки».', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = findSheet_(ss, 'leads', SHEET_NAME);
  if (!sheet) { setup(); sheet = findSheet_(ss, 'leads', SHEET_NAME); }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var layout = loadLayout_(sheet);
    var leads = demoLeads_(N);
    var start = sheet.getLastRow() + 1;
    ensureRoom_(sheet, start + N);
    var width = Math.max(sheet.getLastColumn(), maxOf_(layout));
    var rows = leads.map(function (l) { return rowFromValues_(layout, width, leadValues_(l)); });
    sheet.getRange(start, 1, N, width).setValues(rows);
    // клікабельні контакти й посилання — лише там, де є що робити клікабельним (звичайний текст, як номер телефону, не чіпаємо)
    ['contact', 'link'].forEach(function (key) {
      if (!layout[key]) return;
      leads.forEach(function (l, i) {
        var text = l[key] || '';
        var url = key === 'contact' ? contactUrl_(text) : siteUrl_(text);
        if (!url || !text) return;
        try { sheet.getRange(start + i, layout[key]).setRichTextValue(SpreadsheetApp.newRichTextValue().setText(text).setLinkUrl(url).build()); }
        catch (e) { /* лишаємо звичайним текстом */ }
      });
    });
  } finally {
    lock.releaseLock();
  }
  ss.toast('Додано ' + N + ' демо-заявок. Перегляньте аркуш «Аналітика».', 'marketingpro', 8);
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
      page: academy ? '/academy' : pick(['/', '/', '/cases', '/cases/dental']),
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
  var sheet = findSheet_(ss, 'leads', SHEET_NAME);
  var ui = SpreadsheetApp.getUi();
  var last = sheet ? sheet.getLastRow() : 0;
  if (last < 2) { ui.alert('Заявок ще немає.'); return; }

  var layout = loadLayout_(sheet);
  if (!layout.id && !layout.source) { ui.alert('У таблиці немає колонок «Номер заявки» та «Звідки прийшла людина»: не можу відрізнити тестові заявки.'); return; }
  var ids = layout.id ? sheet.getRange(2, layout.id, last - 1, 1).getValues() : null;
  var sources = layout.source ? sheet.getRange(2, layout.source, last - 1, 1).getValues() : null;
  var rows = [];
  for (var i = 0; i < last - 1; i++) {
    var isTest = (ids && /^TEST/i.test(String(ids[i][0]))) || (sources && String(sources[i][0]).toLowerCase() === 'test');
    if (isTest) rows.push(i + 2);
  }
  if (!rows.length) { ui.alert('Тестових заявок не знайдено.'); return; }
  if (ui.alert('Видалити тестові заявки', 'Знайдено ' + rows.length + ' шт. Видалити їх безповоротно?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    for (var j = rows.length - 1; j >= 0; j--) sheet.deleteRow(rows[j]); // знизу вгору, щоб номери не зсувались
  } finally {
    lock.releaseLock();
  }
  ss.toast('Видалено тестових заявок: ' + rows.length, 'marketingpro', 6);
}


/* ------------------------------------------------------------------ *
 *  Вкладка «Інструкція» — пояснення простими словами (будується з COLUMNS і HOW, тож не розходиться з таблицею)
 * ------------------------------------------------------------------ */

var GUIDE_SHEET = 'Інструкція';

/** Для кожної колонки: [звідки береться, як заповнюється]. */
var HOW = {
  createdAt: ['Сайт', 'Записується автоматично в момент, коли людина надсилає форму (київський час).'],
  status: ['Команда', 'Нова заявка автоматично отримує «Новий». Далі команда міняє статус зі списку.'],
  type: ['Сайт', 'Автоматично: заявка зі сторінки Академії або з вибраним курсом — «Академія», усі інші — «Консультація».'],
  program: ['Людина у формі', 'Людина сама вибирає напрям у блоці «Цікавить навчання?». Є лише на сторінці Академії й необовʼязкове.'],
  name: ['Людина у формі', 'Людина вводить сама. Необовʼязкове поле.'],
  contact: ['Людина у формі', 'Людина вводить сама. Єдине обовʼязкове поле: без нього форма не відправиться.'],
  link: ['Людина у формі', 'Людина вводить сама. Необовʼязкове. Таблиця сама робить посилання клікабельним.'],
  niche: ['Людина у формі', 'Людина вводить сама. Необовʼязкове поле.'],
  quality: ['Сайт', 'Рахується автоматично: скільки з трьох полів (імʼя, лінк, ніша) людина заповнила.'],
  source: ['Посилання, з якого зайшла людина', 'Сайт бере мітку з рекламного посилання. Якщо міток нема — дивиться, з якого сайту чи застосунку прийшли; якщо нікуди — «direct» (зайшли напряму).'],
  campaign: ['Мітка в рекламному посиланні', 'Береться з мітки utm_campaign у посиланні реклами. Щоб заповнювалось, додавайте мітки до посилань в рекламі.'],
  responsible: ['Команда', 'Вписується вручну.'],
  nextContact: ['Команда', 'Вписується вручну: дата, коли повернутись до людини.'],
  manager: ['Команда', 'Вписується вручну.'],
  id: ['Сайт', 'Створюється автоматично, щойно людина відкрила форму. Захищає від дублів, якщо людина натиснула кнопку двічі.'],
  day: ['Таблиця', 'Рахується автоматично з дати заявки.'],
  week: ['Таблиця', 'Рахується автоматично з дати заявки.'],
  month: ['Таблиця', 'Рахується автоматично з дати заявки.'],
  pageLabel: ['Сайт', 'Автоматично: сторінка, на якій людина натиснула «Надіслати».'],
  page: ['Сайт', 'Автоматично: технічна адреса тієї ж сторінки.'],
  medium: ['Мітка в рекламному посиланні', 'Береться з мітки utm_medium, якщо вона була в посиланні.'],
  content: ['Мітка в рекламному посиланні', 'Береться з мітки utm_content, якщо вона була в посиланні.'],
  term: ['Мітка в рекламному посиланні', 'Береться з мітки utm_term, якщо вона була в посиланні.'],
  clickId: ['Рекламне посилання', 'Meta чи Google самі додають цей код до посилання, коли людина клікає по рекламі.'],
  referrer: ['Браузер людини', 'Адреса, з якої перейшли на сайт. Браузер передає її сам; з Instagram і Telegram часто буває порожньою.'],
  landing: ['Сайт (памʼять браузера)', 'Перша сторінка візиту. Сайт запамʼятовує її на час візиту.'],
  casesViewed: ['Сайт (памʼять браузера)', 'Сайт рахує, які кейси людина відкривала до заявки.'],
  pagesViewed: ['Сайт (памʼять браузера)', 'Сайт рахує, скільки сторінок людина відкрила за візит.'],
  timeOnSite: ['Сайт (памʼять браузера)', 'Рахується від початку візиту до натискання «Надіслати».'],
  visit: ['Сайт (памʼять браузера)', 'Сайт запамʼятовує в браузері, що людина вже була. Якщо вона очистила історію, вважається новою.'],
  firstVisit: ['Сайт (памʼять браузера)', 'Дата, коли сайт вперше побачив цей браузер. Якщо історію очищено, дата новa.'],
  country: ['Хостинг сайту (Vercel)', 'Визначається автоматично за інтернет-адресою. Може помилятись (VPN, мобільний інтернет).'],
  region: ['Хостинг сайту (Vercel)', 'Визначається автоматично за інтернет-адресою. Може помилятись.'],
  city: ['Хостинг сайту (Vercel)', 'Визначається автоматично за інтернет-адресою. Може помилятись.'],
  device: ['Браузер людини', 'Розпізнається автоматично з технічного опису браузера.'],
  lang: ['Браузер людини', 'Передається браузером автоматично.'],
  tz: ['Браузер людини', 'Передається браузером автоматично.'],
  viewport: ['Браузер людини', 'Передається браузером автоматично.'],
  fbp: ['Cookie від Meta', 'Зʼявляється лише коли на сайті підключений Meta Pixel. Зараз майже завжди порожньо.'],
  fbc: ['Cookie від Meta', 'Зʼявляється, коли людина прийшла з реклами Meta і підключений Meta Pixel.'],
  ipHash: ['Сайт', 'Зашифрований відбиток інтернет-адреси. Саму адресу не зберігаємо.'],
  ua: ['Браузер людини', 'Передається браузером автоматично.']
};

function buildGuide_(ss) {
  var sh = findSheet_(ss, 'guide', GUIDE_SHEET) || ss.insertSheet(GUIDE_SHEET);
  tagSheet_(sh, 'guide');
  sh.clear();
  // Назви колонок беремо з поточної шапки (їх могли перейменувати); мітки колонок дають актуальні позиції
  var leadsSheet = findSheet_(ss, 'leads', SHEET_NAME), titleOf = function (c) { return c.title; };
  if (leadsSheet) {
    var lay = loadLayout_(leadsSheet), heads = leadsSheet.getRange(1, 1, 1, Math.max(1, leadsSheet.getLastColumn())).getValues()[0];
    titleOf = function (c) { return (lay[c.key] && heads[lay[c.key] - 1]) || c.title; };
  }
  sh.setHiddenGridlines(true);
  sh.setTabColor('#F5B301');
  if (sh.getMaxColumns() < 4) sh.insertColumnsAfter(sh.getMaxColumns(), 4 - sh.getMaxColumns());
  [250, 400, 280, 430].forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });

  var rows = []; // [вид, A, B, C, D]
  var add = function (kind, a, b, c, d) { rows.push([kind, a || '', b || '', c || '', d || '']); };

  add('title', 'Інструкція: як працює таблиця заявок');
  add('sub', 'Ця вкладка оновлюється сама, тому нічого в ній не редагуйте.');
  add('gap');

  add('h', '1. Коротко: що це і навіщо');
  add('p', 'Коли людина заповнює форму на сайті (консультація або запис на навчання), її заявка сама зʼявляється в аркуші «Заявки» за кілька секунд.');
  add('p', 'Вносити заявки вручну не треба. Ваша робота: обробляти їх, міняти статус і записувати, про що домовились.');
  add('p', 'Аркуш «Аналітика» сам рахує цифри й малює графіки: скільки заявок, звідки прийшли, скільки стали клієнтами.');
  add('gap');

  add('h', '2. Як працювати щодня');
  add('p', '1.  Відкрийте аркуш «Заявки». Нові заявки зʼявляються внизу списку. Щоб бачити найновіші зверху: меню marketingpro → «Нові зверху».');
  add('p', '2.  Напишіть або подзвоніть за контактом із колонки «Телефон або Telegram для звʼязку». Telegram-нік — це посилання, на нього можна натиснути.');
  add('p', 'Кольори шапки: РОЖЕВА — колонка для команди, її змінюємо й заповнюємо вручну (Статус, Відповідальний, Наступний контакт, Коментар менеджера; фон клітинок теж світло-рожевий). ЧОРНА — заповнюється автоматично з форми на сайті, руками її правити не потрібно.');
  add('p', '3.  Змініть «Статус» зі списку. Він підсвічується кольором, тому одразу видно, що нове, а що в роботі.');
  add('p', '4.  Впишіть, хто веде заявку («Відповідальний»), коли повернутись («Наступний контакт») і що домовились («Коментар менеджера»).');
  add('p', '5.  Щоб знайти потрібні заявки, натисніть значок воронки в шапці колонки. Наприклад, лише «Новий» або лише «Академія».');
  add('p', '6.  Цифри й графіки дивіться в аркуші «Аналітика».');
  add('gap');

  add('h', '3. Що можна (майже все)');
  add('b', '•  Міняти статус і писати в «Відповідальний», «Наступний контакт», «Коментар менеджера». Правити можна будь-яку клітинку.');
  add('b', '•  Переставляти, ховати, вставляти нові й видаляти непотрібні колонки. Скрипт знаходить колонки за внутрішніми мітками, порядок неважливий.');
  add('b', '•  Перейменовувати заголовки колонок і навіть аркуші «Заявки», «Аналітика», «Інструкція».');
  add('b', '•  Додавати свої колонки де завгодно: сайт їх не чіпає й нічого в них не пише.');
  add('b', '•  Видаляти, переміщувати й сортувати рядки, залишати порожні рядки між заявками. Нова заявка запишеться під останнім заповненим рядком.');
  add('b', '•  Міняти кольори, шрифти, ширину колонок, закріплення, фільтри.');
  add('b', '•  Міняти статуси: додавати свої (просто впишіть у клітинку або додайте у Дані → Перевірка даних), міняти кольори (Формат → Умовне форматування).');
  add('b', '•  Ділитися таблицею з колегами, яким можна бачити контакти клієнтів.');
  add('gap');

  add('h', '4. Що варто памʼятати');
  add('b', '•  Не видаляйте колонку «Телефон або Telegram для звʼязку»: без неї заявку нікуди записати. Сайт покаже людині помилку, а заявка збережеться в журналі сайту.');
  add('b', '•  Статуси «Новий», «Клієнт» і «Спам» краще не перейменовувати: від них залежить аркуш «Аналітика» (нова заявка завжди отримує «Новий»).');
  add('b', '•  Колонку «Номер заявки» можна ховати, але не видаляйте: вона захищає від дублів, якщо людина натиснула кнопку двічі.');
  add('b', '•  Після переставлення чи видалення колонок натисніть меню marketingpro → «Оновити аналітику й інструкцію», щоб цифри й довідник підлаштувались.');
  add('b', '•  «Скинути оформлення до стандартного» повертає стандартні заголовки, кольори й список статусів. Заявки й порядок колонок лишаються.');
  add('b', '•  Давайте доступ лише тим, кому можна бачити контакти клієнтів: у таблиці персональні дані.');
  add('b', '•  Технічні деталі (акаунти, де що лежить, що робити при поломці) записані на вкладці «Технічні дані». Скрипт її не перезаписує, вписуйте туди зміни.');
  add('gap');

  add('h', '5. Як заявка потрапляє в таблицю');
  add('p', '1.  Людина заповнює форму на сайті й натискає кнопку.');
  add('p', '2.  Сайт перевіряє: чи вказано контакт, чи це не бот (спам відсікається), чи заявку не надіслано двічі.');
  add('p', '3.  Сайт додає службові дані: звідки прийшла людина, які кейси дивилась, з якого пристрою і міста.');
  add('p', '4.  Заявка передається сюди й записується новим рядком.');
  add('p', '5.  Якщо таблиця раптом недоступна, сайт спробує ще раз, а людині покаже наш Telegram. Повна заявка збережеться в журналі сайту.');
  add('gap');

  add('h', '6. Статуси');
  add('th', 'Статус', 'Що означає');
  Object.keys(STATUSES).forEach(function (name) {
    var text = {
      'Новий': 'Щойно надійшла, ще ніхто не звʼязувався. Ставиться автоматично.',
      'Зв’язались': 'Вже написали або подзвонили.',
      'В роботі': 'Йдуть перемовини.',
      'Клієнт': 'Купив або записався. Рахується в конверсії на аркуші «Аналітика».',
      'Відмова': 'Не підійшло. Причину допишіть у коментарі менеджера.',
      'Спам': 'Фейкова або помилкова заявка. У конверсії не рахується.'
    }[name];
    add('chip', name, text);
  });
  add('gap');

  add('h', '7. Довідник: що означає кожна колонка, звідки береться і як заповнюється');
  add('th', 'Колонка', 'Що означає', 'Звідки береться', 'Як заповнюється');
  add('sec', 'На виду');
  COLUMNS.filter(function (c) { return !c.tech; }).forEach(function (c) { add('tr', titleOf(c), c.hint, HOW[c.key][0], HOW[c.key][1]); });
  add('sec', 'Службові (згорнуті: кнопка «+» над літерами колонок)');
  COLUMNS.filter(function (c) { return c.tech; }).forEach(function (c) { add('tr', titleOf(c), c.hint, HOW[c.key][0], HOW[c.key][1]); });
  add('gap');

  add('h', '8. Кнопки меню «marketingpro» (угорі над таблицею)');
  add('th', 'Кнопка', 'Що робить');
  add('tr', 'Нові зверху (відсортувати)', 'Один раз сортує заявки від нових до старих. Автоматично не сортується, щоб рядки не «тікали» під час роботи.');
  add('tr', 'Оновити аналітику й інструкцію', 'Перебудовує аркуші «Аналітика» та «Інструкція» під поточний вигляд таблиці. Робіть після зміни колонок.');
  add('tr', 'Додати тестову заявку', 'Додає один тестовий рядок, щоб перевірити, що все працює.');
  add('tr', 'Додати демо-дані (80 заявок)', 'Додає вигадані заявки за 30 днів, щоб побачити, як виглядають фільтри, аналітика й графіки.');
  add('tr', 'Видалити тестові заявки', 'Прибирає тестові й демо-заявки (їхній номер починається з TEST). Справжні заявки не чіпає.');
  add('tr', 'Показати секрет для сайту', 'Потрібна лише розробнику для налаштування сайту. Нікому не показуйте.');
  add('tr', 'Скинути оформлення до стандартного', 'Повертає стандартні заголовки, кольори, список статусів і ширину колонок. Заявки й порядок колонок лишаються.');
  add('gap');

  add('h', '9. Якщо щось не так');
  add('th', 'Ситуація', 'Що робити');
  add('tr', 'Заявка не зʼявилась', 'Зачекайте хвилину й оновіть сторінку. Якщо її досі нема, напишіть розробнику: заявка збережена в журналі сайту.');
  add('tr', 'В аркуші «Аналітика» помилки (#ERROR або #REF)', 'Меню marketingpro → «Оновити аналітику й інструкцію». Якщо не допомогло, можливо видалено потрібну колонку: «Скинути оформлення до стандартного».');
  add('tr', 'Таблиця виглядає зʼїхавшою', 'Меню marketingpro → «Скинути оформлення до стандартного». Дані не постраждають.');
  add('tr', 'Треба прибрати тестові рядки', 'Меню marketingpro → «Видалити тестові заявки».');
  add('tr', 'Хочу побачити, звідки береться якась колонка', 'Довідник у розділі 7: там для кожної колонки написано, звідки береться значення і як воно заповнюється.');
  add('gap');

  add('h', '10. Приватність');
  add('p', 'У таблиці імена й контакти людей. Давайте доступ лише тим, хто працює із заявками, а старі заявки видаляйте, коли вони більше не потрібні.');
  add('p', 'Інтернет-адресу відвідувача ми не зберігаємо, тільки зашифрований відбиток. Він потрібен лише для пошуку спаму.');

  var n = rows.length;
  sh.getRange(1, 1, n, 4).setValues(rows.map(function (r) { return r.slice(1); }));
  sh.getRange(1, 1, n, 4).setFontFamily('Nunito').setFontSize(10).setFontColor(INK).setVerticalAlignment('top').setWrapStrategy(SpreadsheetApp.WrapStrategy.OVERFLOW);

  rows.forEach(function (r, i) {
    var row = i + 1, kind = r[0], line = sh.getRange(row, 1, 1, 4);
    if (kind === 'title') sh.getRange(row, 1).setFontSize(20).setFontWeight('bold');
    else if (kind === 'sub') sh.getRange(row, 1).setFontColor(TECH);
    else if (kind === 'h') { line.setBackground(INK).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setVerticalAlignment('middle'); sh.setRowHeight(row, 30); }
    else if (kind === 'th') line.setBackground(TECH).setFontColor('#FFFFFF').setFontWeight('bold').setVerticalAlignment('middle');
    else if (kind === 'sec') line.setBackground('#F6F7FA').setFontWeight('bold').setFontColor(BRAND);
    else if (kind === 'chip') {
      sh.getRange(row, 1).setBackground(STATUSES[r[1]][0]).setFontColor(STATUSES[r[1]][1]).setFontWeight('bold').setHorizontalAlignment('center');
      sh.getRange(row, 2).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
      line.setBorder(null, null, true, null, null, null, LINE, SpreadsheetApp.BorderStyle.SOLID);
    } else if (kind === 'tr') {
      line.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP).setBorder(null, null, true, null, null, null, LINE, SpreadsheetApp.BorderStyle.SOLID);
      sh.getRange(row, 1).setFontWeight('bold');
    }
  });
  sh.getRange(1, 1, n, 1).setHorizontalAlignment('left');
  sh.autoResizeRows(1, n);
  return sh;
}


/* ------------------------------------------------------------------ *
 *  Вкладка «Технічні дані» — акаунти, де що лежить, що робити при поломці.
 *  Створюється один раз і більше НЕ перезаписується (її заповнюють вручну).
 * ------------------------------------------------------------------ */

var TECH_SHEET = 'Технічні дані';

function buildTech_(ss) {
  if (findSheet_(ss, 'tech', TECH_SHEET)) return; // вже є — не чіпаємо, там ручні записи
  var sh = ss.insertSheet(TECH_SHEET);
  tagSheet_(sh, 'tech');
  sh.setHiddenGridlines(true);
  sh.setTabColor('#3D7BFF');
  if (sh.getMaxColumns() < 4) sh.insertColumnsAfter(sh.getMaxColumns(), 4 - sh.getMaxColumns());
  [230, 430, 300, 430].forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });

  var rows = [];
  var add = function (kind, a, b, c, d) { rows.push([kind, a || '', b || '', c || '', d || '']); };

  add('title', 'Технічні дані: акаунти й де що лежить');
  add('sub', 'Паролі тут не зберігаємо. Жовті клітинки треба вписати вручну. Цю вкладку скрипт не перезаписує, вносьте сюди зміни самі.');
  add('gap');

  add('h', '1. Акаунти й сервіси');
  add('th', 'Що', 'Де / адреса', 'Чий акаунт (пошта)', 'Примітка');
  add('tr', 'GitHub (код сайту)', 'https://github.com/svitlanaogneva-cyber/marketingpro', 'Акаунт: svitlanaogneva-cyber. Пошта акаунта: [вписати]', 'Гілка main. Кожен push у main автоматично збирається й публікується.');
  add('tr', 'Vercel (хостинг сайту)', 'https://vercel.com → проєкт marketingpro', 'Акаунт або команда: [вписати]. Пошта: [вписати]', 'Проєкт підключений до GitHub-репозиторію. Тут змінні середовища (Environment Variables) і журнали (Logs).');
  add('tr', 'Домен', 'marketingpro.company', 'Де куплений і де керується DNS: [вписати]', 'Додається у Vercel → Settings → Domains.');
  add('tr', 'Google-акаунт власника цієї таблиці', 'Ця таблиця й Apps Script', 'marketingpro.ua@gmail.com (за даними Google, скрипт запущено від цього акаунта)', 'Скрипт працює від імені цього акаунта. Якщо його видалити або закрити доступ, форма перестане писати в таблицю.');
  add('tr', 'Apps Script (прийом заявок)', 'Ця таблиця → Розширення → Apps Script (проєкт «marketingpro»)', 'Той самий Google-акаунт', 'Розгортання: Ввести в дію → Керувати введеннями в дію.');
  add('tr', 'Фото для сайту', '[посилання на папку Google Диска]', '[вписати]', 'За ТЗ усі фото складаємо на Google Диску.');
  add('tr', 'Meta Pixel / аналітика', 'Поки не підключено', '—', 'Після підключення в таблиці почнуть заповнюватись технічні мітки Meta.');
  add('gap');

  add('h', '2. Секрети й змінні (самі значення тут НЕ записуємо)');
  add('th', 'Що', 'Де лежить', 'Для чого');
  add('tr', 'LEAD_SECRET', 'Apps Script → ⚙ Налаштування проєкту → Властивості скрипта', 'Пароль між сайтом і таблицею. Без нього таблиця не приймає заявки.');
  add('tr', 'LEAD_WEBHOOK_SECRET', 'Vercel → Settings → Environment Variables', 'Те саме значення, що й LEAD_SECRET. Мають збігатися.');
  add('tr', 'LEAD_WEBHOOK_URL', 'Vercel → Settings → Environment Variables', 'Адреса веб-застосунку Apps Script (закінчується на /exec). Беруть з: Ввести в дію → Керувати введеннями в дію.');
  add('tr', 'NEXT_PUBLIC_SITE_URL', 'Vercel → Settings → Environment Variables (необовʼязково)', 'Домен сайту для метатегів. За замовчуванням https://marketingpro.company.');
  add('gap');

  add('h', '3. Як усе звʼязано');
  add('p', 'Людина відкриває сайт (Vercel) → заповнює форму → сайт перевіряє заявку й додає службові дані (/api/lead) → передає в Apps Script → скрипт дописує рядок у цю таблицю.');
  add('p', 'Код сайту лежить у GitHub. Коли в main зʼявляється нова версія, Vercel сам збирає й публікує її за 1–2 хвилини. Перед цим GitHub Actions перевіряє, що нічого не зламано.');
  add('gap');

  add('h', '4. Типові дії');
  add('th', 'Ситуація', 'Що робити');
  add('tr', 'Змінити текст на сайті', 'Правка в GitHub-репозиторії (теки content/ і components/), потім push у main. Vercel сам опублікує.');
  add('tr', 'Форма не відправляється', 'Vercel → проєкт → Logs: шукайте [lead:FAILED]. Перевірте змінні LEAD_WEBHOOK_URL і LEAD_WEBHOOK_SECRET та що розгортання Apps Script має доступ «Усі».');
  add('tr', 'Оновили код скрипта', 'Apps Script → Ввести в дію → Керувати введеннями → ✏️ → Версія: Нова → Ввести в дію. Адреса не зміниться.');
  add('tr', 'Треба змінити секрет', 'Змініть його в Apps Script (LEAD_SECRET) і у Vercel (LEAD_WEBHOOK_SECRET) на однакове значення, потім зробіть Redeploy у Vercel.');
  add('tr', 'Змінити власника таблиці або акаунт', 'Скрипт працює від імені власника. Перенесіть таблицю разом зі скриптом, заново зробіть розгортання й оновіть LEAD_WEBHOOK_URL у Vercel.');
  add('gap');

  add('h', '5. Відкриті правки з ТЗ');
  add('th', 'Що', 'Стан');
  add('tr', 'Змінити шрифт пунктів меню та інших елементів на інший', 'Відкрито');
  add('tr', 'Замінити фото у відгуках на фото зі стоку', 'Відкрито');
  add('tr', 'Замінити іконку сайту (favicon)', 'Відкрито');

  var n = rows.length;
  sh.getRange(1, 1, n, 4).setValues(rows.map(function (r) { return r.slice(1); }));
  sh.getRange(1, 1, n, 4).setFontFamily('Nunito').setFontSize(10).setFontColor(INK).setVerticalAlignment('top').setWrapStrategy(SpreadsheetApp.WrapStrategy.OVERFLOW);
  rows.forEach(function (r, i) {
    var row = i + 1, kind = r[0], line = sh.getRange(row, 1, 1, 4);
    if (kind === 'title') sh.getRange(row, 1).setFontSize(20).setFontWeight('bold');
    else if (kind === 'sub') sh.getRange(row, 1).setFontColor(TECH);
    else if (kind === 'h') { line.setBackground(INK).setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12).setVerticalAlignment('middle'); sh.setRowHeight(row, 30); }
    else if (kind === 'th') line.setBackground(TECH).setFontColor('#FFFFFF').setFontWeight('bold').setVerticalAlignment('middle');
    else if (kind === 'tr') {
      line.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP).setBorder(null, null, true, null, null, null, LINE, SpreadsheetApp.BorderStyle.SOLID);
      sh.getRange(row, 1).setFontWeight('bold');
      // клітинки, які треба заповнити вручну, підсвічуємо жовтим
      [1, 2, 3, 4].forEach(function (col) {
        if (String(r[col]).indexOf('[вписати') >= 0 || String(r[col]).indexOf('[посилання') >= 0) sh.getRange(row, col).setBackground('#FFF3BF');
      });
    }
  });
  sh.autoResizeRows(1, n);
  ss.setActiveSheet(sh); ss.moveActiveSheet(ss.getNumSheets());
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
    var sheet = findSheet_(ss, 'leads', SHEET_NAME);
    if (!sheet) { setup(); sheet = findSheet_(ss, 'leads', SHEET_NAME); }
    var layout = loadLayout_(sheet);
    // без контакту заявка втрачена — краще віддати помилку (сайт збереже заявку в журналі), ніж мовчки загубити
    if (!layout.contact) throw new Error('У таблиці немає колонки «Телефон або Telegram для звʼязку»: заявку не збережено.');

    var last = sheet.getLastRow();
    if (lead.id && layout.id && last > 1) {
      var found = sheet.getRange(2, layout.id, last - 1, 1).createTextFinder(String(lead.id)).matchEntireCell(true).findNext();
      if (found) return { row: found.getRow(), duplicate: true };
    }

    var row = last + 1;
    ensureRoom_(sheet, row);
    var width = Math.max(sheet.getLastColumn(), maxOf_(layout));
    sheet.getRange(row, 1, 1, width).setValues([rowFromValues_(layout, width, leadValues_(lead))]);

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

/** Якщо рядки закінчуються — додає ще 1000 із тим самим оформленням (формат і список статусів). */
function ensureRoom_(sheet, row) {
  while (row >= sheet.getMaxRows()) {
    var max = sheet.getMaxRows(), cols = sheet.getMaxColumns();
    sheet.insertRowsAfter(max, 1000);
    var src = sheet.getRange(max, 1, 1, cols), dst = sheet.getRange(max + 1, 1, 1000, cols);
    src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
    src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false);
  }
}

/** Заявка → масив значень у порядку колонок COLUMNS (спільний для запису з сайту й демо-даних). */
function leadValues_(lead) {
  var created = lead.createdAt ? new Date(lead.createdAt) : new Date();
  var out = {};
  COLUMNS.forEach(function (c) {
    if (c.manual) return; // колонки для команди сайт не чіпає
    var v;
    if (c.key === 'status') v = lead.status || 'Новий';
    else if (c.key === 'createdAt') v = created;
    else if (c.key === 'day') v = Utilities.formatDate(created, TIMEZONE, 'yyyy-MM-dd');
    else if (c.key === 'month') v = Utilities.formatDate(created, TIMEZONE, 'yyyy-MM');
    else if (c.key === 'week') v = isoWeek_(created);
    else if (c.key === 'firstVisit' && lead.firstVisit && !isNaN(new Date(lead.firstVisit).getTime())) {
      v = Utilities.formatDate(new Date(lead.firstVisit), TIMEZONE, 'dd.MM.yyyy HH:mm');
    } else {
      v = lead[c.key];
      v = v === undefined || v === null ? '' : String(v);
    }
    out[c.key] = v;
  });
  return out;
}

/** {ключ: значення} → рядок під поточну розкладку (порожні клітинки для чужих колонок). */
function rowFromValues_(layout, width, values) {
  var row = [];
  for (var i = 0; i < width; i++) row.push('');
  Object.keys(values).forEach(function (k) { if (layout[k]) row[layout[k] - 1] = values[k]; });
  return row;
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

/* ------------------------------------------------------------------ *
 *  Розкладка колонок і аркушів. Колонки й аркуші знаходяться за невидимими мітками (developer metadata),
 *  які рухаються разом із ними: колонки можна переставляти, вставляти, ховати, видаляти, а аркуші перейменовувати.
 * ------------------------------------------------------------------ */

var LAYOUT_ = null; // {ключ колонки: номер колонки}; null = стандартний порядок COLUMNS

function maxOf_(map) {
  var m = 0;
  Object.keys(map).forEach(function (k) { if (map[k] > m) m = map[k]; });
  return m;
}

/** Аркуш за міткою ролі (знайдеться навіть перейменований); запасний варіант — за стандартною назвою. */
function findSheet_(ss, role, fallbackName) {
  try {
    var found = ss.createDeveloperMetadataFinder().withKey('mp_sheet').withValue(role).find();
    for (var i = 0; i < found.length; i++) {
      var loc = found[i].getLocation();
      if (loc.getLocationType() === SpreadsheetApp.DeveloperMetadataLocationType.SHEET) return loc.getSheet();
    }
  } catch (e) { /* міток нема — шукаємо за назвою */ }
  return ss.getSheetByName(fallbackName);
}

function tagSheet_(sheet, role) {
  try {
    sheet.getParent().createDeveloperMetadataFinder().withKey('mp_sheet').withValue(role).find()
      .forEach(function (m) { m.remove(); });
    sheet.addDeveloperMetadata('mp_sheet', role, SpreadsheetApp.DeveloperMetadataVisibility.DOCUMENT);
  } catch (e) { console.warn('Мітку аркуша не додано: ' + e); }
}

/** {ключ: номер колонки} за мітками. Порожній результат = міток нема. */
function readTags_(sheet) {
  var map = {};
  try {
    sheet.createDeveloperMetadataFinder().withKey('mp_col').find().forEach(function (m) {
      var loc = m.getLocation();
      if (loc.getLocationType() === SpreadsheetApp.DeveloperMetadataLocationType.COLUMN) map[m.getValue()] = loc.getColumn().getColumn();
    });
  } catch (e) { map = {}; }
  return map;
}

function tagColumns_(sheet, layout) {
  try {
    sheet.createDeveloperMetadataFinder().withKey('mp_col').find().forEach(function (m) { m.remove(); });
    var rows = sheet.getMaxRows();
    COLUMNS.forEach(function (c) {
      sheet.getRange(1, layout[c.key], rows, 1).addDeveloperMetadata('mp_col', c.key, SpreadsheetApp.DeveloperMetadataVisibility.DOCUMENT);
    });
  } catch (e) { console.warn('Мітки колонок не додано (працюємо за позиціями): ' + e); }
}

/** Поточна розкладка аркуша заявок. Без міток — стандартний порядок. */
function loadLayout_(sheet) {
  var map = readTags_(sheet);
  if (!Object.keys(map).length) COLUMNS.forEach(function (c, i) { map[c.key] = i + 1; });
  LAYOUT_ = map;
  return map;
}

/** Номер колонки за ключем; 0, якщо такої колонки в таблиці нема (видалили). */
function colIndex_(key) {
  if (LAYOUT_) return LAYOUT_[key] || 0;
  for (var i = 0; i < COLUMNS.length; i++) if (COLUMNS[i].key === key) return i + 1;
  return 0;
}

function letterOf_(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - m) / 26); }
  return s;
}

function colLetter_(key) {
  var n = colIndex_(key);
  if (!n) throw new Error('Немає колонки ' + key);
  return letterOf_(n);
}

function ensureSize_(sheet, rows, cols) {
  if (sheet.getMaxRows() < rows) sheet.insertRowsAfter(sheet.getMaxRows(), rows - sheet.getMaxRows());
  if (sheet.getMaxColumns() < cols) sheet.insertColumnsAfter(sheet.getMaxColumns(), cols - sheet.getMaxColumns());
}

function linkCell_(sheet, row, key, url) {
  if (!url || !colIndex_(key)) return;
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
