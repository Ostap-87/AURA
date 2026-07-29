"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export type CarouselItem = { id: string; name: string; photo?: string };

const ANGLE_STEP = 30;
const PX_PER_STEP = 130;
const MAX_VISIBLE_OFFSET = 2;

/** Кратчайшее знаковое смещение по кругу — нужно, чтобы карусель закольцовывалась. */
function wrappedOffset(index: number, position: number, count: number): number {
  let raw = index - position;
  raw = ((raw % count) + count * 1.5) % count - count / 2;
  return raw;
}

/**
 * 3D-карусель категорий на главной: карточки «парят» на перспективе, а не
 * едут внутри рамки со скрытым переполнением — контейнер намеренно без
 * overflow-hidden. Перетаскивание мышью/тачем крутит колесо; клик по
 * карточке ведёт в каталог категории, если это был клик, а не драг.
 */
export function CategoryCarousel({
  items,
  emptyLabel,
  ariaLabel,
}: {
  items: CarouselItem[];
  emptyLabel: string;
  ariaLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const movedRef = useRef(false);
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const count = items.length;
  const position = activeIndex - dragPx / PX_PER_STEP;

  const step = useCallback(
    (delta: number) => {
      setActiveIndex((prev) => (((prev + delta) % count) + count) % count);
    },
    [count],
  );

  // Слушатели на window, а не setPointerCapture на контейнере: capture
  // переносит последующий click-событие на контейнер и ссылки-карточки
  // перестают открываться — драг не должен ломать переход по клику.
  function handlePointerDown(event: React.PointerEvent) {
    if (count < 2) return;
    if (event.button !== undefined && event.button !== 0) return;
    startXRef.current = event.clientX;
    movedRef.current = false;
    setIsDragging(true);
    setDragPx(0);

    const handleMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startXRef.current;
      if (Math.abs(delta) > 6) movedRef.current = true;
      setDragPx(delta);
    };
    const handleUp = (upEvent: PointerEvent) => {
      const delta = upEvent.clientX - startXRef.current;
      const steps = Math.round(delta / PX_PER_STEP);
      if (steps !== 0) step(-steps);
      setIsDragging(false);
      setDragPx(0);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
  }

  if (count === 0) return null;

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
      }}
      className="relative select-none [perspective:1200px] aspect-[4/3] w-full touch-pan-y"
      onPointerDown={handlePointerDown}
    >
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        {items.map((item, index) => {
          const offset = count > 1 ? wrappedOffset(index, position, count) : 0;
          const absOffset = Math.abs(offset);
          if (absOffset > MAX_VISIBLE_OFFSET) return null;

          const angle = offset * ANGLE_STEP;
          const scale = 1 - Math.min(absOffset * 0.14, 0.4);
          const opacity = 1 - Math.min(absOffset * 0.35, 0.85);

          return (
            <Link
              key={item.id}
              href={`/catalog/${item.id}`}
              aria-label={item.name}
              draggable={false}
              onClick={(e) => {
                if (movedRef.current) e.preventDefault();
              }}
              style={{
                transform: `translate(-50%, -50%) translateX(${offset * 78}px) rotateY(${-angle}deg) translateZ(-${absOffset * 70}px) scale(${scale})`,
                transition:
                  isDragging || prefersReducedMotion
                    ? "opacity 0.2s"
                    : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s",
                opacity,
                zIndex: 100 - Math.round(absOffset * 10),
              }}
              className="absolute left-1/2 top-1/2 block w-[44%] max-w-[220px] overflow-hidden rounded-card border border-ink bg-warm-parchment shadow-lg"
            >
              <div className="media-slot-empty relative aspect-[3/4]" aria-hidden={Boolean(item.photo)}>
                {item.photo && (
                  <Image
                    src={item.photo}
                    alt={item.name}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                )}
              </div>
              <div
                className={`absolute inset-x-0 bottom-0 px-3 py-2 ${
                  item.photo ? "bg-gradient-to-t from-ink/80 to-transparent" : ""
                }`}
              >
                {!item.photo && (
                  <p className="font-mono text-caption uppercase text-ash">{emptyLabel}</p>
                )}
                <p className={`text-body-sm font-medium ${item.photo ? "text-canvas" : "text-ink"}`}>
                  {item.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {count > 1 && (
        <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => step(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink bg-canvas text-body-sm"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => step(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink bg-canvas text-body-sm"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
