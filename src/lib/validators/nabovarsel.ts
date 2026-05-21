import { z } from "zod";

export const nabovarselSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
  navn: z.string().optional(),
  kommune: z.string().min(2, "Velg en kommune"),
  område: z.string().optional(),
  postnummer: z.string().length(4).optional(),
});

export type NabovarselInput = z.infer<typeof nabovarselSchema>;
