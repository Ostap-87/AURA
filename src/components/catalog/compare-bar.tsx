"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { csvList } from "@/lib/csv";
import type { Factory } from "@/lib/schemas";
import { useCompare } from "./compare-context";

export function CompareBar({ factories }: { factories: Factory[] }) {
  const t = useTranslations("catalog");
  const { selected, clear } = useCompare();
  const [open, setOpen] = useState(false);

  if (selected.length < 2) return null;

  const selectedFactories = factories.filter((f) => selected.includes(f.id));

  const rows: { label: string; render: (f: Factory) => React.ReactNode }[] = [
    { label: t("factoryCountry"), render: (f) => f.country },
    { label: t("factoryCity"), render: (f) => f.city },
    { label: t("factoryFounded"), render: (f) => f.founded ?? "—" },
    { label: t("factoryLeadTime"), render: (f) => f.leadTime },
    { label: t("factoryModels"), render: (f) => csvList(f.models).length },
  ];

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink bg-canvas px-5 py-4 lg:px-10">
        <div className="mx-auto flex max-w-(--container-page) items-center justify-between">
          <p className="text-body-sm">{t("compareSelected", { count: selected.length })}</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={clear} className="text-body-sm text-stone underline-offset-4 hover:underline">
              {t("compareClear")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-button bg-pure-black px-6 py-3 text-body-sm font-medium text-canvas"
            >
              {t("compareOpen")}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50 tablet-lg:items-center" onClick={() => setOpen(false)}>
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-t-card bg-canvas p-6 tablet-lg:rounded-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-heading-sm">{t("compareTitle")}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("compareClose")}>
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead>
                  <tr>
                    <th className="border-b border-fog py-2 pr-4"></th>
                    {selectedFactories.map((f) => (
                      <th key={f.id} className="border-b border-fog py-2 pr-4 font-medium">
                        {f.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label}>
                      <th className="border-b border-fog py-2 pr-4 font-normal text-stone">{row.label}</th>
                      {selectedFactories.map((f) => (
                        <td key={f.id} className="border-b border-fog py-2 pr-4">
                          {row.render(f)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
