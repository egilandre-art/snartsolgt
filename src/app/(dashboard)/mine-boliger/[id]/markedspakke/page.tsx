"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PackageSelector } from "@/components/markedspakke/PackageSelector";
import { Button } from "@/components/ui/Button";
import { orderPackage } from "@/actions/markedspakke";
import { toast } from "sonner";
import type { MarkedspakkeType } from "@prisma/client";

export default function MarkedspakkeSide({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [valgtPakke, setValgtPakke] = useState<MarkedspakkeType | null>(null);
  const [pending, startTransition] = useTransition();

  function handleBestill() {
    if (!valgtPakke) { toast.error("Velg en pakke"); return; }
    startTransition(async () => {
      try {
        await orderPackage(params.id, valgtPakke);
        toast.success("Markedspakke bestilt!");
        router.push(`/mine-boliger/${params.id}`);
      } catch {
        toast.error("Noe gikk galt");
      }
    });
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Velg markedspakke</h1>
        <p className="text-sm text-muted-fg mt-1">
          Velg pakken som passer best for din bolig og situasjon.
        </p>
      </div>
      <PackageSelector selected={valgtPakke} onChange={setValgtPakke} />
      <Button
        onClick={handleBestill}
        loading={pending}
        disabled={!valgtPakke}
        size="lg"
        className="w-full"
      >
        Bestill {valgtPakke ? (valgtPakke === "HELDIGITAL" ? "Heldigital" : "Meglerdigital") : ""} pakke
      </Button>
    </div>
  );
}
