import { z } from "zod";

export const leadSchema = z.object({
  label: z.string().min(1),
  fields: z.record(z.string(), z.string()),
  hidden: z.record(z.string(), z.string()).default({}),
  honeypot: z.string().max(0).optional().default(""),
  consent: z.literal(true),
});

export type LeadPayload = z.infer<typeof leadSchema>;
