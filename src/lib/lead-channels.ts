/**
 * Каналы доставки заявки (PROJECT.md, раздел 11). Каждый канал включается
 * переменной окружения и молчит, пока она не задана. Добавление канала —
 * новая функция в CHANNELS, обработчик /api/lead не переписывается.
 */
export type LeadRecord = {
  label: string;
  fields: Record<string, string>;
  hidden: Record<string, string>;
  utm: Record<string, string>;
  at: string;
};

function leadAsText(lead: LeadRecord): string {
  const lines: string[] = [`Форма: ${lead.label}`, ""];
  for (const [key, value] of Object.entries(lead.fields)) lines.push(`${key}: ${value}`);
  const meta = { ...lead.hidden, ...lead.utm };
  if (Object.keys(meta).length > 0) {
    lines.push("");
    for (const [key, value] of Object.entries(meta)) lines.push(`${key}: ${value}`);
  }
  lines.push("", `Время: ${lead.at}`);
  return lines.join("\n");
}

/** Почта через Resend API. Включается RESEND_API_KEY. */
async function sendEmail(lead: LeadRecord): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const to = process.env.LEAD_EMAIL_TO ?? "inquairy@aura-robotics.ru";
  const from = process.env.LEAD_EMAIL_FROM ?? "Aura Robotics <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Заявка с сайта: ${lead.label}`,
      text: leadAsText(lead),
    }),
  });
  if (!response.ok) throw new Error(`email ${response.status}`);
  return "email";
}

/** Telegram-бот. Включается TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID. */
async function sendTelegram(lead: LeadRecord): Promise<string | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return null;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: leadAsText(lead) }),
  });
  if (!response.ok) throw new Error(`telegram ${response.status}`);
  return "telegram";
}

/** Вебхук CRM: заявка отправляется как есть, JSON. Включается LEAD_WEBHOOK_URL. */
async function sendWebhook(lead: LeadRecord): Promise<string | null> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return null;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!response.ok) throw new Error(`webhook ${response.status}`);
  return "webhook";
}

const CHANNELS = [sendEmail, sendTelegram, sendWebhook];

/**
 * Журнал пишется всегда — заявка не теряется, даже если ни один канал
 * не настроен или все упали. Ошибка канала не роняет остальные.
 */
export async function deliverLead(lead: LeadRecord): Promise<void> {
  console.log("[lead]", JSON.stringify(lead));

  const results = await Promise.allSettled(CHANNELS.map((send) => send(lead)));
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[lead:channel-error]", String(result.reason));
    }
  }
}
