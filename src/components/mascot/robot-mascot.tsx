"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Маленький робот-гуманоид в углу экрана (по просьбе владельца,
 * осознанное отступление от лимита анимаций tokens.md):
 * — подпрыгивает, когда при прокрутке сменяется секция;
 * — зрачки следят за курсором;
 * — при наведении машет рукой, при клике делает сальто.
 * Только десктоп с мышью и без prefers-reduced-motion; на мобильных
 * не рендерится вовсе. aria-hidden — для скринридеров его нет.
 */
export function RobotMascot() {
  const [enabled, setEnabled] = useState(false);
  const [hopping, setHopping] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Прыжок при смене секции: срабатывает, когда новая секция пересекает
  // середину экрана
  useEffect(() => {
    if (!enabled) return;
    let current: Element | null = null;
    let timer: number | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target !== current) {
            if (current !== null) {
              setHopping(true);
              window.clearTimeout(timer);
              timer = window.setTimeout(() => setHopping(false), 700);
            }
            current = entry.target;
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    document.querySelectorAll("main section").forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [enabled]);

  // Зрачки следят за курсором
  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: MouseEvent) => {
      const root = rootRef.current;
      const pupils = pupilsRef.current;
      if (!root || !pupils) return;
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.3;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy) || 1;
      const reach = Math.min(2.2, distance / 60);
      pupils.style.transform = `translate(${(dx / distance) * reach}px, ${(dy / distance) * reach}px)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  const onClick = () => {
    if (flipping) return;
    setFlipping(true);
    window.setTimeout(() => setFlipping(false), 900);
  };

  return (
    <div
      ref={rootRef}
      aria-hidden
      onClick={onClick}
      className={`mascot ${hopping ? "mascot-hop" : ""} ${flipping ? "mascot-flip" : ""}`.trim()}
    >
      <svg width="64" height="84" viewBox="0 0 64 84" fill="none" className="mascot-body">
        {/* тень на «земле» */}
        <ellipse className="mascot-shadow" cx="32" cy="80" rx="16" ry="3.5" fill="var(--color-fog)" />
        <g className="mascot-inner">
          {/* антенна */}
          <line x1="32" y1="10" x2="32" y2="3" stroke="var(--color-ink)" strokeWidth="1.5" />
          <circle className="mascot-antenna-tip" cx="32" cy="2.5" r="2.5" fill="var(--color-ink)" />
          {/* голова */}
          <rect x="16" y="10" width="32" height="24" rx="7" fill="var(--color-canvas)" stroke="var(--color-ink)" strokeWidth="1.5" />
          {/* глаза */}
          <circle cx="26" cy="22" r="4.5" fill="var(--color-canvas)" stroke="var(--color-ink)" strokeWidth="1.2" />
          <circle cx="38" cy="22" r="4.5" fill="var(--color-canvas)" stroke="var(--color-ink)" strokeWidth="1.2" />
          <g ref={pupilsRef}>
            <circle cx="26" cy="22" r="2" fill="var(--color-ink)" />
            <circle cx="38" cy="22" r="2" fill="var(--color-ink)" />
          </g>
          {/* веки для моргания */}
          <g className="mascot-eyelids">
            <rect x="21" y="17" width="10" height="10" rx="5" fill="var(--color-canvas)" />
            <rect x="33" y="17" width="10" height="10" rx="5" fill="var(--color-canvas)" />
          </g>
          {/* рот */}
          <line x1="28" y1="29" x2="36" y2="29" stroke="var(--color-ink)" strokeWidth="1.2" strokeLinecap="round" />
          {/* корпус */}
          <rect x="20" y="38" width="24" height="24" rx="6" fill="var(--color-canvas)" stroke="var(--color-ink)" strokeWidth="1.5" />
          <rect x="27" y="44" width="10" height="7" rx="2" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
          {/* левая рука */}
          <line x1="18" y1="42" x2="12" y2="52" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" />
          {/* правая рука — машет при наведении */}
          <g className="mascot-arm">
            <line x1="0" y1="0" x2="7" y2="10" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11.5" r="2" fill="var(--color-ink)" />
          </g>
          {/* ноги */}
          <line x1="26" y1="63" x2="26" y2="72" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="63" x2="38" y2="72" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="73" x2="28" y2="73" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
          <line x1="34" y1="73" x2="40" y2="73" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
