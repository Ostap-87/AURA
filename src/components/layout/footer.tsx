import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const NAV_LINKS = [
  { key: "navDelivery", href: "/delivery" },
  { key: "navPayment", href: "/payment" },
  { key: "navQuiz", href: "/quiz" },
  { key: "navFaq", href: "/faq" },
  { key: "navCases", href: "/cases" },
  { key: "navBlog", href: "/blog" },
  { key: "navAbout", href: "/about" },
  { key: "navPartners", href: "/partners" },
  { key: "navContacts", href: "/contacts" },
  { key: "navPolicy", href: "/policy" },
] as const;

const CONTACTS = {
  whatsapp: { label: "+7 985 874 49 58", href: "https://wa.me/79858744958" },
  telegram: { label: "@ostapdotcenko", href: "https://t.me/ostapdotcenko" },
  email: { label: "inquairy@aura-robotics.ru", href: "mailto:inquairy@aura-robotics.ru" },
  officePhone: { label: "+86 137 6171 6355", href: "tel:+8613761716355" },
};

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-fog bg-ink text-canvas">
      <div className="mx-auto flex max-w-(--container-page) flex-col gap-10 px-5 py-16 lg:flex-row lg:justify-between lg:px-10">
        <div className="flex flex-col gap-2 text-body-sm text-fog">
          <p className="font-mono">{t("legalNameZh")}</p>
          <p>{t("legalNameEn")}</p>
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-caption uppercase text-ash">{t("legalAddressLabel")}</span>
            <span>{t("legalAddress")}</span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-caption uppercase text-ash">{t("officeAddressLabel")}</span>
            <span>{t("officeAddress")}</span>
            <span className="text-caption text-ash">{t("officeTimezone")}</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-body-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.key} href={link.href} className="hover:text-accent">
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-body-sm">
          <a href={CONTACTS.whatsapp.href} className="hover:text-accent">
            {t("whatsapp")}: {CONTACTS.whatsapp.label}
          </a>
          <a href={CONTACTS.telegram.href} className="hover:text-accent">
            {t("telegram")}: {CONTACTS.telegram.label}
          </a>
          <a href={CONTACTS.email.href} className="hover:text-accent">
            {t("email")}: {CONTACTS.email.label}
          </a>
          <a href={CONTACTS.officePhone.href} className="hover:text-accent">
            {t("officePhoneLabel")}: {CONTACTS.officePhone.label}
          </a>
        </div>
      </div>
      <div className="border-t border-charcoal">
        <div className="mx-auto flex max-w-(--container-page) flex-col gap-1 px-5 py-6 text-caption text-ash lg:px-10">
          <span>
            {t("uscc")}: {t("uscPending")}
          </span>
          <span>© {new Date().getFullYear()} {t("copyright")}</span>
        </div>
      </div>
    </footer>
  );
}
