import { pageAlternates } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MediaSlot } from "@/components/media/media-slot";
import { Reveal } from "@/components/motion/reveal";
import { Ticker } from "@/components/motion/ticker";
import { SupplierCard } from "@/components/shared/supplier-card";
import { CountUp } from "@/components/quiz/count-up";
import { LeadForm } from "@/components/forms/lead-form";
import { LinkButton } from "@/components/ui/button";
import { getConsulting, getFactories, getTours } from "@/lib/data";
import { getHeroMedia } from "@/lib/hero-media";
import { HeroBackground } from "@/components/home/hero-background";
import { deliverySteps } from "@/lib/content/delivery";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Aura Robotics — robotics direct from Chinese factories" : "Aura Robotics — робототехника напрямую с китайских заводов",
    description:
      locale === "en"
        ? "Robots, production equipment and sourcing trips. 15–30% below suppliers with a Russian importer's markup."
        : "Роботы, оборудование для производств и закупочные поездки. На 15–30% дешевле поставщиков с наценкой российского импортёра.",
    alternates: pageAlternates(locale, "/"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const tForm = await getTranslations({ locale, namespace: "form" });

  const [factories, tours, consulting] = await Promise.all([
    getFactories(),
    getTours(),
    getConsulting(),
  ]);

  const hero = getHeroMedia();
  // Тёмный вариант хиро включается появлением видео или постера в public/media
  const heroDark = Boolean(hero.video || hero.poster);

  const published = factories.filter((f) => f.published);
  const featured = published.filter((f) => f.featured).slice(0, 3);
  const cityCount = new Set(
    published.flatMap((f) => (f.city ?? "").split(",").map((c) => c.trim()).filter(Boolean)),
  ).size;
  const activeTour = tours.find((t) => t.published && t.status !== "прошла");
  const hasConsulting = consulting.some((c) => c.published);

  const directions = [
    {
      href: "/catalog",
      title: isEn ? "Robots" : "Роботы",
      text: isEn
        ? "A catalog organized by manufacturer: humanoids, cobots, AGVs, welding and industrial robots."
        : "Каталог по заводам-производителям: гуманоиды, коботы, AGV, сварочные и промышленные роботы.",
    },
    {
      href: "/production",
      title: isEn ? "Production equipment" : "Оборудование для производств",
      text: isEn
        ? "Food processing and adjacent industries: lines, central kitchens, packaging, washing."
        : "Пищепром и смежные отрасли: линии, центральные кухни, фасовка, мойка.",
    },
    {
      href: "/tours",
      title: "Aura Robotics Tour",
      text: isEn
        ? "Sourcing trips to Chinese factories: closed visits, interpreters, our engineers at your side."
        : "Закупочные поездки по китайским заводам: закрытые визиты, перевод, наши инженеры рядом.",
    },
    ...(hasConsulting
      ? [
          {
            href: "/consulting",
            title: isEn ? "Consulting" : "Консалтинг",
            text: isEn
              ? "Automation audits and selection support."
              : "Аудит автоматизации и сопровождение выбора.",
          },
        ]
      : []),
  ];

  const whyCheaper = [
    {
      title: isEn ? "We buy at the factory" : "Закупаем на заводе",
      text: isEn
        ? "Directly from the manufacturer under a foreign trade contract — no warehouse, no showroom, no importer in the chain."
        : "Напрямую у производителя по внешнеторговому контракту — без склада, шоурума и импортёра в цепочке.",
    },
    {
      title: isEn ? "Import goes to your company" : "Ввоз — на вашу компанию",
      text: isEn
        ? "That's what removes the markup. No import experience? We support the paperwork at every step."
        : "Именно это убирает наценку. Нет опыта ВЭД — сопровождаем оформление на каждом шаге.",
    },
    {
      title: isEn ? "Evidence instead of promises" : "Доказательства вместо обещаний",
      text: isEn
        ? "Photos and videos from the factory floor, and a test run of your exact unit with the serial number in frame."
        : "Фото и видео из цехов и тестовый прогон именно вашего экземпляра с серийным номером в кадре.",
    },
  ];

  return (
    <>
      {/* Хиро: светлая секция со слотом-чертежом; при наличии видео/постера
          в public/media — тёмная, с фоновым видео и белым текстом */}
      <section className={heroDark ? "relative bg-ink text-canvas" : undefined}>
        {heroDark && (
          <HeroBackground webm={hero.video?.webm} mp4={hero.video?.mp4} poster={hero.poster} />
        )}
        <div
          className={`relative mx-auto flex max-w-(--container-page) flex-col gap-10 px-5 py-16 lg:flex-row lg:items-center lg:gap-16 lg:px-10 ${
            heroDark ? "lg:min-h-[72vh] lg:py-28" : "lg:py-24"
          }`}
        >
        <div className={`flex flex-col gap-6 ${heroDark ? "max-w-2xl" : "lg:w-1/2"}`}>
          <h1 className="text-display-xl">
            {isEn ? "Robotics direct from Chinese factories" : "Робототехника напрямую с китайских заводов"}
          </h1>
          <p className={`text-subheading ${heroDark ? "text-fog" : "text-stone"}`}>
            {isEn ? (
              <>
                Robots, production equipment and sourcing trips.{" "}
                <mark className="hero-mark">15–30% below</mark> suppliers with a Russian
                importer&apos;s markup — because there is no importer.
              </>
            ) : (
              <>
                Роботы, оборудование для производств и закупочные поездки.{" "}
                <mark className="hero-mark">На 15–30% дешевле</mark> поставщиков с наценкой
                российского импортёра — потому что импортёра в цепочке нет.
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            {heroDark ? (
              <>
                <Link
                  href="/quiz"
                  className="inline-block rounded-button bg-canvas px-6 py-3 text-center text-body font-medium text-ink"
                >
                  {isEn ? "Match a solution" : "Подобрать решение"}
                </Link>
                <Link
                  href="/catalog"
                  className="inline-block rounded-button border border-canvas px-6 py-3 text-center text-body font-medium text-canvas"
                >
                  {isEn ? "Browse the catalog" : "Смотреть каталог"}
                </Link>
              </>
            ) : (
              <>
                <LinkButton href="/quiz">{isEn ? "Match a solution" : "Подобрать решение"}</LinkButton>
                <LinkButton href="/catalog" variant="secondary">
                  {isEn ? "Browse the catalog" : "Смотреть каталог"}
                </LinkButton>
              </>
            )}
          </div>
        </div>
        {!heroDark && (
          <div className="lg:w-1/2">
            <MediaSlot
              aspect="4/3"
              emptyBehavior="placeholder"
              placeholderLabel={isEn ? "Factory footage — in production" : "Съёмка с производств — в подготовке"}
            />
          </div>
        )}
        </div>
      </section>

      {/* Направления — парчмент */}
      <section className="bg-warm-parchment">
        <div className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
          <h2 className="text-heading-lg">{isEn ? "What we do" : "Чем мы занимаемся"}</h2>
          <Reveal cascade className="mt-8 grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {directions.map((direction) => (
              <Link
                key={direction.href}
                href={direction.href}
                className="group rounded-card border border-ink bg-canvas p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                <h3 className="text-heading-sm">{direction.title}</h3>
                <p className="mt-2 text-body-sm text-stone">{direction.text}</p>
                <span
                  aria-hidden
                  className="mt-4 inline-block font-mono text-body transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Тёмная полоса — цитата и счётчики */}
      <section className="bg-ink text-canvas">
        <div className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
          {/* На экране два анимированных элемента: появление цитаты и счётчики */}
          <Reveal>
            <p className="max-w-3xl text-heading">
              {isEn
                ? "More than half of all industrial robots in the world are installed in China."
                : "Более половины всех промышленных роботов в мире устанавливается в Китае."}
            </p>
            <p className="mt-3 max-w-2xl text-body text-fog">
              {isEn
                ? "We work where they are made — and bring them out at the factory price."
                : "Мы работаем там, где их производят, — и привозим по заводской цене."}
            </p>
          </Reveal>
          {published.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-x-16 gap-y-6">
              <div>
                <p className="font-mono text-heading-lg">
                  <CountUp value={published.length} />
                </p>
                <p className="mt-1 text-body-sm text-fog">{isEn ? "factories in the base" : "заводов в базе"}</p>
              </div>
              <div>
                <p className="font-mono text-heading-lg">
                  <CountUp value={cityCount} />
                </p>
                <p className="mt-1 text-body-sm text-fog">{isEn ? "cities in China" : "городов Китая"}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Бегущая строка: заводы и города из базы — живая, но документальная */}
      {published.length > 0 && (
        <div className="border-b border-fog py-3 font-mono text-caption uppercase text-stone">
          <Ticker
            items={published.map((f) => {
              const city = f.city?.split(",")[0]?.trim();
              return city ? `${f.name} — ${city}` : f.name;
            })}
          />
        </div>
      )}

      {/* Почему с нами дешевле — белая секция */}
      <section className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
        <h2 className="text-heading-lg">{isEn ? "Why it's cheaper with us" : "Почему с нами дешевле"}</h2>
        <Reveal cascade className="mt-8 grid grid-cols-1 gap-8 tablet:grid-cols-3">
          {whyCheaper.map((item, index) => (
            <div key={item.title}>
              <p className="font-mono text-caption text-ash">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-heading-sm">{item.title}</h3>
              <p className="mt-2 text-body-sm text-stone">{item.text}</p>
            </div>
          ))}
        </Reveal>
        <div className="mt-8 flex flex-wrap gap-4 text-body">
          <Link href="/payment" className="underline underline-offset-4 hover:text-stone">
            {isEn ? "Delivery and payment" : "Доставка и оплата"}
          </Link>
          <Link href="/delivery" className="underline underline-offset-4 hover:text-stone">
            {isEn ? "How delivery works" : "Как проходит поставка"}
          </Link>
        </div>
      </section>

      {/* Рекомендуемые заводы */}
      {featured.length > 0 && (
        <section className="bg-warm-parchment">
          <div className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-heading-lg">{isEn ? "Factories we work with" : "Заводы, с которыми работаем"}</h2>
              <Link href="/catalog" className="text-body underline underline-offset-4 hover:text-stone">
                {isEn ? "Browse the catalog" : "Смотреть каталог"}
              </Link>
            </div>
            <Reveal cascade className="mt-8 grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
              {featured.map((factory) => (
                <SupplierCard key={factory.id} factory={factory} locale={locale} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* Жёлтый акцентный блок — квиз */}
      <section className="bg-accent">
        <div className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
          <Reveal>
            <h2 className="max-w-2xl text-heading-lg text-ink">
              {isEn
                ? "Find out in a minute what a robot will cost — and when it pays back"
                : "За минуту узнайте, сколько стоит робот под вашу задачу — и когда он окупится"}
            </h2>
            <p className="mt-3 max-w-xl text-body text-ink">
              {isEn
                ? "Four questions, an estimate before you leave any contacts."
                : "Четыре вопроса, расчёт — до того, как вы оставите контакты."}
            </p>
            <div className="mt-6">
              <LinkButton href="/quiz">{isEn ? "Calculate payback" : "Посчитать окупаемость"}</LinkButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Тизер тура — если есть активная поездка */}
      {activeTour && (
        <section className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
          <p className="font-mono text-caption uppercase text-ash">Aura Robotics Tour</p>
          <h2 className="mt-2 text-heading-lg">{isEn ? activeTour.title_en : activeTour.title_ru}</h2>
          <p className="mt-3 max-w-2xl text-body text-stone">
            {isEn ? activeTour.summary_en : activeTour.summary_ru}
          </p>
          <p className="mt-3 font-mono text-body-sm text-stone">
            {activeTour.cities.join(" · ")}
            {" — "}
            {activeTour.dateStart
              ? activeTour.dateStart
              : isEn
                ? "dates being finalized, leave a request"
                : "даты формируются, оставьте заявку"}
          </p>
          <div className="mt-6">
            <LinkButton href="/tours" variant="secondary">
              {isEn ? "See the trip program" : "Смотреть программу поездки"}
            </LinkButton>
          </div>
        </section>
      )}

      {/* Финальная форма */}
      <section className="border-t border-fog">
        <div className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
          <div className="grid grid-cols-1 gap-10 tablet-lg:grid-cols-2">
            <div>
              <h2 className="text-heading-lg">{isEn ? "Describe your task" : "Опишите задачу"}</h2>
              <p className="mt-3 max-w-md text-body text-stone">
                {isEn
                  ? "We'll match a factory and a model, and come back with a quote and lead time."
                  : "Подберём завод и модель, вернёмся с расчётом и сроком поставки."}
              </p>
              <ol className="mt-6 flex flex-col gap-2 text-body-sm text-stone">
                {deliverySteps.slice(0, 3).map((step, index) => (
                  <li key={step.id} className="flex gap-3">
                    <span className="font-mono text-caption text-ash">{String(index + 1).padStart(2, "0")}</span>
                    {isEn ? step.title_en : step.title_ru}
                  </li>
                ))}
              </ol>
            </div>
            <div className="max-w-xl">
              <LeadForm
                label="home_request"
                fields={[
                  { type: "text", name: "name", label: tForm("nameLabel") },
                  { type: "tel", name: "phone", label: tForm("phoneLabel") },
                  { type: "textarea", name: "task", label: tForm("taskLabel"), placeholder: tForm("taskPlaceholder") },
                ]}
                submitLabel={tForm("submitGetQuote")}
                backHref="/catalog"
                backLabel={tForm("successBackCatalog")}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
