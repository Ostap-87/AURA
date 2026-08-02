import { Reveal } from "@/components/motion/reveal";
import { pageAlternates } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MediaSlot } from "@/components/media/media-slot";
import { getBlogPosts } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: pageAlternates(locale, "/blog"),
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const t = await getTranslations({ locale, namespace: "blog" });

  const posts = (await getBlogPosts()).filter((p) => p.published);

  return (
    <section className="mx-auto max-w-(--container-page) px-5 py-16 lg:px-10">
      <h1 className="text-display">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-subheading text-stone">{t("description")}</p>

      {posts.length === 0 ? (
        <div className="mt-12 rounded-card border border-fog bg-warm-parchment p-8 text-center">
          <p className="text-heading-sm">{t("emptyTitle")}</p>
          <p className="mt-2 text-body text-stone">{t("emptyText")}</p>
        </div>
      ) : (
        <Reveal cascade className="mt-12 grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {posts.map((post) => {
            const title = isEn ? post.title_en : post.title_ru;
            const excerpt = isEn ? post.excerpt_en : post.excerpt_ru;

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-card border border-ink bg-warm-parchment p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                <MediaSlot
                  src={post.cover}
                  caption={isEn ? post.coverCaption_en : post.coverCaption_ru}
                  aspect="16/9"
                  emptyBehavior="hidden"
                  className="mb-4"
                />
                {post.tags.length > 0 && (
                  <p className="font-mono text-caption uppercase text-ash">{post.tags.join(" · ")}</p>
                )}
                <h2 className="mt-1 text-heading-sm">{title}</h2>
                <p className="mt-3 text-body-sm text-stone">{excerpt}</p>
                <p className="mt-4 font-mono text-caption text-ash">{post.publishedAt}</p>
              </Link>
            );
          })}
        </Reveal>
      )}
    </section>
  );
}
