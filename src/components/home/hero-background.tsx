"use client";

import { useEffect, useState } from "react";

/**
 * Фоновое видео хиро. Видео монтируется только на десктопе и только
 * без prefers-reduced-motion (tokens.md: фоновые видео на мобильных
 * отключаются, автозвука нет — ролик всегда muted). До гидрации и на
 * мобильных виден постер, поверх — затемнение для читаемости текста.
 */
export function HeroBackground({
  webm,
  mp4,
  poster,
}: {
  webm?: string;
  mp4?: string;
  poster?: string;
}) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (!webm && !mp4) return;
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => setShowVideo(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [webm, mp4]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          {webm && <source src={webm} type="video/webm" />}
          {mp4 && <source src={mp4} type="video/mp4" />}
        </video>
      )}
      <div className="absolute inset-0 bg-pure-black/60" />
    </div>
  );
}
