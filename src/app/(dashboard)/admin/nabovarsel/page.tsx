import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDato } from "@/lib/utils";

export default async function AdminNabovarsel() {
  await requireAdmin();

  const varsler = await db.nabovarsel.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl space-y-5">
      <h1 className="text-2xl font-semibold text-fg">
        Nabovarsler ({varsler.filter((v) => v.aktiv).length} aktive)
      </h1>
      <div className="space-y-2">
        {varsler.map((v) => (
          <Card key={v.id}>
            <CardBody className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-fg">{v.email}</p>
                <p className="text-xs text-muted-fg">
                  {v.navn ? `${v.navn} · ` : ""}{v.kommune}
                  {v.postnummer ? ` (${v.postnummer})` : ""}
                </p>
                <p className="text-xs text-muted-fg">Registrert {formatDato(v.createdAt)}</p>
              </div>
              <Badge className={v.aktiv ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}>
                {v.aktiv ? "Aktiv" : "Inaktiv"}
              </Badge>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
