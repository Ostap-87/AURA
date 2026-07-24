/**
 * Заголовок и описание направления «Консалтинг» — из справочника в коде
 * (PROJECT.md 5.5, п.1). Услуги живут в таблице consulting; блоки 2–6
 * страницы рендерятся только при наличии опубликованных услуг.
 */
export const consultingIntro = {
  title_ru: "Консалтинг",
  title_en: "Consulting",
  description_ru:
    "Инженерная экспертиза до покупки: разбираем задачу, считаем экономику автоматизации и помогаем выбрать между решениями — до того, как вы потратите деньги на оборудование.",
  description_en:
    "Engineering expertise before the purchase: we break down the task, run the automation economics and help you choose between solutions — before you spend money on equipment.",
};

/** «Как мы работаем» — 3–4 шага (5.5, п.4); рендерится вместе с блоками услуг. */
export const consultingWorkflow = [
  {
    title_ru: "Заявка и задача",
    title_en: "Request and task",
    text_ru: "Обсуждаем, что вы хотите автоматизировать и какие ограничения есть на площадке.",
    text_en: "We discuss what you want to automate and the constraints of your site.",
  },
  {
    title_ru: "Разбор и расчёт",
    title_en: "Analysis and calculation",
    text_ru: "Считаем экономику, сравниваем варианты оборудования и заводов под задачу.",
    text_en: "We run the economics and compare equipment and factory options for the task.",
  },
  {
    title_ru: "Рекомендация",
    title_en: "Recommendation",
    text_ru: "Вы получаете обоснованный вывод: что брать, где и почему — с цифрами.",
    text_en: "You get a substantiated conclusion: what to buy, where and why — with numbers.",
  },
  {
    title_ru: "Сопровождение",
    title_en: "Support",
    text_ru: "По желанию ведём дальше: закупка, приёмка, запуск.",
    text_en: "Optionally we carry on: procurement, acceptance, launch.",
  },
];
