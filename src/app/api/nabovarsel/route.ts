import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { nabovarselSchema } from "@/lib/validators/nabovarsel";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = nabovarselSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ feil: parsed.error.flatten() }, { status: 400 });
  }

  const { email, navn, kommune, område, postnummer } = parsed.data;

  await db.nabovarsel.upsert({
    where: { email_kommune_område: { email, kommune, område: område ?? "" } },
    update: { aktiv: true, navn },
    create: { email, navn, kommune, område, postnummer, aktiv: true },
  });

  return NextResponse.json({ ok: true });
}
