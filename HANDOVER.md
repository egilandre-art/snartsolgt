# snartsolgt — Handover

## Produktvisjon

snartsolgt er en norsk digital plattform for utbyggere og boligeiere som ønsker å presentere og selge boligen sin uten å betale full meglerprovisjon. Tenk et rimeligere og mer heldigitalisert alternativ til Propr og SamSolgt.

Kjernen er selvbetjening med valgfri megler-in-the-loop: eier kan drive prosessen helt selv, eller koble inn megler på de delene de trenger hjelp til (verdivurdering, visning, budgivning). I første fase er plattformen heldigital uten meglerkrav.

**Målgruppe:** Utbyggere (nye boliger/prosjekter), boligeiere som vil selge selv, og fagfolk (meglere, fotografer, takstmenn) som tilbyr tjenester på plattformen.

---

## Arkitektur

### Overordnet flyt

```
Bruker (browser)
    │
    ▼
Clerk (auth + session)
    │
    ├── middleware.ts — beskytter alle /dashboard/*, /mine-boliger/*, /oppdrag/*, etc.
    │
    ▼
Next.js 15 App Router (Vercel)
    │
    ├── Server Actions (src/actions/) — all skrivelogikk, kalles direkte fra komponenter
    ├── API Routes (src/app/api/) — webhooks + public API-endepunkter
    └── Server Components — henter data direkte fra DB uten eget API-lag
    │
    ▼
Neon PostgreSQL (via Prisma 7 + PrismaPg adapter + pg Pool)
```

### Stack

| Lag | Teknologi |
|-----|-----------|
| Frontend/backend | Next.js 15, App Router, TypeScript |
| Auth | Clerk 7 — roller i `publicMetadata.rolle` |
| Database | Neon (PostgreSQL), Prisma 7 med PrismaPg adapter |
| Styling | Tailwind CSS v4, `@theme`-tokens i `globals.css` |
| Bildeopplasting | UploadThing |
| AI | Anthropic Claude Sonnet — genererer boligbeskrivelse |
| E-post | Resend — nabolagsvarsler ved publisering |
| Hosting | Vercel |

---

## Brukerroller og tilgang

```
BOLIGEIER  → /mine-boliger   — oppretter bolig, velger markedspakke
MEGLER     → /oppdrag        — tildeler fagfolk, følger oppdrag
FOTOGRAF   → /fotograf       — laster opp bilder, markerer levering
TAKSTMANN  → /takst          — leverer takstverdi og rapport
admin      → /admin          — brukeradmin, nabovarsel-oversikt
```

Rolle settes i Clerk `publicMetadata.rolle` ved brukeroppretting og synkes til DB via webhook (`/api/webhooks/clerk`). Server-side sjekk alltid via `requireRolle()` i `src/lib/auth.ts` — aldri stol på klient-side claims.

---

## Oppdragsstatus-pipeline

```
NY
 └─ Megler tildeler takstmann  → TAKST_BESTILT
     └─ Takstmann leverer       → TAKST_LEVERT
         └─ Megler tildeler fotograf  → FOTO_BESTILT
             └─ Fotograf laster opp bilder  → FOTO_LEVERT
                 └─ Claude Sonnet genererer beskrivelse  → AI_GENERERT
                     └─ Publisert  → PUBLISERT
                         └─ Nabovarsel sendes via Resend til interessenter
```

To markedspakker er definert: `HELDIGITAL` (eier kjører selv) og `MEGLERDIGITAL` (megler in-the-loop).

---

## Integrasjoner

| Tjeneste | Bruk |
|----------|------|
| **Clerk** | Auth, roller i `publicMetadata` |
| **Neon** | PostgreSQL — pooled URL (pgbouncer) + direct URL for migrasjoner |
| **UploadThing** | Bildeopplasting i fotograf-flyten |
| **Anthropic Claude** | AI-generert boligbeskrivelse (kort, lang, nabolag) etter foto-leveranse |
| **Resend** | Nabolagsvarsler til interessenter ved publisering |

---

## Datamodell (kjerneobjekter)

```
Bruker (Clerk-synket)
  └── Bolig (eier + valgfri megler)
       ├── Bilde[]          — UploadThing-URLer, status per bilde
       └── Markedsoppdrag   — 1:1 med Bolig, holder status + fagfolk-tildelinger

Nabovarsel                  — e-poster som varsles ved publisering (kommune/postnummer)
```

---

## Kritiske filer

| Fil | Formål |
|-----|--------|
| `prisma/schema.prisma` | Alle datamodeller |
| `src/lib/auth.ts` | Rollesjekk og brukerautorisering |
| `src/lib/db.ts` | Prisma-klient med PrismaPg-adapter |
| `src/lib/ai.ts` | AI-beskrivelse via Claude Sonnet |
| `src/lib/constants.ts` | Norske labels for enums |
| `src/actions/` | All skrivelogikk (Server Actions) |
| `src/app/api/webhooks/clerk/route.ts` | Clerk → DB-synk |
| `middleware.ts` | Rutebasert tilgangskontroll |

---

## Miljøvariabler (kreves i produksjon)

```
DATABASE_URL                        — Neon pooled (pgbouncer)
DIRECT_URL                          — Neon direct (Prisma migrations)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
ANTHROPIC_API_KEY
RESEND_API_KEY
EMAIL_FROM
UPLOADTHING_TOKEN
NEXT_PUBLIC_APP_URL
```

---

## Hva som mangler / naturlige neste steg

- Betalingsflyt (Stripe) for markedspakker
- Heldigital salgsprosess uten megler — visningsbestilling, budgivning, kontraktshåndtering
- Utbygger-flyt for prosjektsalg (flere enheter under ett prosjekt)
- Push-varsler / SMS (kun e-post per nå)
- Megler-dashboard med statistikk og porteføljeoversikt
- Offentlig boligsøk / filtreringsside
