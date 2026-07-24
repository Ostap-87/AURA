import Image from "next/image";

export type MediaSlotProps = {
  /** Путь к фото или URL видео (файл или эмбед). Тип определяется по значению. */
  src?: string;
  /** Обязательна для того, чтобы слот считался заполненным (PROJECT.md, раздел 7). */
  caption?: string;
  /** Соотношение сторон контейнера — держит размер до и после загрузки медиа. */
  aspect?: "16/9" | "4/3" | "1/1" | "9/16";
  emptyBehavior?: "hidden" | "placeholder" | "fallback";
  fallbackSrc?: string;
  alt?: string;
  sizes?: string;
  className?: string;
  /** Моноширинная подпись в пустом слоте («съёмка в подготовке» и т.п.). */
  placeholderLabel?: string;
};

const VIDEO_FILE_PATTERN = /\.(mp4|webm|mov)(\?.*)?$/i;
const YOUTUBE_PATTERN = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i;
const VIMEO_PATTERN = /vimeo\.com\/(\d+)/i;

function isVideo(src: string) {
  return VIDEO_FILE_PATTERN.test(src) || YOUTUBE_PATTERN.test(src) || VIMEO_PATTERN.test(src);
}

function embedUrl(src: string) {
  const youtube = src.match(YOUTUBE_PATTERN);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  const vimeo = src.match(VIMEO_PATTERN);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export function MediaSlot({
  src,
  caption,
  aspect = "4/3",
  emptyBehavior = "hidden",
  fallbackSrc,
  alt = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  className,
  placeholderLabel,
}: MediaSlotProps) {
  // Слот без подписи считается незаполненным независимо от наличия медиа.
  const isFilled = Boolean(src && caption);
  const resolvedSrc = isFilled ? src : emptyBehavior === "fallback" ? fallbackSrc : undefined;

  if (!resolvedSrc) {
    if (emptyBehavior !== "placeholder") return null;
    return (
      <div
        className={`media-slot-empty ${className ?? ""}`.trim()}
        style={{ aspectRatio: aspect.replace("/", " / ") }}
        aria-hidden
      >
        {placeholderLabel && (
          <span className="absolute bottom-3 left-3 font-mono text-caption uppercase text-ash">
            {placeholderLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <figure className={className}>
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: aspect.replace("/", " / ") }}
      >
        {isVideo(resolvedSrc) ? <VideoMedia src={resolvedSrc} /> : (
          <Image
            src={resolvedSrc}
            alt={alt || caption || ""}
            fill
            sizes={sizes}
            className="object-cover"
          />
        )}
      </div>
      {isFilled && caption && (
        <figcaption className="mt-2 font-mono text-caption text-stone">{caption}</figcaption>
      )}
    </figure>
  );
}

function VideoMedia({ src }: { src: string }) {
  const embed = embedUrl(src);
  if (embed) {
    return (
      <iframe
        src={embed}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <video
      src={src}
      className="absolute inset-0 h-full w-full object-cover"
      controls
      playsInline
    />
  );
}
