import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "en"],
  defaultLocale: "ru",
  localePrefix: "as-needed",
  // URL детерминирован: / всегда ru, /en всегда en. Без автоredirect по
  // Accept-Language — иначе русский сайт у посетителя с английским
  // браузером «уезжает» на /en, а canonical и hreflang врут.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
