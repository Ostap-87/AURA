import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { LinkButton } from "@/components/ui/button";
import { LeadForm } from "@/components/forms/lead-form";
import { SupplierCard } from "@/components/shared/supplier-card";
import { industriesContent } from "@/lib/content/industries-content";
import { industries } from "@/lib/reference-data";
import { getFactories } from "@/lib/data";

export function generateStaticParams() {
  return industries.map((industry) => ({ industry: industry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; industry: string }>;
}) {
  const { locale, industry: industryId } = await params;
  const industry = industries.find((i) => i.id === industryId);
  const content = industriesContent.find((c) => c.id === industryId);
  if (!industry || !content) return {};
  return {
    title: locale === "en" ? industry.name_en : industry.name_ru,
    description: locale === "en" ? content.intro_en : content.intro_ru,
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ locale: string; industry: string }>;
}) {
  const { locale, industry: industryId } = await params;
  setRequestLocale(locale);

  const industry = industries.find((i) => i.id === industryId);
  const content = industriesContent.find((c) => c.id === industryId);
  if (!industry || !content) notFound();

  const tBreadcrumbs = await getTranslations({ locale, namespace: "breadcrumbs" });
  const tForm = await getTranslations({ locale, namespace: "form" });
  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  const isEn = locale === "en";

  const factories = (await getFactories()).filter(
    (f) => f.published && f.industries.some((tag) => content.factoryTags.includes(tag)),
  );
  const featured = factories.filter((f) => f.featured).slice(0, 6);
  const shown = featured.length > 0 ? featured : factories.slice(0, 6);

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-10 lg:px-10">
      <Breadcrumbs
        items={[
          { label: tBreadcrumbs("home"), href: "/" },
          { label: tBreadcrumbs("industries") },
          { label: isEn ? industry.name_en : industry.name_ru },
        ]}
      />
      <h1 className="mt-4 text-display">{isEn ? industry.name_en : industry.name_ru}</h1>
      <p className="mt-4 max-w-2xl text-subheading text-stone">{isEn ? content.intro_en : content.intro_ru}</p>

      <div className="mt-6">
        <LinkButton href="/quiz" variant="secondary">
          {isEn ? "Match a solution to your task" : "Подобрать решение под задачу"}
        </LinkButton>
      </div>

      {shown.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-heading-sm">
            {isEn ? "Factories working with this industry" : "Заводы, работающие с отраслью"}
          </h2>
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {shown.map((factory) => (
              <SupplierCard key={factory.id} factory={factory} locale={locale} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 max-w-xl">
        <h2 className="mb-4 text-heading-sm">{tCatalog("noResultsLead")}</h2>
        <LeadForm
          label="industry_request"
          fields={[
            { type: "text", name: "name", label: tForm("nameLabel") },
            { type: "tel", name: "phone", label: tForm("phoneLabel") },
            { type: "textarea", name: "task", label: tForm("taskLabel"), placeholder: tForm("taskPlaceholder") },
          ]}
          hidden={{ industry: industry.id }}
          submitLabel={tForm("submitGetQuote")}
          backHref="/"
          backLabel={tForm("successBackHome")}
        />
      </div>
    </section>
  );
}
