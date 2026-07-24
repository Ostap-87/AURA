import { getCategories, getFactories, getTourContent, getTourCosts, getTourDays, getTours } from "./data";
import type { Factory, Tour, TourContent, TourCost, TourDay } from "./schemas";

export async function getPublishedTours(): Promise<Tour[]> {
  const tours = await getTours();
  return tours.filter((t) => t.published);
}

export async function getTourById(id: string): Promise<Tour | undefined> {
  const tours = await getPublishedTours();
  return tours.find((t) => t.id === id);
}

export async function getDaysForTour(tourId: string): Promise<TourDay[]> {
  const days = await getTourDays();
  return days.filter((d) => d.tourId === tourId).sort((a, b) => a.dayNumber - b.dayNumber);
}

export async function getCostsForTour(tourId: string): Promise<TourCost[]> {
  const costs = await getTourCosts();
  return costs.filter((c) => c.tourId === tourId).sort((a, b) => a.order - b.order);
}

export async function getContentForTour(tourId: string): Promise<TourContent[]> {
  const content = await getTourContent();
  return content.filter((c) => c.tourId === tourId).sort((a, b) => a.order - b.order);
}

/** «3 города · 5 дней · 12 компаний» — всё вычисляется из данных (PROJECT.md 5.3). */
export function computeTourStats(tour: Tour, days: TourDay[]) {
  const companies = new Set(days.flatMap((d) => d.companies));
  return { cities: tour.cities.length, days: days.length, companies: companies.size };
}

/** Суммы сметы (5.4): итог = fixed + estimate, ни одна сумма не вписана в код. */
export function computeCostTotals(costs: TourCost[]) {
  const fixed = costs.filter((c) => c.type === "fixed");
  const estimates = costs.filter((c) => c.type === "estimate");
  const fixedSum = fixed.reduce((sum, c) => sum + c.amount, 0);
  const estimateSum = estimates.reduce((sum, c) => sum + c.amount, 0);
  return { fixed, estimates, fixedSum, total: fixedSum + estimateSum };
}

export function contentBlock(content: TourContent[], block: TourContent["block"]): TourContent[] {
  return content.filter((c) => c.block === block);
}

/**
 * Пары FAQ собираются по одинаковому order. Ответы с маркером
 * «ЗАПОЛНИТЬ»/«TO FILL» в таблице — незаполненный контент; такие пары
 * не рендерятся (правило «ни одного заглушечного текста»), появятся
 * сами, когда владелец допишет ответ в таблице.
 */
export function faqPairs(content: TourContent[]) {
  const questions = contentBlock(content, "faqQuestion");
  const answers = contentBlock(content, "faqAnswer");
  return questions
    .map((q) => ({ q, a: answers.find((a) => a.order === q.order) }))
    .filter((pair): pair is { q: TourContent; a: TourContent } => {
      if (!pair.a) return false;
      const text = pair.a.text_ru.trim().toUpperCase();
      return !text.startsWith("ЗАПОЛНИТЬ") && !text.startsWith("TO FILL");
    });
}

export type ProgramCompany =
  | { kind: "linked"; factory: Factory; href: string }
  | { kind: "plain"; factory: Factory }
  | { kind: "unknown"; id: string };

/**
 * Компании программы: ссылка в каталог, если завод существует и его
 * категория заведена (иначе страница завода отдаст 404); найден без
 * валидной категории — карточка без ссылки; не найден вовсе — текст,
 * сборка не падает (5.3).
 */
export async function resolveProgramCompanies(days: TourDay[]): Promise<ProgramCompany[]> {
  const [factories, categories] = await Promise.all([getFactories(), getCategories()]);
  const validCategoryIds = new Set(categories.map((c) => c.id));
  const ids = Array.from(new Set(days.flatMap((d) => d.companies)));

  return ids.map((id) => {
    const factory = factories.find((f) => f.id === id && f.published);
    if (!factory) return { kind: "unknown", id };
    const categoryId = factory.categories.find((c) => validCategoryIds.has(c));
    if (!categoryId) return { kind: "plain", factory };
    return { kind: "linked", factory, href: `/catalog/${categoryId}/factory/${factory.id}` };
  });
}

/** Активная поездка и множество заводов в её программе — для плашки в каталоге. */
export async function getActiveTourBadge(): Promise<{
  tour: Tour;
  companyIds: Set<string>;
} | null> {
  const tours = await getPublishedTours();
  const active = tours.find((t) => t.status === "набор" || t.status === "анонс");
  if (!active) return null;
  const days = await getDaysForTour(active.id);
  return { tour: active, companyIds: new Set(days.flatMap((d) => d.companies)) };
}

export function tourBadgeText(tour: Tour, locale: string): string {
  const dates = tour.dateStart
    ? tour.dateEnd
      ? `${tour.dateStart} — ${tour.dateEnd}`
      : tour.dateStart
    : null;
  if (locale === "en") {
    return dates ? `This factory is in the ${dates} tour program` : "This factory is in the Aura Robotics Tour program";
  }
  return dates ? `Этот завод в программе тура ${dates}` : "Этот завод в программе Aura Robotics Tour";
}

/** Дней до закрытия регистрации; null, если дата не заполнена или не парсится. */
export function daysUntilDeadline(tour: Tour): number | null {
  if (!tour.registrationDeadline) return null;
  const deadline = Date.parse(tour.registrationDeadline);
  if (Number.isNaN(deadline)) return null;
  const diff = Math.ceil((deadline - Date.now()) / 86_400_000);
  return diff >= 0 ? diff : null;
}

export type TourCityStop = {
  city: string;
  cityEn: string;
  /** Отображаемые названия компаний: имя завода из базы или id с заглавной. */
  companies: string[];
  days: number[];
};

/**
 * Остановки маршрута для карты: города в порядке первого посещения,
 * компании — уникальные по городу. Всё из tour_days: новая поездка
 * или новый город появляются на карте без правки кода (координаты
 * города — в lib/china-map.ts).
 */
export async function getTourCityStops(days: TourDay[]): Promise<TourCityStop[]> {
  const factories = await getFactories();
  const nameById = new Map(factories.map((f) => [f.id, f.name]));
  const stops: TourCityStop[] = [];
  for (const day of [...days].sort((a, b) => a.dayNumber - b.dayNumber)) {
    let stop = stops.find((s) => s.city === day.city);
    if (!stop) {
      stop = { city: day.city, cityEn: day.cityEn, companies: [], days: [] };
      stops.push(stop);
    }
    stop.days.push(day.dayNumber);
    for (const id of day.companies) {
      const name = nameById.get(id) ?? id.charAt(0).toUpperCase() + id.slice(1);
      if (!stop.companies.includes(name)) stop.companies.push(name);
    }
  }
  return stops;
}
