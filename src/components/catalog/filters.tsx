"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { FilterOption } from "@/lib/catalog";

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

export function CatalogFilters({
  industryOptions,
  leadTimeOptions,
  resultCount,
}: {
  industryOptions: FilterOption[];
  leadTimeOptions: FilterOption[];
  resultCount: number;
}) {
  const t = useTranslations("catalog");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedIndustries = searchParams.get("industry")?.split(",").filter(Boolean) ?? [];
  const selectedLeadTimes = searchParams.get("leadtime")?.split(",").filter(Boolean) ?? [];
  const hasSelection = selectedIndustries.length > 0 || selectedLeadTimes.length > 0;

  function updateParams(industries: string[], leadTimes: string[]) {
    const params = new URLSearchParams();
    if (industries.length > 0) params.set("industry", industries.join(","));
    if (leadTimes.length > 0) params.set("leadtime", leadTimes.join(","));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  if (industryOptions.length === 0 && leadTimeOptions.length === 0) {
    return (
      <p className="text-body-sm text-stone">{t("foundCount", { count: resultCount })}</p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between tablet-lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-chip border border-ink px-4 py-2 text-body-sm"
        >
          {t("filtersOpen")}
        </button>
        <p className="text-body-sm text-stone">{t("foundCount", { count: resultCount })}</p>
      </div>

      <div
        className={`${mobileOpen ? "fixed inset-0 z-40 flex flex-col overflow-y-auto bg-canvas p-5" : "hidden"} tablet-lg:static tablet-lg:z-auto tablet-lg:flex tablet-lg:flex-col tablet-lg:gap-6 tablet-lg:overflow-visible tablet-lg:bg-transparent tablet-lg:p-0`}
      >
        <div className="mb-4 flex items-center justify-between tablet-lg:hidden">
          <p className="text-heading-sm">{t("filtersOpen")}</p>
          <button type="button" onClick={() => setMobileOpen(false)} className="text-body-sm">
            ✕
          </button>
        </div>

        <div className="hidden items-center justify-between tablet-lg:flex">
          <p className="text-body-sm text-stone">{t("foundCount", { count: resultCount })}</p>
          {hasSelection && (
            <button
              type="button"
              onClick={() => updateParams([], [])}
              className="text-body-sm text-stone underline-offset-4 hover:underline"
            >
              {t("filtersReset")}
            </button>
          )}
        </div>

        {industryOptions.length > 0 && (
          <fieldset className="mt-6 tablet-lg:mt-0">
            <legend className="text-body-sm font-medium">{t("filtersIndustry")}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {industryOptions.map((option) => {
                const active = selectedIndustries.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      updateParams(toggleValue(selectedIndustries, option.value), selectedLeadTimes)
                    }
                    className={`rounded-chip border px-3 py-1.5 text-body-sm ${
                      active ? "border-ink bg-accent text-ink" : "border-fog text-stone"
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {leadTimeOptions.length > 0 && (
          <fieldset className="mt-6">
            <legend className="text-body-sm font-medium">{t("filtersLeadTime")}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {leadTimeOptions.map((option) => {
                const active = selectedLeadTimes.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      updateParams(selectedIndustries, toggleValue(selectedLeadTimes, option.value))
                    }
                    className={`rounded-chip border px-3 py-1.5 text-body-sm ${
                      active ? "border-ink bg-accent text-ink" : "border-fog text-stone"
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="mt-8 rounded-button bg-pure-black px-6 py-3 text-body font-medium text-canvas tablet-lg:hidden"
        >
          {t("foundCount", { count: resultCount })}
        </button>
      </div>
    </div>
  );
}
