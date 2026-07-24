import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCategoryById, getFactoryById } from "@/lib/catalog";
import { FactoryDetail } from "@/components/catalog/factory-detail";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

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
    </section>
  );
}
