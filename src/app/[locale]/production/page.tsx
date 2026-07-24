import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFactoriesForCategory, getPublishedCategories } from "@/lib/catalog";
import { formatPriceRange } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "production" });
  return { title: t("hubTitle"), description: t("hubDescription") };
}

export default async function ProductionHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("production");
  const tCatalog = await getTranslations("catalog");

  const categories = await getPublishedCategories("production");
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => ({
      category,
      factoryCount: (await getFactoriesForCategory(category.id)).length,
    })),
  );

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
      <h1 className="text-display">{t("hubTitle")}</h1>
      <p className="mt-4 max-w-2xl text-subheading text-stone">{t("hubDescription")}</p>

      {categoriesWithCounts.length === 0 ? (
        <div className="mt-16 rounded-card border border-fog bg-warm-parchment p-8 text-center">
          <p className="text-heading-sm">{tCatalog("hubEmptyTitle")}</p>
          <p className="mt-2 text-body text-stone">{tCatalog("hubEmptyText")}</p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {categoriesWithCounts.map(({ category, factoryCount }) => (
            <Link
              key={category.id}
              href={`/production/equipment/${category.id}`}
              className="rounded-card border border-ink bg-warm-parchment p-6 transition-transform hover:-translate-y-1"
            >
              <h2 className="text-heading-sm">
                {locale === "en" ? category.name_en : category.name_ru}
              </h2>
              <p className="mt-2 text-body-sm text-stone">
                {formatPriceRange(category.priceMin, category.priceMax, locale)}
              </p>
              <p className="mt-1 font-mono text-caption text-ash">
                {tCatalog("metricsFactories")}: {factoryCount}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
