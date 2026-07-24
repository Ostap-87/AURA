import { MediaSlot, type MediaSlotProps } from "./media-slot";

export type MediaGalleryProps = {
  /** Пары по индексу: photos[i] подписан photoCaptions[i]. Без подписи слот не рендерится. */
  photos: string[];
  captions: string[];
  aspect?: MediaSlotProps["aspect"];
  className?: string;
};

export function MediaGallery({ photos, captions, aspect = "4/3", className }: MediaGalleryProps) {
  const slots = photos.map((src, index) => ({ src, caption: captions[index] }));
  const hasAnyFilled = slots.some((slot) => slot.src && slot.caption);
  if (!hasAnyFilled) return null;

  return (
    <div className={className ?? "grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3"}>
      {slots.map((slot, index) => (
        <MediaSlot
          key={`${slot.src}-${index}`}
          src={slot.src}
          caption={slot.caption}
          aspect={aspect}
          emptyBehavior="hidden"
        />
      ))}
    </div>
  );
}
