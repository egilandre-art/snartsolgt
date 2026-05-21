import { requireRolle } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { FileText, ChevronRight, MapPin } from "lucide-react";
import { formatNok } from "@/lib/utils";

export default async function TakstOversikt() {
  const bruker = await requireRolle("TAKSTMANN");

  const oppdrag = await db.markedsoppdrag.findMany({
    where: { takstmannId: bruker.id, status: { in: ["TAKST_BESTILT", "TAKST_LEVERT"] } },
    include: { bolig: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-semibold text-fg">Takstoppdrag</h1>

      {oppdrag.length === 0 ? (
        <EmptyState
          icon={<FileText size={40} />}
          tittel="Ingen ventende oppdrag"
          beskrivelse="Du har ingen takstoppdrag for øyeblikket."
        />
      ) : (
        <div className="space-y-3">
          {oppdrag.map((o) => (
            <Link key={o.id} href={`/takst/${o.id}`}>
              <Card className="hover:shadow-md transition-all">
                <CardBody className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-[var(--radius-sm)] text-muted-fg">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-fg truncate">
                      {o.bolig.gate} {o.bolig.nummer}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-fg">
                      <MapPin size={11} />
                      {o.bolig.postnummer} {o.bolig.poststed}
                    </div>
                    {o.takstverdi && (
                      <p className="text-xs text-success mt-0.5">Takst: {formatNok(o.takstverdi)}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === "TAKST_LEVERT" ? "bg-success/15 text-success" : "bg-amber-100 text-amber-800"}`}>
                    {o.status === "TAKST_LEVERT" ? "Levert" : "Venter"}
                  </span>
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
