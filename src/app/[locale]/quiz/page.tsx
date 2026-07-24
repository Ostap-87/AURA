import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { QuizFlow, type QuizCategoryMeta } from "@/components/quiz/quiz-flow";
import { SupplierCard } from "@/components/shared/supplier-card";
import { getCategoryById, getFactoriesForCategory } from "@/lib/catalog";
import { tasksByIndustry } from "@/lib/quiz-matching";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quiz" });
  return { title: t("title") };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categoryIds = new Set<string>();
  Object.values(tasksByIndustry)
    .flat()
    .forEach((task) => categoryIds.add(task.categoryId));

  const categoryData: Record<string, QuizCategoryMeta> = {};
  const supplierNodes: Record<string, ReactNode> = {};

  await Promise.all(
    Array.from(categoryIds).map(async (id) => {
      const [category, factories] = await Promise.all([
        getCategoryById(id),
        getFactoriesForCategory(id),
      ]);
      categoryData[id] = { category };
      const top = factories.slice(0, 3);
      supplierNodes[id] =
        top.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {top.map((factory) => (
              <SupplierCard key={factory.id} factory={factory} locale={locale} />
            ))}
          </div>
        ) : null;
    }),
  );

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-10 lg:px-10">
      <QuizFlow locale={locale} categoryData={categoryData} supplierNodes={supplierNodes} />
    </section>
  );
}
