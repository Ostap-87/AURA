import { pageAlternates } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { LeadForm } from "@/components/forms/lead-form";
import { servicesContent } from "@/lib/content/services-content";
import { services } from "@/lib/reference-data";

export function generateStaticParams() {
  return services.map((service) => ({ service: service.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}) {
  const { locale, service: serviceId } = await params;
  const service = services.find((s) => s.id === serviceId);
  const content = servicesContent.find((c) => c.id === serviceId);
  if (!service || !content) return {};
  return {
    title: locale === "en" ? service.name_en : service.name_ru,
    description: locale === "en" ? content.intro_en : content.intro_ru,
    alternates: pageAlternates(locale, `/services/${serviceId}`),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}) {
  const { locale, service: serviceId } = await params;
  setRequestLocale(locale);

  const service = services.find((s) => s.id === serviceId);
  const content = servicesContent.find((c) => c.id === serviceId);
  if (!service || !content) notFound();

  const tBreadcrumbs = await getTranslations({ locale, namespace: "breadcrumbs" });
  const tForm = await getTranslations({ locale, namespace: "form" });
  const isEn = locale === "en";

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-10 lg:px-10">
      <Breadcrumbs
        items={[
          { label: tBreadcrumbs("home"), href: "/" },
          { label: tBreadcrumbs("services") },
          { label: isEn ? service.name_en : service.name_ru },
        ]}
      />
      <h1 className="mt-4 text-display">{isEn ? service.name_en : service.name_ru}</h1>
      <p className="mt-4 max-w-2xl text-subheading text-stone">{isEn ? content.intro_en : content.intro_ru}</p>

      <div className="mt-10 max-w-2xl rounded-card bg-warm-parchment p-6">
        <h2 className="text-heading-sm">{isEn ? "What's included" : "Что входит"}</h2>
        <ul className="mt-4 flex flex-col gap-2 text-body text-stone">
          {(isEn ? content.includes_en : content.includes_ru).map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden>—</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16 max-w-xl">
        <h2 className="mb-4 text-heading-sm">{tForm("taskLabel")}</h2>
        <LeadForm
          label="service_request"
          fields={[
            { type: "text", name: "name", label: tForm("nameLabel") },
            { type: "tel", name: "phone", label: tForm("phoneLabel") },
            { type: "textarea", name: "task", label: tForm("taskLabel"), placeholder: tForm("taskPlaceholder") },
          ]}
          hidden={{ service: service.id }}
          submitLabel={tForm("submitGetQuote")}
          backHref="/"
          backLabel={tForm("successBackHome")}
        />
      </div>
    </section>
  );
}
