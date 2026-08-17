import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "aura-robotics.ru" },
      { protocol: "https", hostname: "www.aura-robotics.ru" },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default withNextIntl(nextConfig);
