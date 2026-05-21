"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { markPhotosComplete } from "@/actions/fotograf";
import { toast } from "sonner";
import { CheckCircle2, Upload, Loader2 } from "lucide-react";
import type { Bilde } from "@prisma/client";

interface FotoUploaderProps {
  oppdragId: string;
  boligId: string;
  eksisterendeBilder: Bilde[];
  fullfort: boolean;
}

export function FotoUploader({ oppdragId, eksisterendeBilder, fullfort }: FotoUploaderProps) {
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    // TODO: Implementer UploadThing her når UPLOADTHING_TOKEN er konfigurert
    // For nå, viser vi en placeholder
    setTimeout(() => {
      setUploading(false);
      toast.info("UploadThing er ikke konfigurert ennå. Legg til UPLOADTHING_TOKEN i .env.local");
    }, 500);
  }

  function handleMarkComplete() {
    startTransition(async () => {
      try {
        await markPhotosComplete(oppdragId);
        toast.success("Bilder levert! AI-beskrivelse genereres...");
      } catch {
        toast.error("Noe gikk galt");
      }
    });
  }

  if (fullfort) {
    return (
      <div className="flex flex-col items-center py-10 gap-3">
        <CheckCircle2 size={48} className="text-success" />
        <p className="font-semibold text-fg">Bilder levert</p>
        <p className="text-sm text-muted-fg">AI-beskrivelse genereres automatisk.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="border-2 border-dashed border-border rounded-[var(--radius-card)] p-8 text-center">
        <Upload size={32} className="text-muted-fg mx-auto mb-3" />
        <p className="text-sm text-muted-fg mb-3">Last opp bilder av boligen</p>
        <label className="inline-flex items-center gap-2 bg-navy text-navy-fg text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] cursor-pointer hover:bg-navy-light transition-colors">
          {uploading && <Loader2 size={16} className="animate-spin" />}
          Velg bilder
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="sr-only" />
        </label>
      </div>

      {eksisterendeBilder.length > 0 && (
        <div>
          <p className="text-sm font-medium text-fg mb-2">Opplastede bilder ({eksisterendeBilder.length})</p>
          <div className="grid grid-cols-3 gap-2">
            {eksisterendeBilder.map((bilde) => (
              <div key={bilde.id} className="aspect-square bg-muted rounded-[var(--radius-sm)] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bilde.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleMarkComplete}
        loading={pending}
        disabled={eksisterendeBilder.length === 0}
        className="w-full"
        size="lg"
      >
        <CheckCircle2 size={16} />
        Marker som levert
      </Button>
    </div>
  );
}
