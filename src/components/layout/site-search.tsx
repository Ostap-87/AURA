"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { SearchEntry } from "@/lib/search";

const DEBOUNCE_MS = 200;

/**
 * Поиск в шапке: заводы по названию/применению плюс основные разделы сайта
 * (PROJECT.md — новый завод из таблицы попадает в индекс сам, см.
 * lib/search.ts). Данные подтягиваются из /api/search по мере ввода.
 */
export function SiteSearch() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searched, setSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setActiveIndex(-1);
      setSearched(false);
      return;
    }
    const id = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`)
        .then((res) => res.json())
        .then((data: { results?: SearchEntry[] }) => {
          setResults(data.results ?? []);
          setActiveIndex(-1);
          setSearched(true);
        })
        .catch(() => {
          setResults([]);
          setSearched(true);
        });
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [query, locale]);

  function close() {
    setOpen(false);
    setQuery("");
    setResults([]);
    setSearched(false);
  }

  function goTo(url: string) {
    router.push(url);
    close();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={t("search")}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-warm-parchment"
        onClick={() => setOpen((v) => !v)}
      >
        <SearchIcon />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-[min(22rem,90vw)] rounded-card border border-fog bg-canvas p-3 shadow-lg">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="w-full rounded-utility border border-fog bg-canvas px-3 py-2 text-body-sm outline-none focus:border-ink"
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              }
              if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
                e.preventDefault();
                goTo(results[activeIndex].url);
              }
            }}
          />

          {results.length > 0 && (
            <ul className="mt-2 flex max-h-96 flex-col gap-1 overflow-y-auto">
              {results.map((result, index) => (
                <li key={`${result.group}-${result.url}`}>
                  <Link
                    href={result.url}
                    onClick={close}
                    className={`block rounded-utility px-3 py-2 ${
                      index === activeIndex ? "bg-warm-parchment" : "hover:bg-warm-parchment"
                    }`}
                  >
                    <p className="text-body-sm font-medium">{result.title}</p>
                    {result.description && (
                      <p className="line-clamp-1 text-caption text-stone">{result.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {searched && results.length === 0 && (
            <p className="mt-2 px-3 py-2 text-body-sm text-stone">{t("searchNoResults")}</p>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
