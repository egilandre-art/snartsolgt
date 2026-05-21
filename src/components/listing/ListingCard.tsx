import Image from "next/image";
import Link from "next/link";
import { ListingStatusBadge } from "./ListingStatusBadge";
import { formatNok, formatAreal } from "@/lib/utils";
import { BedDouble, Maximize2, MapPin } from "lucide-react";
import type { BoligStatus } from "@prisma/client";

interface ListingCardProps {
  id: string;
  slug: string;
  status: BoligStatus;
  gate: string;
  nummer: string;
  poststed: string;
  postnummer: string;
  boligtype: string;
  bruksareal?: number | null;
  soverom?: number | null;
  prisantydning?: number | null;
  forsidebilde?: string | null;
}

export function ListingCard({
  slug, status, gate, nummer, poststed, postnummer,
  boligtype, bruksareal, soverom, prisantydning, forsidebilde,
}: ListingCardProps) {
  return (
    <Link href={`/bolig/${slug}`} className="block group">
      <article className="bg-surface rounded-[var(--radius-card)] border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        <div className="relative aspect-[16/10] bg-muted">
          {forsidebilde ? (
            <Image
              src={forsidebilde}
              alt={`${gate} ${nummer}, ${poststed}`}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted-fg text-sm">Ingen bilde</span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <ListingStatusBadge status={status} />
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-muted-fg mb-1">{boligtype}</p>
          <h3 className="font-semibold text-fg text-base leading-tight mb-1">
            {gate} {nummer}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-fg mb-3">
            <MapPin size={11} />
            {postnummer} {poststed}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-fg mb-3">
            {bruksareal && (
              <span className="flex items-center gap-1">
                <Maximize2 size={12} />
                {formatAreal(bruksareal)}
              </span>
            )}
            {soverom != null && (
              <span className="flex items-center gap-1">
                <BedDouble size={12} />
                {soverom} soverom
              </span>
            )}
          </div>

          {prisantydning ? (
            <p className="font-display text-lg font-semibold text-navy">
              {formatNok(prisantydning)}
            </p>
          ) : (
            <p className="text-sm text-muted-fg italic">Pris ikke satt</p>
          )}
        </div>
      </article>
    </Link>
  );
}
