import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Aura Robotics";

const TAGLINE: Record<string, string> = {
  ru: "Робототехника и оборудование для производств напрямую с заводов Китая",
  en: "Robotics and production equipment direct from Chinese factories",
};

/**
 * Картинка для og:image / twitter:image, локализованная по сегменту [locale]
 * (PROJECT.md, раздел 12 — соцсети должны верно читать заголовки на обоих
 * языках). Логотипа-файла нет, поэтому используем тот же текстовый вид,
 * что и фолбэк <Logo> в шапке.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tagline = TAGLINE[locale] ?? TAGLINE.ru;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#262626",
          padding: "80px 96px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -2,
            color: "#ffffff",
            fontFamily: "sans-serif",
          }}
        >
          AURA ROBOTICS
        </div>
        <div style={{ display: "flex", width: 120, height: 8, background: "#fff65d", marginTop: 32 }} />
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 36,
            color: "#d9d7d5",
            fontFamily: "sans-serif",
            maxWidth: 920,
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
