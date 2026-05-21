import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import type { Bruker } from "@prisma/client";

export async function currentBruker(): Promise<Bruker | null> {
  const { userId } = await auth();
  if (!userId) return null;

  return db.bruker.findUnique({ where: { clerkId: userId } });
}

export async function requireBruker(): Promise<Bruker> {
  const bruker = await currentBruker();
  if (!bruker) redirect("/sign-in");
  return bruker;
}

export async function requireRolle(
  ...roller: Bruker["rolle"][]
): Promise<Bruker> {
  const bruker = await requireBruker();
  if (!roller.includes(bruker.rolle)) redirect("/dashboard");
  return bruker;
}

export async function requireAdmin(): Promise<Bruker> {
  const bruker = await requireBruker();
  if (!bruker.isAdmin) redirect("/dashboard");
  return bruker;
}

export async function syncClerkBruker() {
  const user = await currentUser();
  if (!user) return null;

  const existing = await db.bruker.findUnique({
    where: { clerkId: user.id },
  });
  if (existing) return existing;

  const rolle =
    (user.publicMetadata?.rolle as Bruker["rolle"]) ?? "BOLIGEIER";
  const primaryEmail = user.emailAddresses[0]?.emailAddress ?? "";

  return db.bruker.create({
    data: {
      clerkId: user.id,
      email: primaryEmail,
      fornavn: user.firstName ?? "",
      etternavn: user.lastName ?? "",
      rolle,
    },
  });
}
