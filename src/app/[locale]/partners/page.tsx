import { Reveal } from "@/components/motion/reveal";
import { pageAlternates } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { MediaSlot } from "@/components/media/media-slot";
import { getFactories } from "@/lib/data";
import { industryTagLabel } from "@/lib/industry-tags";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Partners and R&D" : "Партнёры и R&D",
    description:
      locale === "en"
        ? "The ecosystem behind the catalog: component suppliers, research centers, and technology developers."
        : "Экосистема вокруг каталога: поставщики компонентов, исследовательские центры и разработчики технологий.",
    alternates: pageAlternates(locale, "/partners"),
  };
}

/**
 * Экосистемные компании — те, кто не продаёт готовых роботов конечному
 * заказчику: компоненты, контроллеры, исследовательские центры
 * (PROJECT.md 5.9). Определяются по данным: категории components/
 * controllers или исследовательский профиль, при этом завод не помечен
 * featured (featured — это активные продавцы каталога, им не место на
 * странице «без кнопки запросить расчёт»).
 */
function isEcosystem(categories: string[], industryTags: string[], featured: boolean): boolean {
  if (featured) return false;
  return (
    categories.includes("components") ||
    categories.includes("controllers") ||
    (industryTags.includes("research") && !categories.includes("humanoid"))
  );
}

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  const factories = (await getFactories()).filter(
    (f) => f.published && isEcosystem(f.categories, f.industries, f.featured),
  );

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
      <h1 className="text-display">{isEn ? "Partners and R&D" : "Партнёры и R&D"}</h1>
      <p className="mt-4 max-w-2xl text-subheading text-stone">
        {isEn
          ? "Not every company in China's robotics industry sells finished robots. This page is about the ecosystem the catalog stands on: component and gripper makers, controller and navigation software developers, national research centers."
          : "Не все компании в китайской робототехнике продают готовых роботов. Эта страница — про экосистему, на которой стоит каталог: производители компонентов и захватов, разработчики контроллеров и навигационного ПО, национальные исследовательские центры."}
      </p>

      {factories.length > 0 && (
        <Reveal cascade className="mt-12 grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {factories.map((factory) => {
            const description =
              isEn && factory.description_en ? factory.description_en : factory.description_ru;
            return (
              <article key={factory.id} className="rounded-card border border-fog bg-warm-parchment p-6">
                <MediaSlot
                  src={factory.photos[0]}
                  caption={factory.photoCaptions[0]}
                  aspect="4/3"
                  emptyBehavior="hidden"
                  className="mb-4"
                />
                <h2 className="text-heading-sm">{factory.name}</h2>
                {factory.nameZh && <p className="font-mono text-caption text-ash">{factory.nameZh}</p>}
                <p className="mt-1 text-body-sm text-stone">
                  {factory.city ? `${factory.city}, ` : ""}
                  {factory.country}
                </p>
                <p className="mt-3 text-body-sm text-stone">{description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {factory.industries.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-chip border border-fog px-3 py-1 text-caption text-stone">
                      {industryTagLabel(tag, locale)}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </Reveal>
      )}
    </section>
  );
}
