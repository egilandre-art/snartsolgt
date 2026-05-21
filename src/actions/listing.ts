"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireBruker } from "@/lib/auth";
import { listingSchema, type ListingInput } from "@/lib/validators/listing";
import { lagSlug } from "@/lib/utils";

function randomSuffix() {
  return Math.random().toString(36).slice(-4);
}

export async function createListing(data: ListingInput) {
  const bruker = await requireBruker();
  const parsed = listingSchema.parse(data);

  const slug = lagSlug(parsed.gate, parsed.nummer, parsed.poststed, randomSuffix());

  const bolig = await db.bolig.create({
    data: {
      slug,
      ...parsed,
      eierId: bruker.id,
      status: "UTKAST",
    },
  });

  revalidatePath("/mine-boliger");
  redirect(`/mine-boliger/${bolig.id}`);
}

export async function updateListing(id: string, data: ListingInput) {
  const bruker = await requireBruker();
  const parsed = listingSchema.parse(data);

  const bolig = await db.bolig.findUnique({ where: { id } });
  if (!bolig || (bolig.eierId !== bruker.id && bolig.meglerId !== bruker.id)) {
    throw new Error("Ikke tilgang");
  }

  await db.bolig.update({ where: { id }, data: parsed });

  revalidatePath(`/mine-boliger/${id}`);
}

export async function publishListing(id: string) {
  const bruker = await requireBruker();

  const bolig = await db.bolig.findUnique({
    where: { id },
    include: { oppdrag: true },
  });

  if (!bolig || (bolig.eierId !== bruker.id && bolig.meglerId !== bruker.id)) {
    throw new Error("Ikke tilgang");
  }

  await db.bolig.update({ where: { id }, data: { status: "TIL_SALGS" } });

  if (bolig.oppdrag) {
    await db.markedsoppdrag.update({
      where: { id: bolig.oppdrag.id },
      data: { status: "PUBLISERT", publisertAt: new Date() },
    });
  }

  // Varsle nabolagsinteressenter
  const nabovarsel = await db.nabovarsel.findMany({
    where: {
      aktiv: true,
      OR: [{ kommune: bolig.kommune }, { postnummer: bolig.postnummer }],
    },
  });

  if (nabovarsel.length > 0) {
    try {
      const { resend, EMAIL_FROM } = await import("@/lib/resend");
      await Promise.all(
        nabovarsel.map((n) =>
          resend.emails.send({
            from: EMAIL_FROM,
            to: n.email,
            subject: `Ny bolig i ${bolig.poststed}!`,
            html: `<p>Hei${n.navn ? ` ${n.navn}` : ""}!</p>
<p>Det har dukket opp en ny bolig i <strong>${bolig.kommune}</strong>:</p>
<p><strong>${bolig.gate} ${bolig.nummer}, ${bolig.postnummer} ${bolig.poststed}</strong></p>
<p><a href="${process.env.NEXT_PUBLIC_APP_URL}/bolig/${bolig.slug}">Se boligen her</a></p>`,
          })
        )
      );
    } catch (e) {
      console.error("Nabovarsel e-post feilet:", e);
    }
  }

  revalidatePath("/mine-boliger");
  revalidatePath("/");
}
