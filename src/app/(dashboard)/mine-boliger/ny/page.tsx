import { ListingForm } from "@/components/listing/ListingForm";
import { createListing } from "@/actions/listing";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Registrer ny bolig" };

export default function NyBolig() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold text-fg mb-6">Registrer ny bolig</h1>
      <div className="bg-surface border border-border rounded-[var(--radius-card)] p-5">
        <ListingForm onSubmit={createListing} submitLabel="Registrer bolig" />
      </div>
    </div>
  );
}
