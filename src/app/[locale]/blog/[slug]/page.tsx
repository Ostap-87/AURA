import { blogPostingJsonLd, pageAlternates } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { MediaSlot } from "@/components/media/media-slot";
import { RichBody } from "@/components/blog/rich-body";
import { getBlogPosts } from "@/lib/data";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = (await getBlogPosts()).find((p) => p.slug === slug && p.published);
  if (!post) return {};
  return {
    title: locale === "en" ? post.title_en : post.title_ru,
    description: locale === "en" ? post.excerpt_en : post.excerpt_ru,
    alternates: pageAlternates(locale, `/blog/${slug}`),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const t = await getTranslations({ locale, namespace: "blog" });

  const post = (await getBlogPosts()).find((p) => p.slug === slug && p.published);
  if (!post) notFound();

  const title = isEn ? post.title_en : post.title_ru;
  const excerpt = isEn ? post.excerpt_en : post.excerpt_ru;
  const body = isEn ? post.body_en : post.body_ru;
  const coverCaption = isEn ? post.coverCaption_en : post.coverCaption_ru;

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 lg:px-10">
      <JsonLd
        data={blogPostingJsonLd({
          locale,
          path: `/blog/${post.slug}`,
          title,
          description: excerpt,
          author: post.author,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          image: post.cover,
        })}
      />
      <Breadcrumbs
        items={[
          { label: isEn ? "Home" : "Главная", href: "/" },
          { label: t("title"), href: "/blog" },
          { label: title },
        ]}
      />
      {post.tags.length > 0 && (
        <p className="mt-4 font-mono text-caption uppercase text-ash">{post.tags.join(" · ")}</p>
      )}
      <h1 className="mt-2 text-display">{title}</h1>

      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-body-sm text-stone">
        <span>
          {t("authorLabel")}: {post.author}
        </span>
        <span>
          {t("dateLabel")}: {post.publishedAt}
        </span>
      </div>

      <MediaSlot
        src={post.cover}
        caption={coverCaption}
        aspect="16/9"
        emptyBehavior="hidden"
        className="mt-8"
      />

      <RichBody body={body} />

      <div className="mt-12">
        <Link href="/blog" className="text-body-sm underline underline-offset-4 hover:text-stone">
          ← {t("backToBlog")}
        </Link>
      </div>
    </section>
  );
}
