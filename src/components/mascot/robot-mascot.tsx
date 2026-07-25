"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";

type MascotApi = {
  play: (gesture: "wave" | "jump" | "point" | "nod" | "scan" | "shrug") => void;
  destroy: (() => void) | null;
  ready: boolean;
};

type AuraMascotGlobal = {
  mount: (opts: Record<string, unknown>) => MascotApi;
};

declare global {
  interface Window {
    AuraMascot?: AuraMascotGlobal;
  }
}

const SCRIPT_SRC = "/js/aura-mascot.js";

/** Точки вдоль нижнего края, доля ширины окна влево от правого угла. */
const ROAM_SLOTS = [0, -0.28, -0.55, -0.8];
/** Длительность перелёта согласована с жестом jump виджета (1.75 c). */
const HOP_MS = 1400;

function loadWidget(): Promise<AuraMascotGlobal> {
  if (window.AuraMascot) return Promise.resolve(window.AuraMascot);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement("script");
    const onLoad = () => {
      if (window.AuraMascot) resolve(window.AuraMascot);
      else reject(new Error("AuraMascot не определился после загрузки"));
    };
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", () => reject(new Error("aura-mascot.js не загрузился")), {
      once: true,
    });
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.AuraMascot) {
      resolve(window.AuraMascot);
    }
  });
}

/**
 * 3D-маскот владельца (public/js/aura-mascot.js, three.js с CDN).
 * Живёт в layout, поэтому есть на каждой странице и переживает
 * клиентские переходы без перезагрузки. Виджет сам умеет: следить
 * головой за курсором, махать при наведении, прыгать по клику,
 * жестикулировать в простое, останавливать рендер вне экрана.
 *
 * Здесь — монтирование и «перемещение по пространству»: при переходе
 * в новую секцию или на другую страницу робот прыжком перелетает
 * в другую точку вдоль нижнего края (transform на контейнере,
 * синхронизирован с жестом jump). Плюс привязка жестов к событиям:
 * успешная заявка → wave, клик по кнопке квиза → point.
 * Только десктоп с мышью и без prefers-reduced-motion; на мобильных
 * не рендерится и ничего не грузит.
 */
export function RobotMascot() {
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();
  const hostRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<MascotApi | null>(null);
  const slotRef = useRef(0);
  const lastHopRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Прыжок в другую точку нижнего края (не чаще, чем длится сам прыжок)
  const hopToNewSpot = () => {
    const host = hostRef.current;
    const mascot = mascotRef.current;
    if (!host || !mascot) return;
    const now = Date.now();
    if (now - lastHopRef.current < HOP_MS) return;
    lastHopRef.current = now;

    const options = ROAM_SLOTS.map((_, index) => index).filter((i) => i !== slotRef.current);
    const next = options[Math.floor(Math.random() * options.length)] ?? 0;
    slotRef.current = next;
    mascot.play("jump");
    host.style.transform = `translateX(${Math.round((ROAM_SLOTS[next] ?? 0) * window.innerWidth)}px)`;
  };

  // Монтирование виджета — один раз на десктопную сессию
  useEffect(() => {
    if (!enabled) return;
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    const cleanups: (() => void)[] = [];

    loadWidget()
      .then((AuraMascot) => {
        if (cancelled) return;
        mascotRef.current = AuraMascot.mount({
          container: host,
          size: 220,
          // Фирменные цвета из design/tokens.md (globals.css @theme)
          palette: { light: 0xf8f6f3, dark: 0x262626, accent: 0xfff65d, glow: 0xfff65d },
          quality: "high",
          greetOnLoad: true,
          reactToScroll: true,
          autoGestures: true,
          enableOnMobile: false,
        });

        // Успешная отправка любой формы → помахать
        const onLead = () => mascotRef.current?.play("wave");
        window.addEventListener("aura:lead-success", onLead);
        cleanups.push(() => window.removeEventListener("aura:lead-success", onLead));

        // Клик по призыву к квизу → указать
        const onClick = (event: MouseEvent) => {
          const target = event.target as HTMLElement | null;
          if (target?.closest('a[href="/quiz"], a[href="/en/quiz"]'))
            mascotRef.current?.play("point");
        };
        document.addEventListener("click", onClick, { capture: true, passive: true });
        cleanups.push(() =>
          document.removeEventListener("click", onClick, { capture: true } as EventListenerOptions),
        );
      })
      .catch((error) => {
        // Без three.js сайт просто живёт без маскота
        console.warn("[mascot]", error instanceof Error ? error.message : error);
      });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      mascotRef.current?.destroy?.();
      mascotRef.current = null;
    };
     
  }, [enabled]);

  // Наблюдатель секций перепривязывается на каждой странице:
  // переход в новую секцию → перелёт в другую точку
  useEffect(() => {
    if (!enabled) return;
    let current: Element | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target !== current) {
            if (current !== null) hopToNewSpot();
            current = entry.target;
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    document.querySelectorAll("main section").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
     
  }, [enabled, pathname]);

  // Переход на другую страницу → тоже перелёт (кроме самого первого рендера)
  const firstPathRef = useRef(true);
  useEffect(() => {
    if (!enabled) return;
    if (firstPathRef.current) {
      firstPathRef.current = false;
      return;
    }
    hopToNewSpot();
     
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="mascot"
      style={{
        position: "fixed",
        right: 16,
        bottom: 8,
        zIndex: 20,
        transition: `transform ${HOP_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1)`,
        willChange: "transform",
      }}
    />
  );
}
