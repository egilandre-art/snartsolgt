"use client";

import { UserButton } from "@clerk/nextjs";
import { ROLLE_LABELS } from "@/lib/constants";
import type { Rolle } from "@prisma/client";

interface DashboardHeaderProps {
  fornavn: string;
  rolle: Rolle;
}

export function DashboardHeader({ fornavn, rolle }: DashboardHeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-surface md:px-6">
      <p className="text-sm text-muted-fg">
        God dag, <span className="font-medium text-fg">{fornavn}</span>
        <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">{ROLLE_LABELS[rolle]}</span>
      </p>
      <UserButton />
    </header>
  );
}
