import { getTranslations, setRequestLocale } from "next-intl/server";
import { FaqList } from "@/components/faq/faq-list";
import { faqSections } from "@/lib/content/faq-content";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return { title: t("title") };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "faq" });
  const isEn = locale === "en";

  const sections = faqSections.map((section) => ({
    id: section.id,
    title: isEn ? section.title_en : section.title_ru,
    items: section.items.map((item) => ({
      id: item.id,
      q: isEn ? item.q_en : item.q_ru,
      a: isEn ? item.a_en : item.a_ru,
    })),
  }));

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:px-10">
      <h1 className="mb-8 text-display">{t("title")}</h1>
      <FaqList sections={sections} />
    </section>
  );
}
