export type VerticalVideoWallProps = {
  /** Вертикальные ролики 9:16 — отдельное поле verticalVideos, не смешивается с photos/videoUrl. */
  videos: string[];
  captions: string[];
  className?: string;
};

/** Сетка вертикальных роликов, автовоспроизведение без звука. Одна колонка на мобильных. */
export function VerticalVideoWall({ videos, captions, className }: VerticalVideoWallProps) {
  const slots = videos.map((src, index) => ({ src, caption: captions[index] })).filter(
    (slot) => slot.src && slot.caption,
  );
  if (slots.length === 0) return null;

  return (
    <div className={className ?? "grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-4"}>
      {slots.map((slot, index) => (
        <figure key={`${slot.src}-${index}`}>
          <div className="relative overflow-hidden" style={{ aspectRatio: "9 / 16" }}>
            <video
              src={slot.src}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
          <figcaption className="mt-2 font-mono text-caption text-stone">{slot.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
