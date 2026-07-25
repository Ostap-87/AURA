"use client";

import { useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export type LeadFormField =
  | { type: "text"; name: string; label: string }
  | { type: "tel"; name: string; label: string }
  | { type: "email"; name: string; label: string }
  | { type: "textarea"; name: string; label: string; placeholder?: string }
  | { type: "select"; name: string; label: string; options: { value: string; label: string }[] };

export type LeadFormProps = {
  /** Метка формы для /api/lead, например "catalog_modal" (PROJECT.md, раздел 9). */
  label: string;
  fields: LeadFormField[];
  /** Заполняются автоматически из контекста страницы, невидимы пользователю. */
  hidden?: Record<string, string>;
  submitLabel: string;
  backHref: string;
  backLabel: string;
};

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^8/, "7");
  return digits ? `+${digits}` : "";
}

function isPhoneValid(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10;
}

function isEmailValid(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
}

export function LeadForm({ label, fields, hidden = {}, submitLabel, backHref, backLabel }: LeadFormProps) {
  const t = useTranslations("form");
  const locale = useLocale();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [f.name, f.type === "select" ? f.options[0]?.value ?? "" : ""]),
    ),
  );
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  function validateField(field: LeadFormField, value: string): string | null {
    if (field.type === "tel" && !isPhoneValid(value)) return t("errorPhoneFormat");
    if (field.type === "email" && value && !isEmailValid(value)) return t("errorEmail");
    return null;
  }

  function handleBlur(field: LeadFormField) {
    const error = validateField(field, values[field.name] ?? "");
    setErrors((prev) => ({ ...prev, [field.name]: error ?? "" }));
  }

  function handleChange(field: LeadFormField, rawValue: string) {
    const value = field.type === "tel" ? normalizePhone(rawValue) : rawValue;
    setValues((prev) => ({ ...prev, [field.name]: value }));
    if (errors[field.name]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field.name]: error ?? "" }));
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const error = validateField(field, values[field.name] ?? "");
      if (error) nextErrors[field.name] = error;
    }
    if (!consent) nextErrors.consent = t("errorConsent");

    setErrors(nextErrors);

    const firstInvalid = [...fields.map((f) => f.name), "consent"].find((name) => nextErrors[name]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          fields: values,
          hidden: { ...hidden, page: typeof window !== "undefined" ? window.location.pathname : "", locale },
          honeypot: "",
          consent: true,
        }),
      });
      if (!response.ok) throw new Error("request_failed");
      setStatus("success");
      // Сигнал для маскота и будущей аналитики: заявка отправлена
      window.dispatchEvent(new Event("aura:lead-success"));
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-card border border-fog bg-warm-parchment p-6">
        <p className="text-heading-sm">{t("successTitle")}</p>
        <p className="mt-2 text-body text-stone">{t("successText")}</p>
        <p className="text-body text-stone">{t("successUrgent")}</p>
        <div className="mt-6 flex flex-col gap-3 tablet:flex-row">
          <a
            href="https://t.me/ostapdotcenko"
            className="rounded-button bg-pure-black px-6 py-3 text-center text-body font-medium text-canvas"
          >
            {t("successTelegram")}
          </a>
          <Link
            href={backHref}
            className="rounded-button border border-ink px-6 py-3 text-center text-body font-medium text-ink"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label htmlFor={field.name} className="text-body-sm font-medium">
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              id={field.name}
              ref={(el) => {
                fieldRefs.current[field.name] = el;
              }}
              value={values[field.name]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="rounded-utility border border-fog bg-canvas px-4 py-3 text-body focus:border-2 focus:border-ink"
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              id={field.name}
              ref={(el) => {
                fieldRefs.current[field.name] = el;
              }}
              value={values[field.name]}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              rows={3}
              className="rounded-utility border border-fog bg-canvas px-4 py-3 text-body focus:border-2 focus:border-ink"
            />
          ) : (
            <input
              id={field.name}
              ref={(el) => {
                fieldRefs.current[field.name] = el;
              }}
              type={field.type}
              value={values[field.name]}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              className={`rounded-utility border bg-canvas px-4 py-3 text-body focus:border-2 focus:border-ink ${
                errors[field.name] ? "border-2 border-ink" : "border-fog"
              }`}
            />
          )}
          {errors[field.name] && <p className="text-body-sm text-ink">{errors[field.name]}</p>}
        </div>
      ))}

      <label className="flex items-start gap-2 py-1 text-body-sm text-stone">
        <input
          ref={(el) => {
            fieldRefs.current.consent = el;
          }}
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (errors.consent) setErrors((prev) => ({ ...prev, consent: "" }));
          }}
          className="mt-0.5 h-5 w-5 shrink-0"
        />
        <span>
          {t("consentText")}{" "}
          <Link href="/policy" className="underline">
            {t("consentLink")}
          </Link>
        </span>
      </label>
      {errors.consent && <p className="text-body-sm text-ink">{errors.consent}</p>}

      {status === "error" && <p className="text-body-sm text-ink">{t("errorGeneral")}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-button bg-pure-black px-6 py-3 text-body font-medium text-canvas disabled:opacity-50"
      >
        {status === "submitting" ? t("submitting") : submitLabel}
      </button>
    </form>
  );
}
