/** Контент страниц четырёх услуг (/services/[service]; справочник — reference-data.ts). */
export type ServiceContent = {
  id: string;
  intro_ru: string;
  intro_en: string;
  includes_ru: string[];
  includes_en: string[];
};

export const servicesContent: ServiceContent[] = [
  {
    id: "integration",
    intro_ru:
      "Робот сам по себе не решает задачу — решает внедрение. Организуем пусконаладку и встраивание оборудования в вашу линию: от оснастки и периферии до запуска в рабочем режиме.",
    intro_en:
      "A robot alone doesn't solve the task — the integration does. We arrange commissioning and fitting the equipment into your line: from tooling and peripherals to launch.",
    includes_ru: [
      "Обследование площадки и подготовка требований",
      "Проект ячейки: оснастка, ограждения, периферия",
      "Монтаж, подключение и пусконаладка",
      "Запуск в рабочем режиме и сдача по программе испытаний",
    ],
    includes_en: [
      "Site survey and requirements",
      "Cell design: tooling, guarding, peripherals",
      "Installation, wiring and commissioning",
      "Production launch and acceptance testing",
    ],
  },
  {
    id: "maintenance",
    intro_ru:
      "Поддерживаем поставленное оборудование в рабочем состоянии: регламентное обслуживание, запчасти с заводов-производителей, удалённая диагностика.",
    intro_en:
      "We keep the delivered equipment running: scheduled maintenance, spare parts from the manufacturers, remote diagnostics.",
    includes_ru: [
      "Регламентное ТО по графику производителя",
      "Оригинальные запчасти напрямую с завода",
      "Удалённая диагностика и консультации инженеров",
      "Выезд специалиста при необходимости",
    ],
    includes_en: [
      "Scheduled maintenance per the manufacturer's plan",
      "Original spare parts direct from the factory",
      "Remote diagnostics and engineering support",
      "On-site visits when needed",
    ],
  },
  {
    id: "training",
    intro_ru:
      "Учим ваших операторов и инженеров работать с новым оборудованием: на вашей площадке, на заводе-производителе в Китае или удалённо.",
    intro_en:
      "We train your operators and engineers on the new equipment: at your site, at the factory in China, or remotely.",
    includes_ru: [
      "Обучение операторов повседневной работе",
      "Обучение инженеров обслуживанию и переналадке",
      "Обучение на заводе-производителе при закупочной поездке",
      "Материалы и инструкции на русском языке",
    ],
    includes_en: [
      "Operator training for daily work",
      "Engineer training for maintenance and changeover",
      "Factory training during a sourcing trip",
      "Materials and manuals in Russian",
    ],
  },
  {
    id: "programming",
    intro_ru:
      "Программируем роботов под вашу задачу: траектории, сценарии работы, интеграция с системами предприятия — WMS, MES, 1С.",
    intro_en:
      "We program robots for your task: trajectories, work scenarios, integration with enterprise systems — WMS, MES, ERP.",
    includes_ru: [
      "Программирование траекторий и рабочих сценариев",
      "Интеграция с WMS, MES и учётными системами",
      "Доработка под смену номенклатуры",
      "Сопровождение после запуска",
    ],
    includes_en: [
      "Trajectory and scenario programming",
      "Integration with WMS, MES and ERP systems",
      "Adaptation to product changes",
      "Post-launch support",
    ],
  },
];
