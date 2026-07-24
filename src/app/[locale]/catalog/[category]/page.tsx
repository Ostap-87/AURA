import { pageAlternates } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { LinkButton } from "@/components/ui/button";
import {
  computeCategoryMetrics,
  filterFactories,
  getCategoryById,
  getFactoriesForCategory,
  getIndustryFilterOptions,
  getLeadTimeFilterOptions,
  getPublishedCategories,
} from "@/lib/catalog";
import { formatPriceRange } from "@/lib/format";
import { industryTagLabelMap } from "@/lib/industry-tags";
import { getActiveTourBadge, tourBadgeText } from "@/lib/tours";
import { CatalogFilters } from "@/components/catalog/filters";
import { CompareProvider } from "@/components/catalog/compare-context";
import { FactoryCard } from "@/components/catalog/factory-card";
import { CompareBar } from "@/components/catalog/compare-bar";

export async function generateStaticParams() {
  const categories = await getPublishedCategories("robots");
  return categories.map((category) => ({ category: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: categoryId } = await params;
  const category = await getCategoryById(categoryId);
  if (!category) return {};
  return {
    title: locale === "en" ? category.name_en : category.name_ru,
    description: locale === "en" && category.description_en ? category.description_en : category.description_ru,
    alternates: pageAlternates(locale, `/catalog/${categoryId}`),
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{ industry?: string; leadtime?: string }>;
}) {
  const { locale, category: categoryId } = await params;
  const query = await searchParams;
  setRequestLocale(locale);

  const category = await getCategoryById(categoryId);
  if (!category || category.segment !== "robots") notFound();

  const t = await getTranslations({ locale, namespace: "catalog" });
  const tBreadcrumbs = await getTranslations({ locale, namespace: "breadcrumbs" });

  const allFactories = await getFactoriesForCategory(category.id);
  const metrics = computeCategoryMetrics(category, allFactories);
  const activeTour = await getActiveTourBadge();
  const badgeFor = (factoryId: string) =>
    activeTour && activeTour.companyIds.has(factoryId)
      ? tourBadgeText(activeTour.tour, locale)
      : undefined;

  const industries = query.industry?.split(",").filter(Boolean) ?? [];
  const leadTimes = query.leadtime?.split(",").filter(Boolean) ?? [];
  const filtered = filterFactories(allFactories, { industries, leadTimes });

  const featured = filtered.filter((f) => f.featured);
  const compact = filtered.filter((f) => !f.featured);

  const industryOptions = getIndustryFilterOptions(allFactories, industryTagLabelMap(locale));
  const leadTimeOptions = getLeadTimeFilterOptions(allFactories);

  const categoryName = locale === "en" ? category.name_en : category.name_ru;
  const description = locale === "en" && category.description_en ? category.description_en : category.description_ru;

  return (
    <CompareProvider>
      <section className="mx-auto max-w-(--container-page) px-5 pb-24 pt-10 lg:px-10">
        <Breadcrumbs
          items={[
            { label: tBreadcrumbs("home"), href: "/" },
            { label: tBreadcrumbs("catalog"), href: "/catalog" },
            { label: categoryName },
          ]}
        />

        <h1 className="mt-4 text-display">{categoryName}</h1>
        {description && <p className="mt-4 max-w-2xl text-subheading text-stone">{description}</p>}

        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 rounded-card bg-warm-parchment p-4">
          <div>
            <p className="text-caption uppercase text-ash">{t("metricsPrice")}</p>
            <p className="font-mono text-body">{formatPriceRange(metrics.priceMin, metrics.priceMax, locale)}</p>
          </div>
          <div>
            <p className="text-caption uppercase text-ash">{t("metricsLeadTime")}</p>
            <p className="font-mono text-body">{metrics.leadTime}</p>
          </div>
          <div>
            <p className="text-caption uppercase text-ash">{t("metricsFactories")}</p>
            <p className="font-mono text-body">{metrics.factoryCount}</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 tablet-lg:grid-cols-[240px_1fr]">
          <aside>
            <CatalogFilters
              industryOptions={industryOptions}
              leadTimeOptions={leadTimeOptions}
              resultCount={filtered.length}
            />
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div className="rounded-card border border-fog bg-warm-parchment p-8 text-center">
                <p className="text-heading-sm">{t("noResultsTitle")}</p>
                <p className="mt-2 text-body text-stone">{t("noResultsText")}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <LinkButton href={`/catalog/${category.id}`} variant="secondary">
                    {t("noResultsReset")}
                  </LinkButton>
                  <LinkButton href="/contacts">{t("noResultsLead")}</LinkButton>
                </div>
              </div>
            ) : (
              <>
                {featured.length > 0 && (
                  <div className="mb-10">
                    <h2 className="mb-4 text-heading-sm">{t("featuredTitle")}</h2>
                    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
                      {featured.map((factory) => (
                        <FactoryCard key={factory.id} factory={factory} categoryId={category.id} featured tourBadge={badgeFor(factory.id)} />
                      ))}
                    </div>
                  </div>
                )}
                {compact.length > 0 && (
                  <div>
                    {featured.length > 0 && <h2 className="mb-4 text-heading-sm">{t("allFactoriesTitle")}</h2>}
                    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
                      {compact.map((factory) => (
                        <FactoryCard key={factory.id} factory={factory} categoryId={category.id} tourBadge={badgeFor(factory.id)} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-16 max-w-2xl">
          <h2 className="text-heading-sm">{t("howToChooseTitle")}</h2>
          <ul className="mt-4 flex flex-col gap-3 text-body text-stone">
            <li>{t("howToChoose1")}</li>
            <li>{t("howToChoose2")}</li>
            <li>{t("howToChoose3")}</li>
            <li>{t("howToChoose4")}</li>
          </ul>
        </div>

        <CompareBar factories={allFactories} />
      </section>
    </CompareProvider>
  );
}
