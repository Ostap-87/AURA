import { type NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";
import { deliverLead } from "@/lib/lead-channels";
import { isRateLimited } from "@/lib/rate-limit";
import { UTM_COOKIE, parseUtmCookie } from "@/lib/utm";

/**
 * Единый обработчик для всех форм (PROJECT.md, раздел 11): валидация zod,
 * поле-ловушка, ограничение частоты по адресу, UTM из cookie, доставка
 * по настроенным каналам (lead-channels.ts) с журналом как гарантией.
 */
export async function POST(request: NextRequest) {
  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Ловушка: боту отвечаем успехом, заявку не доставляем
  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true });
  }

  await deliverLead({
    label: parsed.data.label,
    fields: parsed.data.fields,
    hidden: parsed.data.hidden,
    utm: parseUtmCookie(request.cookies.get(UTM_COOKIE)?.value),
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
