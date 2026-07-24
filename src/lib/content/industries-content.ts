/**
 * Контент страниц семи отраслей (/industries/[industry], PROJECT.md раздел 4).
 * `factoryTags` — какие теги из колонки industries в factories.csv относятся
 * к этой отрасли сайта (сама колонка детальнее семи отраслей — см. CLAUDE.md).
 */
export type IndustryContent = {
  id: string;
  intro_ru: string;
  intro_en: string;
  factoryTags: string[];
};

export const industriesContent: IndustryContent[] = [
  {
    id: "manufacturing",
    intro_ru:
      "Промышленные роботы, коботы и сварочные комплексы для производств: загрузка станков, сборка, сварка, паллетирование, контроль качества. Прямые поставки с заводов, которые делают собственные приводы и контроллеры.",
    intro_en:
      "Industrial robots, cobots and welding cells for manufacturing: machine tending, assembly, welding, palletizing, quality control. Direct supply from factories that build their own drives and controllers.",
    factoryTags: ["manufacturing", "metalwork", "automotive", "electronics", "packaging", "food", "oilgas"],
  },
  {
    id: "warehouse",
    intro_ru:
      "AGV, складские роботы и системы сортировки: подвоз стеллажей, транспортировка паллет, сортировка посылок, разгрузка. Решения масштабируются от одной машины до парка на тысячи единиц.",
    intro_en:
      "AGVs, warehouse robots and sorting systems: rack delivery, pallet transport, parcel sorting, unloading. Solutions scale from one machine to fleets of thousands.",
    factoryTags: ["warehouse", "logistics", "ecommerce"],
  },
  {
    id: "horeca",
    intro_ru:
      "Роботы для ресторанов и общепита: доставка блюд в зале, уборка, роботизированные кухни и автономные точки питания. Быстрая пусконаладка и работа в узких проходах.",
    intro_en:
      "Robots for restaurants and food service: floor delivery, cleaning, robotic kitchens and autonomous food points. Fast commissioning, tight-aisle operation.",
    factoryTags: ["horeca", "catering", "readymeals"],
  },
  {
    id: "retail",
    intro_ru:
      "Сервисные роботы для торговых залов и сетей: консультирование покупателей, навигация, уборка, инвентаризация, автоматизированные точки продаж.",
    intro_en:
      "Service robots for stores and chains: customer assistance, navigation, cleaning, inventory checks, automated points of sale.",
    factoryTags: ["retail", "mall", "vending", "banking", "museum"],
  },
  {
    id: "medical",
    intro_ru:
      "Роботы для клиник и фармацевтики: реабилитационные комплексы и экзоскелеты, дезинфекция, внутрибольничная доставка, сортировка медикаментов.",
    intro_en:
      "Robots for clinics and pharma: rehabilitation systems and exoskeletons, disinfection, in-hospital delivery, medication sorting.",
    factoryTags: ["medical", "pharma", "rehabilitation", "care", "pharmacy"],
  },
  {
    id: "construction",
    intro_ru:
      "Инспекционные роботы и робособаки для стройки и инфраструктуры: обход опасных зон, инспекция резервуаров, тоннелей и подстанций, работа там, где человеку нужны леса или альпинистское снаряжение.",
    intro_en:
      "Inspection robots and quadrupeds for construction and infrastructure: hazardous-area patrol, inspection of tanks, tunnels and substations — work that would otherwise need scaffolding or rope access.",
    factoryTags: ["construction", "energy", "security", "inspection", "shipbuilding", "metro"],
  },
  {
    id: "education",
    intro_ru:
      "Образовательные наборы и исследовательские платформы для школ, вузов и лабораторий: от конструкторов с учебными программами до полноразмерных гуманоидов с открытой архитектурой.",
    intro_en:
      "Educational kits and research platforms for schools, universities and labs: from construction sets with curricula to full-size humanoids with open architecture.",
    factoryTags: ["education", "research", "labs"],
  },
];
