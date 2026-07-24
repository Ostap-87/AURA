"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Появление секции: fade + сдвиг 24px, 400 мс, ease-out, один раз
 * (design/tokens.md, «Анимации»). cascade добавляет задержку 60 мс между
 * соседями — только на десктопе, на мобильных каскад отключён.
 * prefers-reduced-motion показывает контент сразу; без JS контент
 * открывает noscript-стиль в layout.
 */
export function Reveal({
  children,
  cascade = false,
  className = "",
}: {
  children: React.ReactNode;
  cascade?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!cascade) return;
    const el = ref.current;
    if (!el || window.matchMedia("(max-width: 767px)").matches) return;
    Array.from(el.children).forEach((child, index) => {
      (child as HTMLElement).style.setProperty("--reveal-delay", `${index * 60}ms`);
    });
  }, [cascade]);

  const base = cascade ? "reveal-cascade" : "reveal";
  return (
    <div ref={ref} className={`${base}${revealed ? " is-revealed" : ""}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
