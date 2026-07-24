import { pageAlternates } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { MediaGallery } from "@/components/media/media-gallery";
import { deliverySteps } from "@/lib/content/delivery";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "How delivery works" : "Как проходит поставка",
    description:
      locale === "en"
        ? "Six steps from selection to launch: proposal, contract, factory procurement, acceptance testing, logistics, installation."
        : "Шесть шагов от подбора до запуска: КП, договор, закупка на заводе, приёмка и тесты, логистика, монтаж.",
    alternates: pageAlternates(locale, "/delivery"),
  };
}

export default async function DeliveryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
      <h1 className="text-display">{isEn ? "How delivery works" : "Как проходит поставка"}</h1>
      <p className="mt-4 max-w-2xl text-subheading text-stone">
        {isEn
          ? "Every delivery is made to order, directly from the factory. Steps 3 and 4 replace the showroom: you see your actual unit being built and tested."
          : "Каждая поставка идёт под конкретный заказ, напрямую с завода. Шаги 3 и 4 заменяют шоурум: вы видите, как ваш экземпляр производится и проходит тесты."}
      </p>

      {/* Десктоп: закреплённая схема слева, шаги справа (PROJECT.md 5.7) */}
      <div className="mt-12 hidden gap-12 tablet-lg:grid tablet-lg:grid-cols-[280px_1fr]">
        <nav className="sticky top-8 self-start" aria-label={isEn ? "Delivery steps" : "Шаги поставки"}>
          <ol className="flex flex-col gap-3">
            {deliverySteps.map((step, index) => (
              <li key={step.id}>
                <a href={`#${step.id}`} className="flex items-baseline gap-3 text-body-sm text-stone hover:text-ink">
                  <span className="font-mono text-caption text-ash">{String(index + 1).padStart(2, "0")}</span>
                  {isEn ? step.title_en : step.title_ru}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-16">
          {deliverySteps.map((step, index) => (
            <article key={step.id} id={step.id} className="scroll-mt-8">
              <p className="font-mono text-caption text-ash">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-1 text-heading">{isEn ? step.title_en : step.title_ru}</h2>
              <p className="mt-3 max-w-2xl text-body text-stone">{isEn ? step.text_en : step.text_ru}</p>
              {(isEn ? step.details_en : step.details_ru) && (
                <ul className="mt-4 flex max-w-2xl flex-col gap-2 text-body text-stone">
                  {(isEn ? step.details_en! : step.details_ru!).map((detail) => (
                    <li key={detail} className="flex gap-2">
                      <span aria-hidden>—</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
              <MediaGallery photos={step.photos} captions={step.photoCaptions} className="mt-6 grid grid-cols-2 gap-4" />
            </article>
          ))}
        </div>
      </div>

      {/* Мобильный: вертикальный список с раскрытием, схема отключена */}
      <div className="mt-10 flex flex-col gap-3 tablet-lg:hidden">
        {deliverySteps.map((step, index) => (
          <details key={step.id} id={`m-${step.id}`} className="rounded-card border border-fog bg-warm-parchment p-4" open={index === 0}>
            <summary className="flex cursor-pointer items-baseline gap-3 text-heading-sm">
              <span className="font-mono text-caption text-ash">{String(index + 1).padStart(2, "0")}</span>
              {isEn ? step.title_en : step.title_ru}
            </summary>
            <p className="mt-3 text-body text-stone">{isEn ? step.text_en : step.text_ru}</p>
            {(isEn ? step.details_en : step.details_ru) && (
              <ul className="mt-3 flex flex-col gap-2 text-body-sm text-stone">
                {(isEn ? step.details_en! : step.details_ru!).map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span aria-hidden>—</span>
                    {detail}
                  </li>
                ))}
              </ul>
            )}
            <MediaGallery photos={step.photos} captions={step.photoCaptions} className="mt-4 grid grid-cols-1 gap-4" />
          </details>
        ))}
      </div>
    </section>
  );
}
