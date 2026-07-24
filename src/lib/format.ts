export function formatPrice(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU", {
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceRange(min: number, max: number, locale: string): string {
  const currency = locale === "en" ? "RUB" : "₽";
  return `${formatPrice(min, locale)}–${formatPrice(max, locale)} ${currency}`;
}
