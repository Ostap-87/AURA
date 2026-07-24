/**
 * UTM-метки кладутся в cookie на 90 дней и передаются в заявку
 * (PROJECT.md, раздел 11). Модуль без зависимостей — используется
 * и в edge-middleware, и в route handler.
 */
export const UTM_COOKIE = "aura_utm";
export const UTM_MAX_AGE = 90 * 24 * 60 * 60;
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function parseUtmCookie(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return {};
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = (data as Record<string, unknown>)[key];
      if (typeof value === "string" && value) utm[key] = value.slice(0, 200);
    }
    return utm;
  } catch {
    return {};
  }
}
