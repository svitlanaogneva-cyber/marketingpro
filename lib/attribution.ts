/**
 * Клієнтський трекінг візиту: звідки прийшла людина і що дивилась до форми.
 * Усе зберігається лише в браузері відвідувача (sessionStorage/localStorage) і ніде не надсилається,
 * поки людина сама не відправить форму — тоді збирається в `attr` разом із заявкою.
 */

const SESSION_KEY = "mp_session_v1";
const VISITOR_KEY = "mp_visitor_v1";

const CLICK_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "fbclid", "gclid", "ttclid"] as const;

type Session = Partial<Record<(typeof CLICK_PARAMS)[number], string>> & {
  landing: string;
  referrer: string;
  startedAt: number;
  pages: number;
  cases: string[];
  lastPath?: string;
  lastAt?: number;
};

type Visitor = { first: string; visits: number };

function read<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(storage: Storage, key: string, value: unknown) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* приватний режим / переповнене сховище — трекінг просто вимикається */
  }
}

function cookie(name: string): string {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : "";
}

/** Викликається на кожній сторінці (і при клієнтських переходах). Швидка й безпечна: усе в try/catch. */
export function trackPageview(): void {
  try {
    const now = Date.now();
    const path = location.pathname;
    const params = new URLSearchParams(location.search);

    let session = read<Session>(sessionStorage, SESSION_KEY);
    if (!session) {
      // нова сесія: рахуємо візит
      const visitor = read<Visitor>(localStorage, VISITOR_KEY) ?? { first: new Date(now).toISOString(), visits: 0 };
      write(localStorage, VISITOR_KEY, { ...visitor, visits: visitor.visits + 1 });
      let ref = document.referrer;
      try {
        // реферер із нашого ж домену — не джерело
        if (ref && new URL(ref).host === location.host) ref = "";
      } catch {
        ref = "";
      }
      session = { landing: path, referrer: ref.slice(0, 300), startedAt: now, pages: 0, cases: [] };
    }

    // свіжі UTM/клік-ID у URL перезаписують збережені (останній рекламний клік важливіший)
    const fresh = CLICK_PARAMS.filter((k) => params.get(k));
    if (fresh.length) {
      for (const k of CLICK_PARAMS) delete session[k];
      for (const k of fresh) session[k] = (params.get(k) || "").slice(0, 120);
      session.landing = session.landing || path;
    }

    // подвійний виклик (StrictMode, швидкий ре-рендер) не має рахувати сторінку двічі
    if (!(session.lastPath === path && session.lastAt && now - session.lastAt < 1500)) {
      session.pages += 1;
      const m = path.match(/^\/cases\/([\w-]+)$/);
      if (m && !session.cases.includes(m[1])) session.cases.push(m[1]);
    }
    session.lastPath = path;
    session.lastAt = now;
    write(sessionStorage, SESSION_KEY, session);
  } catch {
    /* трекінг ніколи не має ламати сайт */
  }
}

/** Все, що додається до заявки. */
export function collectAttribution(): Record<string, unknown> {
  const session = read<Session>(sessionStorage, SESSION_KEY);
  const visitor = read<Visitor>(localStorage, VISITOR_KEY);

  let fbc = cookie("_fbc");
  if (!fbc && session?.fbclid) fbc = `fb.1.${session.startedAt}.${session.fbclid}`; // стандартний формат Meta
  return {
    ...(session
      ? {
          utm_source: session.utm_source,
          utm_medium: session.utm_medium,
          utm_campaign: session.utm_campaign,
          utm_content: session.utm_content,
          utm_term: session.utm_term,
          utm_id: session.utm_id,
          fbclid: session.fbclid,
          gclid: session.gclid,
          ttclid: session.ttclid,
          landing: session.landing,
          referrer: session.referrer,
          startedAt: session.startedAt,
          pages: session.pages,
          cases: session.cases,
        }
      : {}),
    visits: visitor?.visits,
    firstVisit: visitor?.first,
    fbp: cookie("_fbp"),
    fbc,
  };
}
