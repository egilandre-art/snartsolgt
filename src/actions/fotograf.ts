"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRolle } from "@/lib/auth";
import { genererBeskrivelse } from "@/lib/ai";

export async function markPhotosComplete(oppdragId: string) {
  const bruker = await requireRolle("FOTOGRAF");

  const oppdrag = await db.markedsoppdrag.findUnique({
    where: { id: oppdragId },
    include: { bolig: { include: { bilder: true } } },
  });

  if (!oppdrag || oppdrag.fotografId !== bruker.id) throw new Error("Ikke tilgang");

  await db.markedsoppdrag.update({
    where: { id: oppdragId },
    data: { status: "FOTO_LEVERT", fotoLevertAt: new Date() },
  });

  // Generer AI-beskrivelse
  try {
    const bolig = oppdrag.bolig;
    const beskrivelse = await genererBeskrivelse({
      gate: bolig.gate,
      nummer: bolig.nummer,
      poststed: bolig.poststed,
      kommune: bolig.kommune,
      boligtype: bolig.boligtype,
      bruksareal: bolig.bruksareal,
      soverom: bolig.soverom,
      antallRom: bolig.antallRom,
      byggeaar: bolig.byggeaar,
      prisantydning: bolig.prisantydning,
      fellesgjeld: bolig.fellesgjeld,
      fellesutgifter: bolig.fellesutgifter,
      bildeUrler: bolig.bilder.map((b) => b.url),
    });

    await db.bolig.update({
      where: { id: bolig.id },
      data: {
        kortBeskrivelse: beskrivelse.kortBeskrivelse,
        langBeskrivelse: beskrivelse.langBeskrivelse,
        nabolagsBeskrivelse: beskrivelse.nabolagsBeskrivelse,
      },
    });

    await db.markedsoppdrag.update({
      where: { id: oppdragId },
      data: { status: "AI_GENERERT", aiGenerertAt: new Date() },
    });
  } catch (e) {
    console.error("AI-generering feilet:", e);
  }

  revalidatePath("/fotograf");
}
