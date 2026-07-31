import { pageAlternates } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/forms/lead-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Contacts" : "Контакты",
    description:
      locale === "en"
        ? "WhatsApp, Telegram, email and our Shanghai office phone — get in touch with Aura Robotics."
        : "WhatsApp, Telegram, почта и телефон офиса в Шанхае — свяжитесь с Aura Robotics.",
    alternates: pageAlternates(locale, "/contacts"),
  };
}

/** Порядок контактов и подписи адресов — PROJECT.md, раздел 13. */
const CONTACTS = [
  { label: "WhatsApp", value: "+7 985 874 49 58", href: "https://wa.me/79858744958" },
  { label: "Telegram", value: "@ostapdotcenko", href: "https://t.me/ostapdotcenko" },
  { label: "email", value: "inquairy@aura-robotics.ru", href: "mailto:inquairy@aura-robotics.ru" },
  { label: "shanghaiOffice", value: "+86 137 6171 6355", href: "tel:+8613761716355" },
];

export default async function ContactsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tForm = await getTranslations({ locale, namespace: "form" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const isEn = locale === "en";

  const labelFor = (key: string) =>
    key === "email" ? tFooter("email") : key === "shanghaiOffice" ? tFooter("officePhoneLabel") : key;

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
      <h1 className="text-display">{isEn ? "Contacts" : "Контакты"}</h1>

      <div className="mt-10 grid grid-cols-1 gap-12 tablet-lg:grid-cols-2">
        <div>
          <ul className="flex flex-col gap-3 text-body">
            {CONTACTS.map((contact) => (
              <li key={contact.label}>
                <a href={contact.href} className="hover:underline">
                  <span className="text-stone">{labelFor(contact.label)}: </span>
                  {contact.value}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-6 text-body-sm text-stone">
            <div>
              <p className="text-caption uppercase text-ash">{tFooter("legalAddressLabel")}</p>
              <p className="mt-1">{tFooter("legalAddress")}</p>
            </div>
            <div>
              <p className="text-caption uppercase text-ash">{tFooter("officeAddressLabel")}</p>
              <p className="mt-1">{tFooter("officeAddress")}</p>
              <p className="mt-1 text-caption text-ash">{tFooter("officeTimezone")}</p>
            </div>
            <div>
              <p className="font-mono">{tFooter("legalNameZh")}</p>
              <p>{tFooter("legalNameEn")}</p>
            </div>
          </div>
        </div>

        <div className="max-w-xl">
          <h2 className="mb-4 text-heading-sm">{isEn ? "Ask a question" : "Задать вопрос"}</h2>
          <LeadForm
            label="contacts"
            fields={[
              { type: "text", name: "name", label: tForm("nameLabel") },
              {
                type: "text",
                name: "contact",
                label: isEn ? "Phone or email" : "Телефон или почта",
              },
              {
                type: "textarea",
                name: "message",
                label: isEn ? "Message" : "Сообщение",
              },
            ]}
            submitLabel={isEn ? "Send a question" : "Отправить вопрос"}
            backHref="/"
            backLabel={tForm("successBackHome")}
          />
        </div>
      </div>
    </section>
  );
}
