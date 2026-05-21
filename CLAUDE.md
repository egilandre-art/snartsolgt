# snartsolgt — CLAUDE.md

Norsk digital eiendomsmegler-plattform. Mobil-først.

## Stack

- **Next.js 15** App Router (TypeScript, src/-dir)
- **Clerk 7** — auth (`@clerk/nextjs`). Ingen `SignedIn`/`SignedOut` komponenter — bruk `useUser()` hook klient-side
- **Prisma 7** + **Neon** (PostgreSQL). Skjema: `prisma/schema.prisma`, config: `prisma.config.ts`
- **Tailwind CSS v4** — `@theme` tokens i `src/app/globals.css` (navy/gold/canvas fargepalet)
- **Vercel** hosting

## Kjøre lokalt

```bash
# 1. Kopier og fyll ut miljøvariabler
cp .env.example .env.local

# 2. Push databaseskjema (krever DATABASE_URL og DIRECT_URL i .env.local)
npx prisma db push

# 3. Start dev-server
npm run dev
```

## Miljøvariabler som MÅ fylles ut

- `DATABASE_URL` — Neon connection string (pooled, med pgbouncer)
- `DIRECT_URL` — Neon connection string (direct, for Prisma migrations)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — fra Clerk Dashboard
- `CLERK_SECRET_KEY` — fra Clerk Dashboard
- `CLERK_WEBHOOK_SECRET` — fra Clerk Dashboard → Webhooks
- `ANTHROPIC_API_KEY` — for AI-genererte beskrivelser
- `RESEND_API_KEY` — for nabolagsvarsler via e-post
- `UPLOADTHING_TOKEN` — for bildeopplasting (fotograf-flyt)

## Brukerroller

Rollen settes i Clerk `publicMetadata.rolle` ved brukeroppretting, og synkes til DB via webhook (`/api/webhooks/clerk`).

| Rolle | Tilgang |
|-------|---------|
| `BOLIGEIER` | `/mine-boliger`, `/dashboard` |
| `MEGLER` | `/mine-boliger`, `/oppdrag`, `/dashboard` |
| `FOTOGRAF` | `/fotograf`, `/dashboard` |
| `TAKSTMANN` | `/takst`, `/dashboard` |

For å sette en bruker som admin: `isAdmin = true` i DB (gjøres manuelt eller via Prisma Studio).

## Viktige mønstre

**currentBruker()**: `src/lib/auth.ts` — alltid bruk denne server-side for rollesjekk. Aldri stol på klient-side rolle-claims.

**Server Actions**: `src/actions/` — all skrivelogikk. Kall direkte fra Server/Client Components.

**Prisma 7**: Bruker adapter-pattern. `src/lib/db.ts` initialiserer `PrismaPg` med `Pool`. `prisma.config.ts` brukes av Prisma CLI for migrasjoner.

**AI-beskrivelser**: Genereres automatisk i `markPhotosComplete()` via `genererBeskrivelse()` i `src/lib/ai.ts`. Kaller `claude-sonnet-4-6`.

**Nabolagsvarsel**: Sendes via Resend i `publishListing()`. Matcher på `kommune` eller `postnummer`.

## Oppdragsstatus-flyt

```
NY → TAKST_BESTILT → TAKST_LEVERT → FOTO_BESTILT → FOTO_LEVERT → AI_GENERERT → PUBLISERT
```

## Kritiske filer

- `prisma/schema.prisma` — alle datamodeller
- `src/lib/auth.ts` — rollesjekk og brukerautorisering
- `src/lib/constants.ts` — norske labels for enums
- `src/app/api/webhooks/clerk/route.ts` — Clerk→DB-synk
- `src/actions/` — alle server actions
