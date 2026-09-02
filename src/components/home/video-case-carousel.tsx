"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { wrappedOffset } from "@/lib/carousel-math";

export type VideoCaseItem = {
  id: string;
  title: string;
  video?: string;
  orientation: "horizontal" | "vertical";
  hasDetail: boolean;
};

const ANGLE_STEP = 22;
const PX_PER_STEP = 160;
const MAX_VISIBLE_OFFSET = 2;
/** Сколько мс уходит на непрерывный оборот на одну карточку вперёд. */
const ROTATION_PERIOD_MS = 6000;

/**
 * Полноширинная 3D-карусель видео-кейсов на главной — крутится сама
 * непрерывно и плавно через requestAnimationFrame, без рывков и остановок
 * между карточками (пауза на драге/наведении/prefers-reduced-motion),
 * радиус растянут на всю секцию, а не на половину колонки, как у
 * CategoryCarousel. Общая математика — в lib/carousel-math, остальное
 * отдельно: тут видео вместо фото и наведение тоже ставит на паузу.
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
  const [basePosition, setBasePosition] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [discreteJump, setDiscreteJump] = useState(false);
  const startXRef = useRef(0);
  const movedRef = useRef(false);
  const jumpTimeoutRef = useRef<number | null>(null);
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const count = items.length;
  const position = basePosition - dragPx / PX_PER_STEP;

  // Короткая метка «осознанный прыжок» (кнопка/стрелка/отпускание после
  // драга) — только тогда включаем CSS-переход на transform. Непрерывное
  // автовращение крутит transform каждый кадр само, без transition.
  const triggerDiscreteJump = useCallback(() => {
    setDiscreteJump(true);
    if (jumpTimeoutRef.current) window.clearTimeout(jumpTimeoutRef.current);
    jumpTimeoutRef.current = window.setTimeout(() => setDiscreteJump(false), 500);
  }, []);

  useEffect(() => {
    return () => {
      if (jumpTimeoutRef.current) window.clearTimeout(jumpTimeoutRef.current);
    };
  }, []);

  // Непрерывное плавное автовращение через requestAnimationFrame — без
  // остановок между карточками. Пауза на время драга, наведения мыши и
  // при prefers-reduced-motion.
  useEffect(() => {
    if (count < 2 || prefersReducedMotion || isDragging || isPaused) return;
    let frameId: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setBasePosition((prev) => (prev + dt / ROTATION_PERIOD_MS) % count);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [count, prefersReducedMotion, isDragging, isPaused]);

  const step = useCallback(
    (delta: number) => {
      triggerDiscreteJump();
      setBasePosition((prev) => (((prev + delta) % count) + count) % count);
    },
    [count, triggerDiscreteJump],
  );

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

          const isVertical = item.orientation === "vertical";

          const card = (
            <>
              <div
                className={`media-slot-empty relative ${isVertical ? "aspect-[9/16]" : "aspect-video"}`}
                aria-hidden={Boolean(item.video)}
              >
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
            transform: `translate(-50%, -50%) translateX(${offset * 420}px) rotateY(${-angle}deg) translateZ(-${absOffset * 260}px) scale(${scale})`,
            // Непрерывное автовращение крутит transform каждый кадр без
            // перехода — плавность даёт rAF. Transition на transform — только
            // для дискретного прыжка (кнопка/стрелка/отпускание после драга).
            transition:
              isDragging || prefersReducedMotion
                ? "opacity 0.2s"
                : discreteJump
                  ? "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s"
                  : "opacity 0.3s",
            opacity,
            zIndex: 100 - Math.round(absOffset * 10),
          };

          // Вертикальные ролики занимают меньше ширины слота — иначе
          // portrait-видео растянутое до 60% ширины секции выглядит
          // непропорционально огромным рядом с 16:9 карточками.
          const cardWidthClass = isVertical ? "w-[28%] max-w-[380px]" : "w-[60%] max-w-[840px]";

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
              className={`absolute left-1/2 top-1/2 block ${cardWidthClass} overflow-hidden rounded-card border border-ink bg-warm-parchment shadow-lg`}
            >
              {card}
            </Link>
          ) : (
            <div
              key={item.id}
              style={style}
              className={`absolute left-1/2 top-1/2 block ${cardWidthClass} overflow-hidden rounded-card border border-fog bg-warm-parchment shadow-lg`}
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
