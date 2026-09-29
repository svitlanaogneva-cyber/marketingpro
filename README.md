# marketingpro

Сайт агенції таргетованої реклами marketingpro. Next.js 16 (App Router) + TypeScript, усі сторінки
статично генеруються на етапі збірки (SSG) — повний HTML, метатеги й JSON-LD одразу у відповіді сервера.

## Сторінки

| Маршрут | Файл |
|---|---|
| `/` | `app/page.tsx` → `content/pages/home.tsx` |
| `/cases` | `app/cases/page.tsx` → `content/pages/cases-index.tsx` |
| `/cases/[slug]` (9 кейсів) | `app/cases/[slug]/page.tsx` → `content/cases/<slug>.tsx` |
| `/academy` | `app/academy/page.tsx` → `content/pages/academy.tsx` |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` |

Тексти сторінок — у `content/`. Title/description/canonical/JSON-LD усіх сторінок — у `content/meta.json`
(єдине джерело, з якого беруться і метатеги, і sitemap).

## Локально

```bash
npm install
npm run dev        # http://localhost:3000
npm run ci         # те саме, що робить GitHub Actions: типи + збірка + перевірка HTML
```

## Деплой

Vercel підключено до цього репозиторію: push у `main` → автоматична збірка й деплой на прод,
кожен PR отримує превʼю-URL. Налаштувань не потрібно — Next.js визначається сам.

Перший раз (робить власник акаунта Vercel): **Add New → Project → Import** цей репозиторій → Deploy,
потім **Settings → Domains** → `marketingpro.company`.

GitHub Actions (`.github/workflows/ci.yml`) на кожен push/PR перевіряє типи, збірку і `scripts/verify-build.mjs`:
у кожної сторінки має бути `title`, `description`, `canonical`, `og:*`, один `<h1>`, валідний JSON-LD,
а sitemap має містити всі маршрути. Якщо щось із цього зламано — CI червоний.

## Швидкість і індексація

- Статичний HTML для всіх сторінок, `generateStaticParams` для кейсів (нових slug'ів поза списком — 404).
- Шрифти через `next/font` (self-hosted, `size-adjust` fallback → без стрибків розмітки), без запитів до Google.
- Зображення через `next/image` (AVIF/WebP, адаптивні розміри, lazy; герой — `priority`).
  У лайтбокс скріни йдуть в оригінальній якості (`data-full`).
- Клієнтський JS — лише `lib/effects.ts` (анімації, акордеони, карусель, лайтбокс, меню, форма).
- `sitemap.xml`, `robots.txt`, canonical, Open Graph/Twitter, JSON-LD (`ProfessionalService`, `BreadcrumbList`).
- Домен для метаданих береться з `NEXT_PUBLIC_SITE_URL` (за замовчуванням `https://marketingpro.company`).

## Що ще не зроблено

- Форма заявки поки заглушка (`lib/effects.ts`, блок «форма»): треба Route Handler `/api/lead`
  (Google Sheet + Telegram + Meta Pixel `Lead`).
- Контраст рожевого `#ff2d7e` на білому (3.45:1) нижче за WCAG AA для дрібного тексту — питання до дизайну.
