import { db } from "@/lib/db";
import { ListingGrid } from "@/components/listing/ListingGrid";
import Link from "next/link";
import { Bell } from "lucide-react";

export const revalidate = 60;

export default async function Frontside() {
  const boliger = await db.bolig.findMany({
    where: { status: { in: ["VURDERES_SOLGT", "TIL_SALGS"] } },
    include: { bilder: { orderBy: { rekkefølge: "asc" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
    take: 24,
  });

  const vurderes = boliger.filter((b) => b.status === "VURDERES_SOLGT");
  const tilSalgs = boliger.filter((b) => b.status === "TIL_SALGS");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-20">
      {/* Hero */}
      <section className="mb-10 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-navy mb-3">
          Snart solgt.
        </h1>
        <p className="text-muted-fg text-base max-w-md mx-auto">
          Følg med på boliger i ditt nabolag — enten de vurderes solgt eller allerede er ute på markedet.
        </p>
        <Link
          href="/nabovarsel"
          className="mt-5 inline-flex items-center gap-2 bg-gold text-gold-fg text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          <Bell size={15} />
          Registrer nabolagsvarsel
        </Link>
      </section>

      {/* Til salgs */}
      {tilSalgs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-fg mb-4">Til salgs</h2>
          <ListingGrid boliger={tilSalgs} />
        </section>
      )}

      {/* Vurderes solgt */}
      {vurderes.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-fg mb-1">Vurderes solgt</h2>
          <p className="text-sm text-muted-fg mb-4">
            Disse boligene er ikke ute på markedet ennå, men kan komme snart.
          </p>
          <ListingGrid boliger={vurderes} />
        </section>
      )}

      {boliger.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-fg">Ingen boliger er ute for øyeblikket.</p>
          <p className="text-sm text-muted-fg mt-1">
            <Link href="/nabovarsel" className="text-navy underline underline-offset-2">
              Registrer deg for å få varsel
            </Link>{" "}
            når det dukker opp boliger i ditt område.
          </p>
        </div>
      )}
    </div>
  );
}
