import { getTranslations } from "next-intl/server";
import { MediaGallery } from "@/components/media/media-gallery";
import { MediaSlot } from "@/components/media/media-slot";
import { FactoryLeadForm } from "@/components/catalog/factory-lead-form";
import { FactoryLogo } from "@/components/shared/factory-logo";
import { Link } from "@/i18n/navigation";
import { parseModels } from "@/lib/catalog";
import { getModels } from "@/lib/data";
import { formatPriceRange } from "@/lib/format";
import { industryTagLabel } from "@/lib/industry-tags";
import { getActiveTourBadge, tourBadgeText } from "@/lib/tours";
import type { Category, Factory } from "@/lib/schemas";

export async function FactoryDetail({
  factory,
  category,
  locale,
}: {
  factory: Factory;
  category: Category;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "catalog" });
  const tForm = await getTranslations({ locale, namespace: "form" });
  const isEn = locale === "en";
  const plainModelNames = parseModels(factory.models);
  const structuredModels = (await getModels())
    .filter((m) => m.factoryId === factory.id && m.published)
    .sort((a, b) => a.order - b.order)
    .map((m) => ({
      id: m.id,
      name: isEn && m.name_en ? m.name_en : m.name_ru,
      description: isEn && m.description_en ? m.description_en : m.description_ru,
      photo: m.photo,
    }));
  const description = locale === "en" && factory.description_en ? factory.description_en : factory.description_ru;

  // Плашка «Этот завод в программе тура [даты]» — связка каталога и тура (5.3)
  const tourBadge = await getActiveTourBadge();
  const inTour = tourBadge && tourBadge.companyIds.has(factory.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        {inTour && (
          <Link
            href={`/tours/${tourBadge.tour.id}`}
            className="mb-3 inline-block rounded-chip bg-accent px-4 py-1.5 text-body-sm font-medium text-ink"
          >
            {tourBadgeText(tourBadge.tour, locale)}
          </Link>
        )}
        {factory.logo && <FactoryLogo factory={factory} size={56} />}
        <h2 className={`text-heading-lg ${factory.logo ? "mt-3" : ""}`}>{factory.name}</h2>
        {factory.nameZh && <p className="mt-1 text-body text-stone">{factory.nameZh}</p>}
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-body-sm text-stone">
          <span>
            {t("factoryCountry")}: {factory.country}
          </span>
          <span>
            {t("factoryCity")}: {factory.city ?? factory.country}
          </span>
          {factory.founded && (
            <span>
              {t("factoryFounded")}: {factory.founded}
            </span>
          )}
        </div>
        {factory.industries.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {factory.industries.map((industry) => (
              <span key={industry} className="rounded-chip border border-fog px-3 py-1 text-body-sm text-stone">
                {industryTagLabel(industry, locale)}
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="text-body text-ink">{description}</p>

      <div className="flex flex-wrap gap-x-8 gap-y-2 rounded-card bg-warm-parchment p-4">
        <div>
          <p className="text-caption uppercase text-ash">{t("metricsPrice")}</p>
          <p className="font-mono text-body">{formatPriceRange(category.priceMin, category.priceMax, locale)}</p>
        </div>
        <div>
          <p className="text-caption uppercase text-ash">{t("metricsLeadTime")}</p>
          <p className="font-mono text-body">{factory.leadTime}</p>
        </div>
      </div>

      {factory.videoUrl && (
        <MediaSlot
          src={factory.videoUrl}
          caption={factory.photoCaptions[0]}
          aspect="16/9"
          emptyBehavior="hidden"
        />
      )}

      <MediaGallery photos={factory.photos} captions={factory.photoCaptions} aspect="4/3" />

      <FactoryLeadForm
        models={structuredModels}
        plainModelNames={plainModelNames}
        labels={{
          modelLabel: tForm("modelLabel"),
          modelUnknown: tForm("modelUnknown"),
          nameLabel: tForm("nameLabel"),
          phoneLabel: tForm("phoneLabel"),
          emailLabel: tForm("emailLabel"),
          companyLabel: tForm("companyLabel"),
        }}
        hidden={{ factory: factory.id, category: category.id }}
        submitLabel={tForm("submitGetQuote")}
        backHref={`/catalog/${category.id}`}
        backLabel={tForm("successBackCatalog")}
      />
    </div>
  );
}
