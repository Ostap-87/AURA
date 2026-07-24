import { pageAlternates } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LeadForm } from "@/components/forms/lead-form";
import { consultingIntro, consultingWorkflow } from "@/lib/content/consulting-content";
import { getConsulting } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? consultingIntro.title_en : consultingIntro.title_ru,
    description: isEn ? consultingIntro.description_en : consultingIntro.description_ru,
    alternates: pageAlternates(locale, "/consulting"),
  };
}

export default async function ConsultingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const tForm = await getTranslations({ locale, namespace: "form" });

  const services = (await getConsulting())
    .filter((s) => s.published)
    .sort((a, b) => a.order - b.order);

  // Объединённое «Для кого» из услуг (5.5 п.3) — данные, не выдумка
  const forWhom = Array.from(new Set(services.flatMap((s) => s.forWhom)));

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
      {/* 1. Заголовок и описание направления — из справочника в коде */}
      <h1 className="text-display">{isEn ? consultingIntro.title_en : consultingIntro.title_ru}</h1>
      <p className="mt-4 max-w-2xl text-subheading text-stone">
        {isEn ? consultingIntro.description_en : consultingIntro.description_ru}
      </p>

      {/* 2. Карточки услуг — только при наличии данных */}
      {services.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {services.map((service) => {
            const hasPage = Boolean(service.fullDescription_ru);
            const inner = (
              <>
                <h2 className="text-heading-sm">{isEn ? service.title_en : service.title_ru}</h2>
                <p className="mt-2 text-body-sm text-stone">
                  {isEn && service.shortDescription_en
                    ? service.shortDescription_en
                    : service.shortDescription_ru}
                </p>
                <p className="mt-3 font-mono text-body-sm">
                  {service.price !== undefined
                    ? `${formatPrice(service.price, locale)} ₽`
                    : isEn
                      ? "Price on request"
                      : "Стоимость по запросу"}
                </p>
                <p className="mt-1 font-mono text-caption text-ash">
                  {service.format} · {service.duration}
                </p>
              </>
            );
            return hasPage ? (
              <Link
                key={service.id}
                href={`/consulting/${service.id}`}
                className="rounded-card border border-ink bg-warm-parchment p-6 transition-transform hover:-translate-y-1"
              >
                {inner}
              </Link>
            ) : (
              <div key={service.id} className="rounded-card border border-fog bg-warm-parchment p-6">
                {inner}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Для кого — из данных услуг */}
      {forWhom.length > 0 && (
        <div className="mt-16">
          <h2 className="text-heading-lg">{isEn ? "Who it's for" : "Для кого"}</h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 tablet:grid-cols-2">
            {forWhom.map((item) => (
              <li key={item} className="flex gap-2 text-body text-stone">
                <span aria-hidden>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Как мы работаем — вместе с блоками услуг */}
      {services.length > 0 && (
        <div className="mt-16">
          <h2 className="text-heading-lg">{isEn ? "How we work" : "Как мы работаем"}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-4">
            {consultingWorkflow.map((step, index) => (
              <div key={step.title_ru}>
                <p className="font-mono text-caption text-ash">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-heading-sm">{isEn ? step.title_en : step.title_ru}</h3>
                <p className="mt-2 text-body-sm text-stone">{isEn ? step.text_en : step.text_ru}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Кейсы из Notion — этап 9; 6. FAQ — при появлении данных */}

      {/* 7. Форма — всегда, даже при пустой таблице */}
      <div className="mt-16 max-w-xl">
        <h2 className="mb-4 text-heading-lg">{isEn ? "Describe your task" : "Опишите задачу"}</h2>
        <LeadForm
          label="consulting_request"
          fields={[
            { type: "text", name: "name", label: tForm("nameLabel") },
            { type: "tel", name: "phone", label: tForm("phoneLabel") },
            { type: "textarea", name: "task", label: tForm("taskLabel"), placeholder: tForm("taskPlaceholder") },
          ]}
          submitLabel={isEn ? "Discuss the task" : "Обсудить задачу"}
          backHref="/"
          backLabel={tForm("successBackHome")}
        />
      </div>
    </section>
  );
}
