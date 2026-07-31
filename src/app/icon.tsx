import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Фавикон: буква A на фирменном тёмном фоне (PROJECT.md, раздел 12 — SEO/соцсети). Нет файла логотипа — держим то же решение, что и текстовый фолбэк Logo. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#262626",
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "sans-serif",
          }}
        >
          A
        </span>
      </div>
    ),
    { ...size },
  );
}
