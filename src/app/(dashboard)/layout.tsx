import { requireBruker } from "@/lib/auth";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { MobileNav } from "@/components/layout/MobileNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const bruker = await requireBruker();

  return (
    <div className="flex min-h-screen bg-canvas">
      <DashboardSidebar rolle={bruker.rolle} isAdmin={bruker.isAdmin} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader fornavn={bruker.fornavn} rolle={bruker.rolle} />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>
      <MobileNav rolle={bruker.rolle} />
    </div>
  );
}
