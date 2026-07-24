"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function FactoryModalShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("catalog");
  const router = useRouter();

  const close = () => router.back();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 tablet-lg:items-center tablet-lg:p-6">
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-card bg-canvas p-6 tablet-lg:rounded-card tablet-lg:p-8"
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={close}
            aria-label={t("modalClose")}
            autoFocus
            className="flex h-11 w-11 items-center justify-center"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
