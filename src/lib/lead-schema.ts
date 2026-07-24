import { z } from "zod";

export const leadSchema = z.object({
  label: z.string().min(1),
  fields: z.record(z.string(), z.string()),
  hidden: z.record(z.string(), z.string()).default({}),
  // Любое значение валидно: заполненная ловушка отсекается в обработчике
  // тихим успехом, чтобы бот не получил сигнал об ошибке
  honeypot: z.string().optional().default(""),
  consent: z.literal(true),
});

export type LeadPayload = z.infer<typeof leadSchema>;
