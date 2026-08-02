import { getBlogPosts } from "@/lib/data";
import { localeUrl } from "@/lib/seo";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS feed for the ru blog, used to connect the site to Yandex Zen without manual publishing. */
export async function GET() {
  const posts = (await getBlogPosts())
    .filter((p) => p.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const items = posts
    .map((post) => {
      const url = localeUrl("ru", `/blog/${post.slug}`);
      const pubDate = new Date(post.publishedAt).toUTCString();
      return `
    <item>
      <title>${escapeXml(post.title_ru)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt_ru)}</description>
      <content:encoded><![CDATA[${post.body_ru.replace(/^## (.+)$/gm, "<h2>$1</h2>").replace(/\n\n/g, "</p><p>")}]]></content:encoded>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Aura Robotics — Блог</title>
    <link>${localeUrl("ru", "/blog")}</link>
    <description>Гуманоидные роботы, робособаки и промышленное оборудование из Китая: разбор моделей из каталога Aura Robotics.</description>
    <language>ru</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
