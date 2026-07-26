import { Reveal } from "@/components/motion/reveal";
import { pageAlternates } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MediaSlot } from "@/components/media/media-slot";
import { caseTypeLabel } from "@/lib/case-types";
import { casesIntro } from "@/lib/content/cases-content";
import { getCases } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? casesIntro.title_en : casesIntro.title_ru,
    description: isEn ? casesIntro.description_en : casesIntro.description_ru,
    alternates: pageAlternates(locale, "/cases"),
  };
}

export default async function CasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const t = await getTranslations({ locale, namespace: "cases" });

  const cases = (await getCases())
    .filter((c) => c.published)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
      <h1 className="text-display">{isEn ? casesIntro.title_en : casesIntro.title_ru}</h1>
      <p className="mt-4 max-w-2xl text-subheading text-stone">
        {isEn ? casesIntro.description_en : casesIntro.description_ru}
      </p>

      {cases.length === 0 ? (
        <div className="mt-12 rounded-card border border-fog bg-warm-parchment p-8 text-center">
          <p className="text-heading-sm">{t("emptyTitle")}</p>
          <p className="mt-2 text-body text-stone">{t("emptyText")}</p>
        </div>
      ) : (
        <Reveal cascade className="mt-12 grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {cases.map((item) => {
            const hasPage = Boolean(item.fullText_ru);
            const title = isEn ? item.title_en : item.title_ru;
            const client = isEn && item.client_en ? item.client_en : item.client_ru;
            const quote = isEn && item.quote_en ? item.quote_en : item.quote_ru;
            const author = isEn && item.author_en ? item.author_en : item.author_ru;
            const summary = isEn && item.summary_en ? item.summary_en : item.summary_ru;

            const inner = (
              <>
                <MediaSlot
                  src={item.photo}
                  caption={item.photoCaption}
                  aspect="4/3"
                  emptyBehavior="hidden"
                  className="mb-4"
                />
                <p className="font-mono text-caption uppercase text-ash">
                  {caseTypeLabel(item.type, locale)}
                </p>
                <h2 className="mt-1 text-heading-sm">{title}</h2>
                {client && <p className="mt-1 text-body-sm text-stone">{client}</p>}
                {item.type === "отзыв" && quote ? (
                  <blockquote className="mt-3 text-body text-stone">«{quote}»</blockquote>
                ) : (
                  <p className="mt-3 text-body-sm text-stone">{summary}</p>
                )}
                {author && <p className="mt-3 font-mono text-caption text-ash">{author}</p>}
                {item.date && <p className="mt-1 font-mono text-caption text-ash">{item.date}</p>}
              </>
            );

            return hasPage ? (
              <Link
                key={item.id}
                href={`/cases/${item.id}`}
                className="rounded-card border border-ink bg-warm-parchment p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                {inner}
              </Link>
            ) : (
              <div key={item.id} className="rounded-card border border-fog bg-warm-parchment p-6">
                {inner}
              </div>
            );
          })}
        </Reveal>
      )}
    </section>
  );
}
