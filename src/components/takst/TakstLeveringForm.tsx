"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { deliverValuation } from "@/actions/takst";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TakstLeveringForm({ oppdragId }: { oppdragId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [takstverdi, setTakstverdi] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const verdi = parseInt(takstverdi.replace(/\s/g, ""), 10);
    if (!verdi || verdi < 0) { toast.error("Ugyldig takstverdi"); return; }

    startTransition(async () => {
      try {
        await deliverValuation(oppdragId, verdi);
        toast.success("Takst levert!");
        router.refresh();
      } catch {
        toast.error("Noe gikk galt");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-[var(--radius-card)] p-5 space-y-4">
      <h2 className="font-semibold text-fg">Lever takstvurdering</h2>
      <Input
        label="Takstverdi (kr)"
        type="number"
        min={0}
        value={takstverdi}
        onChange={(e) => setTakstverdi(e.target.value)}
        required
        placeholder="4500000"
        inputMode="numeric"
      />
      <Input
        label="Takstrapport URL (valgfritt)"
        type="url"
        placeholder="https://..."
        hint="Lenke til PDF-rapport"
      />
      <Button type="submit" loading={pending} className="w-full" size="lg">
        Lever takst
      </Button>
    </form>
  );
}
