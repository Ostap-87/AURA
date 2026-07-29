import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFactoryById } from "@/lib/catalog";
import { getProductionFactories } from "@/lib/production";
import { ProductionFactoryDetail } from "@/components/production/production-factory-detail";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { pageAlternates } from "@/lib/seo";

export async function generateStaticParams() {
  const factories = await getProductionFactories();
  return factories.map((factory) => ({ factoryId: factory.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; factoryId: string }>;
}) {
  const { locale, factoryId } = await params;
  const factory = await getFactoryById(factoryId);
  if (!factory || !factory.segments.includes("production")) return {};
  return {
    title: factory.name,
    description:
      locale === "en" && factory.description_en ? factory.description_en : factory.description_ru,
    alternates: pageAlternates(locale, `/production/factory/${factoryId}`),
  };
}

export default async function ProductionFactoryPage({
  params,
}: {
  params: Promise<{ locale: string; factoryId: string }>;
}) {
  const { locale, factoryId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "breadcrumbs" });

  const factory = await getFactoryById(factoryId);
  if (!factory || !factory.segments.includes("production")) notFound();

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 lg:px-10">
      <Breadcrumbs
        items={[
          { label: t("home"), href: "/" },
          { label: t("production"), href: "/production" },
          { label: factory.name },
        ]}
      />
      <div className="mt-8">
        <ProductionFactoryDetail factory={factory} locale={locale} />
      </div>
    </section>
  );
}
