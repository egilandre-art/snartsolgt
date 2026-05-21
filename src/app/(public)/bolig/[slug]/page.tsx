import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ListingStatusBadge } from "@/components/listing/ListingStatusBadge";
import { formatNok, formatAreal, formatDato } from "@/lib/utils";
import Image from "next/image";
import { MapPin, BedDouble, Maximize2, CalendarDays, Building } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bolig = await db.bolig.findUnique({ where: { slug } });
  if (!bolig) return { title: "Ikke funnet" };
  return {
    title: `${bolig.gate} ${bolig.nummer}, ${bolig.poststed}`,
    description: bolig.kortBeskrivelse ?? undefined,
  };
}

export default async function BoligDetalj({ params }: Props) {
  const { slug } = await params;
  const bolig = await db.bolig.findUnique({
    where: { slug },
    include: {
      bilder: { orderBy: { rekkefølge: "asc" } },
      megler: { select: { fornavn: true, etternavn: true, email: true, telefon: true } },
    },
  });

  if (!bolig || (bolig.status !== "TIL_SALGS" && bolig.status !== "VURDERES_SOLGT")) {
    notFound();
  }

  const [forste, ...resten] = bolig.bilder;

  return (
    <article className="max-w-3xl mx-auto px-4 py-6 pb-20">
      {/* Bildegalleri */}
      <div className="mb-6 rounded-[var(--radius-card)] overflow-hidden">
        {forste ? (
          <div className="relative aspect-[16/9]">
            <Image
              src={forste.url}
              alt={forste.altTekst ?? `${bolig.gate} ${bolig.nummer}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-muted flex items-center justify-center text-muted-fg text-sm">
            Ingen bilder lastet opp ennå
          </div>
        )}
        {resten.length > 0 && (
          <div className="grid grid-cols-4 gap-1 mt-1">
            {resten.slice(0, 4).map((bilde) => (
              <div key={bilde.id} className="relative aspect-square">
                <Image src={bilde.url} alt={bilde.altTekst ?? ""} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <ListingStatusBadge status={bolig.status} />
          <span className="text-xs text-muted-fg">{bolig.boligtype}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-fg">
          {bolig.gate} {bolig.nummer}
        </h1>
        <div className="flex items-center gap-1 text-sm text-muted-fg mt-1">
          <MapPin size={14} />
          {bolig.postnummer} {bolig.poststed}, {bolig.kommune}
        </div>
      </div>

      {/* Pris */}
      {bolig.prisantydning && (
        <div className="bg-navy text-navy-fg rounded-[var(--radius-card)] p-4 mb-5">
          <p className="text-xs text-navy-fg/60 mb-0.5">Prisantydning</p>
          <p className="font-display text-3xl font-semibold text-gold">
            {formatNok(bolig.prisantydning)}
          </p>
          {bolig.fellesgjeld && (
            <p className="text-xs text-navy-fg/60 mt-1">
              + {formatNok(bolig.fellesgjeld)} fellesgjeld
            </p>
          )}
        </div>
      )}

      {/* Nøkkelinfo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {bolig.bruksareal && (
          <InfoKort icon={<Maximize2 size={16} />} label="BRA" verdi={formatAreal(bolig.bruksareal)} />
        )}
        {bolig.soverom != null && (
          <InfoKort icon={<BedDouble size={16} />} label="Soverom" verdi={`${bolig.soverom}`} />
        )}
        {bolig.byggeaar && (
          <InfoKort icon={<CalendarDays size={16} />} label="Byggeår" verdi={`${bolig.byggeaar}`} />
        )}
        {bolig.etasje && (
          <InfoKort icon={<Building size={16} />} label="Etasje" verdi={`${bolig.etasje}. etg`} />
        )}
      </div>

      {/* Beskrivelse */}
      {bolig.kortBeskrivelse && (
        <p className="text-base text-fg font-medium mb-4 leading-relaxed border-l-4 border-gold pl-4">
          {bolig.kortBeskrivelse}
        </p>
      )}
      {bolig.langBeskrivelse && (
        <div className="prose prose-sm max-w-none mb-6 text-fg/80 leading-relaxed whitespace-pre-line">
          {bolig.langBeskrivelse}
        </div>
      )}

      {/* Nabolag */}
      {bolig.nabolagsBeskrivelse && (
        <section className="mb-6 p-4 bg-muted rounded-[var(--radius-card)]">
          <h2 className="font-semibold text-fg mb-2">Om nabolaget</h2>
          <p className="text-sm text-muted-fg leading-relaxed">{bolig.nabolagsBeskrivelse}</p>
        </section>
      )}

      {/* Megler */}
      {bolig.megler && (
        <section className="p-4 border border-border rounded-[var(--radius-card)]">
          <p className="text-xs text-muted-fg mb-1">Ansvarlig megler</p>
          <p className="font-semibold text-fg">
            {bolig.megler.fornavn} {bolig.megler.etternavn}
          </p>
          {bolig.megler.telefon && (
            <a href={`tel:${bolig.megler.telefon}`} className="text-sm text-navy underline underline-offset-2">
              {bolig.megler.telefon}
            </a>
          )}
        </section>
      )}

      {/* Publisert */}
      <p className="mt-4 text-xs text-muted-fg">
        Lagt ut: {formatDato(bolig.updatedAt)}
      </p>
    </article>
  );
}

function InfoKort({ icon, label, verdi }: { icon: React.ReactNode; label: string; verdi: string }) {
  return (
    <div className="bg-muted rounded-[var(--radius-sm)] p-3 flex flex-col gap-1">
      <div className="text-muted-fg">{icon}</div>
      <p className="text-xs text-muted-fg">{label}</p>
      <p className="font-semibold text-fg text-sm">{verdi}</p>
    </div>
  );
}
