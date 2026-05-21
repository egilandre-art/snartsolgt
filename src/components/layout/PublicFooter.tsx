export function PublicFooter() {
  return (
    <footer className="bg-navy text-navy-fg/60 text-sm mt-auto">
      <div className="border-t border-navy-light/30 text-center py-4 text-xs text-navy-fg/40">
        <span className="text-gold font-display font-semibold mr-2">SnartSolgt</span>
        © {new Date().getFullYear()} snartsolgt.no — Din digitale eiendomsmegler.
      </div>
    </footer>
  );
}
