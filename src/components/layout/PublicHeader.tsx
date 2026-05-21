"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-40 bg-navy text-navy-fg shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-gold">
          snartsolgt
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/" className="text-navy-fg/80 hover:text-gold transition-colors">
            Boliger
          </Link>
          <Link href="/nabovarsel" className="text-navy-fg/80 hover:text-gold transition-colors">
            Nabolagsvarsel
          </Link>
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="text-navy-fg/80 hover:text-gold transition-colors">
                Min side
              </Link>
              <UserButton />
            </>
          ) : (
            <Link href="/sign-in">
              <Button size="sm" variant="secondary">
                Logg inn
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2 -mr-2 text-navy-fg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Meny"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile nav */}
      <div
        className={cn(
          "sm:hidden bg-navy-light overflow-hidden transition-all duration-200",
          menuOpen ? "max-h-64" : "max-h-0"
        )}
      >
        <nav className="flex flex-col px-4 py-3 gap-4 text-sm">
          <Link href="/" className="text-navy-fg/80 hover:text-gold" onClick={() => setMenuOpen(false)}>
            Boliger
          </Link>
          <Link href="/nabovarsel" className="text-navy-fg/80 hover:text-gold" onClick={() => setMenuOpen(false)}>
            Nabolagsvarsel
          </Link>
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="text-navy-fg/80 hover:text-gold" onClick={() => setMenuOpen(false)}>
                Min side
              </Link>
              <div className="pb-2">
                <UserButton />
              </div>
            </>
          ) : (
            <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
              <Button size="sm" variant="secondary" className="w-full">
                Logg inn
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
