import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const kommune = searchParams.get("kommune");
  const postnummer = searchParams.get("postnummer");
  const side = Math.max(1, parseInt(searchParams.get("side") ?? "1", 10));
  const perSide = 12;

  const boliger = await db.bolig.findMany({
    where: {
      status: { in: ["VURDERES_SOLGT", "TIL_SALGS"] },
      ...(kommune && { kommune }),
      ...(postnummer && { postnummer }),
    },
    include: {
      bilder: { orderBy: { rekkefølge: "asc" }, take: 1 },
      megler: { select: { fornavn: true, etternavn: true } },
    },
    orderBy: { updatedAt: "desc" },
    skip: (side - 1) * perSide,
    take: perSide,
  });

  return NextResponse.json(boliger);
}
