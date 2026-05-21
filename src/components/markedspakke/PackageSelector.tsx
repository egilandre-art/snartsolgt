"use client";

import { cn } from "@/lib/utils";
import { PAKKE_LABELS, PAKKE_BESKRIVELSE } from "@/lib/constants";
import { CheckCircle2, Zap, Users } from "lucide-react";
import type { MarkedspakkeType } from "@prisma/client";

interface PackageSelectorProps {
  selected: MarkedspakkeType | null;
  onChange: (pakke: MarkedspakkeType) => void;
}

const pakker: { type: MarkedspakkeType; icon: React.ReactNode; pris: string }[] = [
  {
    type: "HELDIGITAL",
    icon: <Zap size={24} />,
    pris: "Fra kr 4 900",
  },
  {
    type: "MEGLERDIGITAL",
    icon: <Users size={24} />,
    pris: "Fra kr 29 900",
  },
];

export function PackageSelector({ selected, onChange }: PackageSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {pakker.map(({ type, icon, pris }) => {
        const isSelected = selected === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              "text-left p-5 rounded-[var(--radius-card)] border-2 transition-all",
              isSelected
                ? "border-navy bg-navy/5 shadow-sm"
                : "border-border bg-surface hover:border-navy/40"
            )}
          >
            <div className="flex justify-between items-start mb-3">
              <div className={cn("p-2 rounded-lg", isSelected ? "bg-navy text-navy-fg" : "bg-muted text-muted-fg")}>
                {icon}
              </div>
              {isSelected && <CheckCircle2 size={20} className="text-navy" />}
            </div>
            <h3 className="font-semibold text-fg text-base mb-1">{PAKKE_LABELS[type]}</h3>
            <p className="text-xs text-muted-fg mb-3">{PAKKE_BESKRIVELSE[type]}</p>
            <p className="text-sm font-medium text-navy">{pris}</p>
          </button>
        );
      })}
    </div>
  );
}
