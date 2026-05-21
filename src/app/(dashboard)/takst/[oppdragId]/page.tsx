import { requireRolle } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { TakstLeveringForm } from "@/components/takst/TakstLeveringForm";
import { formatNok, formatDato } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface Props {
  params: Promise<{ oppdragId: string }>;
}

export default async function TakstOppdrag({ params }: Props) {
  const { oppdragId } = await params;
  const bruker = await requireRolle("TAKSTMANN");

  const oppdrag = await db.markedsoppdrag.findUnique({
    where: { id: oppdragId },
    include: { bolig: true },
  });

  if (!oppdrag || oppdrag.takstmannId !== bruker.id) notFound();

  if (oppdrag.status === "TAKST_LEVERT") {
    return (
      <div className="max-w-lg space-y-4">
        <h1 className="text-2xl font-semibold text-fg">
          {oppdrag.bolig.gate} {oppdrag.bolig.nummer}
        </h1>
        <div className="flex flex-col items-center py-10 gap-3">
          <CheckCircle2 size={48} className="text-success" />
          <p className="font-semibold text-fg">Takst levert</p>
          <p className="text-lg font-display font-semibold text-navy">{formatNok(oppdrag.takstverdi)}</p>
          <p className="text-xs text-muted-fg">Levert {formatDato(oppdrag.takstLevertAt)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-fg">
          {oppdrag.bolig.gate} {oppdrag.bolig.nummer}
        </h1>
        <p className="text-sm text-muted-fg">
          {oppdrag.bolig.postnummer} {oppdrag.bolig.poststed} · {oppdrag.bolig.boligtype}
          {oppdrag.bolig.bruksareal && ` · ${oppdrag.bolig.bruksareal} m²`}
        </p>
      </div>
      <TakstLeveringForm oppdragId={oppdragId} />
    </div>
  );
}
