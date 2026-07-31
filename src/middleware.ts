import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { UTM_COOKIE, UTM_KEYS, UTM_MAX_AGE } from "./lib/utm";

const intlMiddleware = createMiddleware(routing);

/** UTM из адресной строки кладутся в cookie на 90 дней (PROJECT.md, раздел 11). */
export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const params = request.nextUrl.searchParams;
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 200);
  }
  if (Object.keys(utm).length > 0) {
    response.cookies.set(UTM_COOKIE, JSON.stringify(utm), {
      maxAge: UTM_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  // icon/apple-icon — файловые метаданные Next.js в корне app/ (без точки в пути,
  // поэтому общее исключение "путь с точкой" их не ловит) — без явного исключения
  // next-intl переписывает путь на локаль и роут «/icon» не находится (404).
  matcher: ["/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)"],
};
