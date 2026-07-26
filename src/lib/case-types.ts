import type { CaseStory } from "./schemas";

const labels: Record<CaseStory["type"], { ru: string; en: string }> = {
  поставка: { ru: "Кейс поставки", en: "Delivery case" },
  экспедиция: { ru: "Кейс экспедиции", en: "Expedition case" },
  отзыв: { ru: "Отзыв", en: "Review" },
};

export function caseTypeLabel(type: CaseStory["type"], locale: string): string {
  return locale === "en" ? labels[type].en : labels[type].ru;
}
