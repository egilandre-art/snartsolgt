"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { NORSKE_KOMMUNER } from "@/lib/constants";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export function NabovarselForm() {
  const [loading, setLoading] = useState(false);
  const [sendt, setSendt] = useState(false);
  const [form, setForm] = useState({ email: "", navn: "", kommune: "", postnummer: "" });

  const kommuneOptions = NORSKE_KOMMUNER.map((k) => ({ value: k, label: k }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.kommune) {
      toast.error("E-post og kommune er påkrevd");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/nabovarsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSendt(true);
    } catch {
      toast.error("Noe gikk galt. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  if (sendt) {
    return (
      <div className="flex flex-col items-center text-center py-10 gap-3">
        <CheckCircle2 size={48} className="text-success" />
        <h3 className="text-lg font-semibold">Du er registrert!</h3>
        <p className="text-sm text-muted-fg max-w-sm">
          Vi sender deg en e-post så snart det dukker opp en bolig i{" "}
          <strong>{form.kommune}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Navn (valgfritt)"
        value={form.navn}
        onChange={(e) => setForm({ ...form, navn: e.target.value })}
        placeholder="Ola Nordmann"
      />
      <Input
        label="E-postadresse"
        type="email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="ola@eksempel.no"
      />
      <Select
        label="Kommune"
        required
        value={form.kommune}
        onChange={(e) => setForm({ ...form, kommune: e.target.value })}
        options={kommuneOptions}
        placeholder="Velg kommune..."
      />
      <Input
        label="Postnummer (valgfritt)"
        value={form.postnummer}
        onChange={(e) => setForm({ ...form, postnummer: e.target.value })}
        placeholder="0150"
        maxLength={4}
        pattern="[0-9]{4}"
        inputMode="numeric"
      />
      <Button type="submit" loading={loading} size="lg" className="mt-2">
        Registrer meg
      </Button>
    </form>
  );
}
