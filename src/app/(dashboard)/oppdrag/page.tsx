import { requireRolle } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListingStatusBadge } from "@/components/listing/ListingStatusBadge";
import Link from "next/link";
import { ClipboardList, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { OPPDRAGSTATUS_LABELS } from "@/lib/constants";

export default async function OppdragOversikt() {
  const megler = await requireRolle("MEGLER");

  const oppdrag = await db.markedsoppdrag.findMany({
    where: { meglerId: megler.id },
    include: { bolig: true },
    orderBy: { createdAt: "desc" },
  });

  // Boliger megleren har overtatt men ikke nødvendigvis aktive oppdrag
  const meglerBoliger = await db.bolig.findMany({
    where: { meglerId: megler.id },
    include: { oppdrag: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-semibold text-fg">Mine oppdrag</h1>

      {meglerBoliger.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={40} />}
          tittel="Ingen oppdrag"
          beskrivelse="Du har ingen boliger tilknyttet deg som megler ennå."
        />
      ) : (
        <div className="space-y-3">
          {meglerBoliger.map((bolig) => (
            <Link key={bolig.id} href={`/mine-boliger/${bolig.id}`}>
              <Card className="hover:shadow-md transition-all">
                <CardBody className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <ListingStatusBadge status={bolig.status} />
                      {bolig.oppdrag && (
                        <Badge className="bg-muted text-muted-fg">
                          {OPPDRAGSTATUS_LABELS[bolig.oppdrag.status]}
                        </Badge>
                      )}
                    </div>
                    <p className="font-semibold text-fg truncate">
                      {bolig.gate} {bolig.nummer}
                    </p>
                    <p className="text-xs text-muted-fg">
                      {bolig.postnummer} {bolig.poststed}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-muted-fg shrink-0" />
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
