import { setRequestLocale } from "next-intl/server";
import { MediaSlot } from "@/components/media/media-slot";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "About Aura Robotics" : "О компании",
    description:
      locale === "en"
        ? "Robotics and production equipment from Chinese factories, delivered to order under a foreign trade contract."
        : "Робототехника и оборудование для производств с китайских заводов, под заказ по внешнеторговому контракту.",
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const blocks = isEn
    ? [
        {
          title: "Direct from the factory",
          text: "Aura Robotics supplies robotics and production equipment from China. We buy directly at the factories under a foreign trade contract — no warehouse, no showroom, no importer's markup. That model saves our clients 15–30% compared to suppliers with a Russian importer margin.",
        },
        {
          title: "Evidence instead of a showroom",
          text: "Our main proof of competence is documentary footage from the factories: production photos, videos from the floor, and a test run of your exact unit with its serial number in frame before it ships. Shot on a phone, captioned, tied to your order.",
        },
        {
          title: "Four directions",
          text: "A robot catalog organized by manufacturer, production equipment for food and adjacent industries, Aura Robotics Tour — sourcing trips to Chinese factories, and consulting. The catalog and the tours reinforce each other: the factories we sell are the factories we visit.",
        },
      ]
    : [
        {
          title: "Напрямую с завода",
          text: "Aura Robotics поставляет робототехнику и оборудование для производств из Китая. Мы закупаем напрямую на заводах по внешнеторговому контракту — без склада, шоурума и наценки импортёра. Эта модель даёт нашим клиентам экономию 15–30% относительно поставщиков с наценкой российского импортёра.",
        },
        {
          title: "Доказательства вместо шоурума",
          text: "Главное доказательство компетентности — документальные кадры с заводов: фото производств, видео из цехов и тестовый прогон именно вашего экземпляра с серийным номером в кадре перед отгрузкой. Снято на телефон, с подписью, привязано к вашему заказу.",
        },
        {
          title: "Четыре направления",
          text: "Каталог роботов по заводам-производителям, оборудование для пищевых и смежных производств, Aura Robotics Tour — закупочные поездки на китайские заводы, и консалтинг. Каталог и поездки усиливают друг друга: заводы, которые мы продаём, — это заводы, куда мы возим.",
        },
      ];

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
      <h1 className="text-display">{isEn ? "About Aura Robotics" : "О компании"}</h1>

      <div className="mt-10 flex flex-col gap-10">
        {blocks.map((block) => (
          <article key={block.title} className="max-w-2xl">
            <h2 className="text-heading-sm">{block.title}</h2>
            <p className="mt-3 text-body text-stone">{block.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <MediaSlot aspect="4/3" emptyBehavior="placeholder" />
        <MediaSlot aspect="4/3" emptyBehavior="placeholder" />
      </div>

      <div className="mt-12 rounded-card bg-ink p-8 text-canvas">
        <p className="font-mono text-body-sm">上海拼那克了科技有限责任公司</p>
        <p className="mt-1 text-body">Shanghai Pinnacle Technology Co., Ltd.</p>
        <p className="mt-4 text-body-sm text-fog">
          {isEn
            ? "Office: Gaoshang Lingyu Complex, Tower T3, Office 1235, Putuo District, Shanghai. UTC+8."
            : "Офис: Gaoshang Lingyu Complex, Tower T3, Office 1235, Putuo District, Shanghai. UTC+8, на 5 часов раньше Москвы."}
        </p>
        <div className="mt-6">
          <Link
            href="/contacts"
            className="inline-block rounded-button border border-canvas px-6 py-3 text-body font-medium text-canvas hover:bg-charcoal"
          >
            {isEn ? "Contacts" : "Контакты"}
          </Link>
        </div>
      </div>
    </section>
  );
}
