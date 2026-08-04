"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Кастомная 404 вместо родовой заглушки Next.js. Клиентский компонент,
 * а не серверный: not-found.tsx в App Router не получает params даже
 * внутри динамического сегмента [locale], поэтому локаль неоткуда взять
 * на сервере — next-intl подхватывает её из контекста NextIntlClientProvider
 * (см. [locale]/layout.tsx), который оборачивает и эту страницу тоже.
 */
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="mx-auto flex max-w-(--container-page) flex-col items-start gap-6 px-5 py-24 lg:px-10">
      <p className="font-mono text-caption uppercase text-ash">404</p>
      <h1 className="text-heading-lg">{t("title")}</h1>
      <p className="max-w-prose text-body text-stone">{t("description")}</p>
      <nav className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/"
          className="rounded-full border border-ink px-5 py-2.5 text-body-sm hover:bg-ink hover:text-canvas"
        >
          {t("home")}
        </Link>
        <Link
          href="/catalog"
          className="rounded-full border border-fog px-5 py-2.5 text-body-sm hover:border-ink"
        >
          {t("catalog")}
        </Link>
        <Link href="/blog" className="rounded-full border border-fog px-5 py-2.5 text-body-sm hover:border-ink">
          {t("blog")}
        </Link>
        <Link
          href="/contacts"
          className="rounded-full border border-fog px-5 py-2.5 text-body-sm hover:border-ink"
        >
          {t("contacts")}
        </Link>
      </nav>
    </main>
  );
}
