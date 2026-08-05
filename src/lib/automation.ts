import { getFactories } from "./data";

/**
 * Отдельный, не роботизированный сегмент: конвейерные весы, сортировщики,
 * рентген-контроль и линии убоя без манипулятора. Держим его отдельно от
 * "production" (там — роботизированное оборудование), чтобы основной
 * каталог сайта не размывался автоматикой без робота внутри.
 */
export async function getAutomationFactories() {
  const factories = await getFactories();
  return factories.filter((f) => f.published && f.segments.includes("automation"));
}
