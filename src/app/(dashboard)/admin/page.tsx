import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";
import { Users, Bell, Building2 } from "lucide-react";

export default async function AdminSide() {
  await requireAdmin();

  const [brukereAntall, nabovarselAntall, boligerAntall] = await Promise.all([
    db.bruker.count(),
    db.nabovarsel.count({ where: { aktiv: true } }),
    db.bolig.count(),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-fg">Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/admin/brukere">
          <Card className="hover:shadow-sm transition-shadow">
            <CardBody className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-[var(--radius-sm)] text-muted-fg"><Users size={18} /></div>
              <div>
                <p className="text-2xl font-bold text-fg">{brukereAntall}</p>
                <p className="text-xs text-muted-fg">Brukere</p>
              </div>
            </CardBody>
          </Card>
        </Link>
        <Link href="/admin/nabovarsel">
          <Card className="hover:shadow-sm transition-shadow">
            <CardBody className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-[var(--radius-sm)] text-muted-fg"><Bell size={18} /></div>
              <div>
                <p className="text-2xl font-bold text-fg">{nabovarselAntall}</p>
                <p className="text-xs text-muted-fg">Aktive nabovarsler</p>
              </div>
            </CardBody>
          </Card>
        </Link>
        <Card>
          <CardBody className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-[var(--radius-sm)] text-muted-fg"><Building2 size={18} /></div>
            <div>
              <p className="text-2xl font-bold text-fg">{boligerAntall}</p>
              <p className="text-xs text-muted-fg">Boliger totalt</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
