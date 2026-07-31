import { getCategoryById, getFactoriesForCategory } from "./catalog";
import { getCategories, getFactories } from "./data";
import { equipmentTypes, subIndustries } from "./reference-data";
import type { Factory } from "./schemas";

export async function getProductionFactories(): Promise<Factory[]> {
  const factories = await getFactories();
  return factories.filter((f) => f.published && f.segments.includes("production"));
}

export async function getFactoriesBySubIndustry(subIndustryId: string): Promise<Factory[]> {
  const factories = await getProductionFactories();
  return factories.filter((f) => f.industries.includes(subIndustryId));
}

/** Типы оборудования — там, где для них заведена категория с ценами, id совпадают. */
export async function getFactoriesByEquipment(equipmentId: string): Promise<Factory[]> {
  return getFactoriesForCategory(equipmentId);
}

export async function getEquipmentCategory(equipmentId: string) {
  const category = await getCategoryById(equipmentId);
  return category?.segment === "production" ? category : undefined;
}

export async function getIntersectionFactories(
  subIndustryId: string,
  equipmentId: string,
): Promise<Factory[]> {
  const bySubIndustry = await getFactoriesBySubIndustry(subIndustryId);
  return bySubIndustry.filter((f) => f.categories.includes(equipmentId));
}

export async function getEquipmentOptionsForSubIndustry(subIndustryId: string) {
  const [factories, options] = await Promise.all([
    getFactoriesBySubIndustry(subIndustryId),
    getEquipmentOptions(),
  ]);
  const ids = new Set<string>();
  factories.forEach((f) => f.categories.forEach((c) => ids.add(c)));
  return options.filter((e) => ids.has(e.id));
}

export async function getSubIndustryOptionsForEquipment(equipmentId: string) {
  const factories = await getFactoriesByEquipment(equipmentId);
  const ids = new Set<string>();
  factories.forEach((f) => f.industries.forEach((i) => ids.add(i)));
  return subIndustries.filter((s) => ids.has(s.id));
}

/** Пересечения создаются только там, где реально есть завод на обеих осях (PROJECT.md, раздел 4). */
export async function getIntersectionParams(): Promise<{ industry: string; equipment: string }[]> {
  const equipmentOptions = await getEquipmentOptions();
  const params: { industry: string; equipment: string }[] = [];
  for (const sub of subIndustries) {
    for (const equipment of equipmentOptions) {
      const matches = await getIntersectionFactories(sub.id, equipment.id);
      if (matches.length > 0) params.push({ industry: sub.id, equipment: equipment.id });
    }
  }
  return params;
}

export type EquipmentOption = { id: string; name_ru: string; name_en: string };

/**
 * Типы оборудования для маршрутов /production/equipment/[equipment]:
 * справочник в коде плюс категории сегмента production из таблицы.
 * Владелец добавляет категорию в Google Sheets — страница появляется
 * сама, без правки кода (раньше такие категории отдавали 404).
 */
export async function getEquipmentOptions(): Promise<EquipmentOption[]> {
  const categories = await getCategories();
  const options: EquipmentOption[] = equipmentTypes.map((e) => ({
    id: e.id,
    name_ru: e.name_ru,
    name_en: e.name_en,
  }));
  const known = new Set(options.map((o) => o.id));
  for (const category of categories) {
    if (category.segment !== "production" || known.has(category.id)) continue;
    options.push({ id: category.id, name_ru: category.name_ru, name_en: category.name_en });
    known.add(category.id);
  }
  return options;
}

export async function getEquipmentOption(id: string): Promise<EquipmentOption | undefined> {
  return (await getEquipmentOptions()).find((o) => o.id === id);
}
