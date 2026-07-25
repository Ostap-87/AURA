import { Reveal } from "@/components/motion/reveal";
import { CHINA_OUTLINE_PATH, MAP_WIDTH, MAP_HEIGHT, cityPoint } from "@/lib/china-map";
import type { TourCityStop } from "@/lib/tours";

/**
 * Карта Китая с маршрутом поездки: города из tour_days в порядке
 * посещения, линия маршрута прорисовывается при появлении секции
 * (CSS-анимация .map-route в globals.css, отключается prefers-reduced-motion).
 * Фоном — города остальных заводов базы: видно охват вокруг маршрута.
 * Города без координат в справочнике не получают точку, но остаются
 * в списке — карта никогда не ломается от новых данных.
 */
export function ChinaMap({
  stops,
  factoryCities = [],
  locale,
}: {
  stops: TourCityStop[];
  factoryCities?: { city: string; count: number }[];
  locale: string;
}) {
  const isEn = locale === "en";
  const plotted = stops
    .map((stop) => ({ stop, point: cityPoint(stop.city, stop.cityEn) }))
    .filter((item): item is { stop: TourCityStop; point: [number, number] } => item.point !== null);

  if (stops.length === 0) return null;

  const routeCities = new Set(stops.map((s) => s.city.trim()));
  const backgroundCities = factoryCities
    .filter((item) => !routeCities.has(item.city))
    .map((item) => ({ ...item, point: cityPoint(item.city) }))
    .filter((item): item is { city: string; count: number; point: [number, number] } =>
      item.point !== null,
    );

  const routePoints = plotted.map((item) => item.point);

  return (
    <Reveal className="grid grid-cols-1 gap-8 desktop:grid-cols-[7fr_5fr] desktop:items-center">
      {plotted.length > 0 && (
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          role="img"
          aria-label={
            isEn
              ? `Trip route: ${stops.map((s) => s.cityEn).join(", ")}`
              : `Маршрут поездки: ${stops.map((s) => s.city).join(", ")}`
          }
          className="w-full"
        >
          {/* Координатная сетка — «технический» тон, как у медиа-слотов */}
          <defs>
            <pattern id="map-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M32 0H0V32"
                fill="none"
                stroke="var(--color-fog)"
                strokeWidth="0.5"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#map-grid)" />

          <path
            d={CHINA_OUTLINE_PATH}
            fill="var(--color-warm-parchment)"
            stroke="var(--color-ash)"
            strokeWidth="1"
            strokeLinejoin="round"
          />

          {/* Города остальных заводов базы — фон маршрута */}
          {backgroundCities.map(({ city, count, point: [x, y] }) => (
            <circle
              key={city}
              cx={x}
              cy={y}
              r={count > 1 ? 4 : 3}
              fill="var(--color-canvas)"
              stroke="var(--color-stone)"
              strokeWidth="1.5"
            />
          ))}

          {routePoints.length > 1 && (
            <polyline
              points={routePoints.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="1.5"
              pathLength={1}
              className="map-route"
            />
          )}

          {plotted.map(({ stop, point: [x, y] }, index) => {
            const label = isEn ? stop.cityEn : stop.city;
            // Подпись слева от точки, если город у восточного края карты
            const labelLeft = x > MAP_WIDTH - 110;
            return (
              <g key={stop.city}>
                <circle cx={x} cy={y} r="9" fill="var(--color-accent)" opacity="0.35" />
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="var(--color-accent)"
                  stroke="var(--color-ink)"
                  strokeWidth="1.5"
                />
                <text
                  x={labelLeft ? x - 12 : x + 12}
                  y={y + 4}
                  textAnchor={labelLeft ? "end" : "start"}
                  fill="var(--color-ink)"
                  fontFamily="var(--font-mono)"
                  fontSize="13"
                >
                  {String(index + 1).padStart(2, "0")} {label}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      <div>
        <ol className="flex flex-col gap-5">
          {stops.map((stop, index) => (
            <li key={stop.city} className="border-l border-fog pl-4">
              <p className="font-mono text-caption text-ash">
                {String(index + 1).padStart(2, "0")} ·{" "}
                {isEn
                  ? `day${stop.days.length > 1 ? "s" : ""} ${stop.days.join(", ")}`
                  : `день ${stop.days.join(", ")}`}
              </p>
              <p className="mt-1 text-heading-sm">{isEn ? stop.cityEn : stop.city}</p>
              {stop.companies.length > 0 && (
                <p className="mt-1 text-body-sm text-stone">{stop.companies.join(" · ")}</p>
              )}
            </li>
          ))}
        </ol>

        {backgroundCities.length > 0 && (
          <p className="mt-6 flex items-center gap-2 font-mono text-caption text-ash">
            <span
              aria-hidden
              className="inline-block h-2 w-2 shrink-0 rounded-full border border-stone bg-canvas"
            />
            {isEn
              ? `${backgroundCities.length} more cities with factories in our base`
              : `Ещё ${backgroundCities.length} городов с заводами из нашей базы`}
          </p>
        )}
      </div>
    </Reveal>
  );
}
