import { z } from "zod";
import { csvBoolean, csvList, csvNumber } from "./csv";

type CsvRow = Record<string, string>;

/**
 * Wraps a final schema with a CSV-row transform, so callers get a single
 * `safeParse(rawRow)` that both reshapes strings (arrays, booleans, numbers)
 * and validates the result. Used by scripts/sync-data.ts to log and skip
 * broken rows without failing the build.
 */
function csvRowSchema<Schema extends z.ZodTypeAny>(
  finalSchema: Schema,
  toRaw: (row: CsvRow) => unknown,
) {
  return z.custom<CsvRow>().transform((row, ctx) => {
    const parsed = finalSchema.safeParse(toRaw(row));
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        ctx.addIssue({ code: "custom", message: issue.message, path: issue.path });
      }
      return z.NEVER;
    }
    return parsed.data as z.infer<Schema>;
  });
}

const segmentEnum = z.enum(["robots", "production"]);

export const factorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameZh: z.string().optional(),
  country: z.string().min(1),
  city: z.string().optional(),
  founded: z.number().int().optional(),
  segments: z.array(segmentEnum).min(1),
  categories: z.array(z.string()),
  industries: z.array(z.string()),
  description_ru: z.string().min(1),
  description_en: z.string().optional(),
  models: z.string().min(1),
  leadTime: z.string().min(1),
  logo: z.string().optional(),
  photos: z.array(z.string()).default([]),
  photoCaptions: z.array(z.string()).default([]),
  videoUrl: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
});
export type Factory = z.infer<typeof factorySchema>;

export const factoryRowSchema = csvRowSchema(factorySchema, (row) => ({
  id: row.id,
  name: row.name,
  nameZh: row.nameZh || undefined,
  country: row.country,
  city: row.city || undefined,
  founded: csvNumber(row.founded ?? ""),
  segments: csvList(row.segments ?? ""),
  categories: csvList(row.categories ?? ""),
  industries: csvList(row.industries ?? ""),
  description_ru: row.description_ru,
  description_en: row.description_en || undefined,
  models: row.models,
  leadTime: row.leadTime,
  logo: row.logo || undefined,
  photos: csvList(row.photos ?? ""),
  photoCaptions: csvList(row.photoCaptions ?? ""),
  videoUrl: row.videoUrl || undefined,
  featured: csvBoolean(row.featured ?? ""),
  published: csvBoolean(row.published ?? ""),
}));

/**
 * Обязательны только идентификатор, названия и сегмент: категория живёт
 * на сайте с первого дня, а цены, срок и описание владелец добавляет
 * в таблицу по мере готовности (PROJECT.md, «пустые данные не ломают сайт»).
 */
export const categorySchema = z.object({
  id: z.string().min(1),
  name_ru: z.string().min(1),
  name_en: z.string().min(1),
  segment: segmentEnum,
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  leadTime: z.string().optional(),
  description_ru: z.string().optional(),
  description_en: z.string().optional(),
  photo: z.string().optional(),
});
export type Category = z.infer<typeof categorySchema>;

export const categoryRowSchema = csvRowSchema(categorySchema, (row) => ({
  id: row.id,
  name_ru: row.name_ru,
  name_en: row.name_en,
  segment: row.segment,
  priceMin: csvNumber(row.priceMin ?? ""),
  priceMax: csvNumber(row.priceMax ?? ""),
  leadTime: row.leadTime || undefined,
  description_ru: row.description_ru || undefined,
  description_en: row.description_en || undefined,
  photo: row.photo || undefined,
}));

export const tourStatusEnum = z.enum(["анонс", "набор", "закрыта", "прошла"]);

export const tourSchema = z.object({
  id: z.string().min(1),
  title_ru: z.string().min(1),
  title_en: z.string().min(1),
  status: tourStatusEnum,
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  cities: z.array(z.string()),
  seatsTotal: z.number().int().optional(),
  seatsLeft: z.number().int().optional(),
  registrationDeadline: z.string().optional(),
  flightRoute: z.string().min(1),
  flightPrice: z.number(),
  summary_ru: z.string().min(1),
  summary_en: z.string().min(1),
  cover: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  galleryCaptions: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  published: z.boolean(),
});
export type Tour = z.infer<typeof tourSchema>;

export const tourRowSchema = csvRowSchema(tourSchema, (row) => ({
  id: row.id,
  title_ru: row.title_ru,
  title_en: row.title_en,
  status: row.status,
  dateStart: row.dateStart || undefined,
  dateEnd: row.dateEnd || undefined,
  cities: csvList(row.cities ?? ""),
  seatsTotal: csvNumber(row.seatsTotal ?? ""),
  seatsLeft: csvNumber(row.seatsLeft ?? ""),
  registrationDeadline: row.registrationDeadline || undefined,
  flightRoute: row.flightRoute,
  flightPrice: csvNumber(row.flightPrice ?? ""),
  summary_ru: row.summary_ru,
  summary_en: row.summary_en,
  cover: row.cover || undefined,
  gallery: csvList(row.gallery ?? ""),
  galleryCaptions: csvList(row.galleryCaptions ?? ""),
  videos: csvList(row.videos ?? ""),
  published: csvBoolean(row.published ?? ""),
}));

export const tourDaySchema = z.object({
  tourId: z.string().min(1),
  dayNumber: z.number().int(),
  date: z.string().optional(),
  city: z.string().min(1),
  cityEn: z.string().min(1),
  district: z.string().optional(),
  companies: z.array(z.string()),
  timeFrom: z.string().min(1),
  timeTo: z.string().min(1),
  location: z.string().min(1),
  logistics: z.string().optional(),
  note: z.string().optional(),
});
export type TourDay = z.infer<typeof tourDaySchema>;

export const tourDayRowSchema = csvRowSchema(tourDaySchema, (row) => ({
  tourId: row.tourId,
  dayNumber: csvNumber(row.dayNumber ?? ""),
  date: row.date || undefined,
  city: row.city,
  cityEn: row.cityEn,
  district: row.district || undefined,
  companies: csvList(row.companies ?? ""),
  timeFrom: row.timeFrom,
  timeTo: row.timeTo,
  location: row.location,
  logistics: row.logistics || undefined,
  note: row.note || undefined,
}));

export const tourCostSchema = z.object({
  tourId: z.string().min(1),
  order: z.number().int(),
  name_ru: z.string().min(1),
  name_en: z.string().min(1),
  calculation_ru: z.string().min(1),
  calculation_en: z.string().min(1),
  amount: z.number(),
  note: z.string().optional(),
  type: z.enum(["fixed", "estimate"]),
});
export type TourCost = z.infer<typeof tourCostSchema>;

export const tourCostRowSchema = csvRowSchema(tourCostSchema, (row) => ({
  tourId: row.tourId,
  order: csvNumber(row.order ?? ""),
  name_ru: row.name_ru,
  name_en: row.name_en,
  calculation_ru: row.calculation_ru,
  calculation_en: row.calculation_en,
  amount: csvNumber(row.amount ?? ""),
  note: row.note || undefined,
  type: row.type,
}));

export const tourContentBlockEnum = z.enum([
  "included",
  "notIncluded",
  "forWhom",
  "youGet",
  "advantages",
  "program",
  "faqQuestion",
  "faqAnswer",
  "testimonial",
]);

export const tourContentSchema = z.object({
  tourId: z.string().min(1),
  block: tourContentBlockEnum,
  order: z.number().int(),
  text_ru: z.string().min(1),
  text_en: z.string().optional(),
});
export type TourContent = z.infer<typeof tourContentSchema>;

export const tourContentRowSchema = csvRowSchema(tourContentSchema, (row) => ({
  tourId: row.tourId,
  block: row.block,
  order: csvNumber(row.order ?? ""),
  text_ru: row.text_ru,
  text_en: row.text_en || undefined,
}));

export const caseTypeEnum = z.enum(["поставка", "экспедиция", "отзыв"]);

/**
 * Кейсы поставок и экспедиций плюс отзывы клиентов — одна таблица,
 * различаются полем type. Полноценная страница появляется только при
 * заполненном fullText (тот же приём, что у consulting.fullDescription).
 */
export const caseSchema = z.object({
  id: z.string().min(1),
  type: caseTypeEnum,
  title_ru: z.string().min(1),
  title_en: z.string().min(1),
  client_ru: z.string().optional(),
  client_en: z.string().optional(),
  summary_ru: z.string().min(1),
  summary_en: z.string().optional(),
  fullText_ru: z.string().optional(),
  fullText_en: z.string().optional(),
  quote_ru: z.string().optional(),
  quote_en: z.string().optional(),
  author_ru: z.string().optional(),
  author_en: z.string().optional(),
  photo: z.string().optional(),
  photoCaption: z.string().optional(),
  video: z.string().optional(),
  date: z.string().optional(),
  order: z.number().int(),
  published: z.boolean(),
});
export type CaseStory = z.infer<typeof caseSchema>;

export const caseRowSchema = csvRowSchema(caseSchema, (row) => ({
  id: row.id,
  type: row.type,
  title_ru: row.title_ru,
  title_en: row.title_en,
  client_ru: row.client_ru || undefined,
  client_en: row.client_en || undefined,
  summary_ru: row.summary_ru,
  summary_en: row.summary_en || undefined,
  fullText_ru: row.fullText_ru || undefined,
  fullText_en: row.fullText_en || undefined,
  quote_ru: row.quote_ru || undefined,
  quote_en: row.quote_en || undefined,
  author_ru: row.author_ru || undefined,
  author_en: row.author_en || undefined,
  photo: row.photo || undefined,
  photoCaption: row.photoCaption || undefined,
  video: row.video || undefined,
  date: row.date || undefined,
  order: csvNumber(row.order ?? ""),
  published: csvBoolean(row.published ?? ""),
}));

/**
 * Флагманские модели заводов — опциональная витрина поверх свободного текстового
 * поля factories.models. Обязательны только id/factoryId/имя: карточка модели
 * без описания и фото всё равно осмысленна (просто покажет только название),
 * а описание и фото владелец добавляет по мере готовности материалов.
 */
export const modelSchema = z.object({
  id: z.string().min(1),
  factoryId: z.string().min(1),
  name_ru: z.string().min(1),
  name_en: z.string().optional(),
  description_ru: z.string().optional(),
  description_en: z.string().optional(),
  photo: z.string().optional(),
  order: z.number().int(),
  published: z.boolean(),
});
export type RobotModel = z.infer<typeof modelSchema>;

export const modelRowSchema = csvRowSchema(modelSchema, (row) => ({
  id: row.id,
  factoryId: row.factoryId,
  name_ru: row.name_ru,
  name_en: row.name_en || undefined,
  description_ru: row.description_ru || undefined,
  description_en: row.description_en || undefined,
  photo: row.photo || undefined,
  order: csvNumber(row.order ?? ""),
  published: csvBoolean(row.published ?? ""),
}));

export const consultingSchema = z.object({
  id: z.string().min(1),
  title_ru: z.string().min(1),
  title_en: z.string().min(1),
  shortDescription_ru: z.string().min(1),
  shortDescription_en: z.string().optional(),
  fullDescription_ru: z.string().optional(),
  fullDescription_en: z.string().optional(),
  forWhom: z.array(z.string()),
  whatIncluded: z.array(z.string()),
  format: z.string().min(1),
  duration: z.string().min(1),
  price: z.number().optional(),
  priceNote: z.string().optional(),
  order: z.number().int(),
  photo: z.string().optional(),
  published: z.boolean(),
});
export type Consulting = z.infer<typeof consultingSchema>;

export const consultingRowSchema = csvRowSchema(consultingSchema, (row) => ({
  id: row.id,
  title_ru: row.title_ru,
  title_en: row.title_en,
  shortDescription_ru: row.shortDescription_ru,
  shortDescription_en: row.shortDescription_en || undefined,
  fullDescription_ru: row.fullDescription_ru || undefined,
  fullDescription_en: row.fullDescription_en || undefined,
  forWhom: csvList(row.forWhom ?? ""),
  whatIncluded: csvList(row.whatIncluded ?? ""),
  format: row.format,
  duration: row.duration,
  price: csvNumber(row.price ?? ""),
  priceNote: row.priceNote || undefined,
  order: csvNumber(row.order ?? ""),
  photo: row.photo || undefined,
  published: csvBoolean(row.published ?? ""),
}));

/**
 * Блог — MVP-конвенция перед плановой интеграцией с Notion (PROJECT.md,
 * Этап 9). Один JSON-файл на статью в content/blog/*.json, имя файла —
 * slug. scripts/sync-data.ts собирает их в data/blog.json тем же приёмом
 * валидации, что и CSV-таблицы (битый файл логируется и пропускается).
 */
export const blogPostSchema = z.object({
  slug: z.string().min(1),
  title_ru: z.string().min(1),
  title_en: z.string().min(1),
  excerpt_ru: z.string().min(1),
  excerpt_en: z.string().min(1),
  body_ru: z.string().min(1),
  body_en: z.string().min(1),
  cover: z.string().optional(),
  coverCaption_ru: z.string().optional(),
  coverCaption_en: z.string().optional(),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1),
  publishedAt: z.string().min(1),
  updatedAt: z.string().optional(),
  published: z.boolean(),
});
export type BlogPost = z.infer<typeof blogPostSchema>;
