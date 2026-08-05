import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFactoryById } from "@/lib/catalog";
import { getAutomationFactories } from "@/lib/automation";
import { AutomationFactoryDetail } from "@/components/automation/automation-factory-detail";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageAlternates, productJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const factories = await getAutomationFactories();
  return factories.map((factory) => ({ factoryId: factory.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; factoryId: string }>;
}) {
  const { locale, factoryId } = await params;
  const factory = await getFactoryById(factoryId);
  if (!factory || !factory.segments.includes("automation")) return {};
  return {
    title: factory.name,
    description:
      locale === "en" && factory.description_en ? factory.description_en : factory.description_ru,
    alternates: pageAlternates(locale, `/automation/factory/${factoryId}`),
  };
}

export default async function AutomationFactoryPage({
  params,
}: {
  params: Promise<{ locale: string; factoryId: string }>;
}) {
  const { locale, factoryId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "breadcrumbs" });

  const factory = await getFactoryById(factoryId);
  if (!factory || !factory.segments.includes("automation")) notFound();

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 lg:px-10">
      <Breadcrumbs
        items={[
          { label: t("home"), href: "/" },
          { label: t("automation"), href: "/automation" },
          { label: factory.name },
        ]}
      />
      <div className="mt-8">
        <AutomationFactoryDetail factory={factory} locale={locale} />
      </div>
      {/* Product без цены — у завода несколько категорий оборудования, единой вилки нет */}
      <JsonLd
        data={productJsonLd({
          locale,
          path: `/automation/factory/${factoryId}`,
          name: factory.name,
          description:
            locale === "en" && factory.description_en ? factory.description_en : factory.description_ru,
          image: factory.photos[0],
        })}
      />
    </section>
  );
}
