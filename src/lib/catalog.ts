import { csvList } from "./csv";
import { getCategories, getFactories } from "./data";
import type { Category, Factory } from "./schemas";

export type Segment = Category["segment"];

export async function getPublishedCategories(segment: Segment): Promise<Category[]> {
  const categories = await getCategories();
  return categories.filter((c) => c.segment === segment);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.id === id);
}

export async function getFactoriesForCategory(categoryId: string): Promise<Factory[]> {
  const factories = await getFactories();
  return factories
    .filter((f) => f.published && f.categories.includes(categoryId))
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}

export async function getFactoryById(id: string): Promise<Factory | undefined> {
  const factories = await getFactories();
  return factories.find((f) => f.id === id && f.published);
}

export function parseModels(models: string): string[] {
  return csvList(models);
}

export type CategoryMetrics = {
  priceMin?: number;
  priceMax?: number;
  leadTime?: string;
  factoryCount: number;
};

export function computeCategoryMetrics(category: Category, factories: Factory[]): CategoryMetrics {
  return {
    priceMin: category.priceMin,
    priceMax: category.priceMax,
    leadTime: category.leadTime,
    factoryCount: factories.length,
  };
}

export type FilterOption = { value: string; label: string; count: number };

/** Отрасли, реально встречающиеся среди заводов категории — справочник фильтруется по данным. */
export function getIndustryFilterOptions(
  factories: Factory[],
  industryLabels: Record<string, string>,
): FilterOption[] {
  const counts = new Map<string, number>();
  for (const factory of factories) {
    for (const industry of factory.industries) {
      counts.set(industry, (counts.get(industry) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count, label: industryLabels[value] ?? value }))
    .sort((a, b) => b.count - a.count);
}

/** Срок поставки — текстовое поле в исходных данных, группируем по нижней границе диапазона недель. */
export function getLeadTimeFilterOptions(factories: Factory[]): FilterOption[] {
  const buckets = new Map<string, number>();
  for (const factory of factories) {
    const bucket = leadTimeBucket(factory.leadTime);
    buckets.set(bucket, (buckets.get(bucket) ?? 0) + 1);
  }
  return Array.from(buckets.entries())
    .map(([value, count]) => ({ value, count, label: value }))
    .sort((a, b) => parseInt(a.value) - parseInt(b.value));
}

function leadTimeBucket(leadTime: string): string {
  const match = leadTime.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return leadTime;
  return `${match[1]}-${match[2]} недель`;
}

export function filterFactories(
  factories: Factory[],
  filters: { industries: string[]; leadTimes: string[] },
): Factory[] {
  return factories.filter((factory) => {
    const industryMatch =
      filters.industries.length === 0 ||
      factory.industries.some((i) => filters.industries.includes(i));
    const leadTimeMatch =
      filters.leadTimes.length === 0 ||
      filters.leadTimes.includes(leadTimeBucket(factory.leadTime));
    return industryMatch && leadTimeMatch;
  });
}
