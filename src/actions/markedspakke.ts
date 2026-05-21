"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireBruker } from "@/lib/auth";
import { markedspakkeSchema } from "@/lib/validators/markedspakke";
import type { MarkedspakkeType } from "@prisma/client";

export async function orderPackage(boligId: string, pakke: MarkedspakkeType) {
  const bruker = await requireBruker();
  markedspakkeSchema.parse({ boligId, pakke });

  const bolig = await db.bolig.findUnique({ where: { id: boligId } });
  if (!bolig || (bolig.eierId !== bruker.id && bolig.meglerId !== bruker.id)) {
    throw new Error("Ikke tilgang");
  }

  const oppdrag = await db.markedsoppdrag.upsert({
    where: { boligId },
    update: { pakke, status: "NY" },
    create: { boligId, pakke, status: "NY" },
  });

  await db.bolig.update({
    where: { id: boligId },
    data: { status: "VURDERES_SOLGT" },
  });

  revalidatePath(`/mine-boliger/${boligId}`);
  return oppdrag;
}

export async function assignProfessional(
  oppdragId: string,
  type: "takstmann" | "fotograf",
  brukerId: string
) {
  await requireBruker();

  const data =
    type === "takstmann"
      ? { takstmannId: brukerId, status: "TAKST_BESTILT" as const }
      : { fotografId: brukerId, status: "FOTO_BESTILT" as const };

  await db.markedsoppdrag.update({ where: { id: oppdragId }, data });
  revalidatePath("/oppdrag");
}
