import { Badge } from "@/components/ui/Badge";
import { BOLIGSTATUS_FARGER, BOLIGSTATUS_LABELS } from "@/lib/constants";
import type { BoligStatus } from "@prisma/client";

export function ListingStatusBadge({ status }: { status: BoligStatus }) {
  return (
    <Badge className={BOLIGSTATUS_FARGER[status]}>
      {BOLIGSTATUS_LABELS[status]}
    </Badge>
  );
}
