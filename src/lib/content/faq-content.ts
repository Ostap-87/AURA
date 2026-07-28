/**
 * FAQ (/faq, PROJECT.md 5.10). Спецификация закладывает ~10 разделов и ~65
 * вопросов — этот файл содержит стартовый набор, честно выводимый из
 * PROJECT.md и брифа; расширение до полного объёма — вопрос контента от
 * владельца, а не кода: раздел/вопрос добавляется строкой здесь.
 */
export type FaqItem = { id: string; q_ru: string; q_en: string; a_ru: string; a_en: string };
export type FaqSection = { id: string; title_ru: string; title_en: string; items: FaqItem[] };

export const faqSections: FaqSection[] = [
  {
    id: "model",
    title_ru: "Как мы работаем",
    title_en: "How we work",
    items: [
      {
        id: "why-cheaper",
        q_ru: "Почему у вас дешевле, чем у российских поставщиков?",
        q_en: "Why are you cheaper than Russian suppliers?",
        a_ru: "Мы закупаем напрямую на китайских заводах по внешнеторговому контракту, без склада и шоурума в России. Вы получаете заводскую цену без наценки российского импортёра — экономия обычно составляет 15–30%.",
        a_en: "We buy directly from Chinese factories under a foreign trade contract, with no warehouse or showroom in Russia. You get the factory price without an importer's markup — usually 15–30% lower.",
      },
      {
        id: "legal-entity",
        q_ru: "С каким юридическим лицом заключается договор?",
        q_en: "Which legal entity signs the contract?",
        a_ru: "Договор заключается с Shanghai Pinnacle Technology Co., Ltd. (上海拼那克了科技有限责任公司) — это внешнеторговый контракт, ввоз оформляется на вашу компанию. Если нужен договор с российским юрлицом — напишите, обсудим варианты.",
        a_en: "The contract is with Shanghai Pinnacle Technology Co., Ltd. — a foreign trade contract with import registered to your company. If you need a Russian legal entity, write to us and we'll discuss options.",
      },
      {
        id: "no-showroom",
        q_ru: "Можно ли посмотреть оборудование вживую до покупки?",
        q_en: "Can I see the equipment in person before buying?",
        a_ru: "Своего шоурума у нас нет — это осознанная модель, за счёт которой цена ниже. Вместо витрины мы показываем реальное производство: фото и видео с заводов, тестовый прогон вашего экземпляра перед отгрузкой, а для крупных закупок — поездку на завод в рамках Aura Robotics Tour.",
        a_en: "We deliberately have no showroom — that's part of why the price is lower. Instead we show real production: factory photos and videos, a test run of your unit before shipping, and for larger purchases — a factory visit as part of Aura Robotics Tour.",
      },
      {
        id: "dealer",
        q_ru: "Вы официальный дилер заводов?",
        q_en: "Are you an official dealer?",
        a_ru: "Мы не называем себя дилером — мы закупаем напрямую на заводах под ваш конкретный заказ и сопровождаем поставку от подбора до запуска. Все поставки идут под конкретный заказ клиента.",
        a_en: "We don't call ourselves a dealer — we buy directly from factories for your specific order and manage the delivery from selection to launch. Every delivery is made to order.",
      },
    ],
  },
  {
    id: "pricing",
    title_ru: "Цены и оплата",
    title_en: "Prices and payment",
    items: [
      {
        id: "price-range",
        q_ru: "Почему на сайте вилки цен, а не точные цены?",
        q_en: "Why do you show price ranges, not exact prices?",
        a_ru: "Цена зависит от модели, комплектации, исполнения и курса на дату заказа. Вилка по категории даёт честный ориентир; точную цену вы получаете в коммерческом предложении под вашу задачу.",
        a_en: "Price depends on model, configuration, options and the exchange rate on the order date. The range is an honest reference; you get the exact price in a proposal for your task.",
      },
      {
        id: "payment-how",
        q_ru: "Как проходит оплата?",
        q_en: "How does payment work?",
        a_ru: "По инвойсу в рамках внешнеторгового контракта. Порядок и валюту платежа согласуем на этапе договора — условия зависят от вашего банка и схемы ввоза.",
        a_en: "By invoice under the foreign trade contract. Currency and schedule are agreed at the contract stage, depending on your bank and import scheme.",
      },
      {
        id: "customs-included",
        q_ru: "Входит ли в цену доставка и таможня?",
        q_en: "Does the price include delivery and customs?",
        a_ru: "Ввоз оформляется на вашу компанию, поэтому таможенные платежи — на вашей стороне; мы сопровождаем оформление и помогаем с документами. Логистику считаем отдельной строкой в коммерческом предложении.",
        a_en: "Import is registered to your company, so customs duties are on your side; we support the paperwork. Logistics is a separate line in the proposal.",
      },
      {
        id: "average-check",
        q_ru: "Какой у вас минимальный заказ?",
        q_en: "Is there a minimum order?",
        a_ru: "Формального минимума нет. Типичный диапазон наших поставок — от 0,5 до 6 млн ₽; для меньших сумм честно скажем, оправдана ли внешнеторговая схема в вашем случае.",
        a_en: "No formal minimum. Typical deliveries range from 0.5 to 6 million RUB; for smaller amounts we'll tell you honestly whether the scheme makes sense.",
      },
    ],
  },
  {
    id: "delivery",
    title_ru: "Поставка и сроки",
    title_en: "Delivery and lead times",
    items: [
      {
        id: "lead-time",
        q_ru: "Сколько занимает поставка?",
        q_en: "How long does delivery take?",
        a_ru: "Срок указан на карточке каждой категории и завода. Роботы — 4–7 недель с момента оплаты, оборудование для производств — 8–16 недель: там больше нюансов интеграции. Срок включает производство, тесты и логистику.",
        a_en: "The lead time is shown on each category and factory card. Robots — 4–7 weeks from payment; production equipment — 8–16 weeks, since there's more integration involved. It includes production, testing and logistics.",
      },
      {
        id: "track",
        q_ru: "Как я узнаю, что происходит с моим заказом?",
        q_en: "How do I know what's happening with my order?",
        a_ru: "Мы присылаем фото- и видеоотчёты с завода по ходу производства, а перед отгрузкой — видео тестового прогона вашего экземпляра с серийным номером в кадре.",
        a_en: "We send photo and video reports from the factory during production, and before shipping — a test-run video of your unit with the serial number in frame.",
      },
      {
        id: "import-self",
        q_ru: "У нас нет опыта ВЭД. Это проблема?",
        q_en: "We have no import experience. Is that a problem?",
        a_ru: "Нет. Мы сопровождаем таможенное оформление и помогаем с документами на каждом шаге. Если своей схемы ввоза у вас нет — обсудим варианты на этапе договора.",
        a_en: "No. We support customs clearance and help with documents at every step. If you don't have an import scheme, we'll discuss options at the contract stage.",
      },
    ],
  },
  {
    id: "quality",
    title_ru: "Качество и гарантия",
    title_en: "Quality and warranty",
    items: [
      {
        id: "test-run",
        q_ru: "Как вы проверяете оборудование перед отгрузкой?",
        q_en: "How do you check equipment before shipping?",
        a_ru: "Завод проводит тестовый прогон именно вашего экземпляра, мы фиксируем его на видео с серийным номером в кадре и отправляем вам до отгрузки. Это документальное свидетельство, а не рекламный ролик.",
        a_en: "The factory test-runs your exact unit; we record it with the serial number in frame and send it to you before shipping. It's documentary evidence, not a promo video.",
      },
      {
        id: "warranty-how",
        q_ru: "Как работает гарантия на оборудование из Китая?",
        q_en: "How does warranty work for equipment from China?",
        a_ru: "Гарантию даёт завод-производитель; условия и срок фиксируются в контракте по каждой поставке. Мы остаёмся стороной, через которую решаются гарантийные вопросы: запчасти, удалённая диагностика, инженеры завода.",
        a_en: "The warranty comes from the manufacturer; terms are fixed in the contract for each delivery. We remain your point of contact for warranty issues: parts, remote diagnostics, factory engineers.",
      },
      {
        id: "spare-parts",
        q_ru: "Что с запчастями и сервисом после покупки?",
        q_en: "What about spare parts and service?",
        a_ru: "Поставляем оригинальные запчасти напрямую с заводов и организуем обслуживание — своими инженерами и партнёрами-интеграторами. Подробнее — на странице «Сервис и ТО».",
        a_en: "We supply original parts direct from the factories and arrange service through our engineers and partner integrators. See the Service page for details.",
      },
    ],
  },
  {
    id: "tour",
    title_ru: "Поездки на заводы",
    title_en: "Factory tours",
    items: [
      {
        id: "tour-what",
        q_ru: "Что такое Aura Robotics Tour?",
        q_en: "What is Aura Robotics Tour?",
        a_ru: "Закрытые бизнес-делегации к производителям роботов в Китае: мы договариваемся о визитах, формируем программу под ваши задачи и сопровождаем на месте — с переводом и технической экспертизой наших инженеров.",
        a_en: "Private business delegations to robot manufacturers in China: we arrange the visits, build the program around your goals and accompany you on site — with interpretation and our engineers' technical expertise.",
      },
      {
        id: "tour-language",
        q_ru: "Нужно ли знание английского или китайского для поездки?",
        q_en: "Do I need English or Chinese for the trip?",
        a_ru: "Нет. Переводчик сопровождает группу на всех встречах, включая технические переговоры.",
        a_en: "No. An interpreter accompanies the group at all meetings, including technical negotiations.",
      },
      {
        id: "tour-buy",
        q_ru: "Можно ли договориться о закупке прямо на заводе?",
        q_en: "Can I negotiate a purchase right at the factory?",
        a_ru: "Да, в этом смысл поездки: прямые контакты с руководством и отделами закупок, возможность обсудить условия поставки на месте и увидеть реальное производство, а не выставочный стенд.",
        a_en: "Yes — that's the point: direct contacts with management and procurement, supply terms discussed on the spot, real production instead of a trade-show booth.",
      },
    ],
  },
  {
    id: "selection",
    title_ru: "Подбор оборудования",
    title_en: "Choosing equipment",
    items: [
      {
        id: "dont-know-model",
        q_ru: "Я не знаю, какая модель мне нужна. С чего начать?",
        q_en: "I don't know which model I need. Where do I start?",
        a_ru: "Начните с задачи, а не с модели: пройдите подбор на сайте или опишите задачу в заявке — подберём категорию, завод и модель под неё и посчитаем предварительную окупаемость.",
        a_en: "Start from the task, not the model: use the on-site finder or describe the task in a request — we'll match a category, factory and model, and estimate payback.",
      },
      {
        id: "execution",
        q_ru: "У нас низкие температуры / чистое помещение / взрывоопасная зона. Есть решения?",
        q_en: "We have low temperatures / clean rooms / explosive atmosphere. Any options?",
        a_ru: "Да, у ряда заводов есть специальные исполнения: для низких температур, чистых помещений и взрывозащищённые. Укажите условия в заявке — учтём при подборе.",
        a_en: "Yes, several factories offer special versions: low-temperature, clean-room and explosion-proof. Mention your conditions in the request.",
      },
      {
        id: "compare",
        q_ru: "Чем заводы внутри одной категории отличаются друг от друга?",
        q_en: "How do factories within one category differ?",
        a_ru: "Специализацией, нагрузкой и исполнениями, сроком поставки, годом основания и экспортным опытом. В каталоге можно сравнить до трёх заводов рядом и посмотреть документальные фото и видео с производств.",
        a_en: "Specialization, payload and versions, lead time, founding year and export experience. The catalog lets you compare up to three factories side by side.",
      },
    ],
  },
];
