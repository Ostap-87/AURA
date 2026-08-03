import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const monogram = readFileSync(path.join(process.cwd(), "public", "ar-monogram.png")).toString(
  "base64",
);

/** Фавикон: AR-монограмма из логотипа (public/logo.svg) на фирменном тёмном фоне (PROJECT.md, раздел 12 — SEO/соцсети). */
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
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse требует <img>, не next/image */}
        <img
          src={`data:image/png;base64,${monogram}`}
          width={22}
          height={13}
          alt=""
        />
      </div>
    ),
    { ...size },
  );
}
