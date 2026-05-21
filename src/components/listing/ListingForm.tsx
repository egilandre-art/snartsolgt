"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { BOLIGTYPER, NORSKE_KOMMUNER } from "@/lib/constants";
import { toast } from "sonner";
import type { ListingInput } from "@/lib/validators/listing";

interface ListingFormProps {
  defaultValues?: Partial<ListingInput>;
  onSubmit: (data: ListingInput) => Promise<void>;
  submitLabel?: string;
}

export function ListingForm({ defaultValues, onSubmit, submitLabel = "Lagre bolig" }: ListingFormProps) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<Partial<ListingInput>>(defaultValues ?? {});

  const set = (field: keyof ListingInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await onSubmit(form as ListingInput);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Noe gikk galt";
        toast.error(msg);
      }
    });
  }

  const boligtypeOptions = BOLIGTYPER.map((b) => ({ value: b, label: b }));
  const kommuneOptions = NORSKE_KOMMUNER.map((k) => ({ value: k, label: k }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-muted-fg uppercase tracking-wide">Adresse</legend>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Input label="Gate" value={form.gate ?? ""} onChange={set("gate")} required placeholder="Storgata" />
          </div>
          <Input label="Nummer" value={form.nummer ?? ""} onChange={set("nummer")} required placeholder="12" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Postnummer" value={form.postnummer ?? ""} onChange={set("postnummer")} required placeholder="0150" maxLength={4} inputMode="numeric" />
          <Input label="Poststed" value={form.poststed ?? ""} onChange={set("poststed")} required placeholder="Oslo" />
        </div>
        <Select label="Kommune" value={form.kommune ?? ""} onChange={set("kommune")} options={kommuneOptions} placeholder="Velg kommune..." required />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-muted-fg uppercase tracking-wide">Boligdetaljer</legend>
        <Select label="Boligtype" value={form.boligtype ?? ""} onChange={set("boligtype")} options={boligtypeOptions} placeholder="Velg type..." required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="BRA (m²)" type="number" min={1} value={form.bruksareal ?? ""} onChange={set("bruksareal")} placeholder="75" inputMode="numeric" />
          <Input label="Tomteareal (m²)" type="number" min={1} value={form.tomteareal ?? ""} onChange={set("tomteareal")} placeholder="350" inputMode="numeric" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input label="Soverom" type="number" min={0} value={form.soverom ?? ""} onChange={set("soverom")} placeholder="3" inputMode="numeric" />
          <Input label="Antall rom" type="number" min={1} value={form.antallRom ?? ""} onChange={set("antallRom")} placeholder="5" inputMode="numeric" />
          <Input label="Byggeår" type="number" min={1800} value={form.byggeaar ?? ""} onChange={set("byggeaar")} placeholder="1995" inputMode="numeric" />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-muted-fg uppercase tracking-wide">Pris</legend>
        <Input label="Prisantydning (kr)" type="number" min={0} value={form.prisantydning ?? ""} onChange={set("prisantydning")} placeholder="4500000" inputMode="numeric" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Fellesgjeld (kr)" type="number" min={0} value={form.fellesgjeld ?? ""} onChange={set("fellesgjeld")} placeholder="0" inputMode="numeric" />
          <Input label="Fellesutgifter/mnd (kr)" type="number" min={0} value={form.fellesutgifter ?? ""} onChange={set("fellesutgifter")} placeholder="0" inputMode="numeric" />
        </div>
      </fieldset>

      <Button type="submit" loading={pending} size="lg" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
