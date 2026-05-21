import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNok(belop: number | null | undefined): string {
  if (belop == null) return "—";
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(belop);
}

export function formatDato(dato: Date | string | null | undefined): string {
  if (!dato) return "—";
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dato));
}

export function lagSlug(gate: string, nummer: string, poststed: string, id: string): string {
  const base = `${gate} ${nummer} ${poststed}`
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${id.slice(-4)}`;
}

export function formatAreal(areal: number | null | undefined): string {
  if (!areal) return "—";
  return `${areal} m²`;
}
