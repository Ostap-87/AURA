"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    ym?: (id: string, action: string, ...args: unknown[]) => void;
  }
}

/**
 * Yandex Metrika's snippet in <Analytics> fires a 'hit' once, on the first
 * script load. Next.js App Router navigates client-side (no full reload),
 * so every route change after that first load was invisible to Metrika —
 * only ever one pageview counted per visit no matter how many pages the
 * visitor actually browsed. This sends an explicit 'hit' on every route
 * change so internal navigation is counted the way Metrika expects.
 */
function MetrikaPageviewInner() {
  const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!metrikaId) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const query = searchParams.toString();
    window.ym?.(metrikaId, "hit", query ? `${pathname}?${query}` : pathname);
  }, [metrikaId, pathname, searchParams]);

  return null;
}

export function MetrikaPageview() {
  return (
    <Suspense fallback={null}>
      <MetrikaPageviewInner />
    </Suspense>
  );
}
