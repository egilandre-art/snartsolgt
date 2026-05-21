"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, ClipboardList, Camera, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Rolle } from "@prisma/client";

interface MobileNavProps {
  rolle: Rolle;
}

const navConfig: Record<Rolle, { href: string; label: string; icon: React.ReactNode }[]> = {
  BOLIGEIER: [
    { href: "/dashboard", label: "Hjem", icon: <Home size={20} /> },
    { href: "/mine-boliger", label: "Boliger", icon: <Building2 size={20} /> },
  ],
  MEGLER: [
    { href: "/dashboard", label: "Hjem", icon: <Home size={20} /> },
    { href: "/mine-boliger", label: "Boliger", icon: <Building2 size={20} /> },
    { href: "/oppdrag", label: "Oppdrag", icon: <ClipboardList size={20} /> },
  ],
  FOTOGRAF: [
    { href: "/dashboard", label: "Hjem", icon: <Home size={20} /> },
    { href: "/fotograf", label: "Oppdrag", icon: <Camera size={20} /> },
  ],
  TAKSTMANN: [
    { href: "/dashboard", label: "Hjem", icon: <Home size={20} /> },
    { href: "/takst", label: "Oppdrag", icon: <FileText size={20} /> },
  ],
};

export function MobileNav({ rolle }: MobileNavProps) {
  const pathname = usePathname();
  const items = navConfig[rolle] ?? navConfig.BOLIGEIER;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy border-t border-navy-light/40 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors",
                active ? "text-gold" : "text-navy-fg/60 hover:text-navy-fg"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
