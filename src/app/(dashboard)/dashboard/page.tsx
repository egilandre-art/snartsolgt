import { requireBruker } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { ListingStatusBadge } from "@/components/listing/ListingStatusBadge";
import Link from "next/link";
import { Building2, ClipboardList, Camera, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function DashboardPage() {
  const bruker = await requireBruker();

  if (bruker.rolle === "BOLIGEIER" || bruker.rolle === "MEGLER") {
    const boliger = await db.bolig.findMany({
      where: {
        OR: [{ eierId: bruker.id }, { meglerId: bruker.id }],
      },
      include: { bilder: { take: 1 }, oppdrag: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-fg">Oversikt</h1>
          <Link href="/mine-boliger/ny">
            <Button size="sm">
              <Plus size={16} />
              Ny bolig
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatKort
            ikon={<Building2 size={20} />}
            label="Mine boliger"
            verdi={boliger.length}
            href="/mine-boliger"
          />
          <StatKort
            ikon={<ClipboardList size={20} />}
            label="Aktive oppdrag"
            verdi={boliger.filter((b) => b.oppdrag).length}
            href="/mine-boliger"
          />
        </div>

        {boliger.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-muted-fg mb-3">Siste boliger</h2>
            <div className="space-y-2">
              {boliger.map((bolig) => (
                <Link key={bolig.id} href={`/mine-boliger/${bolig.id}`}>
                  <Card className="hover:shadow-sm transition-shadow">
                    <CardBody className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-fg text-sm">
                          {bolig.gate} {bolig.nummer}
                        </p>
                        <p className="text-xs text-muted-fg">
                          {bolig.postnummer} {bolig.poststed}
                        </p>
                      </div>
                      <ListingStatusBadge status={bolig.status} />
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {boliger.length === 0 && (
          <Card>
            <CardBody className="text-center py-10">
              <Building2 size={32} className="text-muted-fg mx-auto mb-3" />
              <p className="text-sm text-muted-fg mb-3">Du har ikke registrert noen boliger ennå.</p>
              <Link href="/mine-boliger/ny">
                <Button>Registrer din første bolig</Button>
              </Link>
            </CardBody>
          </Card>
        )}
      </div>
    );
  }

  if (bruker.rolle === "FOTOGRAF") {
    const oppdrag = await db.markedsoppdrag.findMany({
      where: { fotografId: bruker.id, status: "FOTO_BESTILT" },
      include: { bolig: true },
      take: 5,
    });
    return (
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold text-fg">Fotooppdrag</h1>
        <StatKort ikon={<Camera size={20} />} label="Ventende oppdrag" verdi={oppdrag.length} href="/fotograf" />
      </div>
    );
  }

  if (bruker.rolle === "TAKSTMANN") {
    const oppdrag = await db.markedsoppdrag.findMany({
      where: { takstmannId: bruker.id, status: "TAKST_BESTILT" },
      include: { bolig: true },
      take: 5,
    });
    return (
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold text-fg">Takstoppdrag</h1>
        <StatKort ikon={<FileText size={20} />} label="Ventende oppdrag" verdi={oppdrag.length} href="/takst" />
      </div>
    );
  }

  return <p>Velkommen!</p>;
}

function StatKort({ ikon, label, verdi, href }: { ikon: React.ReactNode; label: string; verdi: number; href: string }) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-sm transition-shadow">
        <CardBody className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-[var(--radius-sm)] text-muted-fg">{ikon}</div>
          <div>
            <p className="text-2xl font-bold text-fg">{verdi}</p>
            <p className="text-xs text-muted-fg">{label}</p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
