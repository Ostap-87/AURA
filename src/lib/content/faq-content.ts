/**
 * FAQ (/faq, PROJECT.md 5.10). Полная версия из брифа владельца (14
 * разделов, ~60 вопросов) — заменяет стартовый набор из 6 разделов.
 *
 * Источник — faq.md, присланный владельцем через Google Drive. Несколько
 * пунктов там были помечены как «⚠️ УТОЧНИТЬ» (коммерческие детали без
 * готового ответа на момент написания); по решению владельца:
 * - два вопроса без содержательного ответа (аренда/RaaS отдельным пунктом,
 *   даты ближайшего тура) — не опубликованы;
 * - у шести вопросов с частичным ответом — снята пометка, формулировка
 *   смягчена до «обсуждаем индивидуально» вместо конкретной цифры;
 * - цена тура убрана из ответа (расходится с данными на /tours —
 *   там факт 580 000 ₽, в брифе была устаревшая «от 450 000 ₽»); ответ
 *   отсылает на страницу тура за точной суммой.
 */
export type FaqItem = { id: string; q_ru: string; q_en: string; a_ru: string; a_en: string };
export type FaqSection = { id: string; title_ru: string; title_en: string; items: FaqItem[] };

export const faqSections: FaqSection[] = [
  {
    id: "company",
    title_ru: "О компании и схеме работы",
    title_en: "About us and how we work",
    items: [
      {
        id: "who-we-are",
        q_ru: "Кто такие AURA ROBOTICS?",
        q_en: "Who is AURA ROBOTICS?",
        a_ru: "Мы поставляем робототехнику и производственное оборудование напрямую с заводов Китая. Работаем с пулом порядка 60 проверенных производителей: от лидеров рынка (Unitree, UBTECH, Keenon, Pudu, Dobot, Youibot) до узкоспециализированных фабрик, у которых нет представительств за пределами Китая. Мы закрываем всю цепочку — подбор модели, контракт с заводом, инспекция перед отгрузкой, логистика, таможня, ввод в эксплуатацию.",
        a_en: "We supply robotics and industrial equipment directly from factories in China. We work with a pool of around 60 vetted manufacturers — from market leaders (Unitree, UBTECH, Keenon, Pudu, Dobot, Youibot) to narrowly specialized factories with no representation outside China. We cover the whole chain: model selection, the factory contract, pre-shipment inspection, logistics, customs and commissioning.",
      },
      {
        id: "dealer-or-supplier",
        q_ru: "Вы дилер, посредник или поставщик?",
        q_en: "Are you a dealer, a middleman, or a supplier?",
        a_ru: "Мы работаем по внешнеторговой схеме через собственное юридическое лицо в Китае — Shanghai Pinnacle Technology Co., Ltd. Это значит, что контракт с заводом заключаем мы сами, напрямую, без цепочки перепродаж. Вы получаете заводскую цену плюс прозрачную стоимость наших услуг и логистики, а не наценку трёх посредников.",
        a_en: "We work under a foreign-trade scheme through our own legal entity in China — Shanghai Pinnacle Technology Co., Ltd. That means we sign the factory contract ourselves, directly, with no resale chain. You get the factory price plus a transparent cost for our services and logistics — not a markup from three middlemen.",
      },
      {
        id: "no-showroom",
        q_ru: "Почему у вас нет склада и шоурума в России?",
        q_en: "Why don't you have a warehouse or a showroom in Russia?",
        a_ru: "Потому что робототехника — это не товар с полки. Каждая поставка собирается под задачу заказчика: конфигурация манипулятора, набор сенсоров, вычислительный модуль, язык интерфейса, комплект ЗИП. Склад заставил бы нас продавать то, что уже куплено, а не то, что вам нужно. Демонстрацию мы обеспечиваем иначе: видеотест на заводе под ваш сценарий, визит на производство в рамках бизнес-тура или пилотная поставка одного экземпляра.",
        a_en: "Because robotics isn't an off-the-shelf product. Every delivery is assembled around the client's task: manipulator configuration, sensor set, compute module, interface language, spare-parts kit. A warehouse would force us to sell what's already been bought, not what you actually need. We provide demonstrations a different way: a video test at the factory built around your scenario, a factory visit as part of a business tour, or a pilot delivery of a single unit.",
      },
      {
        id: "contract-structure",
        q_ru: "Как построен договор, если юрлицо в Китае?",
        q_en: "How is the contract structured if the legal entity is in China?",
        a_ru: "Это стандартная внешнеторговая сделка: контракт с китайской компанией, оплата в валюте, поставка по одному из условий Incoterms. Мы даём полный комплект документов для валютного контроля и таможни. Вариант поставки через российское юридическое лицо обсуждаем индивидуально — напишите нам, разберём ваш случай.",
        a_en: "It's a standard foreign-trade deal: a contract with the Chinese company, payment in foreign currency, delivery under one of the Incoterms. We provide the full set of documents for currency control and customs. Delivery through a Russian legal entity is discussed case by case — write to us and we'll go over your situation.",
      },
      {
        id: "robot-categories",
        q_ru: "С какими категориями роботов вы работаете?",
        q_en: "What categories of robots do you work with?",
        a_ru: "15 направлений: гуманоиды, робопсы, AGV/AMR, коллаборативные роботы, промышленные манипуляторы, сервисные, медицинские, строительные, сварочные, дельта-роботы, роботизированные руки, роботы-курьеры, роботы-уборщики, образовательные и специализированные решения. Отдельное направление — производственное оборудование для пищевой промышленности.",
        a_en: "15 directions: humanoids, quadruped robots, AGV/AMR, collaborative robots, industrial manipulators, service, medical, construction, welding, delta robots, robotic arms, delivery robots, cleaning robots, educational and specialized solutions. A separate direction is production equipment for the food industry.",
      },
    ],
  },
  {
    id: "selection",
    title_ru: "Подбор решения",
    title_en: "Choosing a solution",
    items: [
      {
        id: "how-to-choose",
        q_ru: "Как понять, какой робот нужен под мою задачу?",
        q_en: "How do I figure out which robot fits my task?",
        a_ru: "Мы идём от задачи, а не от каталога. Порядок такой:\n1. Вы описываете процесс: что делается сейчас, сколько человек занято, какой такт, какие ограничения по площади и весу.\n2. Мы формируем короткое техзадание и отправляем его 3–5 заводам, у которых есть релевантный опыт.\n3. Вы получаете 2–3 варианта с разной ценой и разной степенью зрелости решения — с честным разбором, где каждый вариант слабый.\n4. При необходимости — пилот на одном экземпляре, потом тираж.",
        a_en: "We start from the task, not the catalog. The process:\n1. You describe the process: what's done now, how many people are involved, the takt time, area and weight constraints.\n2. We put together a short brief and send it to 3–5 factories with relevant experience.\n3. You get 2–3 options at different price points and levels of maturity — with an honest breakdown of where each option is weak.\n4. If needed — a pilot on one unit, then a rollout.",
      },
      {
        id: "robot-classes",
        q_ru: "Чем принципиально отличаются классы роботов?",
        q_en: "What's the fundamental difference between robot classes?",
        a_ru: "Промышленный манипулятор — повторяющиеся операции на фиксированном посту, высокая точность и скорость; требует ограждения или зоны безопасности, жёсткая привязка к месту.\nКоллаборативный робот (кобот) — работа рядом с человеком без ограждения; ниже скорость и полезная нагрузка.\nAGV / AMR — перемещение грузов по цеху и складу; нужна подготовленная поверхность и разметка маршрутов.\nСервисный робот — доставка, уборка, навигация в помещении с людьми; плохо переносит хаотичную среду и лестницы.\nРобопёс — инспекция, обходы, пересечённая местность, съём телеметрии; малая полезная нагрузка, короткая автономность.\nГуманоид — демонстрация, R&D, задачи с манипуляциями в среде человека; наименее зрелая технология, высокая цена, дорогое обслуживание.",
        a_en: "Industrial manipulator — repetitive operations at a fixed station, high precision and speed; needs a guard or safety zone, tied rigidly to one spot.\nCollaborative robot (cobot) — working next to people without a guard; lower speed and payload.\nAGV / AMR — moving loads around a shop floor or warehouse; needs a prepared surface and marked routes.\nService robot — delivery, cleaning, indoor navigation around people; struggles with chaotic environments and stairs.\nQuadruped robot — inspection, patrols, rough terrain, telemetry capture; small payload, short autonomy.\nHumanoid — demonstrations, R&D, manipulation tasks in human environments; least mature technology, high price, expensive upkeep.",
      },
      {
        id: "no-ready-solution",
        q_ru: "Готового решения под мою задачу не существует. Что тогда?",
        q_en: "There's no ready-made solution for my task. What then?",
        a_ru: "Значительная часть китайских заводов работает в формате OEM/ODM: под заказ меняют захват (end-effector), корпус, набор датчиков, вычислительный модуль, пишут прикладной софт. Это дороже и дольше серийной модели, но дешевле, чем разработка с нуля. Мы отдельно проговариваем, какая часть доработки ложится в цену завода, а какая — в вашу интеграцию.",
        a_en: "A large share of Chinese factories work in an OEM/ODM format: on request they swap the end-effector, housing, sensor set, compute module, and write application software. It's more expensive and slower than a stock model, but cheaper than building from scratch. We spell out up front which part of the customization is priced in by the factory and which falls on your own integration.",
      },
      {
        id: "test-before-buy",
        q_ru: "Можно ли получить робота на тест перед покупкой?",
        q_en: "Can I test a robot before buying it?",
        a_ru: "Варианты: видеотест на заводе по вашему сценарию (бесплатно, срок — несколько дней), визит на производство в рамках бизнес-тура, пилотная поставка одного экземпляра с последующим тиражом. Аренду и модель RaaS обсуждаем индивидуально по запросу.",
        a_en: "Options: a video test at the factory built around your scenario (free, a few days' turnaround), a factory visit as part of a business tour, or a pilot delivery of a single unit followed by a rollout. Rental and a RaaS model are discussed case by case on request.",
      },
    ],
  },
  {
    id: "pricing",
    title_ru: "Цены, оплата, контракт",
    title_en: "Prices, payment and the contract",
    items: [
      {
        id: "how-much",
        q_ru: "Сколько стоит робот?",
        q_en: "How much does a robot cost?",
        a_ru: "Разброс внутри одной категории может быть десятикратным, поэтому в каталоге мы указываем цену «от» для базовой конфигурации. Итоговую стоимость формируют:\n— конфигурация: полезная нагрузка, число степеней свободы, вычислительный модуль, набор сенсоров;\n— комплект ЗИП и запасные аккумуляторы;\n— лицензии на прикладное ПО и SDK;\n— условия поставки (EXW/FOB — от завода, DAP — до вашего адреса);\n— таможенные платежи и НДС;\n— пусконаладка и обучение персонала.\nТочную цену даём в коммерческом предложении с разбивкой: что фиксировано, а что оценочно.",
        a_en: "The spread within a single category can be tenfold, so the catalog lists a starting price for the base configuration. The final cost is shaped by:\n— configuration: payload, degrees of freedom, compute module, sensor set;\n— the spare-parts kit and spare batteries;\n— licenses for application software and the SDK;\n— delivery terms (EXW/FOB — from the factory, DAP — to your address);\n— customs duties and VAT;\n— commissioning and staff training.\nWe give the exact price in a commercial proposal with a breakdown of what's fixed and what's an estimate.",
      },
      {
        id: "not-included",
        q_ru: "Что не входит в цену завода?",
        q_en: "What's not included in the factory price?",
        a_ru: "Почти всегда за скобками остаются: доставка, страхование груза, таможенное оформление и пошлины, НДС, сертификация для эксплуатации в ЕАЭС, зарядная станция (у части моделей), ЗИП, обучение персонала, выезд инженера. Мы показываем эти позиции отдельными строками, а не растворяем в цене.",
        a_en: "Almost always left out: delivery, cargo insurance, customs clearance and duties, VAT, EAEU certification for operation, a charging station (for some models), spare parts, staff training, an engineer's site visit. We list these as separate line items rather than folding them into the price.",
      },
      {
        id: "payment-schemes",
        q_ru: "Как происходит оплата?",
        q_en: "How does payment work?",
        a_ru: "Работаем по трём схемам:\n— 100% предоплата — при подписании контракта;\n— 50 / 50 — половина при подписании, половина перед отгрузкой;\n— 30 / 70 — 30% при подписании, 70% перед отгрузкой.\nКакая схема применяется, зависит от суммы сделки, завода и конкретной модели: часть производителей серийных позиций работает только по полной предоплате, по проектным поставкам обычно удаётся согласовать разбивку. Схему фиксируем в контракте до старта производства, чтобы она не менялась по ходу.\nРассрочки и постоплаты сейчас нет.",
        a_en: "We work under three schemes:\n— 100% upfront — on signing the contract;\n— 50 / 50 — half on signing, half before shipment;\n— 30 / 70 — 30% on signing, 70% before shipment.\nWhich scheme applies depends on the deal size, the factory and the specific model: some manufacturers of stock items only work on full prepayment, while project deliveries usually allow a split. We fix the scheme in the contract before production starts, so it doesn't change mid-way.\nThere's currently no installment or post-payment option.",
      },
      {
        id: "defect-delay-protection",
        q_ru: "Что защищает меня от брака или срыва сроков?",
        q_en: "What protects me from defects or delays?",
        a_ru: "Три механизма:\n1. Приёмочные тесты (FAT) — согласованный до оплаты перечень проверок, которые робот должен пройти на заводе.\n2. Инспекция перед отгрузкой — наш человек в Китае физически проверяет комплектность, серийные номера, работоспособность и фиксирует всё фото- и видеоотчётом.\n3. Контракт — штрафные санкции за просрочку и порядок замены при заводском дефекте.\nМы не отправляем груз, пока инспекция не закрыта.",
        a_en: "Three mechanisms:\n1. Factory acceptance tests (FAT) — a checklist agreed before payment that the robot must pass at the factory.\n2. Pre-shipment inspection — our person in China physically checks completeness, serial numbers and functionality, documented with photo and video.\n3. The contract — penalties for delay and a replacement procedure for a factory defect.\nWe don't ship until the inspection is signed off.",
      },
    ],
  },
  {
    id: "leadtime",
    title_ru: "Сроки, производство и доставка",
    title_en: "Lead times, production and delivery",
    items: [
      {
        id: "how-long",
        q_ru: "Сколько ждать робота?",
        q_en: "How long is the wait for a robot?",
        a_ru: "Срок складывается из производства и логистики. Серийная модель со склада завода — от нескольких дней до 2–3 недель; модель под конфигурацию — обычно 4–8 недель; кастомная разработка — от 3 месяцев. Логистика: авиа 7–15 дней, ж/д 25–40 дней, море 35–60 дней. Ориентировочные диапазоны; точные сроки фиксируются в контракте.",
        a_en: "The lead time is production plus logistics. A stock model from the factory floor — a few days to 2–3 weeks; a model built to a configuration — usually 4–8 weeks; a custom build — from 3 months. Logistics: air 7–15 days, rail 25–40 days, sea 35–60 days. These are approximate ranges; exact dates are fixed in the contract.",
      },
      {
        id: "why-air-expensive",
        q_ru: "Почему авиадоставка робота стоит непропорционально дорого?",
        q_en: "Why is air freight for a robot disproportionately expensive?",
        a_ru: "Из-за литиевого аккумулятора. Батареи роботов часто превышают 1000 Вт·ч и относятся к опасным грузам 9-го класса — авиакомпании берут их неохотно и с надбавками. Отсюда две схемы (см. блок про таможню и сертификацию).",
        a_en: "Because of the lithium battery. Robot batteries often exceed 1000 Wh and are classified as Class 9 dangerous goods — airlines take them reluctantly and charge a premium. That's why there are two shipping schemes (see the certification and customs section).",
      },
      {
        id: "who-bears-risk",
        q_ru: "Кто отвечает за груз в пути?",
        q_en: "Who's responsible for the cargo in transit?",
        a_ru: "Зависит от согласованных условий Incoterms. При EXW/FOB риски переходят к покупателю раньше, при DAP — мы везём до вашего адреса. Отдельно рекомендуем страхование груза: робот — это хрупкая электроника в ударопрочном кейсе, и перегрузки на терминалах случаются.",
        a_en: "It depends on the agreed Incoterms. Under EXW/FOB the risk passes to the buyer earlier; under DAP we carry it to your address. We separately recommend cargo insurance: a robot is fragile electronics in a rugged case, and rough handling at terminals does happen.",
      },
    ],
  },
  {
    id: "customs",
    title_ru: "Сертификация, таможня, легальный ввоз",
    title_en: "Certification, customs and legal import",
    items: [
      {
        id: "required-certificates",
        q_ru: "Какие сертификаты должен предоставить завод?",
        q_en: "What certificates should the factory provide?",
        a_ru: "CE / FCC — соответствие нормам безопасности и электромагнитной совместимости.\nRoHS — отсутствие вредных веществ в электронике.\nUN38.3 и MSDS — документы на литиевую батарею. Без них ни одна международная транспортная компания не примет робота к перевозке. Это самые критичные бумаги в комплекте.\nТребуйте оригиналы с печатями испытательных лабораторий и проверяйте подлинность — «сертификат», нарисованный отделом продаж завода, встречается регулярно.",
        a_en: "CE / FCC — compliance with safety and electromagnetic-compatibility rules.\nRoHS — absence of hazardous substances in the electronics.\nUN38.3 and MSDS — documents for the lithium battery. No international carrier will accept a robot for transport without them — the most critical papers in the set.\nAsk for originals stamped by testing labs and verify authenticity — a \"certificate\" drawn up by a factory's sales department shows up regularly.",
      },
      {
        id: "battery-shipping",
        q_ru: "Как везут роботов с учётом правил перевозки литиевых батарей?",
        q_en: "How are robots shipped given the lithium-battery transport rules?",
        a_ru: "Совместная доставка (UN3481): робот едет вместе с установленной батареей — грузовым самолётом или морем, в ударопрочном кейсе. Дороже, но проще на приёмке.\nРаздельная доставка (UN3480): робот летит как обычное оборудование без батареи, а аккумулятор идёт наземным или морским маршрутом как опасный груз. Дешевле, но сроки расходятся, и до прибытия батареи робот бесполезен.",
        a_en: "Combined shipping (UN3481): the robot travels with the battery installed — by cargo plane or by sea, in a rugged case. More expensive, but simpler on receiving.\nSplit shipping (UN3480): the robot flies as regular equipment without the battery, while the battery goes by land or sea as dangerous goods. Cheaper, but the timelines diverge, and the robot is useless until the battery arrives.",
      },
      {
        id: "hs-codes",
        q_ru: "Под какие коды ТН ВЭД попадает оборудование?",
        q_en: "What HS/customs codes does the equipment fall under?",
        a_ru: "8479 50 000 0 — промышленные роботы (пошлина обычно 0–5% плюс НДС).\n8471 — вычислительные машины, если робот позиционируется как мобильный компьютерный комплекс.\n9023 00 800 0 — демонстрационные макеты и учебное оборудование; актуально для гуманоидов без прикладного применения, поставляемых в вузы.\nКод зависит от конструкции и заявленного назначения, а не от маркетингового описания. Мы рекомендуем получать предварительное классификационное решение таможни до прибытия груза на границу — это снимает риск переклассификации и простоя на СВХ.",
        a_en: "8479 50 000 0 — industrial robots (duty usually 0–5% plus VAT).\n8471 — computing machines, if the robot is positioned as a mobile compute platform.\n9023 00 800 0 — demonstration models and training equipment; relevant for humanoids with no applied function supplied to universities.\nThe code depends on the design and stated purpose, not the marketing copy. We recommend getting an advance customs classification ruling before the cargo reaches the border — it removes the risk of reclassification and downtime at the bonded warehouse.",
      },
      {
        id: "eaeu-certification",
        q_ru: "Нужна ли сертификация для эксплуатации в России, а не только для ввоза?",
        q_en: "Do I need certification to operate the equipment in Russia, not just to import it?",
        a_ru: "Да, и это разные вещи. Для законной эксплуатации оборудование должно соответствовать техническим регламентам ЕАЭС — в первую очередь ТР ТС 010/2011 (безопасность машин и оборудования) и ТР ТС 004/2011 и 020/2011 (электробезопасность и ЭМС). На большинство позиций оформляется декларация или сертификат соответствия с нанесением знака EAC. Заводские CE и FCC для этого не подходят — они принимаются как доказательная база, но не заменяют документ ЕАЭС.",
        a_en: "Yes, and it's a separate matter. For legal operation the equipment must meet EAEU technical regulations — primarily TR TS 010/2011 (machinery safety) and TR TS 004/2011 and 020/2011 (electrical safety and EMC). Most items need a declaration or certificate of conformity with the EAC mark. Factory CE and FCC don't substitute for this — they're accepted as supporting evidence, not as a replacement for the EAEU document.",
      },
      {
        id: "fsb-notification",
        q_ru: "Нужна ли нотификация ФСБ?",
        q_en: "Is an FSB notification required?",
        a_ru: "Если в роботе есть Wi-Fi, Bluetooth или иные средства шифрования — а они есть почти всегда — для ввоза на территорию ЕАЭС требуется нотификация о криптографических средствах. У крупных брендов она часто уже оформлена на модель; у небольших фабрик — нет, и её нужно получать. Этот пункт проверяем до подписания контракта, потому что он умеет задерживать груз на месяцы.",
        a_en: "If the robot has Wi-Fi, Bluetooth or other encryption tools — and it almost always does — importing it into the EAEU requires a notification on cryptographic tools. Large brands often already have one filed for the model; smaller factories usually don't, and it has to be obtained. We check this before signing the contract, because it can hold cargo up for months.",
      },
    ],
  },
  {
    id: "software",
    title_ru: "Программное обеспечение, ИИ и интеграция",
    title_en: "Software, AI and integration",
    items: [
      {
        id: "os-languages",
        q_ru: "Какая операционная система на роботе и какие языки поддерживаются?",
        q_en: "What operating system runs on the robot, and which languages are supported?",
        a_ru: "Отраслевой стандарт — Ubuntu Linux (20.04 или 22.04 LTS). Верхний уровень управления работает на ROS или ROS 2. Для пользовательских скриптов, алгоритмов и сценариев поведения предоставляются библиотеки на C++ и Python.",
        a_en: "The industry standard is Ubuntu Linux (20.04 or 22.04 LTS). The top control layer runs on ROS or ROS 2. For custom scripts, algorithms and behavior scenarios, C++ and Python libraries are provided.",
      },
      {
        id: "source-code",
        q_ru: "Исходный код робота открыт?",
        q_en: "Is the robot's source code open?",
        a_ru: "Нет, и это важно понимать заранее. Код разделён на уровни:\n— Низкий уровень — балансировка гуманоида, динамика шага, управление токами в суставах. Зашит в контроллеры жёстко, поставляется как «чёрный ящик» и остаётся собственностью завода.\n— High-Level SDK — доступен покупателю: управление траекториями, чтение данных с сенсоров, работа с манипуляторами, интеграция собственных ИИ-моделей.\nЕсли ваша задача требует вмешательства в низкоуровневые алгоритмы, это отдельный разговор с заводом и, как правило, отдельный бюджет.",
        a_en: "No, and it's worth knowing that upfront. The code is split into layers:\n— Low level — humanoid balancing, gait dynamics, joint current control. Hard-baked into the controllers, delivered as a \"black box\" and remains the factory's property.\n— High-level SDK — available to the buyer: trajectory control, reading sensor data, working with manipulators, integrating your own AI models.\nIf your task requires touching the low-level algorithms, that's a separate conversation with the factory and, as a rule, a separate budget.",
      },
      {
        id: "docs-updates",
        q_ru: "На каком языке документация и как приходят обновления?",
        q_en: "What language is the documentation in, and how do updates arrive?",
        a_ru: "Заводы дают документацию на английском и китайском — через закрытые Wiki-порталы или приватные репозитории GitHub. Обновления прошивки устанавливаются по OTA или вручную по кабелю.\nОтдельная рекомендация: до покупки запросите гостевой доступ к документации. Качество перевода и полнота API — лучший индикатор зрелости продукта. Красивая брошюра и API на 12 методов с примерами только на китайском — плохой знак.",
        a_en: "Factories provide documentation in English and Chinese — through closed wiki portals or private GitHub repos. Firmware updates are installed OTA or manually over a cable.\nA separate recommendation: request guest access to the documentation before buying. Translation quality and API completeness are the best indicator of a product's maturity. A glossy brochure paired with a 12-method API documented only in Chinese is a bad sign.",
      },
      {
        id: "external-llm",
        q_ru: "Можно ли подключить внешнюю языковую модель, например GPT, для общения с людьми?",
        q_en: "Can an external language model, like GPT, be connected for talking to people?",
        a_ru: "Да. Бортовые вычислители имеют стек для работы с нейросетями. Схема стандартная: микрофонная решётка робота пишет речь, распознанный текст уходит API-запросом в облачную LLM, ответ озвучивается локальным модулем TTS на нужном языке. Учитывайте задержку канала и то, что при потере сети диалоговая функция отключится, а базовая навигация — нет.",
        a_en: "Yes. The onboard compute has a stack for working with neural networks. The typical setup: the robot's microphone array records speech, the recognized text goes out as an API call to a cloud LLM, and the reply is voiced by a local TTS module in the needed language. Account for channel latency, and note that if the network drops, the conversational function goes down while basic navigation keeps working.",
      },
      {
        id: "erp-integration",
        q_ru: "Интегрируется ли робот с нашей ERP, WMS или 1С?",
        q_en: "Does the robot integrate with our ERP, WMS or 1C?",
        a_ru: "Через High-Level API. Типовые интерфейсы — REST/WebSocket, MQTT, у промышленных линий OPC UA и Modbus. Заводской софт почти никогда не умеет вашу систему «из коробки»: интеграционный слой пишется под конкретный контур, и его трудоёмкость надо закладывать в проект отдельной строкой.",
        a_en: "Through the high-level API. Typical interfaces are REST/WebSocket and MQTT; industrial lines also use OPC UA and Modbus. Factory software almost never talks to your system out of the box: the integration layer is written for your specific setup, and its effort needs its own line item in the project.",
      },
      {
        id: "russian-interface",
        q_ru: "Есть ли русский язык в интерфейсе?",
        q_en: "Is there a Russian interface?",
        a_ru: "У части сервисных роботов из массового сегмента русская локализация есть, у промышленных и гуманоидов — обычно только английский и китайский. Распознавание и синтез русской речи решаются подключением сторонних движков. Локализацию интерфейса и голосовых сценариев делаем как отдельную работу — формат и стоимость считаем индивидуально под задачу.",
        a_en: "Some mass-market service robots have a Russian localization; industrial robots and humanoids usually only have English and Chinese. Russian speech recognition and synthesis are handled by connecting third-party engines. We do interface and voice-scenario localization as separate work — format and cost are quoted individually for the task.",
      },
    ],
  },
  {
    id: "hardware",
    title_ru: "Железо, вычислительная мощность и сенсоры",
    title_en: "Hardware, compute and sensors",
    items: [
      {
        id: "compute-hardware",
        q_ru: "Какие процессоры и видеокарты стоят внутри?",
        q_en: "What processors and GPUs are inside?",
        a_ru: "Для базовых задач — навигация, кинематика — промышленные контроллеры. Для компьютерного зрения и локального ИИ устанавливаются модули NVIDIA Jetson Orin (Nano / NX / AGX) либо кастомные x86-компьютеры с дискретными ускорителями.\nВсегда запрашивайте точную спецификацию вычислительного узла, включая производительность в TOPS. Это единственный способ понять, поедут ли на роботе ваши локальные модели, или придётся выносить инференс в облако.",
        a_en: "For basic tasks — navigation, kinematics — industrial controllers. For computer vision and local AI, NVIDIA Jetson Orin modules (Nano / NX / AGX) or custom x86 computers with discrete accelerators are installed.\nAlways ask for the exact compute-node spec, including TOPS performance. It's the only way to know whether your local models will actually run on the robot, or whether inference has to be pushed to the cloud.",
      },
      {
        id: "connection-lost",
        q_ru: "Что произойдёт, если робот потеряет связь с Wi-Fi или 5G?",
        q_en: "What happens if the robot loses its Wi-Fi or 5G connection?",
        a_ru: "Ничего критичного. Все системы безопасности и базовой навигации работают локально на бортовом компьютере. При потере сети робот не упадёт и не врежется в стену — он выполнит заложенный аварийный сценарий: остановится и перейдёт в режим удержания равновесия либо вернётся на точку старта по сохранённой карте. Облачное подключение нужно для телеметрии и внешних команд, а не для того, чтобы робот стоял на ногах.",
        a_en: "Nothing critical. All safety systems and basic navigation run locally on the onboard computer. Losing the network doesn't make the robot fall or crash into a wall — it runs its built-in failsafe: stops and holds balance, or returns to the starting point via its saved map. The cloud connection is for telemetry and external commands, not for keeping the robot on its feet.",
      },
      {
        id: "safety-sensors",
        q_ru: "Какие датчики отвечают за то, чтобы робот не сталкивался с людьми?",
        q_en: "What sensors keep the robot from colliding with people?",
        a_ru: "Работает гибридная система (sensor fusion):\n— 3D LiDAR — лазерное сканирование на 360°, точное расстояние до объектов.\n— Глубинные RGB-D камеры — рельеф, высота ступеней, распознавание лиц и препятствий.\n— Ультразвуковые и ИК-датчики — страхуют «слепые зоны» вплотную к корпусу.\n— Датчики крутящего момента в каждом суставе — при лёгком сопротивлении (например, рука задела человека) движение останавливается мгновенно.",
        a_en: "A hybrid sensor-fusion system:\n— 3D LiDAR — 360° laser scanning, precise distance to objects.\n— Depth RGB-D cameras — terrain, step height, face and obstacle recognition.\n— Ultrasonic and IR sensors — cover the blind spots right against the housing.\n— Torque sensors in every joint — if there's light resistance (say, an arm brushes a person), the motion stops instantly.",
      },
      {
        id: "ip-temp-range",
        q_ru: "Какой класс защиты и в каком температурном диапазоне работает робот?",
        q_en: "What ingress protection rating and temperature range does the robot handle?",
        a_ru: "Это вопрос, который в России решает судьбу проекта. Большинство сервисных роботов и гуманоидов рассчитаны на помещения: IP54 и ниже, диапазон примерно от 0 до +40 °C. Уличная и цеховая эксплуатация, мойка из шланга, отрицательные температуры требуют отдельных исполнений — как правило, робопсов и AMR в защищённых версиях. Требуйте IP-класс и температурный диапазон в спецификации, а не в презентации.",
        a_en: "This is a question that can decide a project's fate in Russia. Most service robots and humanoids are built for indoor use: IP54 or lower, roughly 0 to +40°C. Outdoor and shop-floor operation, hose-down washing, and sub-zero temperatures need dedicated versions — typically ruggedized quadrupeds and AMRs. Ask for the IP rating and temperature range in the spec sheet, not the pitch deck.",
      },
      {
        id: "beyond-price",
        q_ru: "На что смотреть в характеристиках, кроме цены?",
        q_en: "What else to look at in the specs besides price?",
        a_ru: "Полезная нагрузка и её распределение, повторяемость позиционирования, рабочая зона манипулятора, преодолеваемый уклон и высота порога для мобильных платформ, шум, время наработки на отказ (MTBF), сколько единиц этой модели завод уже отгрузил. Последнее — самый честный показатель зрелости.",
        a_en: "Payload and how it's distributed, repeatability of positioning, the manipulator's working envelope, the slope and threshold height a mobile platform can handle, noise, mean time between failures (MTBF), and how many units of this model the factory has already shipped. The last one is the most honest sign of maturity.",
      },
    ],
  },
  {
    id: "power",
    title_ru: "Питание, автономность и батареи",
    title_en: "Power, runtime and batteries",
    items: [
      {
        id: "real-runtime",
        q_ru: "Каково реальное время работы?",
        q_en: "What's the real runtime?",
        a_ru: "Заявленное в брошюре время (например, 5 часов) обычно измеряется в стоянии на месте. В реальной эксплуатации — постоянное перемещение, работа манипуляторов, сканирование лидарами, охлаждение или обогрев процессоров — автономность составляет от 1,5 до 3 часов. Основной расход у гуманоидов идёт на удержание баланса, а у всех классов — на вычислительные блоки.\nПланируйте сменный цикл исходя из реальных цифр, а не из спецификации. Практическое правило: делите заявленное время на два.",
        a_en: "The runtime quoted in the brochure (say, 5 hours) is usually measured standing still. In real use — constant movement, manipulators working, LiDAR scanning, processor cooling or heating — the runtime is 1.5 to 3 hours. For humanoids, most of the draw goes to holding balance; across all classes, a large share goes to the compute units.\nPlan shift cycles around the real numbers, not the spec sheet. A practical rule: halve the quoted runtime.",
      },
      {
        id: "charging-docking",
        q_ru: "Как заряжается робот, есть ли автоматическая стыковка?",
        q_en: "How does the robot charge, and is there auto-docking?",
        a_ru: "Большинство сервисных роботов и робопсов поставляются с док-станциями для автоподзарядки — робот сам находит станцию по камере или ИК-маяку и садится на контакты. Крупные гуманоиды пока требуют ручного подключения кабеля. Уточняйте, идёт ли зарядная станция в комплекте или покупается отдельно: это регулярно оказывается неприятным сюрпризом в счёте.",
        a_en: "Most service robots and quadrupeds ship with docking stations for auto-charging — the robot finds the station via camera or IR beacon and docks on its own. Large humanoids still need a cable plugged in by hand. Check whether the charging station is included or sold separately: it regularly turns out to be an unpleasant surprise on the invoice.",
      },
      {
        id: "battery-lifespan",
        q_ru: "Каков ресурс аккумулятора и можно ли его быстро заменить?",
        q_en: "What's the battery's lifespan, and can it be swapped quickly?",
        a_ru: "Применяются литий-ионные или литий-железо-фосфатные (LiFePO4) батареи высокой плотности. Ресурс — порядка 800–1200 циклов заряд-разряд до падения ёмкости до 80%.\nКлючевой вопрос к заводу — архитектура: поддерживает ли робот горячую замену (hot-swap) за пару минут, или аккумулятор встроен в корпус и меняется только с разбором в сервисном центре. Для сменной работы первое обязательно.",
        a_en: "High-density lithium-ion or lithium iron phosphate (LiFePO4) batteries are used. Lifespan is around 800–1,200 charge cycles before capacity drops to 80%.\nThe key question for the factory is the architecture: does the robot support a hot-swap in a couple of minutes, or is the battery built into the housing and only replaceable by disassembly at a service center? For shift work, the former is a must.",
      },
      {
        id: "cold-operation",
        q_ru: "Можно ли эксплуатировать робота на морозе?",
        q_en: "Can the robot be operated in freezing conditions?",
        a_ru: "Разряд литиевой батареи при отрицательных температурах возможен с потерей ёмкости, а вот заряд ниже 0 °C повреждает элементы — большинство BMS его просто блокируют. Для холодных зон нужны либо исполнения с подогревом батарейного отсека, либо организационное решение: зарядка в тёплом помещении, работа на улице.",
        a_en: "A lithium battery can discharge below 0°C with some capacity loss, but charging below 0°C damages the cells — most BMS units simply block it. For cold zones you need either a version with a heated battery compartment, or an operational workaround: charge indoors, work outside.",
      },
    ],
  },
  {
    id: "deployment",
    title_ru: "Внедрение, пусконаладка и обучение",
    title_en: "Deployment, commissioning and training",
    items: [
      {
        id: "onsite-engineer",
        q_ru: "Возможен ли выезд китайского инженера на нашу площадку?",
        q_en: "Can a Chinese engineer travel to our site?",
        a_ru: "По умолчанию — нет. Пусконаладка заложена как удалённая: через WeChat или Zoom. Выезд возможен у топ-брендов при закупке партии либо как платная опция — вы оплачиваете визу, перелёт, проживание и посуточную ставку инженера (ориентировочно $300–1000 в день).\nЭтот разрыв мы закрываем на своей стороне: у нас есть ряд партнёрских инженерных команд, которые занимаются монтажом, пусконаладкой и настройкой оборудования на площадке заказчика. Формат и объём работ обсуждаем под конкретный проект — от разовой помощи с первым запуском до полного шеф-монтажа.",
        a_en: "By default — no. Commissioning is set up remotely, over WeChat or Zoom. A site visit is possible from top-tier brands on a bulk order, or as a paid option — you cover the visa, flight, accommodation and a daily engineer rate (roughly $300–1,000 a day).\nWe close that gap on our side: we have partner engineering teams who handle installation, commissioning and setup at the client's site. The scope is discussed per project — from one-off help with the first start-up to full turnkey supervision.",
      },
      {
        id: "staff-training",
        q_ru: "Кто и как обучает наших сотрудников?",
        q_en: "Who trains our staff, and how?",
        a_ru: "Базовое обучение операторов — удалённо от завода, обычно на английском с нашим переводом, плюс переданный комплект инструкций. Для промышленных линий и коботов практикуется обучение группы на заводе во время приёмки — если вы всё равно едете на FAT, это лучшее время. Состав и стоимость собственной программы обучения от Aura Robotics считаем индивидуально под ваш парк оборудования.",
        a_en: "Basic operator training happens remotely from the factory, usually in English with our translation, plus a handed-over set of instructions. For industrial lines and cobots, group training at the factory during acceptance is common — if you're travelling for the FAT anyway, that's the best time for it. The scope and cost of our own Aura Robotics training program are quoted individually for your equipment fleet.",
      },
      {
        id: "need-own-engineer",
        q_ru: "Нужен ли нам свой инженер?",
        q_en: "Do we need our own engineer?",
        a_ru: "Для сервисных роботов — нет, достаточно обученного оператора. Для промышленных манипуляторов, коботов и AMR — да: нужен человек, который умеет читать логи, работать с ROS, менять программу под новую номенклатуру и не бояться терминала. Отсутствие такого человека — вторая по частоте причина, по которой робот стоит в углу. Первая — отсутствие ЗИП.",
        a_en: "For service robots — no, a trained operator is enough. For industrial manipulators, cobots and AMRs — yes: you need someone who can read logs, work with ROS, reprogram for a new part number, and isn't afraid of a terminal. Not having that person is the second most common reason a robot ends up parked in a corner. The first is missing spare parts.",
      },
      {
        id: "deployment-time",
        q_ru: "Сколько времени занимает внедрение после прибытия груза?",
        q_en: "How long does deployment take after the cargo arrives?",
        a_ru: "Распаковка, сборка и первичный запуск — от одного дня до недели. Настройка под процесс, картирование помещения, отладка сценариев — от одной до нескольких недель. Промышленные линии с интеграцией в ERP — месяцы. Закладывайте пилотный период, в течение которого робот работает параллельно с человеком, а не вместо него.",
        a_en: "Unpacking, assembly and the first start-up — a day to a week. Tuning for the process, mapping the space, debugging scenarios — one to several weeks. Industrial lines with ERP integration — months. Plan for a pilot period where the robot works alongside a person, not instead of one.",
      },
    ],
  },
  {
    id: "warranty",
    title_ru: "Гарантия, сервис и запчасти",
    title_en: "Warranty, service and spare parts",
    items: [
      {
        id: "warranty-coverage",
        q_ru: "Что покрывает заводская гарантия и каков её срок?",
        q_en: "What does the factory warranty cover, and how long does it last?",
        a_ru: "Стандарт китайских фабрик — 12 месяцев. Покрывается заводской брак: выход из строя плат управления, сервоприводов, сенсоров при целевом использовании.\nНе покрывается: механические повреждения от падений, попадание влаги (если класс защиты ниже IP65), естественный износ протектора ног и колёс, деградация ёмкости батареи. Продление гарантии у части заводов возможно за отдельную плату — обсуждаем на этапе контракта.",
        a_en: "The standard across Chinese factories is 12 months. It covers factory defects: control-board, servo and sensor failures under intended use.\nNot covered: mechanical damage from drops, water ingress (below IP65), normal wear of foot pads and wheels, and battery capacity degradation. Extended warranty is available from some factories for an extra fee — we discuss it at the contract stage.",
      },
      {
        id: "spare-parts-buy",
        q_ru: "Какой ЗИП нужно взять сразу при покупке?",
        q_en: "What spare parts should I buy right away?",
        a_ru: "Чтобы робот не простаивал месяцами из-за мелкой поломки, докупайте вместе с основной поставкой:\n— 1–2 оригинальных сустава / сервопривода — актуаторы самый нагруженный и чаще всего выходящий из строя элемент;\n— запасные кабели питания и интерфейсные шлейфы;\n— комплект защитных пластиковых накладок корпуса;\n— дополнительный аккумулятор.\nЭто самая недооценённая строка бюджета. Заказ одного актуатора отдельной посылкой обходится дороже и дольше, чем взять его в основной поставке.",
        a_en: "So the robot doesn't sit idle for months over a minor failure, buy along with the main order:\n— 1–2 original joints/servos — actuators are the most heavily loaded and most frequently failing part;\n— spare power cables and interface harnesses;\n— a set of protective plastic housing covers;\n— an extra battery.\nThis is the most underrated line in the budget. Ordering a single actuator as a separate shipment later costs more and takes longer than including it in the main delivery.",
      },
      {
        id: "warranty-repair",
        q_ru: "Как происходит ремонт по гарантии?",
        q_en: "How does a warranty repair work?",
        a_ru: "1. Вы снимаете видео неисправности и выгружаете логи ошибок через терминал.\n2. Инженеры завода проводят удалённую диагностику.\n3. Программный сбой — присылают патч. Аппаратный — вы демонтируете узел (например, руку или ногу) и отправляете его карго на завод по процедуре RMA.\n4. Завод ремонтирует узел и отправляет обратно.\nДоставку в Китай обычно оплачивает покупатель, обратную — завод. Срок цикла — от 3 недель. Именно поэтому ЗИП важнее гарантии.",
        a_en: "1. You record video of the fault and pull the error logs via the terminal.\n2. Factory engineers run remote diagnostics.\n3. A software fault gets a patch sent over. A hardware fault means you remove the unit (say, an arm or a leg) and ship it to the factory by cargo under an RMA procedure.\n4. The factory repairs the unit and ships it back.\nThe buyer usually pays shipping to China; the factory pays the return leg. The cycle takes 3+ weeks. That's exactly why spare parts matter more than the warranty.",
      },
      {
        id: "post-warranty",
        q_ru: "Что с обслуживанием после гарантии?",
        q_en: "What about servicing after the warranty ends?",
        a_ru: "Запчасти доступны, пока модель находится в производстве и обычно несколько лет после. Риск в другом: китайские вендоры обновляют линейки быстро, и через 3–4 года актуаторы «вашей» ревизии могут стать неснимаемой позицией. Практическое следствие — на длинный горизонт эксплуатации берите модель с большим объёмом отгрузок, а не самую свежую новинку.",
        a_en: "Parts are available as long as the model is in production, and usually for a few years after. The real risk is elsewhere: Chinese vendors refresh their lineups fast, and in 3–4 years the actuators for \"your\" revision can become impossible to source. The practical takeaway — for a long operating horizon, pick a model with a large shipped volume, not the newest release.",
      },
      {
        id: "service-russia",
        q_ru: "Есть ли у вас сервис в России?",
        q_en: "Do you have service in Russia?",
        a_ru: "Да, у нас есть партнёры — инженерные компании, которые занимаются обслуживанием и ремонтом такого оборудования на территории России. Часть неисправностей закрывается на месте, без отправки узла в Китай, а по гарантийным случаям мы сопровождаем процедуру RMA: диагностику с заводом, демонтаж узла, отправку и обратную приёмку. Состав работ и условия обслуживания обсуждаем под ваш парк оборудования.",
        a_en: "Yes, we have partners — engineering companies that service and repair this kind of equipment in Russia. Some faults are resolved on site, without shipping the unit to China, and for warranty cases we manage the RMA process: diagnostics with the factory, removing the unit, shipping it out and receiving it back. The scope and terms of service are discussed for your equipment fleet.",
      },
    ],
  },
  {
    id: "safety",
    title_ru: "Безопасность, охрана труда и данные",
    title_en: "Safety, labor protection and data",
    items: [
      {
        id: "safe-near-people",
        q_ru: "Насколько безопасно ставить робота рядом с людьми?",
        q_en: "How safe is it to put a robot next to people?",
        a_ru: "Промышленные манипуляторы требуют физического ограждения или сканеров зоны безопасности. Коллаборативные роботы проектируются под работу рядом с человеком: ограниченная скорость, ограниченное усилие, датчики момента в каждом суставе. Ориентиры — стандарты ISO 10218 и ISO/TS 15066. Но «кобот» на шильдике не отменяет оценку рисков конкретного рабочего места — её нужно делать под ваш процесс.",
        a_en: "Industrial manipulators need a physical guard or safety-zone scanners. Collaborative robots are designed to work next to people: limited speed, limited force, torque sensors in every joint. The reference points are the ISO 10218 and ISO/TS 15066 standards. But a \"cobot\" label on the nameplate doesn't replace a risk assessment of your specific workstation — that has to be done for your process.",
      },
      {
        id: "labor-protection",
        q_ru: "Что требуется по охране труда?",
        q_en: "What's required for occupational safety?",
        a_ru: "Оценка профессиональных рисков рабочего места с роботом, инструкция по эксплуатации на русском языке, обучение и инструктаж операторов, схема аварийного останова, доступная человеку. Мы предоставляем техническую базу — инструкции, схемы, паспорта; оформление внутренних документов остаётся на стороне работодателя.",
        a_en: "An occupational risk assessment for the workstation with the robot, an operating manual in Russian, operator training and briefing, and an emergency-stop scheme accessible to people. We provide the technical base — manuals, diagrams, data sheets; drawing up the internal paperwork stays with the employer.",
      },
      {
        id: "personal-data",
        q_ru: "Робот записывает видео и распознаёт лица. Что с персональными данными?",
        q_en: "The robot records video and recognizes faces. What about personal data?",
        a_ru: "Если робот распознаёт лица, это обработка биометрических персональных данных с соответствующими требованиями 152-ФЗ: правовое основание, согласие субъектов, информирование о видеонаблюдении. Технически ситуация управляемая: у большинства моделей распознавание лиц можно отключить, а обработку видео оставить полностью локальной, без выгрузки в облако производителя. Этот пункт нужно решить до запуска, а не после первой жалобы.",
        a_en: "If the robot recognizes faces, that's processing of biometric personal data under 152-FZ, with the corresponding requirements: a legal basis, subjects' consent, notice of video surveillance. Technically it's manageable: on most models, face recognition can be turned off while video processing stays fully local, without uploading to the manufacturer's cloud. This has to be resolved before launch, not after the first complaint.",
      },
      {
        id: "network-security",
        q_ru: "Безопасно ли подключать робота к нашей корпоративной сети?",
        q_en: "Is it safe to connect the robot to our corporate network?",
        a_ru: "Робот — это Linux-машина с постоянным каналом к серверам производителя. Стандартная гигиена: отдельный VLAN, ограничение исходящих соединений, отключение необязательной телеметрии, смена дефолтных паролей и SSH-ключей, контроль обновлений прошивки. Мы даём перечень адресов и портов, к которым обращается конкретная модель, чтобы ваша служба ИБ могла настроить правила осознанно.",
        a_en: "A robot is a Linux machine with a permanent channel to the manufacturer's servers. Standard hygiene applies: a separate VLAN, restricted outbound connections, disabling unnecessary telemetry, changing default passwords and SSH keys, and controlling firmware updates. We provide a list of addresses and ports a given model talks to, so your security team can set rules deliberately.",
      },
    ],
  },
  {
    id: "economics",
    title_ru: "Экономика и окупаемость",
    title_en: "Economics and payback",
    items: [
      {
        id: "how-to-calculate-payback",
        q_ru: "Как правильно считать окупаемость?",
        q_en: "How should payback be calculated?",
        a_ru: "Сравнивайте не «цена робота против зарплаты», а полные стоимости владения.\nЧто робот замещает: ФОТ с налогами по всем сменам, которые он закрывает; издержки от брака и ошибок; потери от простоев и текучки; расходы на травматизм на опасных участках; стоимость найма и обучения.\nЧто робот стоит: цена оборудования и доставки, таможня и НДС, сертификация, интеграция и пусконаладка, обучение персонала, электроэнергия, ЗИП и плановое обслуживание, замена батарей за срок жизни, лицензии на ПО, зарплата инженера сопровождения.\nСчитать корректно — по 3–5 годам эксплуатации, а не по первому году: в первый год перевес почти всегда на стороне человека.",
        a_en: "Compare full costs of ownership, not \"robot price vs. salary.\"\nWhat the robot replaces: full payroll with taxes across every shift it covers; losses from defects and errors; losses from downtime and turnover; injury-related costs on hazardous stations; hiring and training costs.\nWhat the robot costs: the equipment and delivery price, customs and VAT, certification, integration and commissioning, staff training, electricity, spare parts and scheduled maintenance, battery replacement over its service life, software licenses, and the salary of the engineer who supports it.\nCalculate it correctly over 3–5 years of operation, not the first year: in year one, the balance is almost always in favor of the human.",
      },
      {
        id: "typical-payback",
        q_ru: "Какой типичный срок окупаемости?",
        q_en: "What's a typical payback period?",
        a_ru: "Зависит от числа замещаемых смен, поэтому единой цифры нет. Робот, работающий в одну смену, окупается вдвое медленнее того же робота в две. Быстрее всего окупаются монотонные операции с высоким тактом и круглосуточной загрузкой; медленнее — представительские и демонстрационные сценарии, где эффект вообще не в экономии ФОТ. Расчёт под ваши цифры делаем в калькуляторе на сайте и уточняем в КП.",
        a_en: "It depends on how many shifts are replaced, so there's no single number. A robot working one shift pays back twice as slowly as the same robot working two. Monotonous, high-takt, round-the-clock operations pay back fastest; representative and demo scenarios pay back slowest, since the payoff isn't really about payroll savings. We run the calculation on your numbers with the calculator on the site and refine it in the proposal.",
      },
      {
        id: "forgotten-costs",
        q_ru: "Какие расходы обычно забывают заложить?",
        q_en: "What costs do people usually forget to budget for?",
        a_ru: "Зарядные станции, ЗИП, замена аккумуляторов на третий год, интеграционный слой к учётной системе, сертификация ЕАЭС, доработка помещения под маршруты AMR, зарплата человека, который будет с этим жить. По нашему опыту это добавляет ощутимую долю к цене оборудования — и именно её отсутствие в расчёте губит проекты.",
        a_en: "Charging stations, spare parts, battery replacement in year three, the integration layer to the accounting system, EAEU certification, adapting the space for AMR routes, and the salary of the person who will actually live with it day to day. In our experience this adds a meaningful share on top of the equipment price — and leaving it out of the calculation is what kills projects.",
      },
    ],
  },
  {
    id: "tour",
    title_ru: "Бизнес-туры на заводы Китая — Aura Robotics Tour",
    title_en: "Factory business tours in China — Aura Robotics Tour",
    items: [
      {
        id: "what-is-it",
        q_ru: "Что это такое?",
        q_en: "What is it?",
        a_ru: "Организованный визит на производства китайских робототехнических заводов: вы своими глазами видите сборочные линии, тестовые полигоны, объёмы выпуска и уровень контроля качества — и разговариваете с инженерами, а не с отделом продаж. Для большинства заказчиков это самый быстрый способ отличить реального производителя от сборочного цеха с чужим брендом на корпусе.",
        a_en: "An organized visit to Chinese robotics factories: you see the assembly lines, test grounds, output volumes and quality-control level with your own eyes — and talk to engineers, not the sales department. For most clients this is the fastest way to tell a real manufacturer from an assembly shop with someone else's brand on the housing.",
      },
      {
        id: "whats-included",
        q_ru: "Что входит в программу?",
        q_en: "What's included in the program?",
        a_ru: "Подбор заводов под ваш профиль и согласование визитов, маршрут и трансферы, переводчик с техническим китайским, сопровождение на переговорах, помощь с проживанием, итоговый отчёт по каждому заводу.",
        a_en: "Selecting factories that match your profile and arranging the visits, the route and transfers, an interpreter with technical Chinese, support during negotiations, help with accommodation, and a final report on each factory.",
      },
      {
        id: "tour-price",
        q_ru: "Сколько стоит тур?",
        q_en: "How much does the tour cost?",
        a_ru: "Стоимость зависит от программы: числа заводов, продолжительности, города и размера группы. Она фиксируется после согласования программы и не меняется. Перелёт из России в стоимость не входит — вы оформляете его сами либо мы помогаем с подбором. Точную стоимость ближайшего тура и полную раскладку по статьям смотрите на странице «Туры».",
        a_en: "The cost depends on the program: the number of factories, the duration, the city and the group size. It's fixed once the program is agreed and doesn't change afterward. The flight from Russia isn't included — you book it yourself, or we help find one. See the exact cost of the upcoming tour and the full breakdown on the Tours page.",
      },
      {
        id: "visa",
        q_ru: "Нужна ли виза?",
        q_en: "Do I need a visa?",
        a_ru: "Визовый режим Китая для граждан России в последние годы менялся — актуальные требования уточняем индивидуально перед каждым туром и помогаем с оформлением документов и приглашений от заводов.",
        a_en: "China's visa regime for Russian citizens has changed several times in recent years — we confirm the current requirements individually before each tour and help with the paperwork and factory invitation letters.",
      },
      {
        id: "must-buy-after-tour",
        q_ru: "Обязательно ли покупать оборудование после тура?",
        q_en: "Do I have to buy equipment after the tour?",
        a_ru: "Нет. Тур — самостоятельная услуга. Многие едут за отраслевой картиной: понять уровень технологий, найти поставщиков под собственную сборку, оценить нишу до входа в неё.",
        a_en: "No. The tour is a standalone service. Many people come for the industry overview: to gauge the technology level, find suppliers for their own build, or size up a niche before entering it.",
      },
    ],
  },
  {
    id: "food-equipment",
    title_ru: "Производственное оборудование для пищевой промышленности",
    title_en: "Production equipment for the food industry",
    items: [
      {
        id: "what-equipment",
        q_ru: "Какое оборудование вы поставляете?",
        q_en: "What equipment do you supply?",
        a_ru: "Линии и отдельные единицы оборудования для пищевых производств: переработка, фасовка, упаковка, маркировка, транспортировка внутри цеха. Как и в робототехнике, работаем напрямую с заводами и подбираем решение под ваш продукт, такт и площадь.",
        a_en: "Lines and individual units of equipment for food production: processing, filling, packaging, labeling, in-plant transport. As with robotics, we work directly with factories and match a solution to your product, takt time and floor space.",
      },
      {
        id: "sanitary-requirements",
        q_ru: "Что с санитарными требованиями?",
        q_en: "What about sanitary requirements?",
        a_ru: "Оборудование для контакта с пищевой продукцией должно соответствовать ТР ТС 021/2011 и связанным регламентам: пищевые нержавеющие стали в контактных узлах, конструкция, допускающая мойку и санобработку, документы на материалы контактных поверхностей. Требуйте эти документы от завода на этапе спецификации — заменить контактный узел после поставки дороже, чем выбрать правильный до неё.",
        a_en: "Equipment that contacts food must meet TR TS 021/2011 and related regulations: food-grade stainless steel in contact parts, a design that allows washing and sanitizing, and documentation on contact-surface materials. Ask the factory for these documents at the spec stage — replacing a contact unit after delivery costs more than choosing the right one beforehand.",
      },
      {
        id: "who-installs",
        q_ru: "Кто монтирует и запускает линию?",
        q_en: "Who installs and starts up the line?",
        a_ru: "Линии сложнее отдельного робота: нужен монтаж, подключение к коммуникациям, шеф-монтаж и приёмочные испытания. Эти работы выполняют наши партнёрские инженерные команды в России, при необходимости — совместно с удалённым сопровождением от завода. Объём и формат обсуждаем под конкретный проект.",
        a_en: "A line is more involved than a single robot: it needs installation, utility hookups, supervised assembly and acceptance testing. Our partner engineering teams in Russia handle this work, together with remote support from the factory when needed. The scope and format are discussed per project.",
      },
    ],
  },
];
