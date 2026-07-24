import { existsSync } from "node:fs";
import path from "node:path";
import { useTranslations } from "next-intl";

/**
 * Читает public/logo.svg на сервере. Замена файла меняет логотип без
 * правки кода (PROJECT.md, раздел 6 «Логотип»). Нет файла — текстовый
 * запасной вариант шрифтом Inter.
 */
export function Logo({ className }: { className?: string }) {
  const t = useTranslations("logo");
  const hasLogoFile = existsSync(path.join(process.cwd(), "public", "logo.svg"));

  if (hasLogoFile) {
    // eslint-disable-next-line @next/next/no-img-element -- логотип: SVG без next/image, размер задаёт CSS
    return <img src="/logo.svg" alt={t("alt")} className={className} />;
  }

  return (
    <span className={className} style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}>
      AURA ROBOTICS
    </span>
  );
}
