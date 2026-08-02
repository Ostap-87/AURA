import { getCategories, getFactories } from "./data";
import { getEquipmentOptions, getProductionFactories } from "./production";
import { industriesContent } from "./content/industries-content";
import { servicesContent } from "./content/services-content";
import { industries as industryRef, services as serviceRef } from "./reference-data";

export type SearchEntry = {
  title: string;
  description: string;
  url: string;
  group: "factory" | "page";
};

/** Разделы сайта, не привязанные к таблицам — заголовки/описания на обоих языках. */
const STATIC_PAGES: {
  path: string;
  title_ru: string;
  title_en: string;
  description_ru: string;
  description_en: string;
}[] = [
  {
    path: "/catalog",
    title_ru: "Каталог роботов",
    title_en: "Robot catalog",
    description_ru: "Роботы напрямую с китайских заводов — по категориям, с ценами и сроками поставки.",
    description_en: "Robots direct from Chinese factories — by category, with prices and lead times.",
  },
  {
    path: "/production",
    title_ru: "Роботизированное оборудование для производств",
    title_en: "Robotic equipment for production",
    description_ru: "Роботизированные линии, кухни и оборудование для пищевых и смежных производств.",
    description_en: "Robotic lines, kitchens and equipment for food and related production.",
  },
  {
    path: "/quiz",
    title_ru: "Подбор решения",
    title_en: "Solution finder",
    description_ru: "Ответьте на несколько вопросов — подберём решение и посчитаем экономику.",
    description_en: "Answer a few questions — we'll match a solution and calculate the economics.",
  },
  {
    path: "/tours",
    title_ru: "Aura Robotics Tour",
    title_en: "Aura Robotics Tour",
    description_ru: "Поездки на заводы-производители в Китае: смотрим оборудование вживую перед покупкой.",
    description_en: "Trips to manufacturing factories in China: see the equipment in person before buying.",
  },
  {
    path: "/consulting",
    title_ru: "Консалтинг",
    title_en: "Consulting",
    description_ru: "Интеграция, сервис, обучение персонала и программирование поставленного оборудования.",
    description_en: "Integration, maintenance, staff training and programming for delivered equipment.",
  },
  {
    path: "/cases",
    title_ru: "Кейсы и отзывы",
    title_en: "Cases and reviews",
    description_ru: "Истории поставок и закупочных поездок с фото и результатами.",
    description_en: "Delivery and sourcing trip stories with photos and results.",
  },
  {
    path: "/blog",
    title_ru: "Блог",
    title_en: "Blog",
    description_ru: "Разборы производств, роботов и оборудования из Китая.",
    description_en: "Deep dives into factories, robots and equipment from China.",
  },
  {
    path: "/delivery",
    title_ru: "Как проходит поставка",
    title_en: "How delivery works",
    description_ru: "Подбор, контракт, инспекция, логистика, таможня, ввод в эксплуатацию.",
    description_en: "Model selection, contract, inspection, logistics, customs, commissioning.",
  },
  {
    path: "/payment",
    title_ru: "Доставка и оплата",
    title_en: "Delivery and payment",
    description_ru: "Условия оплаты, валюта контракта, доставка до вашего склада.",
    description_en: "Payment terms, contract currency, delivery to your warehouse.",
  },
  {
    path: "/about",
    title_ru: "О компании",
    title_en: "About",
    description_ru: "Кто мы и как работаем с заводами в Китае.",
    description_en: "Who we are and how we work with factories in China.",
  },
  {
    path: "/partners",
    title_ru: "Партнёры и R&D",
    title_en: "Partners and R&D",
    description_ru: "Партнёрская сеть заводов и разработчиков, с которыми мы работаем.",
    description_en: "The network of factories and R&D partners we work with.",
  },
  {
    path: "/faq",
    title_ru: "Вопросы и ответы",
    title_en: "Questions and answers",
    description_ru: "Ответы на частые вопросы о поставке, оплате, гарантии и сервисе.",
    description_en: "Answers to common questions about delivery, payment, warranty and service.",
  },
  {
    path: "/contacts",
    title_ru: "Контакты",
    title_en: "Contacts",
    description_ru: "Свяжитесь с нами: WhatsApp, Telegram, почта, офис в Шанхае.",
    description_en: "Contact us: WhatsApp, Telegram, email, our office in Shanghai.",
  },
];

function pickText(locale: string, ru: string, en: string): string {
  return locale === "en" && en ? en : ru;
}

/**
 * Индекс для строки поиска в шапке: заводы (по названию и применению —
 * industries/categories) плюс основные разделы сайта. Строится из тех же
 * функций данных, что и остальной сайт, поэтому новый завод из таблицы
 * попадает сюда сразу при следующей сборке — без отдельного шага индексации.
 */
export async function buildSearchIndex(locale: string): Promise<SearchEntry[]> {
  const [categories, factories, productionFactories, equipmentOptions] = await Promise.all([
    getCategories(),
    getFactories(),
    getProductionFactories(),
    getEquipmentOptions(),
  ]);
  const categoryIds = new Set(categories.map((c) => c.id));
  const productionFactoryIds = new Set(productionFactories.map((f) => f.id));

  const entries: SearchEntry[] = [];

  // Заводы: и роботы, и производственное оборудование
  for (const factory of factories) {
    if (!factory.published) continue;

    let url: string | undefined;
    if (productionFactoryIds.has(factory.id)) {
      url = `/production/factory/${factory.id}`;
    } else {
      const categoryId = factory.categories.find((id) => categoryIds.has(id));
      if (categoryId) url = `/catalog/${categoryId}/factory/${factory.id}`;
    }
    if (!url) continue;

    const description = pickText(locale, factory.description_ru, factory.description_en ?? "");
    const tags = [...factory.industries, ...factory.categories].join(" ");
    entries.push({
      title: factory.name,
      description: [description, tags].filter(Boolean).join(" "),
      url,
      group: "factory",
    });
  }

  // Разделы сайта без таблицы
  for (const page of STATIC_PAGES) {
    entries.push({
      title: pickText(locale, page.title_ru, page.title_en),
      description: pickText(locale, page.description_ru, page.description_en),
      url: page.path,
      group: "page",
    });
  }

  // Отрасли (/industries/[id])
  for (const content of industriesContent) {
    const ref = industryRef.find((i) => i.id === content.id);
    if (!ref) continue;
    entries.push({
      title: pickText(locale, ref.name_ru, ref.name_en),
      description: pickText(locale, content.intro_ru, content.intro_en),
      url: `/industries/${content.id}`,
      group: "page",
    });
  }

  // Услуги (/services/[id])
  for (const content of servicesContent) {
    const ref = serviceRef.find((s) => s.id === content.id);
    if (!ref) continue;
    entries.push({
      title: pickText(locale, ref.name_ru, ref.name_en),
      description: pickText(locale, content.intro_ru, content.intro_en),
      url: `/services/${content.id}`,
      group: "page",
    });
  }

  // Типы оборудования для производств (/production/equipment/[id]) — только
  // те, где реально есть хотя бы один завод (getEquipmentOptions уже
  // объединяет справочник кода и категории из таблицы).
  const equipmentIds = new Set(productionFactories.flatMap((f) => f.categories));
  for (const equipment of equipmentOptions) {
    if (!equipmentIds.has(equipment.id)) continue;
    entries.push({
      title: pickText(locale, equipment.name_ru, equipment.name_en),
      description: "",
      url: `/production/equipment/${equipment.id}`,
      group: "page",
    });
  }

  return entries;
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

/** Простой поиск подстрокой: совпадение в заголовке важнее совпадения в описании/тегах. */
export function searchIndex(entries: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const q = normalize(query);
  if (!q) return [];

  const scored = entries
    .map((entry) => {
      const title = normalize(entry.title);
      const description = normalize(entry.description);
      let score = -1;
      if (title === q) score = 100;
      else if (title.startsWith(q)) score = 80;
      else if (title.includes(q)) score = 60;
      else if (description.includes(q)) score = 30;
      return { entry, score };
    })
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.entry);
}
