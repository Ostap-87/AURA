import { getTranslations } from "next-intl/server";
import { MediaSlot } from "@/components/media/media-slot";
import type { Factory } from "@/lib/schemas";

/**
 * Карточка поставщика без модалки и сравнения — используется на
 * страницах оборудования/отраслей (PROJECT.md 5.2) и на экране
 * результата квиза (5.6). Для каталога роботов есть отдельная
 * FactoryCard с модалкой и сравнением (5.1).
 */
export async function SupplierCard({ factory, locale }: { factory: Factory; locale: string }) {
  const t = await getTranslations({ locale, namespace: "catalog" });
  const description = locale === "en" && factory.description_en ? factory.description_en : factory.description_ru;

  return (
    <div className="rounded-card border border-ink bg-warm-parchment p-6">
      <MediaSlot
        src={factory.photos[0]}
        caption={factory.photoCaptions[0]}
        aspect="4/3"
        emptyBehavior="hidden"
        className="mb-4"
      />
      <h3 className="text-heading-sm">{factory.name}</h3>
      <p className="mt-1 text-body-sm text-stone">
        {factory.city}, {factory.country}
      </p>
      <p className="mt-3 line-clamp-3 text-body-sm text-stone">{description}</p>
      <p className="mt-3 font-mono text-caption text-ash">
        {t("factoryLeadTime")}: {factory.leadTime}
      </p>
    </div>
  );
}
