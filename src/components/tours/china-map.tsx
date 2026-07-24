import { Reveal } from "@/components/motion/reveal";
import { CHINA_OUTLINE_PATH, MAP_WIDTH, MAP_HEIGHT, cityPoint } from "@/lib/china-map";
import type { TourCityStop } from "@/lib/tours";

/**
 * Карта Китая с маршрутом поездки: города из tour_days в порядке
 * посещения, линия маршрута прорисовывается при появлении секции
 * (CSS-анимация .map-route в globals.css, отключается prefers-reduced-motion).
 * Города без координат в справочнике не получают точку, но остаются
 * в списке компаний — карта никогда не ломается от новых данных.
 */
export function ChinaMap({ stops, locale }: { stops: TourCityStop[]; locale: string }) {
  const isEn = locale === "en";
  const plotted = stops
    .map((stop) => ({ stop, point: cityPoint(stop.city, stop.cityEn) }))
    .filter((item): item is { stop: TourCityStop; point: [number, number] } => item.point !== null);

  if (stops.length === 0) return null;

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
          <path
            d={CHINA_OUTLINE_PATH}
            fill="var(--color-warm-parchment)"
            stroke="var(--color-ash)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
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
                <circle cx={x} cy={y} r="5" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="1.5" />
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
    </Reveal>
  );
}
