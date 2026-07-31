import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Logo } from "@/components/layout/logo";
import { Analytics } from "@/components/analytics/analytics";
import { RobotMascot } from "@/components/mascot/robot-mascot";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategories, getConsulting } from "@/lib/data";
import { organizationJsonLd, pageAlternates, siteUrl, websiteJsonLd } from "@/lib/seo";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Метаданные по умолчанию для всего сайта (PROJECT.md, раздел 12).
 * title.template подхватывают дочерние generateMetadata, которые задают
 * title простой строкой — им не нужно самим дописывать «— Aura Robotics».
 * openGraph/twitter не переопределяют title/description — Next берёт их
 * из тех же полей метаданных страницы (см. доки Metadata API), поэтому
 * достаточно один раз задать здесь тип карточки, локаль и картинку —
 * страницы, у которых уже есть свой title/description, получат корректный
 * og:title/og:description бесплатно, без правки каждой страницы.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const alternateLocale = locale === "en" ? "ru_RU" : "en_US";
  const ogLocale = locale === "en" ? "en_US" : "ru_RU";

  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("defaultTitle"), template: t("titleTemplate") },
    description: t("defaultDescription"),
    alternates: pageAlternates(locale, "/"),
    openGraph: {
      type: "website",
      siteName: "Aura Robotics",
      locale: ogLocale,
      alternateLocale,
      url: locale === "en" ? `${siteUrl}/en` : siteUrl,
      // Картинку не переопределяем: она приходит из файловой конвенции
      // [locale]/opengraph-image.tsx и в объекте metadata её всё равно
      // перекрывает автодетект Next по тому же сегменту. У ru как локали
      // по умолчанию (as-needed) физический путь сегмента содержит «ru» —
      // «/ru/opengraph-image» отдаёт 307 на «/opengraph-image», это штатно
      // отрабатывается краулерами соцсетей (Facebook/Telegram/VK следуют
      // за редиректом при загрузке og:image).
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    verification: {
      ...(process.env.GOOGLE_SITE_VERIFICATION
        ? { google: process.env.GOOGLE_SITE_VERIFICATION }
        : {}),
      ...(process.env.YANDEX_VERIFICATION
        ? { yandex: process.env.YANDEX_VERIFICATION }
        : {}),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const [categories, consulting] = await Promise.all([getCategories(), getConsulting()]);
  const consultingCount = consulting.filter((c) => c.published).length;

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <noscript>
          <style>{`.reveal,.reveal-cascade>*{opacity:1 !important;animation:none !important}`}</style>
        </noscript>
        <NextIntlClientProvider messages={messages}>
          <Header
            categories={categories}
            consultingCount={consultingCount}
            locale={locale}
            logo={<Logo className="text-heading-sm" />}
          />
          <main>{children}</main>
          <Footer />
          <RobotMascot />
        </NextIntlClientProvider>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd(locale)} />
        <Analytics />
      </body>
    </html>
  );
}
