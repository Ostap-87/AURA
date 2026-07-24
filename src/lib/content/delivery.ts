/**
 * Шесть шагов поставки (PROJECT.md 5.7). Шаги 3 и 4 — самые подробные,
 * они заменяют шоурум. Медиа добавляются заполнением photos/photoCaptions
 * здесь, без правки компонентов (раздел 7).
 */
export type DeliveryStep = {
  id: string;
  title_ru: string;
  title_en: string;
  text_ru: string;
  text_en: string;
  details_ru?: string[];
  details_en?: string[];
  photos: string[];
  photoCaptions: string[];
};

export const deliverySteps: DeliveryStep[] = [
  {
    id: "selection",
    title_ru: "Подбор и КП",
    title_en: "Selection and proposal",
    text_ru:
      "Обсуждаем задачу голосом, подбираем завод и конкретную модель под неё. Готовим коммерческое предложение с ценой, сроком поставки и составом поставки.",
    text_en:
      "We discuss your task, match a factory and a specific model to it, and prepare a commercial proposal with price, lead time and scope.",
    photos: [],
    photoCaptions: [],
  },
  {
    id: "contract",
    title_ru: "Договор и оплата",
    title_en: "Contract and payment",
    text_ru:
      "Заключаем внешнеторговый контракт с Shanghai Pinnacle Technology Co., Ltd. и выставляем инвойс. Ввоз оформляется на вашу компанию — за счёт этого вы получаете заводскую цену без наценки российского импортёра. Если нужен договор с российским юрлицом — напишите, обсудим варианты.",
    text_en:
      "We sign a foreign trade contract with Shanghai Pinnacle Technology Co., Ltd. and issue an invoice. Import is registered to your company — that's how you get the factory price without a Russian importer's markup. If you need a contract with a Russian legal entity, write to us and we'll discuss options.",
    photos: [],
    photoCaptions: [],
  },
  {
    id: "procurement",
    title_ru: "Закупка на заводе",
    title_en: "Factory procurement",
    text_ru:
      "Размещаем заказ напрямую на заводе-производителе и ведём его до отгрузки. Вы видите процесс, а не ждёте вслепую: мы присылаем фото и видео с производственной площадки по ходу выполнения заказа.",
    text_en:
      "We place the order directly with the manufacturer and manage it until shipping. You see the process instead of waiting blindly: we send photos and videos from the factory floor as the order progresses.",
    details_ru: [
      "Подтверждение спецификации и комплектации с инженерами завода",
      "Контроль сроков производства по этапам",
      "Фото- и видеоотчёты с площадки — снятые на телефон, с подписью, что и когда снято",
    ],
    details_en: [
      "Specification and configuration confirmed with the factory's engineers",
      "Production timeline tracked stage by stage",
      "Photo and video reports from the floor — phone footage, captioned with what was shot and when",
    ],
    photos: [],
    photoCaptions: [],
  },
  {
    id: "acceptance",
    title_ru: "Приёмка и тесты",
    title_en: "Acceptance and testing",
    text_ru:
      "Перед отгрузкой завод проводит тестовый прогон именно вашего экземпляра — не витринного образца. Вы получаете видео прогона с серийным номером в кадре до того, как оборудование покинет завод.",
    text_en:
      "Before shipping, the factory test-runs your exact unit — not a showroom sample. You receive the test-run video with the serial number in frame before the equipment leaves the factory.",
    details_ru: [
      "Тестовый прогон конкретного экземпляра перед отгрузкой",
      "Серийный номер в кадре — видео привязано к вашей поставке",
      "Проверка комплектации и упаковки перед отправкой",
    ],
    details_en: [
      "Test run of the specific unit before shipping",
      "Serial number in frame — the video is tied to your delivery",
      "Configuration and packaging checked before dispatch",
    ],
    photos: [],
    photoCaptions: [],
  },
  {
    id: "logistics",
    title_ru: "Логистика и таможня",
    title_en: "Logistics and customs",
    text_ru:
      "Организуем доставку и сопровождаем таможенное оформление. Ввоз оформляется на вашу компанию, мы помогаем с документами на каждом шаге.",
    text_en:
      "We arrange delivery and support customs clearance. Import is registered to your company; we help with documents at every step.",
    photos: [],
    photoCaptions: [],
  },
  {
    id: "launch",
    title_ru: "Монтаж и запуск",
    title_en: "Installation and launch",
    text_ru:
      "При необходимости организуем пусконаладку, интеграцию в линию и обучение персонала — своими инженерами и партнёрами-интеграторами.",
    text_en:
      "When needed, we arrange commissioning, line integration and staff training — with our engineers and partner integrators.",
    photos: [],
    photoCaptions: [],
  },
];
