"use client";

import { useTranslations } from "next-intl";
import { TELEGRAM_CHANNEL_URL } from "./footer";

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M21.5 4.5 2.7 11.9c-1.15.46-1.14 1.1-.21 1.38l4.8 1.5 1.85 5.63c.23.63.4.88.82.88.4 0 .58-.18.8-.4l1.94-1.87 4.03 2.97c.74.41 1.28.2 1.47-.68l2.66-12.55c.28-1.15-.44-1.67-1.36-1.26Zm-2.7 3.02L9.3 14.6l-.38 3.53-1.85-5.62 12.4-4.99Z" />
    </svg>
  );
}

export function TelegramFloatingButton() {
  const t = useTranslations("footer");

  return (
    <a
      href={TELEGRAM_CHANNEL_URL}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-[#2AABEE] px-4 py-3 text-body-sm font-semibold text-white shadow-lg shadow-black/30 transition-transform hover:scale-105"
      aria-label={t("telegramSubscribeAria")}
    >
      <TelegramIcon />
      <span className="hidden sm:inline">{t("telegramSubscribe")}</span>
    </a>
  );
}
