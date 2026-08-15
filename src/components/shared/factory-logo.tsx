import Image from "next/image";
import type { Factory } from "@/lib/schemas";

/**
 * Реальный логотип завода на белой плашке — рендерится только когда
 * factory.logo реально заполнен (см. data/source/factories.csv). Нет
 * логотипа — компонент просто ничего не рисует, никакого плейсхолдера
 * (в отличие от карточки компаний SINOTECH, где принято рисовать
 * монограмму — здесь такой договорённости нет).
 */
export function FactoryLogo({ factory, size = 48 }: { factory: Factory; size?: number }) {
  if (!factory.logo) return null;
  const pad = Math.round(size * 0.15);

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-card bg-white"
      style={{ width: size, height: size, padding: pad }}
    >
      <Image
        src={factory.logo}
        alt=""
        width={size - pad * 2}
        height={size - pad * 2}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}
