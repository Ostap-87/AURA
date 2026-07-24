import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCategoryById, getFactoryById } from "@/lib/catalog";
import { FactoryDetail } from "@/components/catalog/factory-detail";
import { FactoryModalShell } from "@/components/catalog/factory-modal-shell";

export default async function FactoryModalPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; factoryId: string }>;
}) {
  const { locale, category: categoryId, factoryId } = await params;
  setRequestLocale(locale);

  const [category, factory] = await Promise.all([
    getCategoryById(categoryId),
    getFactoryById(factoryId),
  ]);

  if (!category || !factory || !factory.categories.includes(categoryId)) {
    notFound();
  }

  return (
    <FactoryModalShell>
      <FactoryDetail factory={factory} category={category} locale={locale} />
    </FactoryModalShell>
  );
}
