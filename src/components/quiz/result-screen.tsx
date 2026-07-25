"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { LeadForm } from "@/components/forms/lead-form";
import { calculatePayback } from "@/lib/quiz-calc";
import { formatPrice } from "@/lib/format";
import type { Category } from "@/lib/schemas";
import { CountUp } from "./count-up";

export function ResultScreen({
  categoryName,
  category,
  supplierNode,
  employees,
  salary,
  locale,
  hidden,
}: {
  categoryName: string;
  category?: Category;
  supplierNode: ReactNode;
  employees: number;
  salary: number;
  locale: string;
  hidden: Record<string, string>;
}) {
  const t = useTranslations("quiz");
  const tForm = useTranslations("form");
  const rub = (n: number) => `${formatPrice(Math.round(n), locale)} ₽`;

  // Расчёт возможен только с заведёнными ценами категории; без них
  // показываем рекомендацию и заводы, а сумму считаем по запросу
  const calc =
    category && category.priceMin !== undefined && category.priceMax !== undefined
      ? calculatePayback(employees, salary, category.priceMin, category.priceMax)
      : null;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-display">{t("resultTitle")}</h1>

        {category ? (
          <>
            <p className="mt-2 text-subheading text-stone">
              {t("recommendedTitle")}: {categoryName}
            </p>

            {calc ? (
              <>
                <div className="mt-8 grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-4">
                  <Metric label={t("currentCostLabel")} value={calc.currentAnnualCost} format={rub} />
                  <Metric label={t("solutionCostLabel")} value={calc.solutionCost} format={rub} />
                  <Metric label={t("savingsLabel")} value={calc.annualSavings} format={rub} />
                  <div>
                    <p className="text-caption uppercase text-ash">{t("paybackLabel")}</p>
                    <p className="mt-1 font-mono text-heading-sm">
                      {calc.paybackMonths !== null ? (
                        <CountUp value={Math.round(calc.paybackMonths)} format={(n) => t("paybackMonths", { months: n })} />
                      ) : (
                        t("paybackUnavailable")
                      )}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-body-sm text-stone">{t("disclaimer")}</p>
              </>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-6 tablet:grid-cols-2">
                <Metric
                  label={t("currentCostLabel")}
                  value={employees * salary * 12 * 1.3}
                  format={rub}
                />
                <div>
                  <p className="text-caption uppercase text-ash">{t("solutionCostLabel")}</p>
                  <p className="mt-1 font-mono text-heading-sm">
                    {locale === "en" ? "Price on request" : "Цена по запросу"}
                  </p>
                </div>
              </div>
            )}

            {supplierNode && (
              <div className="mt-10">
                <h2 className="mb-4 text-heading-sm">{t("suppliersTitle")}</h2>
                {supplierNode}
              </div>
            )}
          </>
        ) : (
          <div className="mt-8 rounded-card border border-fog bg-warm-parchment p-8">
            <p className="text-heading-sm">{t("noCategoryTitle")}</p>
            <p className="mt-2 text-body text-stone">{t("noCategoryText")}</p>
          </div>
        )}
      </div>

      <div className="max-w-xl">
        <h2 className="mb-4 text-heading-sm">{t("contactsTitle")}</h2>
        <LeadForm
          label="quiz"
          fields={[
            { type: "text", name: "name", label: tForm("nameLabel") },
            { type: "tel", name: "phone", label: tForm("phoneLabel") },
          ]}
          hidden={hidden}
          submitLabel={tForm("submitPreciseQuote")}
          backHref="/"
          backLabel={tForm("successBackHome")}
        />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  format,
}: {
  label: string;
  value: number;
  format: (n: number) => string;
}) {
  return (
    <div>
      <p className="text-caption uppercase text-ash">{label}</p>
      <p className="mt-1 font-mono text-heading-sm">
        <CountUp value={Math.round(value)} format={format} />
      </p>
    </div>
  );
}
