export function formatPrice(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU", {
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Вилка цены категории. Пока цены не заведены в таблицу — «по запросу»:
 * категория показывается на сайте с первого дня (PROJECT.md, раздел 7).
 */
export function formatPriceRange(
  min: number | undefined,
  max: number | undefined,
  locale: string,
): string {
  if (min === undefined || max === undefined) {
    return locale === "en" ? "Price on request" : "Цена по запросу";
  }
  const currency = locale === "en" ? "RUB" : "₽";
  return `${formatPrice(min, locale)}–${formatPrice(max, locale)} ${currency}`;
}
