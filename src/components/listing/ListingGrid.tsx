import { ListingCard } from "./ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Building2 } from "lucide-react";
import type { Bolig, Bilde } from "@prisma/client";

type BoligMedBilde = Bolig & { bilder: Pick<Bilde, "url">[] };

export function ListingGrid({ boliger }: { boliger: BoligMedBilde[] }) {
  if (!boliger.length) {
    return (
      <EmptyState
        icon={<Building2 size={40} />}
        tittel="Ingen boliger funnet"
        beskrivelse="Det er ingen boliger til salgs i dette området ennå."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {boliger.map((bolig) => (
        <ListingCard
          key={bolig.id}
          id={bolig.id}
          slug={bolig.slug}
          status={bolig.status}
          gate={bolig.gate}
          nummer={bolig.nummer}
          poststed={bolig.poststed}
          postnummer={bolig.postnummer}
          boligtype={bolig.boligtype}
          bruksareal={bolig.bruksareal}
          soverom={bolig.soverom}
          prisantydning={bolig.prisantydning}
          forsidebilde={bolig.bilder[0]?.url ?? null}
        />
      ))}
    </div>
  );
}
