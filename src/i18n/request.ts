import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Русский всегда загружается как основа: отсутствующий перевод в en
  // должен показывать русский вариант, а не пустое место.
  const base = (await import(`../../messages/ru.json`)).default;
  const messages =
    locale === "ru"
      ? base
      : deepMerge(base, (await import(`../../messages/${locale}.json`)).default);

  return { locale, messages };
});

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const overrideValue = override[key];
    const baseValue = base[key];
    if (
      overrideValue &&
      baseValue &&
      typeof overrideValue === "object" &&
      typeof baseValue === "object" &&
      !Array.isArray(overrideValue) &&
      !Array.isArray(baseValue)
    ) {
      result[key] = deepMerge(
        baseValue as Record<string, unknown>,
        overrideValue as Record<string, unknown>,
      );
    } else {
      result[key] = overrideValue;
    }
  }
  return result;
}
