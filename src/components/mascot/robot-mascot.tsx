"use client";

import { useEffect, useRef, useState } from "react";

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
 * Виджет сам умеет: следить головой за курсором, махать при наведении,
 * прыгать по клику, жестикулировать в простое, останавливать рендер
 * вне экрана. Здесь — только монтирование и привязка жестов к событиям
 * сайта: смена секции при прокрутке → jump, успешная заявка → wave,
 * клик по кнопке квиза → point. Только десктоп с мышью и без
 * prefers-reduced-motion; на мобильных не рендерится и ничего не грузит.
 */
export function RobotMascot() {
  const [enabled, setEnabled] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const host = hostRef.current;
    if (!host) return;

    let mascot: MascotApi | null = null;
    let cancelled = false;
    const cleanups: (() => void)[] = [];

    loadWidget()
      .then((AuraMascot) => {
        if (cancelled) return;
        mascot = AuraMascot.mount({
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

        // Прыжок при переходе на новую секцию (как у прежнего маскота)
        let current: Element | null = null;
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting && entry.target !== current) {
                if (current !== null) mascot?.play("jump");
                current = entry.target;
              }
            }
          },
          { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
        );
        document.querySelectorAll("main section").forEach((section) => observer.observe(section));
        cleanups.push(() => observer.disconnect());

        // Успешная отправка любой формы → помахать
        const onLead = () => mascot?.play("wave");
        window.addEventListener("aura:lead-success", onLead);
        cleanups.push(() => window.removeEventListener("aura:lead-success", onLead));

        // Клик по призыву к квизу → указать
        const onClick = (event: MouseEvent) => {
          const target = event.target as HTMLElement | null;
          if (target?.closest('a[href="/quiz"], a[href="/en/quiz"]')) mascot?.play("point");
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
      mascot?.destroy?.();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="mascot"
      style={{ position: "fixed", right: 16, bottom: 8, zIndex: 20 }}
    />
  );
}
