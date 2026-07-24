/**
 * Свободные теги отрасли из колонки `industries` в factories.csv — это не то же
 * самое, что 7 отраслей сайта (industries в reference-data.ts, для /industries).
 * Здесь просто подписи для фильтра каталога по фактическим значениям в данных.
 */
const labels: Record<string, { ru: string; en: string }> = {
  manufacturing: { ru: "Производство", en: "Manufacturing" },
  metalwork: { ru: "Металлообработка", en: "Metalwork" },
  food: { ru: "Пищепром", en: "Food" },
  packaging: { ru: "Упаковка", en: "Packaging" },
  electronics: { ru: "Электроника", en: "Electronics" },
  oilgas: { ru: "Нефть и газ", en: "Oil & gas" },
  medical: { ru: "Медицина", en: "Medical" },
  education: { ru: "Образование", en: "Education" },
  retail: { ru: "Ретейл", en: "Retail" },
  pharma: { ru: "Фармацевтика", en: "Pharma" },
  pharmacy: { ru: "Аптеки", en: "Pharmacies" },
  warehouse: { ru: "Склад", en: "Warehouse" },
  logistics: { ru: "Логистика", en: "Logistics" },
  automotive: { ru: "Автопром", en: "Automotive" },
  labs: { ru: "Лаборатории", en: "Labs" },
  inspection: { ru: "Инспекция", en: "Inspection" },
  shipbuilding: { ru: "Судостроение", en: "Shipbuilding" },
  ecommerce: { ru: "Электронная коммерция", en: "E-commerce" },
  horeca: { ru: "HoReCa", en: "HoReCa" },
  mall: { ru: "Торговые центры", en: "Malls" },
  museum: { ru: "Музеи", en: "Museums" },
  banking: { ru: "Банки", en: "Banking" },
  energy: { ru: "Энергетика", en: "Energy" },
  security: { ru: "Охрана", en: "Security" },
  construction: { ru: "Строительство", en: "Construction" },
  metro: { ru: "Метрополитен", en: "Metro" },
  research: { ru: "Исследования", en: "Research" },
  events: { ru: "Мероприятия", en: "Events" },
  care: { ru: "Уход и забота", en: "Care" },
  agriculture: { ru: "Сельское хозяйство", en: "Agriculture" },
  vending: { ru: "Вендинг", en: "Vending" },
  household: { ru: "Быт", en: "Household" },
  prosthetics: { ru: "Протезирование", en: "Prosthetics" },
  rehabilitation: { ru: "Реабилитация", en: "Rehabilitation" },
  service: { ru: "Сфера услуг", en: "Services" },
  catering: { ru: "Кейтеринг", en: "Catering" },
  readymeals: { ru: "Готовая еда", en: "Ready meals" },
  airline: { ru: "Авиакомпании", en: "Airlines" },
  vegetables: { ru: "Овощепереработка", en: "Vegetable processing" },
  rice: { ru: "Рис и крупы", en: "Rice & grains" },
  thermal: { ru: "Тепловая обработка", en: "Thermal processing" },
  washing: { ru: "Мойка", en: "Washing" },
  centralkitchen: { ru: "Центральные кухни", en: "Central kitchens" },
};

export function industryTagLabel(id: string, locale: string): string {
  const entry = labels[id];
  if (!entry) return id;
  return locale === "en" ? entry.en : entry.ru;
}

export function industryTagLabelMap(locale: string): Record<string, string> {
  return Object.fromEntries(Object.keys(labels).map((id) => [id, industryTagLabel(id, locale)]));
}
