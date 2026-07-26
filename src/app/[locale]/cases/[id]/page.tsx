import { pageAlternates } from "@/lib/seo";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { MediaSlot } from "@/components/media/media-slot";
import { caseTypeLabel } from "@/lib/case-types";
import { casesIntro } from "@/lib/content/cases-content";
import { getCases } from "@/lib/data";

/** Страница кейса существует только при заполненном fullText (тот же приём, что у консалтинга). */
export async function generateStaticParams() {
  const cases = await getCases();
  return cases.filter((c) => c.published && c.fullText_ru).map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const item = (await getCases()).find((c) => c.id === id && c.published);
  if (!item) return {};
  return {
    title: locale === "en" ? item.title_en : item.title_ru,
    description: locale === "en" && item.summary_en ? item.summary_en : item.summary_ru,
    alternates: pageAlternates(locale, `/cases/${id}`),
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const t = await getTranslations({ locale, namespace: "cases" });

  const item = (await getCases()).find((c) => c.id === id && c.published && c.fullText_ru);
  if (!item) notFound();

  const title = isEn ? item.title_en : item.title_ru;
  const client = isEn && item.client_en ? item.client_en : item.client_ru;
  const fullText = isEn && item.fullText_en ? item.fullText_en : item.fullText_ru;
  const quote = isEn && item.quote_en ? item.quote_en : item.quote_ru;
  const author = isEn && item.author_en ? item.author_en : item.author_ru;

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 lg:px-10">
      <Breadcrumbs
        items={[
          { label: isEn ? "Home" : "Главная", href: "/" },
          { label: isEn ? casesIntro.title_en : casesIntro.title_ru, href: "/cases" },
          { label: title },
        ]}
      />
      <p className="mt-4 font-mono text-caption uppercase text-ash">
        {caseTypeLabel(item.type, locale)}
      </p>
      <h1 className="mt-2 text-display">{title}</h1>

      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-body-sm text-stone">
        {client && (
          <span>
            {t("clientLabel")}: {client}
          </span>
        )}
        {item.date && (
          <span>
            {t("dateLabel")}: {item.date}
          </span>
        )}
      </div>

      <MediaSlot
        src={item.photo}
        caption={item.photoCaption}
        aspect="16/9"
        emptyBehavior="hidden"
        className="mt-8"
      />

      <p className="mt-8 whitespace-pre-line text-body text-stone">{fullText}</p>

      {quote && (
        <blockquote className="mt-8 border-l-2 border-ink pl-4 text-heading-sm">
          «{quote}»
          {author && <footer className="mt-2 font-mono text-caption text-ash">{author}</footer>}
        </blockquote>
      )}

      <div className="mt-12">
        <Link href="/cases" className="text-body-sm underline underline-offset-4 hover:text-stone">
          ← {t("backToCases")}
        </Link>
      </div>
    </section>
  );
}
