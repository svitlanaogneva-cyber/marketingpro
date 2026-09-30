/**
 * Структуровані дані schema.org (JSON-LD). Усі факти беруться з того, що вже є на сайті
 * (тексти FAQ, тривалість програм, контакти), нічого не вигадуємо: розмітка має збігатися з видимим вмістом.
 */
import { FAQ } from "@/content/faq";
import { SITE_NAME, SITE_URL, cases } from "@/lib/site";

const CTX = "https://schema.org";
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export const CONTACTS = {
  email: "marketingpro.ua@gmail.com",
  instagram: "https://www.instagram.com/marketingpro.company/",
  telegram: "https://t.me/marketingpro_ua",
} as const;

/** Компанія + сайт. Виводимо на головній; решта сторінок посилаються на неї через @id. */
export function organizationLd(): object[] {
  return [
    {
      "@context": CTX,
      "@type": "ProfessionalService",
      "@id": ORG_ID,
      name: `${SITE_NAME} — агенція таргетованої реклами`,
      alternateName: SITE_NAME,
      url: `${SITE_URL}/`,
      description: "Performance-маркетинг у Meta Ads: воронки, що приносять підтверджені продажі.",
      email: CONTACTS.email,
      areaServed: "UA",
      inLanguage: "uk",
      founder: { "@type": "Person", name: "Світлана Ліщишина" },
      sameAs: [CONTACTS.instagram, CONTACTS.telegram],
      knowsAbout: ["Meta Ads", "Performance-маркетинг", "Таргетована реклама", "ROAS"],
    },
    {
      "@context": CTX,
      "@type": "WebSite",
      "@id": SITE_ID,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      inLanguage: "uk",
      publisher: { "@id": ORG_ID },
    },
  ];
}

export function faqLd(): object {
  return {
    "@context": CTX,
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path?: string }[]): object {
  return {
    "@context": CTX,
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.path !== undefined ? { item: SITE_URL + it.path } : {}),
    })),
  };
}

/** Дві програми Академії: назви, описи й тривалість взято дослівно зі сторінки /academy. */
export function coursesLd(): object[] {
  const base = {
    "@context": CTX,
    "@type": "Course",
    provider: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
    inLanguage: "uk",
    url: `${SITE_URL}/academy`,
  };
  return [
    {
      ...base,
      name: "Академія таргету: для власників бізнесу та їхніх команд",
      description:
        "Практичне навчання для тих, хто хоче розібратися в таргеті й керувати рекламою свого бізнесу в Meta Ads — впевнено й без зливу бюджету.",
      timeRequired: "P5W",
    },
    {
      ...base,
      name: "Академія таргету: для тих, хто будує карʼєру в таргеті",
      description:
        "Практичне навчання для тих, хто хоче впевнено працювати з таргетованою рекламою, легко знаходити клієнтів і побудувати стабільний дохід.",
      timeRequired: "P10W",
    },
  ];
}

export function casesListLd(): object {
  return {
    "@context": CTX,
    "@type": "ItemList",
    name: "Кейси marketingpro",
    itemListElement: cases.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: c.canonical,
      name: c.title.replace(/\s+—\s+кейс marketingpro$/i, ""),
    })),
  };
}
