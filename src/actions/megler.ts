"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRolle } from "@/lib/auth";

export async function overtaListing(boligId: string) {
  const megler = await requireRolle("MEGLER");

  await db.bolig.update({
    where: { id: boligId },
    data: { meglerId: megler.id },
  });

  revalidatePath("/mine-boliger");
  revalidatePath(`/mine-boliger/${boligId}`);
}

export async function frigiListing(boligId: string) {
  const megler = await requireRolle("MEGLER");

  const bolig = await db.bolig.findUnique({ where: { id: boligId } });
  if (bolig?.meglerId !== megler.id) throw new Error("Ikke tilgang");

  await db.bolig.update({ where: { id: boligId }, data: { meglerId: null } });

  revalidatePath("/mine-boliger");
}
