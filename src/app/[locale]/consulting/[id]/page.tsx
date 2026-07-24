import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { MediaSlot } from "@/components/media/media-slot";
import { consultingIntro } from "@/lib/content/consulting-content";
import { getConsulting } from "@/lib/data";
import { formatPrice } from "@/lib/format";

/** Страница услуги существует только при заполненном fullDescription (PROJECT.md, раздел 4). */
export async function generateStaticParams() {
  const services = await getConsulting();
  return services
    .filter((s) => s.published && s.fullDescription_ru)
    .map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const service = (await getConsulting()).find((s) => s.id === id && s.published);
  if (!service) return {};
  return {
    title: locale === "en" ? service.title_en : service.title_ru,
    description:
      locale === "en" && service.shortDescription_en
        ? service.shortDescription_en
        : service.shortDescription_ru,
  };
}

export default async function ConsultingServicePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const tForm = await getTranslations({ locale, namespace: "form" });

  const service = (await getConsulting()).find(
    (s) => s.id === id && s.published && s.fullDescription_ru,
  );
  if (!service) notFound();

  const fullDescription =
    isEn && service.fullDescription_en ? service.fullDescription_en : service.fullDescription_ru;

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 lg:px-10">
      <Breadcrumbs
        items={[
          { label: isEn ? "Home" : "Главная", href: "/" },
          { label: isEn ? consultingIntro.title_en : consultingIntro.title_ru, href: "/consulting" },
          { label: isEn ? service.title_en : service.title_ru },
        ]}
      />
      <h1 className="mt-4 text-display">{isEn ? service.title_en : service.title_ru}</h1>

      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 rounded-card bg-warm-parchment p-4">
        <div>
          <p className="text-caption uppercase text-ash">{isEn ? "Price" : "Стоимость"}</p>
          <p className="font-mono text-body">
            {service.price !== undefined
              ? `${formatPrice(service.price, locale)} ₽`
              : isEn
                ? "Price on request"
                : "Стоимость по запросу"}
          </p>
          {service.priceNote && <p className="mt-1 text-caption text-ash">{service.priceNote}</p>}
        </div>
        <div>
          <p className="text-caption uppercase text-ash">{isEn ? "Format" : "Формат"}</p>
          <p className="font-mono text-body">{service.format}</p>
        </div>
        <div>
          <p className="text-caption uppercase text-ash">{isEn ? "Duration" : "Срок"}</p>
          <p className="font-mono text-body">{service.duration}</p>
        </div>
      </div>

      <p className="mt-8 whitespace-pre-line text-body text-stone">{fullDescription}</p>

      <MediaSlot src={service.photo} caption={service.priceNote} aspect="16/9" emptyBehavior="hidden" className="mt-8" />

      {service.forWhom.length > 0 && (
        <div className="mt-10">
          <h2 className="text-heading-sm">{isEn ? "Who it's for" : "Для кого"}</h2>
          <ul className="mt-3 flex flex-col gap-2 text-body text-stone">
            {service.forWhom.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {service.whatIncluded.length > 0 && (
        <div className="mt-8">
          <h2 className="text-heading-sm">{isEn ? "What's included" : "Что входит"}</h2>
          <ul className="mt-3 flex flex-col gap-2 text-body text-stone">
            {service.whatIncluded.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12">
        <h2 className="mb-4 text-heading-sm">{isEn ? "Describe your task" : "Опишите задачу"}</h2>
        <LeadForm
          label="consulting_request"
          fields={[
            { type: "text", name: "name", label: tForm("nameLabel") },
            { type: "tel", name: "phone", label: tForm("phoneLabel") },
            { type: "textarea", name: "task", label: tForm("taskLabel"), placeholder: tForm("taskPlaceholder") },
          ]}
          hidden={{ service: service.id }}
          submitLabel={isEn ? "Discuss the task" : "Обсудить задачу"}
          backHref="/consulting"
          backLabel={isEn ? "Back to consulting" : "Вернуться к консалтингу"}
        />
      </div>
    </section>
  );
}
