import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { SupplierCard } from "@/components/shared/supplier-card";
import { getIntersectionFactories, getIntersectionParams } from "@/lib/production";
import { equipmentTypes, subIndustries } from "@/lib/reference-data";

export async function generateStaticParams() {
  return getIntersectionParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; industry: string; equipment: string }>;
}) {
  const { locale, industry, equipment: equipmentId } = await params;
  const sub = subIndustries.find((s) => s.id === industry);
  const equipment = equipmentTypes.find((e) => e.id === equipmentId);
  if (!sub || !equipment) return {};
  const subName = locale === "en" ? sub.name_en : sub.name_ru;
  const equipmentName = locale === "en" ? equipment.name_en : equipment.name_ru;
  return { title: `${equipmentName} — ${subName}` };
}

export default async function ProductionIntersectionPage({
  params,
}: {
  params: Promise<{ locale: string; industry: string; equipment: string }>;
}) {
  const { locale, industry, equipment: equipmentId } = await params;
  setRequestLocale(locale);

  const sub = subIndustries.find((s) => s.id === industry);
  const equipment = equipmentTypes.find((e) => e.id === equipmentId);
  if (!sub || !equipment) notFound();

  const factories = await getIntersectionFactories(sub.id, equipment.id);
  // Страницы пересечений существуют только там, где есть реальные данные (PROJECT.md, раздел 4).
  if (factories.length === 0) notFound();

  const t = await getTranslations({ locale, namespace: "production" });
  const tBreadcrumbs = await getTranslations({ locale, namespace: "breadcrumbs" });
  const tForm = await getTranslations({ locale, namespace: "form" });

  const subName = locale === "en" ? sub.name_en : sub.name_ru;
  const equipmentName = locale === "en" ? equipment.name_en : equipment.name_ru;

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-10 lg:px-10">
      <Breadcrumbs
        items={[
          { label: tBreadcrumbs("home"), href: "/" },
          { label: tBreadcrumbs("production"), href: "/production" },
          { label: subName, href: `/production/${sub.id}` },
          { label: equipmentName },
        ]}
      />
      <h1 className="mt-4 text-display">
        {equipmentName} — {subName}
      </h1>

      <p className="mt-4 max-w-2xl text-body text-stone">{t("hygieneNote")}</p>

      <div className="mt-10">
        <h2 className="mb-4 text-heading-sm">{t("suppliersTitle")}</h2>
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {factories.map((factory) => (
            <SupplierCard key={factory.id} factory={factory} locale={locale} />
          ))}
        </div>
      </div>

      <div className="mt-16 max-w-xl">
        <h2 className="mb-4 text-heading-sm">{tForm("automateLabel")}</h2>
        <LeadForm
          label="production_request"
          fields={[
            { type: "text", name: "name", label: tForm("nameLabel") },
            { type: "tel", name: "phone", label: tForm("phoneLabel") },
            { type: "textarea", name: "task", label: tForm("automateLabel") },
          ]}
          hidden={{ subIndustry: sub.id, equipment: equipment.id }}
          submitLabel={tForm("submitRequestQuote")}
          backHref={`/production/${sub.id}`}
          backLabel={tForm("successBackProduction")}
        />
      </div>
    </section>
  );
}
