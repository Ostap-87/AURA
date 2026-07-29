/**
 * Бегущая строка из данных (заводы, города). Чистый CSS-marquee:
 * работает без JS, пауза при наведении, prefers-reduced-motion
 * останавливает движение (глобальное правило в globals.css).
 * Список дублируется для бесшовного цикла — второй экземпляр скрыт
 * от скринридеров.
 */
export type TickerItem = { name: string; suffix?: string };

export function Ticker({
  items,
  className = "",
}: {
  items: (string | TickerItem)[];
  className?: string;
}) {
  if (items.length === 0) return null;
  // Скорость постоянная независимо от длины списка: ~4.5 с на элемент
  const duration = Math.max(30, items.length * 4.5);

  const row = (hidden: boolean) => (
    <span aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, index) => {
        const { name, suffix } = typeof item === "string" ? { name: item, suffix: undefined } : item;
        return (
          <span key={index} className="flex shrink-0 items-center">
            <span className="whitespace-nowrap">
              <span className="font-semibold text-ink">{name}</span>
              {suffix && <span className="text-stone"> — {suffix}</span>}
            </span>
            <span aria-hidden className="mx-5 text-ash">
              ·
            </span>
          </span>
        );
      })}
    </span>
  );

  return (
    <div className={`ticker ${className}`.trim()}>
      <div className="ticker-track" style={{ "--ticker-duration": `${duration}s` } as React.CSSProperties}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
