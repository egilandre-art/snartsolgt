interface EmptyStateProps {
  icon?: React.ReactNode;
  tittel: string;
  beskrivelse?: string;
  handling?: React.ReactNode;
}

export function EmptyState({ icon, tittel, beskrivelse, handling }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="text-muted-fg mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-fg mb-1">{tittel}</h3>
      {beskrivelse && <p className="text-sm text-muted-fg max-w-sm mb-4">{beskrivelse}</p>}
      {handling}
    </div>
  );
}
