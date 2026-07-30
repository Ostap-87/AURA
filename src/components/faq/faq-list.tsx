"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export type FaqListSection = {
  id: string;
  title: string;
  items: { id: string; q: string; a: string }[];
};

export function FaqList({ sections }: { sections: FaqListSection[] }) {
  const t = useTranslations("faq");
  const [query, setQuery] = useState("");

  const normalized = query.trim().toLowerCase();
  const filtered = sections
    .map((section) => ({
      ...section,
      items: normalized
        ? section.items.filter(
            (item) =>
              item.q.toLowerCase().includes(normalized) || item.a.toLowerCase().includes(normalized),
          )
        : section.items,
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
        className="w-full max-w-md rounded-utility border border-fog bg-canvas px-4 py-3 text-body focus:border-2 focus:border-ink"
      />

      {filtered.length === 0 ? (
        <p className="mt-10 text-body text-stone">{t("noResults")}</p>
      ) : (
        <div className="mt-10 flex flex-col gap-12">
          {filtered.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-8">
              <h2 className="text-heading-sm">{section.title}</h2>
              <div className="mt-4 flex flex-col gap-3">
                {section.items.map((item) => (
                  <details
                    key={item.id}
                    id={item.id}
                    open={Boolean(normalized)}
                    className="rounded-card border border-fog bg-warm-parchment p-4"
                  >
                    <summary className="cursor-pointer text-body font-medium">{item.q}</summary>
                    <p className="mt-3 whitespace-pre-line text-body text-stone">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
