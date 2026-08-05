import { pageAlternates } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { SupplierCard } from "@/components/shared/supplier-card";
import { formatPriceRange } from "@/lib/format";
import { getCategoryById, getFactoriesForCategory, getPublishedCategories } from "@/lib/catalog";

export async function generateStaticParams() {
  const categories = await getPublishedCategories("automation");
  return categories.map((category) => ({ category: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: categoryId } = await params;
  const category = await getCategoryById(categoryId);
  if (!category || category.segment !== "automation") return {};
  const name = locale === "en" ? category.name_en : category.name_ru;
  return {
    title: name,
    description:
      locale === "en"
        ? `${name} suppliers among vetted Chinese factories: specifications, pricing and lead times.`
        : `Заводы-поставщики оборудования «${name}» в Китае: характеристики, цены, сроки поставки.`,
    alternates: pageAlternates(locale, `/automation/${categoryId}`),
  };
}

export default async function AutomationCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: categoryId } = await params;
  setRequestLocale(locale);
  const category = await getCategoryById(categoryId);
  if (!category || category.segment !== "automation") notFound();

  const t = await getTranslations({ locale, namespace: "automation" });
  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  const tBreadcrumbs = await getTranslations({ locale, namespace: "breadcrumbs" });
  const tForm = await getTranslations({ locale, namespace: "form" });

  const factories = await getFactoriesForCategory(category.id);
  const name = locale === "en" ? category.name_en : category.name_ru;

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-10 lg:px-10">
      <Breadcrumbs
        items={[
          { label: tBreadcrumbs("home"), href: "/" },
          { label: tBreadcrumbs("automation"), href: "/automation" },
          { label: name },
        ]}
      />
      <h1 className="mt-4 text-display">{name}</h1>
      {(locale === "en" ? category.description_en : category.description_ru) && (
        <p className="mt-4 max-w-2xl text-subheading text-stone">
          {locale === "en" && category.description_en ? category.description_en : category.description_ru}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 rounded-card bg-warm-parchment p-4">
        <div>
          <p className="text-caption uppercase text-ash">{tCatalog("metricsPrice")}</p>
          <p className="font-mono text-body">{formatPriceRange(category.priceMin, category.priceMax, locale)}</p>
        </div>
        <div>
          <p className="text-caption uppercase text-ash">{tCatalog("metricsLeadTime")}</p>
          <p className="font-mono text-body">{category.leadTime}</p>
        </div>
      </div>

      {factories.length === 0 ? (
        <div className="mt-10 rounded-card border border-fog bg-warm-parchment p-8 text-center">
          <p className="text-heading-sm">{t("equipmentEmptyTitle")}</p>
          <p className="mt-2 text-body text-stone">{t("equipmentEmptyText")}</p>
        </div>
      ) : (
        <div className="mt-10">
          <h2 className="mb-4 text-heading-sm">{t("suppliersTitle")}</h2>
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {factories.map((factory) => (
              <SupplierCard
                key={factory.id}
                factory={factory}
                locale={locale}
                href={`/automation/factory/${factory.id}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 max-w-xl">
        <h2 className="mb-4 text-heading-sm">{tForm("automateLabel")}</h2>
        <LeadForm
          label="automation_request"
          fields={[
            { type: "text", name: "name", label: tForm("nameLabel") },
            { type: "tel", name: "phone", label: tForm("phoneLabel") },
            { type: "textarea", name: "task", label: tForm("automateLabel") },
          ]}
          hidden={{ category: category.id }}
          submitLabel={tForm("submitRequestQuote")}
          backHref="/automation"
          backLabel={tForm("successBackAutomation")}
        />
      </div>
    </section>
  );
}
