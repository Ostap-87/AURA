"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MediaSlot } from "@/components/media/media-slot";
import { csvList } from "@/lib/csv";
import type { Factory } from "@/lib/schemas";
import { useCompare } from "./compare-context";

export function FactoryCard({
  factory,
  categoryId,
  featured = false,
  tourBadge,
}: {
  factory: Factory;
  categoryId: string;
  featured?: boolean;
  /** Текст плашки «Этот завод в программе тура …», если завод в активной поездке (5.3). */
  tourBadge?: string;
}) {
  const t = useTranslations("catalog");
  const { selected, toggle, isFull } = useCompare();
  const isSelected = selected.includes(factory.id);
  const models = csvList(factory.models);

  return (
    <div
      className={`relative rounded-card border border-ink bg-warm-parchment transition-transform duration-200 hover:-translate-y-1 ${
        featured ? "p-6" : "p-4"
      }`}
    >
      <label
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isSelected}
          disabled={!isSelected && isFull}
          onChange={() => toggle(factory.id)}
          aria-label={factory.name}
          className="h-5 w-5"
        />
      </label>

      <Link href={`/catalog/${categoryId}/factory/${factory.id}`} className="block">
        {featured && (
          <MediaSlot
            src={factory.photos[0]}
            caption={factory.photoCaptions[0]}
            aspect="4/3"
            emptyBehavior="hidden"
            className="mb-4"
          />
        )}
        {tourBadge && (
          <p className="mb-2 inline-block rounded-chip bg-accent px-3 py-1 text-caption font-medium text-ink">
            {tourBadge}
          </p>
        )}
        <h3 className={featured ? "text-heading-sm pr-10" : "text-body font-medium pr-10"}>
          {factory.name}
        </h3>
        <p className="mt-1 text-body-sm text-stone">
          {factory.city}, {factory.country}
        </p>
        {featured && (
          <p className="mt-3 line-clamp-3 text-body-sm text-stone">{factory.description_ru}</p>
        )}
        <p className="mt-3 font-mono text-caption text-ash">
          {t("factoryModels")}: {models.length}
        </p>
        <p className="font-mono text-caption text-ash">
          {t("factoryLeadTime")}: {factory.leadTime}
        </p>
      </Link>
    </div>
  );
}
