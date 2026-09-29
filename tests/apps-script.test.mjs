import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";

/* Модель середовища Google Apps Script (таблиця, мітки колонок, замок, властивості), щоб перевіряти реальний код Code.gs
   без Google: setup, запис заявок, переставлення/видалення колонок, перейменування аркушів, аналітика в обох локалях. */
const code = fs.readFileSync(new URL("../integrations/google-sheets/Code.gs", import.meta.url), "utf8");
let LOCALE = "uk";

const ENUM=new Proxy({}, {get:(_,k)=>String(k)});
class Range{
  constructor(sh,r,c,nr=1,nc=1){Object.assign(this,{sh,r,c,nr,nc});
    const px=new Proxy(this,{get:(t,p)=>{ if(p in t) return t[p]; if(typeof p==='symbol') return undefined; return (..._a)=>px; }, set:(t,p,v)=>{t[p]=v;return true}}); return px; }
  getValues(){const o=[];for(let i=0;i<this.nr;i++){const row=[];for(let j=0;j<this.nc;j++)row.push(this.sh.cells.get(`${this.r+i},${this.c+j}`)??'');o.push(row)}return o}
  getValue(){const v=this.sh.cells.get(`${this.r},${this.c}`)??'';if(v==='=IF(TRUE,1,2)')return LOCALE==='us'?1:'#ERROR!';return v}
  setValues(v){v.forEach((row,i)=>row.forEach((x,j)=>this.sh.cells.set(`${this.r+i},${this.c+j}`,x)));return this}
  setValue(x){this.sh.cells.set(`${this.r},${this.c}`,x);return this}
  setFormula(f){this.sh.cells.set(`${this.r},${this.c}`,f);return this}
  setFormulas(v){return this.setValues(v)}
  getRow(){return this.r} getColumn(){return this.c}
  getA1Notation(){return 'A'+this.r}
  createTextFinder(t){const self=this;return {matchEntireCell(){return this},findNext(){for(let i=0;i<self.nr;i++)for(let j=0;j<self.nc;j++){if(String(self.sh.cells.get(`${self.r+i},${self.c+j}`)??'')===t) return new Range(self.sh,self.r+i,self.c+j)} return null}}}
  addDeveloperMetadata(key,val){ if(this.nc!==1) throw new Error('only whole column'); this.sh.meta.push({key,value:val,type:'COLUMN',col:this.c,sheet:this.sh}); return this }
  shiftColumnGroupDepth(d){ for(let c=this.c;c<this.c+this.nc;c++) this.sh.depth[c]=Math.max(0,(this.sh.depth[c]||0)+d); return this }
  setRichTextValues(v){ v.forEach((row,i)=>row.forEach((_x,j)=>this.sh.rich.push({r:this.r+i,c:this.c+j,v:this.sh.cells.get(`${this.r+i},${this.c+j}`)}))); return this }
  setRichTextValue(){ this.sh.rich.push({r:this.r,c:this.c,v:this.sh.cells.get(`${this.r},${this.c}`)}); return this }
  sort({column,ascending}){ /* сортуємо рядки діапазону за колонкою */ const rows=[];for(let i=0;i<this.nr;i++){const row=[];for(let j=0;j<this.nc;j++)row.push(this.sh.cells.get(`${this.r+i},${this.c+j}`)??'');rows.push(row)}
    const k=column-this.c; rows.sort((a,b)=>(a[k]<b[k]?-1:a[k]>b[k]?1:0)*(ascending?1:-1)); rows.forEach((row,i)=>row.forEach((x,j)=>this.sh.cells.set(`${this.r+i},${this.c+j}`,x))); return this }
}
class Sheet{
  constructor(ss,name){this.ss=ss;this.name=name;this.cells=new Map();this.meta=[];this.rich=[];this.depth={};this.collapsedFrom=null;this.maxRows=1000;this.maxCols=26;
    const px=new Proxy(this,{get:(t,p)=>{ if(p in t) return t[p]; if(typeof p==='symbol') return undefined; return (..._a)=>new Range(px,1,1); }}); return px; }
  getColumnGroupDepth(c){return this.depth[c]||0}
  getColumnGroup(col){return {collapse:()=>{this.collapsedFrom=col}}}
  getName(){return this.name} setName(n){this.name=n;return this} getParent(){return this.ss}
  getRange(r,c,nr,nc){return new Range(this,r,c,nr??1,nc??1)}
  getLastRow(){let m=0;for(const [k,v] of this.cells) if(v!==''&&v!==null){m=Math.max(m,+k.split(',')[0])}return m}
  getLastColumn(){let m=0;for(const [k,v] of this.cells) if(v!==''&&v!==null){m=Math.max(m,+k.split(',')[1])}return m}
  getMaxRows(){return this.maxRows} getMaxColumns(){return this.maxCols}
  insertRowsAfter(_a,n){this.maxRows+=n} insertColumnsAfter(_a,n){this.maxCols+=n}
  deleteRows(a,n){this.maxRows-=n} deleteColumns(a,n){this.maxCols-=n}
  deleteRow(r){const nc=new Map();for(const [k,v] of this.cells){const [rr,cc]=k.split(',').map(Number);if(rr===r)continue;nc.set(`${rr>r?rr-1:rr},${cc}`,v)}this.cells=nc}
  getFilter(){return null} getCharts(){return []} newChart(){const b=new Proxy({},{get:(_t,_p)=>()=>b});return b}
  addDeveloperMetadata(key,val){this.meta.push({key,value:val,type:'SHEET',sheet:this})}
  createDeveloperMetadataFinder(){return finder(()=>this.meta)}
}
function finder(getAll){let key,val;const f={withKey(k){key=k;return f},withValue(v){val=v;return f},find(){return getAll().filter(m=>(key===undefined||m.key===key)&&(val===undefined||m.value===val)).map(m=>({getValue:()=>m.value,remove(){const all=getAll();all.splice(all.indexOf(m),1)},getLocation:()=>({getLocationType:()=>m.type,getColumn:()=>({getColumn:()=>m.col}),getSheet:()=>m.sheet})}))}};return f}
class Spreadsheet{
  constructor(){this.sheets=[new Sheet(this,'Аркуш1')];this.active=this.sheets[0]}
  getSheets(){return this.sheets} getSheetByName(n){return this.sheets.find(s=>s.name===n)||null}
  insertSheet(n,i){const s=new Sheet(this,n);this.sheets.splice(i??this.sheets.length,0,s);return s}
  setActiveSheet(s){this.active=s} moveActiveSheet(pos){this.sheets.splice(this.sheets.indexOf(this.active),1);this.sheets.splice(pos-1,0,this.active)}
  getNumSheets(){return this.sheets.length} setSpreadsheetTimeZone(){} toast(){}
  createDeveloperMetadataFinder(){return finder(()=>this.sheets.flatMap(s=>s.meta.filter(m=>m.type==='SHEET')))}
}

function makeEnv(locale) {
  LOCALE = locale;
  const ss = new Spreadsheet();
  const props = {};
  const ctx = {
    console, Date, Math, JSON, Object, Array, String, Number, RegExp, parseInt, isNaN, Logger: { log() {} },
    SpreadsheetApp: new Proxy({
      getActiveSpreadsheet: () => ss, flush() {},
      getUi: () => ({ alert: () => "YES", ButtonSet: ENUM, Button: { YES: "YES" } }),
      newDataValidation: () => { const b = new Proxy({}, { get: () => () => b }); return b; },
      newConditionalFormatRule: () => { const b = new Proxy({}, { get: () => () => b }); return b; },
      newRichTextValue: () => { const b = new Proxy({}, { get: () => () => b }); return b; },
    }, { get: (t, p) => (p in t ? t[p] : ENUM) }),
    Utilities: {
      formatDate: (d, tz, f) => { const iso = new Intl.DateTimeFormat("sv-SE", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d); return f === "yyyy-MM" ? iso.slice(0, 7) : f === "dd.MM.yyyy HH:mm" ? iso.split("-").reverse().join(".") + " 00:00" : iso; },
      getUuid: () => Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2),
    },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k], setProperty: (k, v) => { props[k] = v; } }) },
    ContentService: {},
  };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return { ss, run: (src) => vm.runInContext(src, ctx), leads: () => ss.sheets.find((s) => s.meta.some((m) => m.type === "SHEET" && m.value === "leads")) };
}

const { ss, run, leads } = makeEnv("uk");
test('setup() виконується без помилок', ()=>run('setup()'));
test('створено аркуші: Заявки, Аналітика, Інструкція, Технічні дані (у цьому порядку)', ()=>assert.deepEqual(ss.sheets.map(s=>s.name),['Заявки','Аналітика','Інструкція','Технічні дані']));
test('кожна з 42 колонок має мітку, номери колонок унікальні', ()=>{const t=leads().meta.filter(m=>m.key==='mp_col');assert.equal(t.length,run('COLUMNS.length'));assert.equal(new Set(t.map(m=>m.col)).size,t.length)});
test('аркуші мають ролі: leads/stats/guide/tech', ()=>assert.deepEqual(ss.sheets.flatMap(s=>s.meta.filter(m=>m.type==='SHEET').map(m=>m.value)).sort(),['guide','leads','stats','tech']));
test('шапка = заголовки колонок', ()=>{const h=leads().getRange(1,1,1,run('COLUMNS.length')).getValues()[0];assert.equal(h[0],'Коли надійшла заявка');assert.ok(h.includes('Ніша бізнесу'))});
test('вкладка «Технічні дані» містить репозиторій і акаунт Google', ()=>{const vals=[...ss.getSheetByName('Технічні дані').cells.values()].join('|');assert.ok(vals.includes('svitlanaogneva-cyber/marketingpro'));assert.ok(vals.includes('marketingpro.ua@gmail.com'))});

const lead={id:'AB12CD34',createdAt:'2026-09-29T10:00:00.000Z',type:'Консультація',name:'Олена',contact:'+380631112233',link:'x.com',niche:'бьюті',source:'meta',device:'Телефон · iOS',ua:'UA-STRING',page:'/'};
const colOf=(k)=>leads().meta.find(m=>m.key==='mp_col'&&m.value===k).col;
const cell=(r,k)=>leads().getRange(r,colOf(k)).getValue();

let res; test('writeLead_ пише в рядок 2', ()=>{ res=run(`writeLead_(${JSON.stringify(lead)})`); assert.equal(res.row,2); assert.equal(res.duplicate,false)});
test('значення у правильних колонках', ()=>{assert.equal(cell(2,'contact'),'+380631112233');assert.equal(cell(2,'name'),'Олена');assert.equal(cell(2,'status'),'Новий');assert.equal(cell(2,'day'),'2026-09-29');assert.equal(cell(2,'id'),'AB12CD34')});
test('повтор із тим самим ID → duplicate, рядок не додається', ()=>{const r=run(`writeLead_(${JSON.stringify(lead)})`);assert.equal(r.duplicate,true);assert.equal(leads().getLastRow(),2)});

// імітація: «Телефон…» переміщено в колонку 1 (усі інші зсунуті вправо), «Технічний опис браузера» (ua) видалено, «Ім’я» перейменовано
const moveCol=(sh,from,to)=>{const H=sh.getLastRow()+5, W=sh.maxCols; const data={};for(let r=1;r<=H;r++){const row=[];for(let c=1;c<=W;c++)row.push(sh.cells.get(`${r},${c}`)??'');data[r]=row}
  for(let r=1;r<=H;r++){const [x]=data[r].splice(from-1,1);data[r].splice(to-1,0,x)} sh.cells=new Map();for(let r=1;r<=H;r++)data[r].forEach((v,i)=>{if(v!=='')sh.cells.set(`${r},${i+1}`,v)});
  sh.meta.filter(m=>m.type==='COLUMN').forEach(m=>{ if(m.col===from) m.col=to; else if(from>to&&m.col>=to&&m.col<from) m.col++; else if(from<to&&m.col>from&&m.col<=to) m.col--; })};
const delCol=(sh,col)=>{const H=sh.getLastRow()+5,W=sh.maxCols;const cells=new Map();for(let r=1;r<=H;r++)for(let c=1;c<=W;c++){const v=sh.cells.get(`${r},${c}`);if(v===undefined)continue;if(c===col)continue;cells.set(`${r},${c>col?c-1:c}`,v)}sh.cells=cells;sh.meta=sh.meta.filter(m=>!(m.type==='COLUMN'&&m.col===col));sh.meta.filter(m=>m.type==='COLUMN'&&m.col>col).forEach(m=>m.col--)};
test('користувач: переніс «Телефон…» у колонку 1, видалив «Технічний опис браузера», перейменував заголовок і аркуш', () => {
  moveCol(leads(),colOf('contact'),1); delCol(leads(),colOf('ua'));
  leads().getRange(1,colOf('name')).setValue('Як звати');       // перейменували заголовок
  leads().name='Мої заявки';                                      // перейменували аркуш
});
test('контакт тепер у колонці 1, колонки ua більше нема', ()=>{assert.equal(colOf('contact'),1);assert.ok(!leads().meta.some(m=>m.value==='ua'))});
const lead2={...lead,id:'ZZ99YY88',name:'Марія',contact:'@maria_test'};
test('нова заявка потрапляє в ПЕРЕСТАВЛЕНІ колонки', ()=>{ const r=run(`writeLead_(${JSON.stringify(lead2)})`); assert.equal(r.row,3); assert.equal(cell(3,'contact'),'@maria_test'); assert.equal(cell(3,'name'),'Марія'); assert.equal(cell(3,'id'),'ZZ99YY88'); assert.equal(cell(3,'status'),'Новий'); assert.equal(leads().getRange(3,1).getValue(),'@maria_test')});
test('дані першої заявки не зачеплено', ()=>{assert.equal(cell(2,'contact'),'+380631112233');assert.equal(cell(2,'name'),'Олена')});
test('дедуплікація працює й після переставлення', ()=>assert.equal(run(`writeLead_(${JSON.stringify(lead2)})`).duplicate,true));
test('перейменований аркуш «Мої заявки» знаходиться за міткою', ()=>{assert.equal(run("findSheet_(SpreadsheetApp.getActiveSpreadsheet(),'leads','Заявки')").name,'Мої заявки')});
test('рядки з дірою (порожній рядок посередині) — нова заявка під останнім заповненим', ()=>{ const r=run(`writeLead_(${JSON.stringify({...lead,id:'GAP00001',contact:'+380500000000'})})`); assert.equal(r.row,4)});

test('refreshDocs() працює на переставленій розкладці', ()=>run('refreshDocs()'));
test('в аналітиці формули посилаються на актуальні літери колонок', ()=>{const f=[...ss.getSheetByName('Аналітика').cells.values()].filter(v=>typeof v==='string'&&v.startsWith('=')&&v.includes("'Мої заявки'!"));assert.ok(f.length>50,'формул: '+f.length)});
test('в інструкції показано актуальну назву перейменованої колонки', ()=>{const g=[...ss.getSheetByName('Інструкція').cells.values()];assert.ok(g.includes('Як звати'))});

test('користувач видалив колонку з контактом', () => delCol(leads(),colOf('contact')));
test('якщо видалили колонку з контактом — запис ПАДАЄ з помилкою (заявка не губиться мовчки)', ()=>assert.throws(()=>run(`writeLead_(${JSON.stringify({...lead,id:'NOCONT01'})})`),/немає колонки/));
test('аналітика без потрібних колонок пояснює, чого бракує, а не ламається', ()=>{ delCol(leads(),colOf('source')); run('refreshDocs()'); assert.ok([...ss.getSheetByName('Аналітика').cells.values()].join('|').includes('Не вистачає')) });

test("HOW (звідки береться / як заповнюється) описує кожну колонку", () => {
  const cols = JSON.parse(run("JSON.stringify(COLUMNS.map(function (c) { return c.key; }))"));
  const how = JSON.parse(run("JSON.stringify(Object.keys(HOW))"));
  assert.deepEqual(cols.filter((k) => !how.includes(k)), []);
  assert.deepEqual(how.filter((k) => !cols.includes(k)), []);
});

for (const [locale, sep, other] of [["us", ",", ";"], ["uk", ";", ","]]) {
  test(`формули «Аналітики» коректні для локалі ${locale} (роздільник «${sep}»)`, () => {
    const env = makeEnv(locale);
    env.run("setup()");
    LOCALE = locale;
    env.run("refreshDocs()");
    const outside = (f) => f.replace(/"[^"]*"/g, '""');
    const formulas = [...env.ss.getSheetByName("Аналітика").cells.values()].filter((v) => typeof v === "string" && v.startsWith("=") && v !== "=IF(TRUE,1,2)");
    assert.ok(formulas.length > 100, `формул: ${formulas.length}`);
    assert.deepEqual(formulas.filter((f) => f.includes("¦")), [], "лишились плейсхолдери ¦");
    assert.deepEqual(formulas.filter((f) => !f.includes("QUERY(") && outside(f).includes(other)), [], `формули з чужим роздільником «${other}»`);
    assert.ok(formulas.some((f) => f.startsWith(`=COUNTIF('Заявки'!`) && f.includes(sep)));
  });
}

test("демо-дані: клікабельним робимо лише те, що має посилання (номери телефонів лишаються звичайним текстом)", () => {
  const env = makeEnv("uk");
  env.run("setup()");
  env.run("seedDemoData()");
  const sheet = env.leads();
  assert.equal(sheet.getLastRow(), 81, "має бути 80 демо-заявок");
  const rich = sheet.rich;
  assert.ok(rich.length > 0, "Telegram-нікнейми й сайти мають бути клікабельними");
  assert.deepEqual(rich.filter((x) => String(x.v).startsWith("+") || String(x.v).startsWith("=")), [], "номер телефону не має проходити через rich text");
  const contactCol = env.leads().meta.find((m) => m.key === "mp_col" && m.value === "contact").col;
  const phones = Array.from({ length: 80 }, (_, i) => sheet.getRange(i + 2, contactCol).getValue()).filter((v) => String(v).startsWith("+"));
  assert.ok(phones.length > 10, "у демо-даних мають бути номери телефонів");
  assert.deepEqual(phones.filter((v) => /^[=]/.test(String(v))), []);
});

test("заявка з номером телефону записується звичайним текстом без посилання", () => {
  const env = makeEnv("uk");
  env.run("setup()");
  env.run(`writeLead_(${JSON.stringify({ id: "PH000001", contact: "+38 067 277 27 12", createdAt: "2026-09-29T10:00:00.000Z" })})`);
  assert.deepEqual(env.leads().rich, []);
  const col = env.leads().meta.find((m) => m.key === "mp_col" && m.value === "contact").col;
  assert.equal(env.leads().getRange(2, col).getValue(), "+38 067 277 27 12");
});

test("Google-сумісність графіків: без опцій, які рушій діаграм відхиляє (chartArea.right/bottom тощо)", () => {
  const charts = code.slice(code.indexOf("function buildCharts_"), code.indexOf("/* ------", code.indexOf("function buildCharts_")));
  const area = [...charts.matchAll(/chartArea: \{([^}]*)\}/g)].map((m) => m[1]);
  assert.ok(area.length >= 3);
  for (const a of area) assert.ok(!/right|bottom/.test(a), `chartArea має лише left/top, а знайдено: ${a}`);
  for (const bad of ["showTextEvery", "groupWidth"]) assert.ok(!charts.includes(bad), `недопустима опція ${bad}`);
  assert.ok(charts.includes("try {") && charts.includes("catch (e)"), "графіки мають будуватись у try/catch");
});

test("група службових колонок: стара група зі старого місця знімається, ховаються лише службові колонки", () => {
  const env = makeEnv("uk");
  env.run("setup()");
  const sheet = env.leads();
  const colOf = (k) => sheet.meta.find((m) => m.key === "mp_col" && m.value === k).col;
  const lastVisible = Math.max(...JSON.parse(env.run("JSON.stringify(COLUMNS.filter(function (c) { return !c.tech; }).map(function (c) { return c.key; }))")).map(colOf));
  const firstTech = colOf("id");
  assert.equal(firstTech, lastVisible + 1, "службові колонки йдуть відразу після видимих");
  // імітуємо стару групу з попередньої розкладки (починалась із 13-ї колонки, тобто ховала видимі)
  for (let c = 13; c <= 42; c++) sheet.depth[c] = 1;
  sheet.collapsedFrom = 13;
  env.run("resetFormatting()");
  for (let c = 1; c <= lastVisible; c++) assert.equal(sheet.depth[c] || 0, 0, `видима колонка ${c} не має бути в групі`);
  for (let c = firstTech; c <= 42; c++) assert.equal(sheet.depth[c], 1, `службова колонка ${c} має бути в групі`);
  assert.equal(sheet.collapsedFrom, firstTech);
});

test("у текстах діалогів і підказок немає буквальних «\\n» (мають бути справжні переноси рядків)", () => {
  const bad = code.split("\n").map((l, i) => [i + 1, l]).filter(([, l]) => l.includes("\\\\n") && !/\/.*\\\\n.*\/[gimsuy]*[.,;)]/.test(l));
  assert.deepEqual(bad, []);
});
