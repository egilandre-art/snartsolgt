"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRolle } from "@/lib/auth";

export async function deliverValuation(
  oppdragId: string,
  takstverdi: number,
  takstRapportUrl?: string
) {
  const bruker = await requireRolle("TAKSTMANN");

  const oppdrag = await db.markedsoppdrag.findUnique({ where: { id: oppdragId } });
  if (!oppdrag || oppdrag.takstmannId !== bruker.id) throw new Error("Ikke tilgang");

  await db.markedsoppdrag.update({
    where: { id: oppdragId },
    data: {
      takstverdi,
      takstRapportUrl,
      status: "TAKST_LEVERT",
      takstLevertAt: new Date(),
    },
  });

  revalidatePath("/takst");
  revalidatePath(`/takst/${oppdragId}`);
}
