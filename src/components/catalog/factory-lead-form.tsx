"use client";

import { useState } from "react";
import { MediaSlot } from "@/components/media/media-slot";
import { LeadForm, type LeadFormField } from "@/components/forms/lead-form";

export type ModelOption = { id: string; name: string; description?: string; photo?: string };

/**
 * Витрина моделей + форма заявки для карточки завода. Выбор модели — вне
 * счёта видимых полей формы (PROJECT.md: не больше четырёх на форму):
 * это переключатель показа фото/описания, а не поле лида. Сама форма — ровно
 * четыре поля: имя, телефон, e-mail, компания; выбранная модель уходит в hidden.
 */
export function FactoryLeadForm({
  models,
  plainModelNames,
  labels,
  hidden,
  submitLabel,
  backHref,
  backLabel,
}: {
  models: ModelOption[];
  plainModelNames: string[];
  labels: {
    modelLabel: string;
    modelUnknown: string;
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    companyLabel: string;
  };
  hidden: Record<string, string>;
  submitLabel: string;
  backHref: string;
  backLabel: string;
}) {
  const hasStructuredModels = models.length > 0;
  const options = hasStructuredModels
    ? models.map((m) => ({ value: m.id, label: m.name }))
    : plainModelNames.map((name) => ({ value: name, label: name }));

  const [selected, setSelected] = useState("unknown");
  const activeModel = hasStructuredModels ? models.find((m) => m.id === selected) : undefined;

  const fields: LeadFormField[] = [
    { type: "text", name: "name", label: labels.nameLabel },
    { type: "tel", name: "phone", label: labels.phoneLabel },
    { type: "email", name: "email", label: labels.emailLabel },
    { type: "text", name: "company", label: labels.companyLabel },
  ];

  return (
    <div className="flex flex-col gap-6">
      {options.length > 0 && (
        <div className="flex flex-col gap-3">
          <label htmlFor="model-showcase" className="text-body-sm font-medium">
            {labels.modelLabel}
          </label>
          <select
            id="model-showcase"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-utility border border-fog bg-canvas px-4 py-3 text-body focus:border-2 focus:border-ink"
          >
            <option value="unknown">{labels.modelUnknown}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {activeModel && (
            <div className="rounded-card border border-fog bg-warm-parchment p-4">
              <MediaSlot src={activeModel.photo} aspect="4/3" emptyBehavior="hidden" className="mb-3" />
              <p className="text-heading-sm">{activeModel.name}</p>
              {activeModel.description && (
                <p className="mt-2 text-body-sm text-stone">{activeModel.description}</p>
              )}
            </div>
          )}
        </div>
      )}

      <LeadForm
        label="catalog_modal"
        fields={fields}
        hidden={{ ...hidden, model: selected }}
        submitLabel={submitLabel}
        backHref={backHref}
        backLabel={backLabel}
      />
    </div>
  );
}
