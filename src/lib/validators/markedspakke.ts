import { z } from "zod";

export const markedspakkeSchema = z.object({
  boligId: z.string().cuid(),
  pakke: z.enum(["HELDIGITAL", "MEGLERDIGITAL"]),
});

export type MarkedspakkeInput = z.infer<typeof markedspakkeSchema>;
