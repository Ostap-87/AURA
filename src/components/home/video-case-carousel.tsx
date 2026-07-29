"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { wrappedOffset } from "@/lib/carousel-math";

export type VideoCaseItem = { id: string; title: string; video?: string; hasDetail: boolean };

const ANGLE_STEP = 22;
const PX_PER_STEP = 160;
const MAX_VISIBLE_OFFSET = 2;
const AUTOPLAY_MS = 4500;

/**
 * Полноширинная 3D-карусель видео-кейсов на главной — крутится сама
 * (пауза на драге/наведении/prefers-reduced-motion), радиус растянут
 * на всю секцию, а не на половину колонки, как у CategoryCarousel.
 * Общая математика вынесена в lib/carousel-math, остальное отдельно:
 * тут видео вместо фото и автопрокрутка вместо только ручной.
 */
export function VideoCaseCarousel({
  items,
  emptyLabel,
  ariaLabel,
}: {
  items: VideoCaseItem[];
  emptyLabel: string;
  ariaLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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

  useEffect(() => {
    if (count < 2 || prefersReducedMotion || isDragging || isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [count, prefersReducedMotion, isDragging, isPaused]);

  function step(delta: number) {
    setActiveIndex((prev) => (((prev + delta) % count) + count) % count);
  }

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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative mx-auto aspect-[21/9] w-full max-w-(--container-page) select-none touch-pan-y [perspective:1600px]"
      onPointerDown={handlePointerDown}
    >
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        {items.map((item, index) => {
          const offset = count > 1 ? wrappedOffset(index, position, count) : 0;
          const absOffset = Math.abs(offset);
          if (absOffset > MAX_VISIBLE_OFFSET) return null;

          const angle = offset * ANGLE_STEP;
          const scale = 1 - Math.min(absOffset * 0.16, 0.45);
          const opacity = 1 - Math.min(absOffset * 0.4, 0.9);
          const isActive = absOffset < 0.5;

          const card = (
            <>
              <div className="media-slot-empty relative aspect-video" aria-hidden={Boolean(item.video)}>
                {item.video && (
                  <video
                    src={item.video}
                    className="absolute inset-0 h-full w-full object-cover"
                    autoPlay={isActive || absOffset <= 1}
                    muted
                    loop
                    playsInline
                  />
                )}
              </div>
              <div
                className={`absolute inset-x-0 bottom-0 px-4 py-3 ${
                  item.video ? "bg-gradient-to-t from-ink/80 to-transparent" : ""
                }`}
              >
                {!item.video && (
                  <p className="font-mono text-caption uppercase text-ash">{emptyLabel}</p>
                )}
                {item.title && (
                  <p className={`text-body-sm font-medium ${item.video ? "text-canvas" : "text-ink"}`}>
                    {item.title}
                  </p>
                )}
              </div>
              {/* Затемнение дальних карточек — «уходят в полукруг», а не просто тускнеют целиком */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-ink"
                style={{ opacity: Math.min(absOffset * 0.32, 0.7) }}
              />
            </>
          );

          const style: React.CSSProperties = {
            transform: `translate(-50%, -50%) translateX(${offset * 210}px) rotateY(${-angle}deg) translateZ(-${absOffset * 130}px) scale(${scale})`,
            transition:
              isDragging || prefersReducedMotion
                ? "opacity 0.2s"
                : "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s",
            opacity,
            zIndex: 100 - Math.round(absOffset * 10),
          };

          return item.hasDetail ? (
            <Link
              key={item.id}
              href={`/cases/${item.id}`}
              aria-label={item.title}
              draggable={false}
              onClick={(e) => {
                if (movedRef.current) e.preventDefault();
              }}
              style={style}
              className="absolute left-1/2 top-1/2 block w-[60%] max-w-[420px] overflow-hidden rounded-card border border-ink bg-warm-parchment shadow-lg"
            >
              {card}
            </Link>
          ) : (
            <div
              key={item.id}
              style={style}
              className="absolute left-1/2 top-1/2 block w-[60%] max-w-[420px] overflow-hidden rounded-card border border-fog bg-warm-parchment shadow-lg"
            >
              {card}
            </div>
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
