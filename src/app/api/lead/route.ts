import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead-schema";

/**
 * Единый обработчик для всех форм (PROJECT.md, раздел 11). Пока только
 * валидирует и логирует — отправка на почту, вебхук CRM и Telegram-бот
 * подключаются в этапе 10 без изменения формы вызова.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true });
  }

  console.log(
    "[lead]",
    JSON.stringify({
      label: parsed.data.label,
      fields: parsed.data.fields,
      hidden: parsed.data.hidden,
      at: new Date().toISOString(),
    }),
  );

  return NextResponse.json({ ok: true });
}
