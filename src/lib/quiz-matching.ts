import { industries } from "./reference-data";

/**
 * Детерминированная таблица соответствий для квиза (PROJECT.md 5.6):
 * отрасль → задача → категория каталога. Никакого ИИ — фиксированная
 * таблица, category id должен существовать в categories.csv (иначе
 * экран результата покажет «решение уточняется», см. quiz/result-screen).
 */
export type QuizTask = {
  id: string;
  label_ru: string;
  label_en: string;
  categoryId: string;
};

export const quizIndustries = industries;

export const tasksByIndustry: Record<string, QuizTask[]> = {
  manufacturing: [
    { id: "welding", label_ru: "Сварка", label_en: "Welding", categoryId: "welding" },
    { id: "assembly", label_ru: "Сборка узлов", label_en: "Assembly", categoryId: "cobots" },
    { id: "palletizing", label_ru: "Паллетирование", label_en: "Palletizing", categoryId: "palletizing" },
    { id: "qualityControl", label_ru: "Контроль качества", label_en: "Quality control", categoryId: "sorting" },
  ],
  warehouse: [
    { id: "moving", label_ru: "Перемещение грузов", label_en: "Moving goods", categoryId: "agv" },
    { id: "sorting", label_ru: "Сортировка посылок", label_en: "Parcel sorting", categoryId: "sorting" },
    { id: "palletizing", label_ru: "Паллетирование", label_en: "Palletizing", categoryId: "palletizing" },
  ],
  horeca: [
    { id: "service", label_ru: "Обслуживание в зале", label_en: "Floor service", categoryId: "service" },
    { id: "cleaning", label_ru: "Уборка помещений", label_en: "Cleaning", categoryId: "cleaning" },
    { id: "cooking", label_ru: "Приготовление блюд", label_en: "Cooking", categoryId: "roboticskitchen" },
    { id: "dishwashing", label_ru: "Мойка посуды и оборудования", label_en: "Dishwashing", categoryId: "washing" },
  ],
  retail: [
    { id: "customerService", label_ru: "Консультирование покупателей", label_en: "Customer service", categoryId: "service" },
    { id: "cleaning", label_ru: "Уборка торгового зала", label_en: "Store cleaning", categoryId: "cleaning" },
    { id: "inventory", label_ru: "Инвентаризация", label_en: "Inventory checks", categoryId: "inspection" },
  ],
  medical: [
    { id: "rehabilitation", label_ru: "Реабилитация пациентов", label_en: "Patient rehabilitation", categoryId: "medical" },
    { id: "disinfection", label_ru: "Дезинфекция помещений", label_en: "Disinfection", categoryId: "cleaning" },
    { id: "logistics", label_ru: "Доставка внутри клиники", label_en: "In-facility delivery", categoryId: "courier" },
  ],
  construction: [
    { id: "inspection", label_ru: "Инспекция объектов", label_en: "Site inspection", categoryId: "inspection" },
    { id: "monitoring", label_ru: "Мониторинг опасных зон", label_en: "Hazard monitoring", categoryId: "quadruped" },
  ],
  education: [
    { id: "training", label_ru: "Обучение и демонстрация", label_en: "Training and demos", categoryId: "education" },
    { id: "research", label_ru: "Лабораторные исследования", label_en: "Lab research", categoryId: "robotarms" },
  ],
};

export function getTasksForIndustry(industryId: string): QuizTask[] {
  return tasksByIndustry[industryId] ?? [];
}

export function getTaskById(industryId: string, taskId: string): QuizTask | undefined {
  return getTasksForIndustry(industryId).find((task) => task.id === taskId);
}
