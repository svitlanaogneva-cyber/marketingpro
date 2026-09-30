/**
 * Клієнтська поведінка сайту (порт assets/js/main.js + anim.js зі статичної версії).
 *
 * Розмітка рендериться на сервері й повністю читабельна без JS — цей модуль лише
 * «оживляє» її після гідратації: анімації заголовків, акордеони, карусель, лайтбокс,
 * меню, форма. Усі слухачі й observer'и знімаються в поверненій функції, тому
 * ефекти безпечно перезапускати при переході між сторінками. Кожна мутація DOM
 * ідемпотентна (перевірка «вже ініціалізовано»), щоб не ламатись у StrictMode.
 */

import { collectAttribution, trackPageview } from "./attribution";

type Cleanup = () => void;

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

export function initEffects(): Cleanup {
  const ac = new AbortController();
  const { signal } = ac;
  const observers: IntersectionObserver[] = [];
  const timers: number[] = [];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const on = <K extends keyof WindowEventMap>(
    target: Window | Document | HTMLElement,
    type: K | string,
    handler: (e: any) => void,
    opts: AddEventListenerOptions = {},
  ) => target.addEventListener(type, handler, { ...opts, signal });

  trackPageview();

  /* ================= anim.js ================= */

  /* Розбиття тексту на слова (і за потреби на літери). Чіпаємо лише текстові
     вузли — інакше згорить внутрішня розмітка заголовка. */
  function split(el: HTMLElement, withChars: boolean): HTMLElement[] {
    const words: HTMLElement[] = [];
    (function walk(node: Node) {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 1) { walk(n); return; }
        if (n.nodeType !== 3 || !n.textContent) return;
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part.replace(/ /g, " "))); return; }
          const word = document.createElement("span");
          word.className = "word";
          if (withChars) {
            [...part].forEach((ch) => {
              const c = document.createElement("span");
              c.className = "char";
              c.textContent = ch;
              word.appendChild(c);
            });
          } else {
            word.textContent = part;
          }
          words.push(word);
          frag.appendChild(word);
        });
        n.replaceWith(frag);
      });
    })(el);
    return words;
  }

  /* 1. Літери заголовка виїжджають з-під рядка */
  const heads = reduce ? [] : $$("[data-split]").filter((el) => !el.classList.contains("split-ready"));
  if (heads.length) {
    heads.forEach((el) => {
      el.setAttribute("aria-label", (el.textContent || "").replace(/\s+/g, " ").trim());
      const chars: HTMLElement[] = [];
      split(el, true).forEach((w) => chars.push(...(Array.from(w.children) as HTMLElement[])));
      const base = parseFloat(el.dataset.splitDelay || "") || 0;
      const last = chars.length - 1;
      chars.forEach((c, i) => {
        c.style.transitionDelay = (base + (last > 0 ? (i / last) * 0.4 : 0)).toFixed(3) + "s";
      });
      el.classList.add("split-ready");
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const below = e.boundingClientRect.top > 0;
          e.target.classList.toggle("is-in", e.isIntersecting || !below);
        });
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0 },
    );
    observers.push(io);
    heads.forEach((el) => io.observe(el));
  }

  /* 2. Слова абзацу проявляються за прогресом скролу */
  const scrubs: { el: HTMLElement; words: HTMLElement[] }[] = [];
  if (!reduce) {
    $$("[data-scrub]").forEach((el) => {
      if (el.classList.contains("scrub-ready")) return;
      const words = split(el, false);
      if (!words.length) return;
      el.classList.add("scrub-ready");
      scrubs.push({ el, words });
    });
  }
  if (scrubs.length) {
    const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
    let queued = false;
    const paint = () => {
      queued = false;
      const vh = window.innerHeight;
      scrubs.forEach(({ el, words }) => {
        const p = Math.min(1, Math.max(0, (vh * 0.9 - el.getBoundingClientRect().top) / (vh * 0.5)));
        const total = 0.6 + 0.5 * (words.length - 1);
        words.forEach((w, i) => {
          const t = Math.min(1, Math.max(0, (p * total - i * 0.5) / 0.6));
          w.style.opacity = (0.3 + 0.7 * easeOutExpo(t)).toFixed(3);
        });
      });
    };
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };
    on(window, "scroll", queue, { passive: true });
    on(window, "resize", queue);
    paint();
  }

  /* 3. Кругла кнопка на обкладинці кейсу (суто декоративна) */
  $$(".ccard .ccard-media").forEach((media) => {
    if (media.querySelector(".circle-arrow")) return;
    const btn = document.createElement("span");
    btn.className = "circle-arrow";
    btn.setAttribute("aria-hidden", "true");
    btn.innerHTML = '<span class="ca-arr">→</span>';
    media.appendChild(btn);
  });

  /* ================= main.js ================= */

  /* один fade на завантаженні (герой) */
  const fades = $$(".fade");
  if (reduce) {
    fades.forEach((el) => el.classList.add("in"));
  } else {
    requestAnimationFrame(() =>
      fades.forEach((el, i) => timers.push(window.setTimeout(() => el.classList.add("in"), 60 + i * 90))),
    );
  }

  /* відгуки в кейсах: кожен скрін іде в коротшу з двох колонок */
  $$(".revs").forEach((revs) => {
    if (revs.classList.contains("revs--masonry")) return;
    const figs = Array.from(revs.children) as HTMLElement[];
    if (figs.length < 3) return;
    const cols = [document.createElement("div"), document.createElement("div")];
    const heights = [0, 0];
    figs.forEach((fig, i) => {
      const img = fig.querySelector("img");
      const ratio = img ? Number(img.getAttribute("height")) / Number(img.getAttribute("width")) : 1;
      const c = heights[0] <= heights[1] ? 0 : 1;
      fig.style.order = String(i);
      cols[c].appendChild(fig);
      heights[c] += ratio;
    });
    cols.forEach((col) => { col.className = "revs-col"; revs.appendChild(col); });
    revs.classList.add("revs--masonry");
  });

  /* header + sticky CTA */
  const header = document.querySelector<HTMLElement>(".site-header");
  const sticky = document.getElementById("stickyCta");
  const darkSections = $$(".pain, .process, .quote-sec, .contact, .site-footer");
  const syncHeaderTheme = () => {
    if (!header) return;
    const probe = header.getBoundingClientRect().bottom + 1;
    let onDark = false;
    darkSections.forEach((sec) => {
      const r = sec.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) onDark = true;
    });
    header.classList.toggle("is-dark", onDark);
  };
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-stuck", y > 12);
    if (sticky) sticky.classList.toggle("show", y > 760);
    syncHeaderTheme();
  };
  onScroll();
  on(window, "scroll", onScroll, { passive: true });
  on(window, "resize", syncHeaderTheme, { passive: true });

  /* акордеон послуг */
  $$(".svc-row").forEach((btn) => {
    on(btn, "click", () => {
      const item = btn.closest(".svc-item")!;
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* «Спектр наших рішень» центруємо за ЗГОРНУТИМ каталогом і фіксуємо */
  const svcLayout = document.querySelector<HTMLElement>(".svc-layout");
  const svcHead = svcLayout?.querySelector<HTMLElement>(".svc-head");
  if (svcLayout && svcHead) {
    const twoCol = window.matchMedia("(min-width: 1001px)");
    const closedHeight = () =>
      Math.max(
        0,
        ...$$(".svc-col", svcLayout).map((col) => {
          let h = col.offsetHeight;
          $$(".svc-item.open .svc-desc > span", col).forEach((sp) => { h -= sp.offsetHeight; });
          return h;
        }),
      );
    const placeSvcHead = () => {
      svcLayout.style.setProperty("--svc-head-top", "0px");
      if (!twoCol.matches) return;
      const gap = (closedHeight() - svcHead.offsetHeight) / 2;
      if (gap > 0) svcLayout.style.setProperty("--svc-head-top", Math.round(gap) + "px");
    };
    placeSvcHead();
    on(window, "resize", placeSvcHead, { passive: true });
    document.fonts?.ready.then(placeSvcHead);
  }

  /* акордеон FAQ */
  $$(".qa-q").forEach((btn) => {
    on(btn, "click", () => {
      const item = btn.closest(".qa")!;
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* картки програм: на телефоні згорнуті, на десктопі завжди розгорнуті */
  const progToggles = $$(".prog-toggle");
  if (progToggles.length) {
    const progMq = window.matchMedia("(max-width: 700px)");
    const syncProg = () =>
      progToggles.forEach((btn) => {
        const card = btn.closest(".program")!;
        btn.setAttribute("aria-expanded", String(!progMq.matches || card.classList.contains("open")));
      });
    progToggles.forEach((btn) => {
      on(btn, "click", () => {
        const open = btn.closest(".program")!.classList.toggle("open");
        const t = btn.querySelector(".t");
        if (t) t.textContent = open ? "Згорнути" : "Що всередині програми";
        syncProg();
      });
    });
    syncProg();
    progMq.addEventListener("change", syncProg, { signal });
  }

  /* поява блоків при скролі. Класи вішає JS: без JS сторінка повністю видима */
  if (!reduce && "IntersectionObserver" in window) {
    const targets: HTMLElement[] = [];
    $$("main section").forEach((section) => {
      if (section.querySelector(".fade")) return;
      const rows = $$(
        ":scope > .wrap > *:not(.pain-list), :scope > * > .step, :scope > .founder-grid, :scope > .ccards-grid, :scope > .gal--cases",
        section,
      );
      (rows.length ? rows : [section]).forEach((el) => targets.push(el));
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
    );
    observers.push(io);
    targets.forEach((el) => {
      if (el.hasAttribute("data-split")) return;
      if (el.classList.contains("in")) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  /* Симптоми злитого бюджету — картки виїжджають по черзі */
  const painList = document.querySelector<HTMLElement>(".pain-list");
  if (!reduce && painList && "IntersectionObserver" in window) {
    const cards = $$(".pain-row", painList);
    if (cards.length && !cards[0].classList.contains("in") && painList.getBoundingClientRect().top > window.innerHeight * 0.9) {
      cards.forEach((card, i) => {
        card.classList.add("reveal");
        card.style.transitionDelay = (i * 0.13).toFixed(2) + "s";
      });
      const pio = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          cards.forEach((card) => card.classList.add("in"));
          pio.disconnect();
        },
        { rootMargin: "0px 0px -15% 0px", threshold: 0 },
      );
      observers.push(pio);
      pio.observe(painList);
    }
  }

  /* обкладинки: є фото — показуємо, немає — цифру кейсу */
  $$<HTMLImageElement>(".ccard-media img").forEach((img) => {
    const media = img.parentElement!;
    const fail = () => { media.classList.add("no-cover"); img.remove(); };
    img.addEventListener("error", fail, { signal });
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* «назад» угорі кейсу підлаштовується під те, звідки людина прийшла (?from=home) */
  const back = document.querySelector<HTMLAnchorElement>(".case-back a");
  if (back && new URLSearchParams(location.search).get("from") === "home") {
    back.setAttribute("href", "/");
    const lbl = back.querySelector(".lbl");
    if (lbl) lbl.textContent = "Головна";
  }

  /* карусель скрінів — навігація будується з JS, щоб лічильник не розʼїжджався з розміткою */
  $$(".gal").forEach((gal) => {
    if (gal.querySelector(".gal-nav")) return;
    const track = gal.querySelector<HTMLElement>(".gal-track");
    const slides = track ? (Array.from(track.children) as HTMLElement[]) : [];
    if (!track || slides.length < 2) return;

    const what = gal.dataset.navLabel || "скрін";
    const nav = document.createElement("div");
    nav.className = "gal-nav";
    nav.innerHTML =
      `<button class="gal-btn" type="button" data-dir="-1" aria-label="Попередній ${what}">←</button>` +
      `<button class="gal-btn" type="button" data-dir="1" aria-label="Наступний ${what}">→</button>` +
      `<span class="gal-count"><b>1</b> / ${slides.length}</span>`;
    gal.appendChild(nav);

    const [prev, next] = Array.from(nav.querySelectorAll<HTMLButtonElement>(".gal-btn"));
    const counter = nav.querySelector(".gal-count b")!;
    const current = () => {
      const x = track.scrollLeft;
      let best = 0, dist = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft - track.offsetLeft - x);
        if (d < dist) { dist = d; best = i; }
      });
      return best;
    };
    const sync = () => {
      counter.textContent = String(current() + 1);
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    };
    const go = (dir: number) => {
      const i = Math.min(slides.length - 1, Math.max(0, current() + dir));
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" });
    };
    on(nav, "click", (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(".gal-btn");
      if (btn) go(Number(btn.dataset.dir));
    });
    on(track, "scroll", sync, { passive: true });
    on(window, "resize", sync);
    sync();

    /* тягнути мишею — лише для точного вказівника */
    if (!window.matchMedia("(pointer: fine)").matches) return;
    track.classList.add("can-drag");
    let sx = 0, sl = 0, moved = 0, dragging = false;
    const move = (e: PointerEvent) => {
      moved = Math.max(moved, Math.abs(e.clientX - sx));
      if (!dragging && moved < 6) return;
      dragging = true;
      track.classList.add("dragging");
      track.scrollLeft = sl - (e.clientX - sx);
    };
    const up = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      track.classList.remove("dragging");
      dragging = false;
      sync();
    };
    signal.addEventListener("abort", up);
    on(track, "pointerdown", (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType !== "mouse") return;
      sx = e.clientX; sl = track.scrollLeft; moved = 0;
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    });
    track.addEventListener("click", (e) => { if (moved > 6) e.preventDefault(); }, { capture: true, signal });
    on(track, "dragstart", (e: Event) => e.preventDefault());
  });

  /* лайтбокс — скріни кабінету дрібні, без збільшення їх не прочитати */
  const lbox = document.getElementById("lbox");
  if (lbox) {
    const lboxImg = document.getElementById("lboxImg") as HTMLImageElement;
    const lboxVideo = document.getElementById("lboxVideo") as HTMLVideoElement | null;
    let lastFocus: HTMLElement | null = null;
    const open = () => {
      lbox.classList.add("show");
      document.body.classList.add("lbox-open");
      lbox.querySelector<HTMLElement>(".lbox-close")?.focus();
    };
    const close = () => {
      lbox.classList.remove("show", "is-video");
      document.body.classList.remove("lbox-open");
      lboxImg.removeAttribute("src");
      if (lboxVideo) { lboxVideo.pause(); lboxVideo.removeAttribute("src"); lboxVideo.load(); }
      lastFocus?.focus();
    };
    $$(".shot").forEach((btn) => {
      on(btn, "click", () => {
        const img = btn.querySelector("img");
        if (!img) return;
        lastFocus = btn;
        /* у лайтбокс — оригінал, а не оптимізована під розмір блоку версія */
        lboxImg.src = img.dataset.full || img.currentSrc || img.src;
        lboxImg.alt = img.alt;
        open();
      });
    });
    $$(".vid-tile").forEach((btn) => {
      on(btn, "click", () => {
        if (!lboxVideo) return;
        lastFocus = btn;
        lboxVideo.src = btn.dataset.video || "";
        lboxVideo.removeAttribute("poster");
        lbox.classList.add("is-video");
        open();
        lboxVideo.play().catch(() => {});
      });
    });
    if (lboxVideo) on(lboxVideo, "click", (e: Event) => e.stopPropagation());
    on(lbox, "click", close);
    on(document, "keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape" && lbox.classList.contains("show")) close();
    });
    signal.addEventListener("abort", () => {
      if (lbox.classList.contains("show")) close();
    });
  }

  /* скрол до верху по логотипу і «Головна» */
  $$<HTMLAnchorElement>('a[href="#top"]').forEach((a) => {
    on(a, "click", (e: Event) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", window.location.pathname);
    });
  });

  /* мобільне меню */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    const setOpen = (open: boolean) => {
      document.body.classList.toggle("menu-open", open);
      links.classList.toggle("mobile-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
    };
    on(toggle, "click", () => setOpen(!document.body.classList.contains("menu-open")));
    $$("a", links).forEach((a) => on(a, "click", () => setOpen(false)));
    on(document, "keydown", (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); });
    signal.addEventListener("abort", () => setOpen(false));
  }

  /* форма */
  const form = document.getElementById("leadForm") as HTMLFormElement | null;
  if (form) {
    const fields = document.getElementById("formFields");
    const success = document.getElementById("formSuccess");
    const showError = (id: string, msg: string) => {
      const input = document.getElementById(id + "Field");
      const box = document.getElementById("err-" + id);
      if (box) box.textContent = msg || "";
      if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    };
    const val = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? "";

    const submitBtn = form.querySelector<HTMLButtonElement>("button[type=submit]");
    const submitLabel = submitBtn?.innerHTML ?? "";
    /* Один ID на всі спроби цієї форми: повторна відправка (подвійний клік, ретрай) не створить дубль у таблиці */
    const submissionId = Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("");
    let sending = false;

    on(form, "submit", async (e: Event) => {
      e.preventDefault();
      if (sending) return;
      if (val("company") !== "") return; // honeypot

      const contact = val("contact");
      if (contact.length < 4) {
        showError("contact", "Лишіть телефон або Telegram");
        document.getElementById("contactField")?.focus();
        return;
      }
      showError("contact", "");
      showError("form", "");

      sending = true;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Надсилаємо…"; }

      const payload = {
        id: submissionId,
        contact,
        name: val("name"),
        link: val("link"),
        niche: val("niche"),
        prog: (form.querySelector<HTMLInputElement>('input[name="prog"]:checked')?.value ?? "").trim(),
        company: val("company"),
        page: location.pathname,
        referrer: document.referrer,
        lang: navigator.language,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        attr: collectAttribution(),
      };

      try {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
        if (!res.ok || !data.ok) {
          if (data.error === "contact_required" || data.error === "contact_too_short") {
            showError("contact", "Лишіть телефон або Telegram");
            document.getElementById("contactField")?.focus();
            throw new Error("validation");
          }
          throw new Error(data.error || String(res.status));
        }
        if (fields) fields.style.display = "none";
        success?.classList.add("show");
        const w = window as unknown as { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void };
        w.fbq?.("track", "Lead");
        w.gtag?.("event", "generate_lead");
      } catch (err) {
        if ((err as Error).message !== "validation") {
          showError("form", "Не вдалося надіслати заявку. Спробуйте ще раз або напишіть нам у Telegram: @marketingpro_ua");
        }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
      } finally {
        sending = false;
      }
    });

    /* напрям навчання — необовʼязкове поле; кнопка «Записатися» з картки програми відмічає чіп */
    const progInputs = $$<HTMLInputElement>('input[name="prog"]', form);
    if (progInputs.length) {
      const progClear = document.getElementById("progClear") as HTMLElement | null;
      const syncClear = () => { if (progClear) progClear.hidden = !form.querySelector('input[name="prog"]:checked'); };
      progInputs.forEach((input) => on(input, "change", syncClear));
      if (progClear) on(progClear, "click", () => {
        progInputs.forEach((input) => { input.checked = false; });
        syncClear();
      });
      $$("[data-prog]").forEach((link) => {
        on(link, "click", () => {
          const chip = document.getElementById(link.dataset.prog || "") as HTMLInputElement | null;
          if (chip) { chip.checked = true; syncClear(); }
        });
      });
    }

    const contactEl = document.getElementById("contactField");
    if (contactEl) on(contactEl, "input", () => showError("contact", ""));
  }

  return () => {
    ac.abort();
    observers.forEach((o) => o.disconnect());
    timers.forEach((t) => clearTimeout(t));
  };
}
