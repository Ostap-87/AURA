import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { SupplierCard } from "@/components/shared/supplier-card";
import { Link } from "@/i18n/navigation";
import { formatPriceRange } from "@/lib/format";
import {
  getEquipmentCategory,
  getFactoriesByEquipment,
  getSubIndustryOptionsForEquipment,
} from "@/lib/production";
import { equipmentTypes } from "@/lib/reference-data";

export function generateStaticParams() {
  return equipmentTypes.map((equipment) => ({ equipment: equipment.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; equipment: string }>;
}) {
  const { locale, equipment: equipmentId } = await params;
  const equipment = equipmentTypes.find((e) => e.id === equipmentId);
  if (!equipment) return {};
  return { title: locale === "en" ? equipment.name_en : equipment.name_ru };
}

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ locale: string; equipment: string }>;
}) {
  const { locale, equipment: equipmentId } = await params;
  setRequestLocale(locale);
  const equipment = equipmentTypes.find((e) => e.id === equipmentId);
  if (!equipment) notFound();

  const t = await getTranslations({ locale, namespace: "production" });
  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  const tBreadcrumbs = await getTranslations({ locale, namespace: "breadcrumbs" });
  const tForm = await getTranslations({ locale, namespace: "form" });

  const [category, factories, subIndustryOptions] = await Promise.all([
    getEquipmentCategory(equipment.id),
    getFactoriesByEquipment(equipment.id),
    getSubIndustryOptionsForEquipment(equipment.id),
  ]);

  const name = locale === "en" ? equipment.name_en : equipment.name_ru;

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-10 lg:px-10">
      <Breadcrumbs
        items={[
          { label: tBreadcrumbs("home"), href: "/" },
          { label: tBreadcrumbs("production"), href: "/production" },
          { label: name },
        ]}
      />
      <h1 className="mt-4 text-display">{name}</h1>
      {category && (locale === "en" ? category.description_en : category.description_ru) && (
        <p className="mt-4 max-w-2xl text-subheading text-stone">
          {locale === "en" && category.description_en ? category.description_en : category.description_ru}
        </p>
      )}

      {category && (
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
      )}

      {subIndustryOptions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-heading-sm">{t("relatedIndustriesTitle")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {subIndustryOptions.map((sub) => (
              <Link
                key={sub.id}
                href={`/production/${sub.id}/${equipment.id}`}
                className="rounded-chip border border-ink px-4 py-2 text-body-sm hover:bg-warm-parchment"
              >
                {locale === "en" ? sub.name_en : sub.name_ru}
              </Link>
            ))}
          </div>
        </div>
      )}

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
              <SupplierCard key={factory.id} factory={factory} locale={locale} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 max-w-xl">
        <h2 className="mb-4 text-heading-sm">{tForm("automateLabel")}</h2>
        <LeadForm
          label="production_request"
          fields={[
            { type: "text", name: "name", label: tForm("nameLabel") },
            { type: "tel", name: "phone", label: tForm("phoneLabel") },
            { type: "textarea", name: "task", label: tForm("automateLabel") },
          ]}
          hidden={{ equipment: equipment.id }}
          submitLabel={tForm("submitRequestQuote")}
          backHref="/production"
          backLabel={tForm("successBackProduction")}
        />
      </div>
    </section>
  );
}
