import { setRequestLocale } from "next-intl/server";
import { LinkButton } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Delivery and payment" : "Доставка и оплата",
    description:
      locale === "en"
        ? "How the foreign trade scheme works: factory price without importer markup, import registered to your company."
        : "Как работает внешнеторговая схема: заводская цена без наценки импортёра, ввоз оформляется на вашу компанию.",
  };
}

/** Формулировка модели работы — PROJECT.md, раздел 13: схема описывается прямо. */
export default async function PaymentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const paragraphs = isEn
    ? [
        "We work under a foreign trade scheme, and we describe it directly. You buy at the factory price, without a Russian importer's markup — in exchange, the import is registered to your company. The contract is signed with Shanghai Pinnacle Technology Co., Ltd., payment is made by invoice.",
        "What this gives you: the price is 15–30% lower than from suppliers holding stock in Russia, and the configuration is exactly what the factory builds for your order — not what happens to be in a warehouse.",
        "What it requires from you: your company becomes the importer of record. If you've never imported, this isn't a blocker — we support customs clearance and help with the documents at every step.",
      ]
    : [
        "Мы работаем по внешнеторговой схеме и описываем её прямо. Вы покупаете по заводской цене, без наценки российского импортёра — взамен ввоз оформляется на вашу компанию. Договор заключается с Shanghai Pinnacle Technology Co., Ltd., оплата — по инвойсу.",
        "Что это даёт: цена на 15–30% ниже, чем у поставщиков со складом в России, а комплектация — ровно та, которую завод собирает под ваш заказ, а не та, что оказалась на складе.",
        "Что это требует от вас: ваша компания выступает импортёром. Если опыта ВЭД нет — это не препятствие: мы сопровождаем таможенное оформление и помогаем с документами на каждом шаге.",
      ];

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:px-10">
      <h1 className="text-display">{isEn ? "Delivery and payment" : "Доставка и оплата"}</h1>

      <div className="mt-8 flex flex-col gap-5">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-body text-stone">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Обязательный абзац — PROJECT.md, раздел 13 */}
      <div className="mt-10 rounded-card bg-accent p-6">
        <p className="text-body text-ink">
          {isEn
            ? "If you need a contract with a Russian legal entity — write to us, we'll discuss options."
            : "Если нужен договор с российским юрлицом — напишите, обсудим варианты."}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <LinkButton href="/delivery" variant="secondary">
          {isEn ? "How delivery works" : "Как проходит поставка"}
        </LinkButton>
        <LinkButton href="/contacts">{isEn ? "Discuss your case" : "Обсудить вашу ситуацию"}</LinkButton>
      </div>
    </section>
  );
}
