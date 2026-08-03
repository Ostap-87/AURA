import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const monogram = readFileSync(path.join(process.cwd(), "public", "ar-monogram.png")).toString(
  "base64",
);

export default function AppleIcon() {
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
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse требует <img>, не next/image */}
        <img
          src={`data:image/png;base64,${monogram}`}
          width={120}
          height={71}
          alt=""
        />
      </div>
    ),
    { ...size },
  );
}
