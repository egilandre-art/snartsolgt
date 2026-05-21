"use server";

import { db } from "@/lib/db";
import { nabovarselSchema, type NabovarselInput } from "@/lib/validators/nabovarsel";

export async function registerInterest(data: NabovarselInput) {
  const parsed = nabovarselSchema.parse(data);
  const { email, navn, kommune, område, postnummer } = parsed;

  await db.nabovarsel.upsert({
    where: { email_kommune_område: { email, kommune, område: område ?? "" } },
    update: { aktiv: true, navn },
    create: { email, navn, kommune, område, postnummer, aktiv: true },
  });
}
