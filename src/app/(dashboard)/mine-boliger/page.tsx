import { requireBruker } from "@/lib/auth";
import { db } from "@/lib/db";
import { ListingStatusBadge } from "@/components/listing/ListingStatusBadge";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { Building2, Plus, ChevronRight } from "lucide-react";
import { formatNok, formatAreal } from "@/lib/utils";

export default async function MineBoliger() {
  const bruker = await requireBruker();

  const boliger = await db.bolig.findMany({
    where: {
      OR: [{ eierId: bruker.id }, { meglerId: bruker.id }],
    },
    include: { bilder: { take: 1 }, oppdrag: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-fg">Mine boliger</h1>
        <Link href="/mine-boliger/ny">
          <Button size="sm">
            <Plus size={16} />
            Ny bolig
          </Button>
        </Link>
      </div>

      {boliger.length === 0 ? (
        <EmptyState
          icon={<Building2 size={40} />}
          tittel="Ingen boliger ennå"
          beskrivelse="Registrer din første bolig for å komme i gang."
          handling={
            <Link href="/mine-boliger/ny">
              <Button>Registrer bolig</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {boliger.map((bolig) => (
            <Link key={bolig.id} href={`/mine-boliger/${bolig.id}`}>
              <Card className="hover:shadow-md transition-all">
                <CardBody className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <ListingStatusBadge status={bolig.status} />
                      <span className="text-xs text-muted-fg">{bolig.boligtype}</span>
                    </div>
                    <p className="font-semibold text-fg truncate">
                      {bolig.gate} {bolig.nummer}
                    </p>
                    <p className="text-xs text-muted-fg">
                      {bolig.postnummer} {bolig.poststed}
                    </p>
                    <div className="flex gap-3 mt-1 text-xs text-muted-fg">
                      {bolig.bruksareal && <span>{formatAreal(bolig.bruksareal)}</span>}
                      {bolig.prisantydning && <span>{formatNok(bolig.prisantydning)}</span>}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-muted-fg shrink-0" />
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
