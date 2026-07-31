"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { wrappedOffset } from "@/lib/carousel-math";

export type CarouselItem = { id: string; name: string; photo?: string };

const ANGLE_STEP = 30;
const PX_PER_STEP = 130;
const MAX_VISIBLE_OFFSET = 2;
/** Сколько мс уходит на непрерывный оборот на одну карточку вперёд. */
const ROTATION_PERIOD_MS = 6000;
/** Горизонтальный шаг между карточками: меньше на мобильных (карточки уже). */
const CARD_OFFSET_PX_DESKTOP = 160;
const CARD_OFFSET_PX_MOBILE = 100;

/**
 * 3D-карусель категорий на главной: карточки «парят» на перспективе, а не
 * едут внутри рамки со скрытым переполнением — контейнер намеренно без
 * overflow-hidden. Крутится сама непрерывно и плавно (requestAnimationFrame,
 * без рывков и остановок); перетаскивание мышью/тачем останавливает
 * автовращение на время драга и крутит колесо руками, а после отпускания
 * оно продолжается с той же точки. Клик по карточке ведёт в каталог
 * категории, если это был клик, а не драг.
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
  const [basePosition, setBasePosition] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
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
  const isDesktop = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
    [],
  );
  const cardOffsetPx = isDesktop ? CARD_OFFSET_PX_DESKTOP : CARD_OFFSET_PX_MOBILE;

  const count = items.length;
  const position = basePosition - dragPx / PX_PER_STEP;

  // Короткая метка «это был осознанный прыжок на карточку» (кнопка,
  // стрелка на клавиатуре, отпускание после драга) — только тогда включаем
  // CSS-переход на transform. Непрерывное автовращение крутит transform
  // само по себе каждый кадр, ему лишний transition только мешает плавности.
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

  const step = useCallback(
    (delta: number) => {
      triggerDiscreteJump();
      setBasePosition((prev) => (((prev + delta) % count) + count) % count);
    },
    [count, triggerDiscreteJump],
  );

  // Непрерывное плавное автовращение через requestAnimationFrame — без
  // остановок между карточками. Останавливается на время ручного драга,
  // при prefers-reduced-motion и во время короткого дискретного прыжка.
  useEffect(() => {
    if (count < 2 || prefersReducedMotion || isDragging) return;
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
  }, [count, prefersReducedMotion, isDragging]);

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
                transform: `translate(-50%, -50%) translateX(${offset * cardOffsetPx}px) rotateY(${-angle}deg) translateZ(-${absOffset * 70}px) scale(${scale})`,
                // Во время непрерывного автовращения transform обновляется
                // каждый кадр без перехода — плавность даёт сам rAF, а не
                // CSS-transition. Переход на transform включаем только для
                // дискретного прыжка (кнопка/стрелка/отпускание после драга).
                transition:
                  isDragging || prefersReducedMotion
                    ? "opacity 0.2s"
                    : discreteJump
                      ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s"
                      : "opacity 0.3s",
                opacity,
                zIndex: 100 - Math.round(absOffset * 10),
              }}
              className="absolute left-1/2 top-1/2 block w-[54%] max-w-[280px] overflow-hidden rounded-card border border-ink bg-warm-parchment shadow-lg lg:w-[450px] lg:max-w-none"
            >
              <div className="media-slot-empty relative aspect-[3/4]" aria-hidden={Boolean(item.photo)}>
                {item.photo && (
                  <Image
                    src={item.photo}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1024px) 450px, 280px"
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
