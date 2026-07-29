import type { MetadataRoute } from "next";
import { getCases, getCategories, getConsulting, getFactories } from "@/lib/data";
import { getPublishedTours } from "@/lib/tours";
import { getEquipmentOptions, getIntersectionParams, getProductionFactories } from "@/lib/production";
import { industriesContent } from "@/lib/content/industries-content";
import { servicesContent } from "@/lib/content/services-content";
import { subIndustries } from "@/lib/reference-data";
import { localeUrl } from "@/lib/seo";

/** Обе локали через hreflang-альтернативы (PROJECT.md, раздел 12). */
function entry(path: string): MetadataRoute.Sitemap[number] {
  return {
    url: localeUrl("ru", path),
    alternates: {
      languages: { ru: localeUrl("ru", path), en: localeUrl("en", path) },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, factories, consulting, cases, tours, intersections, productionFactories] =
    await Promise.all([
      getCategories(),
      getFactories(),
      getConsulting(),
      getCases(),
      getPublishedTours(),
      getIntersectionParams(),
      getProductionFactories(),
    ]);

  const paths: string[] = [
    "/",
    "/catalog",
    "/production",
    "/quiz",
    "/tours",
    "/consulting",
    "/cases",
    "/delivery",
    "/payment",
    "/about",
    "/partners",
    "/faq",
    "/contacts",
    "/policy",
  ];

  // Справочники в коде — страницы существуют всегда
  for (const industry of industriesContent) paths.push(`/industries/${industry.id}`);
  for (const service of servicesContent) paths.push(`/services/${service.id}`);

  // Каталог: категории и карточки опубликованных заводов
  for (const category of categories) paths.push(`/catalog/${category.id}`);
  const categoryIds = new Set(categories.map((c) => c.id));
  for (const factory of factories) {
    if (!factory.published) continue;
    for (const categoryId of factory.categories) {
      if (categoryIds.has(categoryId)) paths.push(`/catalog/${categoryId}/factory/${factory.id}`);
    }
  }

  // Оборудование для производств: оси и пересечения только при наличии данных
  if (productionFactories.length > 0) {
    const subIds = new Set(productionFactories.flatMap((f) => f.industries));
    for (const sub of subIndustries) {
      if (subIds.has(sub.id)) paths.push(`/production/${sub.id}`);
    }
    // Справочник кода + категории сегмента production из таблицы (та же
    // логика, что и в generateStaticParams — иначе категории вроде
    // centralkitchen/smartchef не попадут в карту сайта).
    const equipmentOptions = await getEquipmentOptions();
    const equipmentIds = new Set(productionFactories.flatMap((f) => f.categories));
    for (const equipment of equipmentOptions) {
      if (equipmentIds.has(equipment.id)) paths.push(`/production/equipment/${equipment.id}`);
    }
    for (const pair of intersections) {
      paths.push(`/production/${pair.industry}/${pair.equipment}`);
    }
    for (const factory of productionFactories) {
      paths.push(`/production/factory/${factory.id}`);
    }
  }

  // Туры и консалтинг — по данным
  for (const tour of tours) paths.push(`/tours/${tour.id}`);
  for (const service of consulting) {
    if (service.published && service.fullDescription_ru) paths.push(`/consulting/${service.id}`);
  }
  for (const item of cases) {
    if (item.published && item.fullText_ru) paths.push(`/cases/${item.id}`);
  }

  return paths.map(entry);
}
