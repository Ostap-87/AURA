"use client";

import { type ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { Tiles } from "./tiles";
import { PeopleStep } from "./people-step";
import { ResultScreen } from "./result-screen";
import { getTaskById, getTasksForIndustry, quizIndustries } from "@/lib/quiz-matching";
import type { Category } from "@/lib/schemas";

type Step = "industry" | "task" | "people" | "result";

export type QuizCategoryMeta = { category?: Category };

export function QuizFlow({
  locale,
  categoryData,
  supplierNodes,
}: {
  locale: string;
  categoryData: Record<string, QuizCategoryMeta>;
  supplierNodes: Record<string, ReactNode>;
}) {
  const t = useTranslations("quiz");
  const [step, setStep] = useState<Step>("industry");
  const [industryId, setIndustryId] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [employees, setEmployees] = useState(0);
  const [salary, setSalary] = useState(0);

  const stepNumber: Record<Step, number> = { industry: 1, task: 2, people: 3, result: 4 };

  function goBack() {
    if (step === "task") setStep("industry");
    else if (step === "people") setStep("task");
    else if (step === "result") setStep("people");
  }

  const task = industryId && taskId ? getTaskById(industryId, taskId) : undefined;
  const meta = task ? categoryData[task.categoryId] : undefined;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <p className="text-body-sm text-stone">{t("progressLabel", { step: stepNumber[step] })}</p>
        <div className="h-1 flex-1 mx-4 rounded-full bg-fog">
          <div
            className="h-1 rounded-full bg-ink transition-all"
            style={{ width: `${(stepNumber[step] / 4) * 100}%` }}
          />
        </div>
      </div>

      {step !== "industry" && (
        <button type="button" onClick={goBack} className="mb-6 text-body-sm text-stone underline-offset-4 hover:underline">
          ← {t("backButton")}
        </button>
      )}

      {step === "industry" && (
        <div>
          <h1 className="mb-8 text-display">{t("stepIndustryTitle")}</h1>
          <Tiles
            withIcons
            tiles={quizIndustries.map((i) => ({
              id: i.id,
              label: locale === "en" ? i.name_en : i.name_ru,
            }))}
            onSelect={(id) => {
              setIndustryId(id);
              setStep("task");
            }}
          />
        </div>
      )}

      {step === "task" && industryId && (
        <div>
          <h1 className="mb-8 text-display">{t("stepTaskTitle")}</h1>
          <Tiles
            tiles={getTasksForIndustry(industryId).map((task) => ({
              id: task.id,
              label: locale === "en" ? task.label_en : task.label_ru,
            }))}
            onSelect={(id) => {
              setTaskId(id);
              setStep("people");
            }}
          />
        </div>
      )}

      {step === "people" && (
        <div>
          <h1 className="mb-8 text-display">{t("stepPeopleTitle")}</h1>
          <PeopleStep
            onSubmit={(nextEmployees, nextSalary) => {
              setEmployees(nextEmployees);
              setSalary(nextSalary);
              setStep("result");
            }}
          />
        </div>
      )}

      {step === "result" && task && (
        <ResultScreen
          categoryName={
            meta?.category ? (locale === "en" ? meta.category.name_en : meta.category.name_ru) : ""
          }
          category={meta?.category}
          supplierNode={supplierNodes[task.categoryId]}
          employees={employees}
          salary={salary}
          locale={locale}
          hidden={{ industry: industryId ?? "", task: task.id, category: task.categoryId }}
        />
      )}
    </div>
  );
}
