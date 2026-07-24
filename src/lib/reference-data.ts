/**
 * Справочники, которые не меняются построчно в Google Sheets и живут в коде
 * (PROJECT.md, раздел 3 «Справочники в коде»).
 */

export const industries = [
  { id: "manufacturing", name_ru: "Производство", name_en: "Manufacturing" },
  { id: "warehouse", name_ru: "Склад и логистика", name_en: "Warehouse and logistics" },
  { id: "horeca", name_ru: "HoReCa", name_en: "HoReCa" },
  { id: "retail", name_ru: "Ретейл", name_en: "Retail" },
  { id: "medical", name_ru: "Медицина", name_en: "Medical" },
  { id: "construction", name_ru: "Строительство", name_en: "Construction" },
  { id: "education", name_ru: "Образование", name_en: "Education" },
] as const;

export const subIndustries = [
  { id: "dairy", name_ru: "Молочная продукция", name_en: "Dairy" },
  { id: "meat", name_ru: "Мясопереработка и птица", name_en: "Meat and poultry processing" },
  { id: "salads", name_ru: "Салаты и готовая еда", name_en: "Salads and ready meals" },
  { id: "bakery", name_ru: "Хлебобулочные и кондитерские", name_en: "Bakery and confectionery" },
  { id: "beverages", name_ru: "Напитки", name_en: "Beverages" },
  { id: "snacks", name_ru: "Снеки и бакалея", name_en: "Snacks and groceries" },
  { id: "frozen", name_ru: "Заморозка и полуфабрикаты", name_en: "Frozen and semi-finished" },
  { id: "pharma", name_ru: "Фармацевтика", name_en: "Pharmaceuticals" },
  { id: "cosmetics", name_ru: "Косметика и бытовая химия", name_en: "Cosmetics and household chemicals" },
  { id: "electronics", name_ru: "Электроника", name_en: "Electronics" },
  { id: "packagingIndustry", name_ru: "Упаковочные производства", name_en: "Packaging production" },
] as const;

export const equipmentTypes = [
  { id: "dosing", name_ru: "Дозирование и фасовка", name_en: "Dosing and filling" },
  { id: "packaging", name_ru: "Упаковка и запайка", name_en: "Packaging and sealing" },
  { id: "cutting", name_ru: "Нарезка и порционирование", name_en: "Cutting and portioning" },
  { id: "traying", name_ru: "Укладка в лотки", name_en: "Tray loading" },
  { id: "palletizing", name_ru: "Паллетирование", name_en: "Palletizing" },
  { id: "sorting", name_ru: "Сортировка и инспекция", name_en: "Sorting and inspection" },
  { id: "marking", name_ru: "Маркировка", name_en: "Marking" },
  { id: "washing", name_ru: "Мойка и санобработка", name_en: "Washing and sanitation" },
  { id: "transport", name_ru: "Внутрицеховая транспортировка", name_en: "In-plant transport" },
  { id: "roboticCells", name_ru: "Роботизированные ячейки", name_en: "Robotic cells" },
] as const;

export const services = [
  { id: "integration", name_ru: "Интеграция и пусконаладка", name_en: "Integration and commissioning" },
  { id: "maintenance", name_ru: "Сервис и ТО", name_en: "Service and maintenance" },
  { id: "training", name_ru: "Обучение персонала", name_en: "Staff training" },
  { id: "programming", name_ru: "Программирование", name_en: "Programming" },
] as const;

export const executions = [
  { id: "standard", name_ru: "Базовое", name_en: "Standard" },
  { id: "lowTemp", name_ru: "Для низких температур", name_en: "For low temperatures" },
  { id: "explosionProof", name_ru: "Взрывозащищённое", name_en: "Explosion-proof" },
  { id: "cleanRoom", name_ru: "Для чистых помещений", name_en: "For clean rooms" },
  { id: "unknown", name_ru: "Не знаю", name_en: "Not sure" },
] as const;

export type Industry = (typeof industries)[number];
export type SubIndustry = (typeof subIndustries)[number];
export type EquipmentType = (typeof equipmentTypes)[number];
export type Service = (typeof services)[number];
export type Execution = (typeof executions)[number];
