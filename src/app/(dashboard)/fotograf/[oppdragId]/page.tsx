import { requireRolle } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FotoUploader } from "@/components/fotograf/FotoUploader";

interface Props {
  params: Promise<{ oppdragId: string }>;
}

export default async function FotografOppdrag({ params }: Props) {
  const { oppdragId } = await params;
  const bruker = await requireRolle("FOTOGRAF");

  const oppdrag = await db.markedsoppdrag.findUnique({
    where: { id: oppdragId },
    include: { bolig: { include: { bilder: true } } },
  });

  if (!oppdrag || oppdrag.fotografId !== bruker.id) notFound();

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-fg">
          {oppdrag.bolig.gate} {oppdrag.bolig.nummer}
        </h1>
        <p className="text-sm text-muted-fg">
          {oppdrag.bolig.postnummer} {oppdrag.bolig.poststed}
        </p>
      </div>
      <FotoUploader oppdragId={oppdragId} boligId={oppdrag.boligId} eksisterendeBilder={oppdrag.bolig.bilder} fullfort={oppdrag.status === "FOTO_LEVERT"} />
    </div>
  );
}
