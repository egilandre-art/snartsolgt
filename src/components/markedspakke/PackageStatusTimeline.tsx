import { cn } from "@/lib/utils";
import { OPPDRAGSTATUS_LABELS, OPPDRAGSTATUS_STEG } from "@/lib/constants";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { OppdragStatus } from "@prisma/client";

interface TimelineProps {
  nåværendeStatus: OppdragStatus;
}

export function PackageStatusTimeline({ nåværendeStatus }: TimelineProps) {
  const nåværendeIndex = OPPDRAGSTATUS_STEG.indexOf(nåværendeStatus);

  return (
    <ol className="relative border-l-2 border-border ml-3 space-y-6">
      {OPPDRAGSTATUS_STEG.map((steg, i) => {
        const ferdig = i < nåværendeIndex;
        const aktiv = i === nåværendeIndex;
        return (
          <li key={steg} className="ml-6">
            <div
              className={cn(
                "absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full border-2",
                ferdig ? "border-navy bg-navy" : aktiv ? "border-gold bg-surface" : "border-border bg-surface"
              )}
            >
              {ferdig ? (
                <CheckCircle2 size={14} className="text-navy-fg" />
              ) : aktiv ? (
                <Clock size={12} className="text-gold" />
              ) : (
                <Circle size={12} className="text-border" />
              )}
            </div>
            <p
              className={cn(
                "text-sm",
                ferdig ? "text-muted-fg line-through" : aktiv ? "font-semibold text-fg" : "text-muted-fg"
              )}
            >
              {OPPDRAGSTATUS_LABELS[steg]}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
