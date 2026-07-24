import { pageAlternates } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { SupplierCard } from "@/components/shared/supplier-card";
import { Link } from "@/i18n/navigation";
import { getEquipmentOptionsForSubIndustry, getFactoriesBySubIndustry } from "@/lib/production";
import { subIndustries } from "@/lib/reference-data";

export function generateStaticParams() {
  return subIndustries.map((sub) => ({ industry: sub.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; industry: string }>;
}) {
  const { locale, industry } = await params;
  const sub = subIndustries.find((s) => s.id === industry);
  if (!sub) return {};
  return {
    title: locale === "en" ? sub.name_en : sub.name_ru,
    alternates: pageAlternates(locale, `/production/${industry}`),
  };
}

export default async function SubIndustryPage({
  params,
}: {
  params: Promise<{ locale: string; industry: string }>;
}) {
  const { locale, industry } = await params;
  setRequestLocale(locale);
  const sub = subIndustries.find((s) => s.id === industry);
  if (!sub) notFound();

  const t = await getTranslations({ locale, namespace: "production" });
  const tBreadcrumbs = await getTranslations({ locale, namespace: "breadcrumbs" });
  const tForm = await getTranslations({ locale, namespace: "form" });

  const factories = await getFactoriesBySubIndustry(sub.id);
  const equipmentOptions = await getEquipmentOptionsForSubIndustry(sub.id);
  const name = locale === "en" ? sub.name_en : sub.name_ru;

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

      {equipmentOptions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-heading-sm">{t("relatedEquipmentTitle")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {equipmentOptions.map((equipment) => (
              <Link
                key={equipment.id}
                href={`/production/${sub.id}/${equipment.id}`}
                className="rounded-chip border border-ink px-4 py-2 text-body-sm hover:bg-warm-parchment"
              >
                {locale === "en" ? equipment.name_en : equipment.name_ru}
              </Link>
            ))}
          </div>
        </div>
      )}

      {factories.length === 0 ? (
        <div className="mt-10 rounded-card border border-fog bg-warm-parchment p-8 text-center">
          <p className="text-heading-sm">{t("subIndustryEmptyTitle")}</p>
          <p className="mt-2 text-body text-stone">{t("subIndustryEmptyText")}</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {factories.map((factory) => (
            <SupplierCard key={factory.id} factory={factory} locale={locale} />
          ))}
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
          hidden={{ subIndustry: sub.id }}
          submitLabel={tForm("submitRequestQuote")}
          backHref="/production"
          backLabel={tForm("successBackProduction")}
        />
      </div>
    </section>
  );
}
