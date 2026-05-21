import { requireBruker } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ListingStatusBadge } from "@/components/listing/ListingStatusBadge";
import { PackageStatusTimeline } from "@/components/markedspakke/PackageStatusTimeline";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import Link from "next/link";
import { publishListing } from "@/actions/listing";
import { PAKKE_LABELS } from "@/lib/constants";
import { formatNok } from "@/lib/utils";
import { Package, Globe, Edit3 } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BoligDetalj({ params }: Props) {
  const { id } = await params;
  const bruker = await requireBruker();

  const bolig = await db.bolig.findUnique({
    where: { id },
    include: {
      bilder: { orderBy: { rekkefølge: "asc" } },
      oppdrag: true,
      eier: { select: { fornavn: true, etternavn: true } },
      megler: { select: { fornavn: true, etternavn: true } },
    },
  });

  if (!bolig || (bolig.eierId !== bruker.id && bolig.meglerId !== bruker.id)) {
    notFound();
  }

  const kanPublisere =
    bolig.oppdrag?.status === "AI_GENERERT" && bolig.status !== "TIL_SALGS";

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ListingStatusBadge status={bolig.status} />
          </div>
          <h1 className="text-2xl font-semibold text-fg">
            {bolig.gate} {bolig.nummer}
          </h1>
          <p className="text-sm text-muted-fg">
            {bolig.postnummer} {bolig.poststed}
          </p>
        </div>
        {bolig.prisantydning && (
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-fg">Prisantydning</p>
            <p className="font-display text-xl font-semibold text-navy">{formatNok(bolig.prisantydning)}</p>
          </div>
        )}
      </div>

      {/* Handlinger */}
      <div className="flex flex-wrap gap-3">
        {bolig.status === "UTKAST" && (
          <Link href={`/mine-boliger/${id}/markedspakke`}>
            <Button>
              <Package size={16} />
              Bestill markedspakke
            </Button>
          </Link>
        )}
        {kanPublisere && (
          <form action={publishListing.bind(null, id)}>
            <Button type="submit" variant="primary">
              <Globe size={16} />
              Publiser til salgs
            </Button>
          </form>
        )}
        {bolig.oppdrag && (
          <Link href={`/mine-boliger/${id}/markedspakke`}>
            <Button variant="secondary">
              <Package size={16} />
              Se oppdrag
            </Button>
          </Link>
        )}
      </div>

      {/* Oppdragsstatus */}
      {bolig.oppdrag && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-fg">
                {PAKKE_LABELS[bolig.oppdrag.pakke]} — Oppdragsstatus
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            <PackageStatusTimeline nåværendeStatus={bolig.oppdrag.status} />
          </CardBody>
        </Card>
      )}

      {/* Boliginfo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-fg">Boligdetaljer</h2>
            <Link href={`/mine-boliger/${id}/rediger`}>
              <Button variant="ghost" size="sm">
                <Edit3 size={14} />
                Rediger
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-muted-fg">Type</dt><dd className="font-medium">{bolig.boligtype}</dd></div>
            {bolig.bruksareal && <div><dt className="text-muted-fg">BRA</dt><dd className="font-medium">{bolig.bruksareal} m²</dd></div>}
            {bolig.soverom != null && <div><dt className="text-muted-fg">Soverom</dt><dd className="font-medium">{bolig.soverom}</dd></div>}
            {bolig.byggeaar && <div><dt className="text-muted-fg">Byggeår</dt><dd className="font-medium">{bolig.byggeaar}</dd></div>}
          </dl>
        </CardBody>
      </Card>

      {/* AI-beskrivelse */}
      {bolig.kortBeskrivelse && (
        <Card>
          <CardHeader><h2 className="font-semibold text-fg">AI-generert beskrivelse</h2></CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm font-medium text-fg border-l-4 border-gold pl-3">{bolig.kortBeskrivelse}</p>
            {bolig.langBeskrivelse && (
              <p className="text-sm text-muted-fg whitespace-pre-line">{bolig.langBeskrivelse}</p>
            )}
          </CardBody>
        </Card>
      )}

      {/* Bilder */}
      {bolig.bilder.length > 0 && (
        <Card>
          <CardHeader><h2 className="font-semibold text-fg">Bilder ({bolig.bilder.length})</h2></CardHeader>
          <CardBody>
            <div className="grid grid-cols-3 gap-2">
              {bolig.bilder.map((bilde) => (
                <div key={bilde.id} className="aspect-square relative bg-muted rounded-[var(--radius-sm)] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bilde.url} alt={bilde.altTekst ?? ""} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
