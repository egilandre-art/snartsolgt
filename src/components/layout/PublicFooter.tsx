import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-navy text-navy-fg/60 text-sm mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <span className="text-gold font-display font-semibold">snartsolgt</span>
          <p className="mt-1 text-xs">Din digitale eiendomsmegler.</p>
        </div>
        <nav className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-xs">
          <Link href="/" className="hover:text-navy-fg transition-colors">Boliger</Link>
          <Link href="/nabovarsel" className="hover:text-navy-fg transition-colors">Nabolagsvarsel</Link>
          <Link href="/sign-up" className="hover:text-navy-fg transition-colors">Registrer deg</Link>
        </nav>
      </div>
      <div className="border-t border-navy-light/30 text-center py-3 text-xs text-navy-fg/40">
        © {new Date().getFullYear()} snartsolgt.no
      </div>
    </footer>
  );
}
