import { existsSync } from "node:fs";
import path from "node:path";
import { useTranslations } from "next-intl";

const LOGO_CANDIDATES = ["logo.svg", "logo.png", "logo.webp"] as const;

/**
 * Читает public/logo.{svg,png,webp} на сервере. Замена файла меняет логотип
 * без правки кода (PROJECT.md, раздел 6 «Логотип»). Нет файла — текстовый
 * запасной вариант шрифтом Inter. Высота фиксирована (h-11) — className из
 * вызова добавляется поверх, но не задаёт размер картинки (font-size на
 * <img> не действует). Один и тот же логотип на всех экранах: вариант
 * «иконка над названием» достаточно компактный по ширине и помещается
 * в шапку рядом с меню даже на узких мобильных (проверено от 360px).
 */
export function Logo({ className }: { className?: string }) {
  const t = useTranslations("logo");
  const publicDir = path.join(process.cwd(), "public");
  const logoFile = LOGO_CANDIDATES.find((name) => existsSync(path.join(publicDir, name)));

  if (logoFile) {
    // eslint-disable-next-line @next/next/no-img-element -- логотип: интринсик-размер файла, next/image избыточен для статичной картинки в шапке
    return <img src={`/${logoFile}`} alt={t("alt")} className={`h-11 w-auto ${className ?? ""}`} />;
  }

  return (
    <span className={className} style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}>
      AURA ROBOTICS
    </span>
  );
}
