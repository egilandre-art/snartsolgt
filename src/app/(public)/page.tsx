import { db } from "@/lib/db";
import { ListingGrid } from "@/components/listing/ListingGrid";
import Link from "next/link";
import { Building2, Clock, MapPin, Package } from "lucide-react";

export const revalidate = 60;

export default async function Frontside() {
  const boliger = await db.bolig.findMany({
    where: { status: { in: ["VURDERES_SOLGT", "TIL_SALGS"] } },
    include: { bilder: { orderBy: { rekkefølge: "asc" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
    take: 24,
  }).catch(() => []);

  const vurderes = boliger.filter((b) => b.status === "VURDERES_SOLGT");
  const tilSalgs = boliger.filter((b) => b.status === "TIL_SALGS");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 pb-20">
      {/* Hero */}
      <section className="mb-14 text-center">
        <h1 className="font-display text-5xl sm:text-6xl font-semibold text-navy mb-10 leading-tight">
          SnartSolgt
        </h1>

        {/* Tre knapper stablet */}
        <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
          <Link href="/" className="w-full inline-flex items-center justify-center gap-2 bg-navy text-navy-fg text-sm font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity">
            <Building2 size={16} />
            Boliger til salgs
          </Link>
          <Link href="/?status=vurderes" className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity" style={{ backgroundColor: "oklch(35% 0.07 245)", color: "oklch(97% 0.005 245)" }}>
            <Clock size={16} />
            Boliger vurderes solgt
          </Link>
          <Link href="/nabovarsel" className="w-full inline-flex items-center justify-center gap-2 bg-gold text-gold-fg text-sm font-medium px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity">
            <MapPin size={16} />
            Registrer interesse i et område
          </Link>
        </div>

        {/* Markedspakke-seksjon */}
        <div className="mt-12">
          <p className="text-muted-fg text-sm max-w-sm mx-auto mb-4">
            Bestill markedspakke om du har en bolig å selge, eller om du bare ønsker å teste markedet.
          </p>
          <Link href="/mine-boliger/ny" className="inline-flex items-center gap-2 border-2 border-navy text-navy text-sm font-medium px-6 py-3 rounded-full hover:bg-navy hover:text-navy-fg transition-colors">
            <Package size={16} />
            Bestill markedspakke
          </Link>
        </div>
      </section>

      {/* Til salgs */}
      {tilSalgs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-fg mb-4">Boliger til salgs</h2>
          <ListingGrid boliger={tilSalgs} />
        </section>
      )}

      {/* Vurderes solgt */}
      {vurderes.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-fg mb-1">Boliger vurderes solgt</h2>
          <p className="text-sm text-muted-fg mb-4">
            Disse boligene er ikke ute på markedet ennå, men kan komme snart.
          </p>
          <ListingGrid boliger={vurderes} />
        </section>
      )}
    </div>
  );
}
