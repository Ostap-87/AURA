import type { Metadata } from "next";

/** Базовый адрес сайта. До подключения домена (этап 12) — боевой домен из PROJECT.md. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aura-robotics.ru";

/** Абсолютный URL страницы: ru без префикса, en с /en (localePrefix: "as-needed"). */
export function localeUrl(locale: string, path: string): string {
  const suffix = path === "/" ? "" : path;
  return locale === "en" ? `${siteUrl}/en${suffix}` : `${siteUrl}${suffix}` || siteUrl;
}

/** canonical + hreflang для пары ru/en (PROJECT.md, раздел 12). */
export function pageAlternates(locale: string, path: string): Metadata["alternates"] {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      ru: localeUrl("ru", path),
      en: localeUrl("en", path),
      "x-default": localeUrl("ru", path),
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD (PROJECT.md, раздел 12). Каждый билдер возвращает готовый объект
// для <JsonLd data={...} />; строки берутся из данных, ничего не выдумываем.
// ---------------------------------------------------------------------------

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Aura Robotics",
    legalName: "Shanghai Pinnacle Technology Co., Ltd.",
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    email: "inquairy@aura-robotics.ru",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gaoshang Lingyu Complex, Tower T3, Office 1235, Putuo District",
      addressLocality: "Shanghai",
      addressCountry: "CN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+7 985 874 49 58",
        contactType: "sales",
        availableLanguage: ["ru", "en"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+86 137 6171 6355",
        contactType: "customer support",
        areaServed: "CN",
      },
    ],
    sameAs: ["https://t.me/ostapdotcenko"],
  };
}

/** WebSite-сущность для карточки сайта в поиске (имя, язык, канонический URL). */
export function websiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aura Robotics",
    url: localeUrl(locale, "/"),
    inLanguage: locale,
  };
}

export function breadcrumbJsonLd(locale: string, items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: localeUrl(locale, item.href) } : {}),
    })),
  };
}

export function faqJsonLd(pairs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map((pair) => ({
      "@type": "Question",
      name: pair.question,
      acceptedAnswer: { "@type": "Answer", text: pair.answer },
    })),
  };
}

export function productJsonLd(input: {
  locale: string;
  path: string;
  name: string;
  description: string;
  image?: string;
  priceFrom?: number;
  priceTo?: number;
}) {
  const hasPrice = input.priceFrom !== undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: localeUrl(input.locale, input.path),
    ...(input.image ? { image: input.image } : {}),
    brand: { "@type": "Brand", name: "Aura Robotics" },
    ...(hasPrice
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "RUB",
            lowPrice: input.priceFrom,
            ...(input.priceTo !== undefined ? { highPrice: input.priceTo } : {}),
            availability: "https://schema.org/PreOrder",
          },
        }
      : {}),
  };
}

export function eventJsonLd(input: {
  locale: string;
  path: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  locationName?: string;
  price?: number;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    description: input.description,
    url: localeUrl(input.locale, input.path),
    startDate: input.startDate,
    endDate: input.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: input.locationName ?? "China",
      address: { "@type": "PostalAddress", addressCountry: "CN" },
    },
    organizer: { "@type": "Organization", name: "Aura Robotics", url: siteUrl },
    ...(input.image ? { image: input.image } : {}),
    ...(input.price !== undefined
      ? {
          offers: {
            "@type": "Offer",
            price: input.price,
            priceCurrency: "RUB",
            url: localeUrl(input.locale, input.path),
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}
