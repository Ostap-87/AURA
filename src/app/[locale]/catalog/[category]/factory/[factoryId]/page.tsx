import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCategoryById, getFactoryById } from "@/lib/catalog";
import { FactoryDetail } from "@/components/catalog/factory-detail";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageAlternates, productJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; factoryId: string }>;
}) {
  const { locale, category: categoryId, factoryId } = await params;
  const factory = await getFactoryById(factoryId);
  if (!factory) return {};
  // A factory listed under multiple categories (or also surfaced under
  // /production or /automation) gets one identical detail page per URL —
  // same title/description, different path. Canonicalize all of them to
  // the factory's first listed category so search engines don't see
  // duplicate content across those URLs; every URL still renders normally.
  const canonicalCategoryId = factory.categories[0] ?? categoryId;
  return {
    title: factory.name,
    description:
      locale === "en" && factory.description_en ? factory.description_en : factory.description_ru,
    alternates: pageAlternates(locale, `/catalog/${canonicalCategoryId}/factory/${factoryId}`),
  };
}

export default async function FactoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; factoryId: string }>;
}) {
  const { locale, category: categoryId, factoryId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "breadcrumbs" });

  const [category, factory] = await Promise.all([
    getCategoryById(categoryId),
    getFactoryById(factoryId),
  ]);

  if (!category || !factory || !factory.categories.includes(categoryId)) {
    notFound();
  }

  const categoryName = locale === "en" ? category.name_en : category.name_ru;

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 lg:px-10">
      <Breadcrumbs
        items={[
          { label: t("home"), href: "/" },
          { label: t("catalog"), href: "/catalog" },
          { label: categoryName, href: `/catalog/${category.id}` },
          { label: factory.name },
        ]}
      />
      <div className="mt-8">
        <FactoryDetail factory={factory} category={category} locale={locale} />
      </div>
      {/* Product с Offer на карточке завода (PROJECT.md, раздел 12); цены — из категории */}
      <JsonLd
        data={productJsonLd({
          locale,
          path: `/catalog/${categoryId}/factory/${factoryId}`,
          name: factory.name,
          description:
            locale === "en" && factory.description_en
              ? factory.description_en
              : factory.description_ru,
          image: factory.photos[0],
          priceFrom: category.priceMin,
          priceTo: category.priceMax,
        })}
      />
    </section>
  );
}
