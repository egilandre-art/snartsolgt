"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home, Building2, ClipboardList, Camera, FileText, Users, Bell, Settings
} from "lucide-react";
import type { Rolle } from "@prisma/client";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roller: Rolle[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Oversikt", icon: <Home size={18} />, roller: ["BOLIGEIER", "MEGLER", "FOTOGRAF", "TAKSTMANN"] },
  { href: "/mine-boliger", label: "Mine boliger", icon: <Building2 size={18} />, roller: ["BOLIGEIER", "MEGLER"] },
  { href: "/oppdrag", label: "Oppdrag", icon: <ClipboardList size={18} />, roller: ["MEGLER"] },
  { href: "/fotograf", label: "Fotooppdrag", icon: <Camera size={18} />, roller: ["FOTOGRAF"] },
  { href: "/takst", label: "Takstoppdrag", icon: <FileText size={18} />, roller: ["TAKSTMANN"] },
];

const adminItems: NavItem[] = [
  { href: "/admin", label: "Admin", icon: <Settings size={18} />, roller: ["BOLIGEIER"] },
  { href: "/admin/brukere", label: "Brukere", icon: <Users size={18} />, roller: ["BOLIGEIER"] },
  { href: "/admin/nabovarsel", label: "Nabovarsel", icon: <Bell size={18} />, roller: ["BOLIGEIER"] },
];

interface DashboardSidebarProps {
  rolle: Rolle;
  isAdmin?: boolean;
}

export function DashboardSidebar({ rolle, isAdmin }: DashboardSidebarProps) {
  const pathname = usePathname();

  const filteredNav = navItems.filter((item) => item.roller.includes(rolle));

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-navy text-navy-fg border-r border-navy-light/40 shrink-0">
      <div className="h-14 flex items-center px-5 border-b border-navy-light/40">
        <Link href="/" className="font-display text-lg font-semibold text-gold">
          snartsolgt
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {filteredNav.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href || pathname.startsWith(item.href + "/")} />
        ))}
        {isAdmin && (
          <>
            <div className="mt-4 mb-2 px-2 text-xs font-medium text-navy-fg/40 uppercase tracking-widest">Admin</div>
            {adminItems.map((item) => (
              <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors",
        active
          ? "bg-gold text-gold-fg font-medium"
          : "text-navy-fg/70 hover:text-navy-fg hover:bg-navy-light/60"
      )}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}
