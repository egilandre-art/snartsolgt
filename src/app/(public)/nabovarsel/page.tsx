import { NabovarselForm } from "@/components/nabovarsel/NabovarselForm";
import { Bell } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nabolagsvarsel",
  description: "Registrer deg for å få varsel når det dukker opp boliger i ditt nabolag.",
};

export default function NabovarselSide() {
  return (
    <div className="max-w-md mx-auto px-4 py-12 pb-20">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/10 rounded-full mb-4">
          <Bell size={28} className="text-gold" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-fg mb-2">Nabolagsvarsel</h1>
        <p className="text-muted-fg text-sm">
          Registrer din interesse for et område, og vi varsler deg så snart det dukker opp en bolig —
          enten det gjelder "vurderes solgt" eller "til salgs".
        </p>
      </div>
      <div className="bg-surface border border-border rounded-[var(--radius-card)] p-6">
        <NabovarselForm />
      </div>
    </div>
  );
}
