import { setRequestLocale } from "next-intl/server";
import { MediaSlot } from "@/components/media/media-slot";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <section className="mx-auto flex max-w-(--container-page) flex-col gap-10 px-5 py-16 lg:flex-row lg:items-center lg:gap-16 lg:px-10 lg:py-24">
      <div className="flex flex-col gap-6 lg:w-1/2">
        <h1 className="text-display-xl">Aura Robotics</h1>
        <p className="text-subheading text-stone">
          {isEn
            ? "Robotics and production equipment shipped from Chinese factories directly to you — 15–30% below importer markups."
            : "Робототехника и оборудование для производств напрямую с китайских заводов — на 15–30% дешевле, чем у поставщиков с наценкой российского импортёра."}
        </p>
      </div>
      <div className="lg:w-1/2">
        <MediaSlot aspect="4/3" emptyBehavior="placeholder" />
      </div>
    </section>
  );
}
