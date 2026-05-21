import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ROLLE_LABELS } from "@/lib/constants";
import { formatDato } from "@/lib/utils";

export default async function AdminBrukere() {
  await requireAdmin();

  const brukere = await db.bruker.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl space-y-5">
      <h1 className="text-2xl font-semibold text-fg">Brukere ({brukere.length})</h1>
      <div className="space-y-2">
        {brukere.map((bruker) => (
          <Card key={bruker.id}>
            <CardBody className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-fg">
                  {bruker.fornavn} {bruker.etternavn}
                </p>
                <p className="text-xs text-muted-fg">{bruker.email}</p>
                <p className="text-xs text-muted-fg">{formatDato(bruker.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-muted text-muted-fg">{ROLLE_LABELS[bruker.rolle]}</Badge>
                {bruker.isAdmin && <Badge className="bg-navy text-navy-fg">Admin</Badge>}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
