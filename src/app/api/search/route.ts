import { type NextRequest, NextResponse } from "next/server";
import { buildSearchIndex, searchIndex } from "@/lib/search";

/** Поиск для строки в шапке: заводы по названию/применению + разделы сайта. */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? "";
  const locale = searchParams.get("locale") === "en" ? "en" : "ru";

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  const index = await buildSearchIndex(locale);
  const results = searchIndex(index, q);
  return NextResponse.json({ results });
}
