"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { Category } from "@/lib/schemas";

type NavKey = "robots" | "production" | "tours" | "consulting";

type NavItem = {
  key: NavKey;
  href: string;
  categories: { id: string; label: string; href: string }[];
};

export function Header({
  categories,
  logo,
  consultingCount = 0,
  locale,
}: {
  categories: Category[];
  logo: ReactNode;
  consultingCount?: number;
  locale: string;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<NavKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setOpenKey(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenKey(null);
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const nameByLocale = (categoryName: { name_ru: string; name_en: string }) =>
    locale === "en" ? categoryName.name_en : categoryName.name_ru;

  const items: NavItem[] = [
    {
      key: "robots",
      href: "/catalog",
      categories: categories
        .filter((c) => c.segment === "robots")
        .map((c) => ({ id: c.id, label: nameByLocale(c), href: `/catalog/${c.id}` })),
    },
    {
      key: "production",
      href: "/production",
      categories: categories
        .filter((c) => c.segment === "production")
        .map((c) => ({ id: c.id, label: nameByLocale(c), href: `/production/${c.id}` })),
    },
    { key: "tours", href: "/tours", categories: [] },
  ];

  if (consultingCount > 0) {
    items.push({ key: "consulting", href: "/consulting", categories: [] });
  }

  return (
    <header className="relative border-b border-fog bg-canvas">
      <div className="mx-auto flex max-w-(--container-page) items-center justify-between px-5 py-4 lg:px-10">
        <Link href="/" className="shrink-0 text-heading-sm">
          {logo}
        </Link>

        <nav className="hidden items-center gap-1 tablet-lg:flex">
          {items.map((item) => (
            <NavDropdown
              key={item.key}
              item={item}
              label={t(item.key)}
              isOpen={openKey === item.key}
              onOpen={() => setOpenKey(item.key)}
              onClose={() => setOpenKey((k) => (k === item.key ? null : k))}
            />
          ))}
          <LocaleSwitch pathname={pathname} />
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center tablet-lg:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? t("close") : t("menu")}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <BurgerIcon open={mobileOpen} />
        </button>
      </div>

      {mobileOpen && (
        <MobileMenu items={items} t={t} pathname={pathname} onClose={() => setMobileOpen(false)} />
      )}
    </header>
  );
}

function NavDropdown({
  item,
  label,
  isOpen,
  onOpen,
  onClose,
}: {
  item: NavItem;
  label: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const hasDropdown = item.categories.length > 0;
  const panelId = useId();

  if (!hasDropdown) {
    return (
      <Link
        href={item.href}
        className="rounded-chip px-4 py-2 text-body-sm hover:bg-warm-parchment"
      >
        {label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseLeave={onClose}>
      <button
        type="button"
        className="rounded-chip px-4 py-2 text-body-sm hover:bg-warm-parchment"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onMouseEnter={onOpen}
        onClick={() => (isOpen ? onClose() : onOpen())}
      >
        {label}
      </button>
      {isOpen && (
        <div
          id={panelId}
          className="absolute left-0 top-full z-20 min-w-56 rounded-card border border-fog bg-canvas p-2 shadow-none"
        >
          <Link
            href={item.href}
            className="block rounded-utility px-3 py-2 text-body-sm font-medium hover:bg-warm-parchment"
          >
            {label}
          </Link>
          {item.categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="block rounded-utility px-3 py-2 text-body-sm text-stone hover:bg-warm-parchment"
            >
              {category.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileMenu({
  items,
  t,
  pathname,
  onClose,
}: {
  items: NavItem[];
  t: ReturnType<typeof useTranslations>;
  pathname: string;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<NavKey | null>(null);

  return (
    <div className="fixed inset-0 top-[73px] z-30 overflow-y-auto bg-canvas tablet-lg:hidden">
      <div className="flex flex-col px-5 py-4">
        {items.map((item) => (
          <div key={item.key} className="border-b border-fog">
            {item.categories.length > 0 ? (
              <>
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-4 text-left text-heading-sm"
                  aria-expanded={expanded === item.key}
                  onClick={() => setExpanded((k) => (k === item.key ? null : item.key))}
                >
                  {t(item.key)}
                  <span aria-hidden>{expanded === item.key ? "−" : "+"}</span>
                </button>
                {expanded === item.key && (
                  <div className="flex flex-col gap-1 pb-4">
                    <Link href={item.href} onClick={onClose} className="py-2 text-body">
                      {t(item.key)}
                    </Link>
                    {item.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={category.href}
                        onClick={onClose}
                        className="py-2 text-body text-stone"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link href={item.href} onClick={onClose} className="block py-4 text-heading-sm">
                {t(item.key)}
              </Link>
            )}
          </div>
        ))}
        <div className="py-4">
          <LocaleSwitch pathname={pathname} />
        </div>
      </div>
    </div>
  );
}

function LocaleSwitch({ pathname }: { pathname: string }) {
  return (
    <div className="flex items-center gap-2 pl-2 text-body-sm text-stone">
      {routing.locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden>/</span>}
          <Link href={pathname} locale={locale} className="uppercase hover:text-ink">
            {locale}
          </Link>
        </span>
      ))}
    </div>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      {open ? (
        <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
      ) : (
        <path d="M2 5H18M2 10H18M2 15H18" stroke="currentColor" strokeWidth="1.5" />
      )}
    </svg>
  );
}
