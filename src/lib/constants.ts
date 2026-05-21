import type { BoligStatus, OppdragStatus, Rolle, MarkedspakkeType } from "@prisma/client";

export const BOLIGSTATUS_LABELS: Record<BoligStatus, string> = {
  UTKAST: "Utkast",
  VURDERES_SOLGT: "Vurderes solgt",
  TIL_SALGS: "Til salgs",
  SOLGT: "Solgt",
  TRUKKET: "Trukket",
};

export const BOLIGSTATUS_FARGER: Record<BoligStatus, string> = {
  UTKAST: "bg-muted text-muted-fg",
  VURDERES_SOLGT: "bg-amber-100 text-amber-800",
  TIL_SALGS: "bg-navy text-navy-fg",
  SOLGT: "bg-success/15 text-success",
  TRUKKET: "bg-danger/15 text-danger",
};

export const OPPDRAGSTATUS_LABELS: Record<OppdragStatus, string> = {
  NY: "Ny bestilling",
  TAKST_BESTILT: "Takst bestilt",
  TAKST_LEVERT: "Takst levert",
  FOTO_BESTILT: "Foto bestilt",
  FOTO_LEVERT: "Foto levert",
  AI_GENERERT: "Beskrivelse generert",
  PUBLISERT: "Publisert",
  AVSLUTTET: "Avsluttet",
};

export const OPPDRAGSTATUS_STEG: OppdragStatus[] = [
  "NY",
  "TAKST_BESTILT",
  "TAKST_LEVERT",
  "FOTO_BESTILT",
  "FOTO_LEVERT",
  "AI_GENERERT",
  "PUBLISERT",
];

export const ROLLE_LABELS: Record<Rolle, string> = {
  BOLIGEIER: "Boligeier",
  MEGLER: "Megler",
  FOTOGRAF: "Fotograf",
  TAKSTMANN: "Takstmann",
};

export const PAKKE_LABELS: Record<MarkedspakkeType, string> = {
  HELDIGITAL: "Heldigital",
  MEGLERDIGITAL: "Meglerdigital",
};

export const PAKKE_BESKRIVELSE: Record<MarkedspakkeType, string> = {
  HELDIGITAL: "Alt digitalt — bestill takst og foto direkte, få AI-generert boligannonse og publiser selv.",
  MEGLERDIGITAL: "Megler bistår hele prosessen — fra takst og foto til publisering og visning.",
};

export const NORSKE_KOMMUNER = [
  "Oslo", "Bergen", "Stavanger", "Trondheim", "Drammen", "Fredrikstad",
  "Kristiansand", "Sandnes", "Tromsø", "Sarpsborg", "Skien", "Ålesund",
  "Sandefjord", "Bodø", "Tønsberg", "Moss", "Porsgrunn", "Arendal",
  "Hamar", "Larvik", "Halden", "Lillehammer", "Molde", "Harstad",
  "Gjøvik", "Kongsberg", "Horten", "Mandal", "Narvik", "Alta",
] as const;

export const BOLIGTYPER = [
  "Enebolig",
  "Rekkehus",
  "Tomannsbolig",
  "Leilighet",
  "Hytte/Fritidsbolig",
  "Tomt",
] as const;
