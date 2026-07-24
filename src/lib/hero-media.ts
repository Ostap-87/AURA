import { existsSync } from "node:fs";
import path from "node:path";

export type HeroMedia = {
  video: { webm?: string; mp4?: string } | null;
  poster?: string;
};

/**
 * Видео первого экрана главной. Подключается без правки кода:
 * положите файлы в public/media (hero.webm / hero.mp4 и постер
 * hero-poster.jpg) или задайте NEXT_PUBLIC_HERO_VIDEO_URL /
 * NEXT_PUBLIC_HERO_POSTER_URL. Пока файлов нет — хиро остаётся светлым
 * со слотом-чертежом.
 */
export function getHeroMedia(): HeroMedia {
  const pub = (p: string) => path.join(process.cwd(), "public", "media", p);

  const envVideo = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
  const envPoster = process.env.NEXT_PUBLIC_HERO_POSTER_URL;

  const webm = existsSync(pub("hero.webm")) ? "/media/hero.webm" : undefined;
  const mp4 = existsSync(pub("hero.mp4")) ? "/media/hero.mp4" : undefined;
  const poster = existsSync(pub("hero-poster.jpg")) ? "/media/hero-poster.jpg" : envPoster;

  if (envVideo) return { video: { mp4: envVideo }, poster };
  if (webm || mp4) return { video: { webm, mp4 }, poster };
  return { video: null, poster };
}
