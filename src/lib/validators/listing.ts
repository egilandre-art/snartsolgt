import { z } from "zod";
import { BOLIGTYPER } from "@/lib/constants";

export const listingSchema = z.object({
  gate: z.string().min(2, "Gate er påkrevd"),
  nummer: z.string().min(1, "Nummer er påkrevd"),
  postnummer: z.string().length(4, "Postnummer må være 4 siffer"),
  poststed: z.string().min(2, "Poststed er påkrevd"),
  kommune: z.string().min(2, "Kommune er påkrevd"),
  boligtype: z.enum(BOLIGTYPER),
  bruksareal: z.coerce.number().positive().optional(),
  tomteareal: z.coerce.number().positive().optional(),
  byggeaar: z.coerce.number().min(1800).max(new Date().getFullYear()).optional(),
  soverom: z.coerce.number().min(0).max(20).optional(),
  antallRom: z.coerce.number().min(1).max(50).optional(),
  etasje: z.coerce.number().min(-2).max(100).optional(),
  prisantydning: z.coerce.number().positive().optional(),
  fellesgjeld: z.coerce.number().min(0).optional(),
  fellesutgifter: z.coerce.number().min(0).optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;
