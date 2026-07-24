import { pageAlternates } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { computeTourStats, getDaysForTour, getPublishedTours } from "@/lib/tours";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "Aura Robotics Tour",
    description:
      locale === "en"
        ? "Sourcing trips to China's robotics factories: closed visits, interpreters, technical expertise."
        : "Закупочные поездки по заводам робототехники Китая: закрытые визиты, перевод, техническая экспертиза.",
    alternates: pageAlternates(locale, "/tours"),
  };
}

export default async function ToursHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const tours = await getPublishedTours();
  const active = tours.filter((t) => t.status !== "прошла");
  const archive = tours.filter((t) => t.status === "прошла");

  const activeWithStats = await Promise.all(
    active.map(async (tour) => {
      const days = await getDaysForTour(tour.id);
      return { tour, stats: computeTourStats(tour, days) };
    }),
  );

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
      <p className="font-mono text-caption uppercase text-ash">Aura Robotics Tour</p>
      <h1 className="mt-2 text-display">
        {isEn ? "Business delegations to China's robotics factories" : "Бизнес-делегации на заводы робототехники Китая"}
      </h1>
      <p className="mt-4 max-w-2xl text-subheading text-stone">
        {isEn
          ? "Closed visits to companies you can't reach on your own — with interpreters and our engineers' technical expertise at every meeting."
          : "Закрытые визиты в компании, куда не попасть самостоятельно, — с переводом и технической экспертизой наших инженеров на каждой встрече."}
      </p>

      {activeWithStats.length > 0 && (
        <div className="mt-12 flex flex-col gap-6">
          {activeWithStats.map(({ tour, stats }) => (
            <Link
              key={tour.id}
              href={`/tours/${tour.id}`}
              className="rounded-card border border-ink bg-warm-parchment p-6 transition-transform hover:-translate-y-1 tablet:p-8"
            >
              <h2 className="text-heading">{isEn ? tour.title_en : tour.title_ru}</h2>
              <p className="mt-2 max-w-2xl text-body text-stone">{isEn ? tour.summary_en : tour.summary_ru}</p>
              <p className="mt-4 font-mono text-body-sm text-stone">
                {stats.cities} {isEn ? "cities" : "города"} · {stats.days} {isEn ? "days" : "дней"} ·{" "}
                {stats.companies} {isEn ? "companies" : "компаний"}
              </p>
              <p className="mt-1 font-mono text-body-sm text-ash">
                {tour.dateStart
                  ? tour.dateEnd
                    ? `${tour.dateStart} — ${tour.dateEnd}`
                    : tour.dateStart
                  : isEn
                    ? "dates being finalized"
                    : "даты формируются"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {archive.length > 0 && (
        <div className="mt-16">
          <h2 className="text-heading-sm">{isEn ? "Past trips" : "Прошедшие поездки"}</h2>
          <div className="mt-4 flex flex-col gap-3">
            {archive.map((tour) => (
              <Link
                key={tour.id}
                href={`/tours/${tour.id}`}
                className="rounded-card border border-fog p-4 text-body hover:bg-warm-parchment"
              >
                {isEn ? tour.title_en : tour.title_ru}
                <span className="ml-3 font-mono text-body-sm text-ash">{tour.cities.join(" · ")}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
