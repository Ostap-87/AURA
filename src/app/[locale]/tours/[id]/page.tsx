import { eventJsonLd, pageAlternates } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LeadForm } from "@/components/forms/lead-form";
import { MediaGallery } from "@/components/media/media-gallery";
import { MediaSlot } from "@/components/media/media-slot";
import { formatPrice } from "@/lib/format";
import {
  computeCostTotals,
  computeTourStats,
  contentBlock,
  daysUntilDeadline,
  faqPairs,
  getContentForTour,
  getCostsForTour,
  getDaysForTour,
  getPublishedTours,
  getTourById,
  getTourCityStops,
  resolveProgramCompanies,
} from "@/lib/tours";
import { ChinaMap } from "@/components/tours/china-map";
import type { TourContent } from "@/lib/schemas";

export async function generateStaticParams() {
  const tours = await getPublishedTours();
  return tours.map((tour) => ({ id: tour.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const tour = await getTourById(id);
  if (!tour) return {};
  return {
    title: `${locale === "en" ? tour.title_en : tour.title_ru} — Aura Robotics Tour`,
    description: locale === "en" ? tour.summary_en : tour.summary_ru,
    alternates: pageAlternates(locale, `/tours/${id}`),
  };
}

function pick(item: TourContent, isEn: boolean): string {
  return isEn && item.text_en ? item.text_en : item.text_ru;
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const tour = await getTourById(id);
  if (!tour) notFound();

  const [days, costs, content] = await Promise.all([
    getDaysForTour(tour.id),
    getCostsForTour(tour.id),
    getContentForTour(tour.id),
  ]);
  const stats = computeTourStats(tour, days);
  const totals = computeCostTotals(costs);
  const companies = await resolveProgramCompanies(days);
  const cityStops = await getTourCityStops(days);
  const tForm = await getTranslations({ locale, namespace: "form" });

  const forWhom = contentBlock(content, "forWhom");
  const youGet = contentBlock(content, "youGet");
  const included = contentBlock(content, "included");
  const notIncluded = contentBlock(content, "notIncluded");
  const advantages = contentBlock(content, "advantages");
  const testimonials = contentBlock(content, "testimonial");
  const faq = faqPairs(content);
  const deadlineDays = daysUntilDeadline(tour);
  const isClosed = tour.status === "закрыта" || tour.status === "прошла";

  const rub = (n: number) => `${formatPrice(n, locale)} ₽`;
  const dates = tour.dateStart
    ? tour.dateEnd
      ? `${tour.dateStart} — ${tour.dateEnd}`
      : tour.dateStart
    : null;

  return (
    <>
      {/* Event JSON-LD только при заданных датах (PROJECT.md, раздел 12) */}
      {tour.dateStart && tour.dateEnd && (
        <JsonLd
          data={eventJsonLd({
            locale,
            path: `/tours/${tour.id}`,
            name: isEn ? tour.title_en : tour.title_ru,
            description: isEn ? tour.summary_en : tour.summary_ru,
            startDate: tour.dateStart,
            endDate: tour.dateEnd,
            locationName: tour.cities.join(", "),
            price: totals.total > 0 ? totals.total : undefined,
            image: tour.cover,
          })}
        />
      )}
      <section className="mx-auto max-w-(--container-page) px-5 pb-24 pt-10 lg:px-10">
        {/* 1. Шапка */}
        <p className="font-mono text-caption uppercase text-ash">Aura Robotics Tour</p>
        <h1 className="mt-2 text-display">{isEn ? tour.title_en : tour.title_ru}</h1>
        <p className="mt-4 text-heading-sm">
          {dates ?? (isEn ? "Dates being finalized — leave a request" : "Даты формируются, оставьте заявку")}
        </p>
        <p className="mt-2 font-mono text-body text-stone">
          {tour.cities.join(" · ")} — {stats.cities} {isEn ? "cities" : "города"} · {stats.days}{" "}
          {isEn ? "days" : "дней"} · {stats.companies} {isEn ? "companies" : "компаний"}
        </p>
        <div className="mt-6">
          <a
            href="#register"
            className="inline-block rounded-button bg-pure-black px-6 py-3 text-body font-medium text-canvas"
          >
            {isClosed
              ? isEn
                ? "Join the next trip"
                : "Записаться на следующую поездку"
              : isEn
                ? "Reserve a seat"
                : "Забронировать место"}
          </a>
        </div>

        {/* 2. Счётчики мест и дней до закрытия — только при заполненных данных */}
        {(tour.seatsLeft !== undefined || deadlineDays !== null) && (
          <div className="mt-8 flex flex-wrap gap-x-12 gap-y-4 rounded-card bg-warm-parchment p-4">
            {tour.seatsLeft !== undefined && (
              <div>
                <p className="font-mono text-heading-sm">
                  {tour.seatsLeft}
                  {tour.seatsTotal !== undefined ? ` / ${tour.seatsTotal}` : ""}
                </p>
                <p className="text-body-sm text-stone">{isEn ? "seats left" : "мест осталось"}</p>
              </div>
            )}
            {deadlineDays !== null && (
              <div>
                <p className="font-mono text-heading-sm">{deadlineDays}</p>
                <p className="text-body-sm text-stone">
                  {isEn ? "days until registration closes" : "дней до закрытия регистрации"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3. Для кого */}
        {forWhom.length > 0 && (
          <div className="mt-16">
            <h2 className="text-heading-lg">{isEn ? "Who it's for" : "Для кого"}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 tablet:grid-cols-2">
              {forWhom.map((item) => (
                <p key={item.order} className="rounded-card border border-fog p-4 text-body text-stone">
                  {pick(item, isEn)}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* 4. Что вы получите */}
        {youGet.length > 0 && (
          <div className="mt-16">
            <h2 className="text-heading-lg">{isEn ? "What you get" : "Что вы получите"}</h2>
            <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 tablet:grid-cols-2">
              {youGet.map((item) => (
                <li key={item.order} className="flex gap-2 text-body text-stone">
                  <span aria-hidden>—</span>
                  {pick(item, isEn)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 5. Программа по дням — вертикальный таймлайн */}
        {days.length > 0 && (
          <div className="mt-16">
            <h2 className="text-heading-lg">{isEn ? "Day-by-day program" : "Программа по дням"}</h2>
            <div className="mt-6 flex flex-col gap-4">
              {days.map((day) => (
                <article key={day.dayNumber} className="rounded-card border border-fog p-5">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-mono text-caption text-ash">
                      {isEn ? "Day" : "День"} {day.dayNumber}
                    </span>
                    <h3 className="text-heading-sm">{isEn ? day.cityEn : day.city}</h3>
                    {day.district && <span className="text-body-sm text-stone">{day.district}</span>}
                    <span className="font-mono text-body-sm text-stone">
                      {day.timeFrom}–{day.timeTo}
                    </span>
                  </div>
                  <p className="mt-2 text-body-sm text-stone">
                    {day.companies
                      .map((companyId) => {
                        const match = companies.find(
                          (c) => (c.kind === "unknown" ? c.id : c.factory.id) === companyId,
                        );
                        return match && match.kind !== "unknown" ? match.factory.name : companyId;
                      })
                      .join(" · ")}
                  </p>
                  <p className="mt-1 font-mono text-caption text-ash">{day.location}</p>
                  {day.logistics && <p className="mt-2 text-body-sm text-stone">{day.logistics}</p>}
                  {day.note && <p className="mt-1 text-body-sm text-ash">{day.note}</p>}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 5а. География поездки: карта Китая с маршрутом из tour_days */}
        {cityStops.length > 0 && (
          <div className="mt-16">
            <h2 className="text-heading-lg">{isEn ? "Trip geography" : "География поездки"}</h2>
            <div className="mt-6">
              <ChinaMap stops={cityStops} locale={locale} />
            </div>
          </div>
        )}

        {/* 6. Заводы в программе — со ссылками в каталог, где это возможно */}
        {companies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-heading-lg">{isEn ? "Factories in the program" : "Заводы в программе"}</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 tablet:grid-cols-3 desktop:grid-cols-4">
              {companies.map((company) => {
                if (company.kind === "unknown") {
                  return (
                    <span key={company.id} className="rounded-card border border-fog p-4 text-body text-stone">
                      {company.id}
                    </span>
                  );
                }
                const card = (
                  <>
                    <p className="text-body font-medium">{company.factory.name}</p>
                    <p className="mt-1 text-body-sm text-stone">{company.factory.city}</p>
                  </>
                );
                return company.kind === "linked" ? (
                  <Link
                    key={company.factory.id}
                    href={company.href}
                    className="rounded-card border border-ink bg-warm-parchment p-4 transition-transform duration-200 hover:-translate-y-1"
                  >
                    {card}
                  </Link>
                ) : (
                  <div key={company.factory.id} className="rounded-card border border-fog bg-warm-parchment p-4">
                    {card}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. Что входит и что не входит */}
        {(included.length > 0 || notIncluded.length > 0) && (
          <div className="mt-16 grid grid-cols-1 gap-8 tablet-lg:grid-cols-2">
            {included.length > 0 && (
              <div>
                <h2 className="text-heading-sm">{isEn ? "What's included" : "Что входит"}</h2>
                <ul className="mt-4 flex flex-col gap-2">
                  {included.map((item) => (
                    <li key={item.order} className="flex gap-2 text-body text-stone">
                      <span aria-hidden>+</span>
                      {pick(item, isEn)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {notIncluded.length > 0 && (
              <div>
                <h2 className="text-heading-sm">{isEn ? "Not included" : "Что не входит"}</h2>
                <ul className="mt-4 flex flex-col gap-2">
                  {notIncluded.map((item) => (
                    <li key={item.order} className="flex gap-2 text-body text-stone">
                      <span aria-hidden>−</span>
                      {pick(item, isEn)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 8. Стоимость — всё вычисляется из tour_costs (5.4) */}
        {costs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-heading-lg">
              {isEn
                ? `Full cost — from ${rub(totals.total)} per participant`
                : `Полная стоимость — от ${rub(totals.total)} на участника`}
            </h2>

            {totals.fixed.length > 0 && (
              <div className="mt-8">
                <h3 className="text-heading-sm">
                  {isEn
                    ? `Program — ${rub(totals.fixedSum)}, fixed price`
                    : `Программа — ${rub(totals.fixedSum)}, фиксированная стоимость`}
                </h3>
                <div className="mt-4 flex flex-col divide-y divide-fog rounded-card border border-fog">
                  {totals.fixed.map((cost) => (
                    <div key={cost.order} className="flex flex-col gap-1 p-4 tablet:flex-row tablet:justify-between tablet:gap-8">
                      <div>
                        <p className="text-body font-medium">{isEn ? cost.name_en : cost.name_ru}</p>
                        <p className="mt-1 text-body-sm text-stone">
                          {isEn ? cost.calculation_en : cost.calculation_ru}
                        </p>
                      </div>
                      <p className="shrink-0 font-mono text-body">{rub(cost.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totals.estimates.map((cost) => (
              <div key={cost.order} className="mt-6 rounded-card bg-warm-parchment p-4">
                <h3 className="text-heading-sm">
                  {isEn
                    ? `${cost.name_en} — about ${rub(cost.amount)}, paid separately`
                    : `${cost.name_ru} — около ${rub(cost.amount)}, оплачивается отдельно`}
                </h3>
                <p className="mt-1 text-body-sm text-stone">{isEn ? cost.calculation_en : cost.calculation_ru}</p>
                {cost.note && <p className="mt-1 text-body-sm text-ash">{cost.note}</p>}
              </div>
            ))}

            {days.length > 0 && (
              <p className="mt-6 max-w-2xl text-body-sm text-stone">
                {isEn
                  ? `The program covers ${days.length} days of visits. Accommodation and meals run one day longer: arrival the day before, departure after the program ends.`
                  : `Программа рассчитана на ${days.length} ${days.length === 1 ? "день" : "дней"} визитов. Проживание и питание — на сутки больше: заезд накануне, вылет после завершения.`}
              </p>
            )}
          </div>
        )}

        {/* 9. Преимущества маршрута */}
        {advantages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-heading-lg">{isEn ? "Route advantages" : "Преимущества маршрута"}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 tablet:grid-cols-2">
              {advantages.map((item) => (
                <p key={item.order} className="text-body text-stone">
                  {pick(item, isEn)}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* 10. Галерея и видео с прошлых поездок */}
        <MediaSlot src={tour.cover} caption={tour.galleryCaptions[0]} aspect="16/9" emptyBehavior="hidden" className="mt-16" />
        <MediaGallery photos={tour.gallery} captions={tour.galleryCaptions} className="mt-8 grid grid-cols-2 gap-4 tablet-lg:grid-cols-3" />

        {/* 11. Отзывы участников */}
        {testimonials.length > 0 && (
          <div className="mt-16">
            <h2 className="text-heading-lg">{isEn ? "Participant feedback" : "Отзывы участников"}</h2>
            <div className="mt-6 flex flex-col gap-4">
              {testimonials.map((item) => (
                <blockquote key={item.order} className="rounded-card bg-ink p-6 text-body text-canvas">
                  {pick(item, isEn)}
                </blockquote>
              ))}
            </div>
          </div>
        )}

        {/* 12. FAQ — пары с одинаковым order, незаполненные ответы не рендерятся */}
        {faq.length > 0 && (
          <div className="mt-16">
            <h2 className="text-heading-lg">{isEn ? "Questions and answers" : "Вопросы и ответы"}</h2>
            <div className="mt-6 flex flex-col gap-3">
              {faq.map(({ q, a }) => (
                <details key={q.order} className="rounded-card border border-fog bg-warm-parchment p-4">
                  <summary className="cursor-pointer text-body font-medium">{pick(q, isEn)}</summary>
                  <p className="mt-3 text-body text-stone">{pick(a, isEn)}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* 13. Форма регистрации */}
        <div id="register" className="mt-16 max-w-xl scroll-mt-8">
          <h2 className="mb-4 text-heading-lg">
            {isClosed
              ? isEn
                ? "Join the next trip"
                : "Записаться на следующую поездку"
              : isEn
                ? "Reserve a seat"
                : "Забронировать место"}
          </h2>
          <LeadForm
            label={isClosed ? "tour_waitlist" : `tour_${tour.id}`}
            fields={[
              { type: "text", name: "name", label: tForm("nameLabel") },
              { type: "text", name: "company", label: isEn ? "Company" : "Компания" },
              { type: "tel", name: "phone", label: tForm("phoneLabel") },
              { type: "email", name: "email", label: isEn ? "Email" : "Почта" },
            ]}
            hidden={{ tour: tour.id }}
            submitLabel={
              isClosed
                ? isEn
                  ? "Join the next trip"
                  : "Записаться на следующую поездку"
                : isEn
                  ? "Reserve a seat"
                  : "Забронировать место"
            }
            backHref="/tours"
            backLabel={isEn ? "Back to trips" : "Вернуться к поездкам"}
          />
        </div>
      </section>

      {/* Кнопка регистрации закреплена внизу на мобильных (раздел 8) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-fog bg-canvas p-3 tablet-lg:hidden">
        <a
          href="#register"
          className="block rounded-button bg-pure-black px-6 py-3 text-center text-body font-medium text-canvas"
        >
          {isClosed
            ? isEn
              ? "Join the next trip"
              : "Записаться на следующую поездку"
            : isEn
              ? "Reserve a seat"
              : "Забронировать место"}
        </a>
      </div>
    </>
  );
}
