import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Logo } from "@/components/layout/logo";
import { Analytics } from "@/components/analytics/analytics";
import { JsonLd } from "@/components/seo/json-ld";
import { getCategories, getConsulting } from "@/lib/data";
import { organizationJsonLd, siteUrl } from "@/lib/seo";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Aura Robotics",
  description:
    "Поставка робототехники и оборудования для производств из Китая напрямую с заводов.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
        </NextIntlClientProvider>
        <JsonLd data={organizationJsonLd()} />
        <Analytics />
      </body>
    </html>
  );
}
