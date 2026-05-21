# SnartSolgt — Oppsettguide

Dette er det som gjenstår for å få plattformen helt opp å kjøre.

---

## 1. Neon (database)

**URL:** https://neon.tech → Opprett gratis konto

1. Klikk **New Project** → gi det navn `snartsolgt`
2. Velg region: **EU Central (Frankfurt)** (nærmest Norge)
3. Når prosjektet er opprettet, gå til **Connection Details**
4. Velg **Prisma** fra dropdown — du får to URLer:
   - **DATABASE_URL** — pooled (med `?pgbouncer=true`)
   - **DIRECT_URL** — direct connection (uten pooling)
5. Kopier begge inn i `.env.local`

**Kjør deretter:**
```bash
npx prisma db push
```
Dette oppretter alle tabeller automatisk fra `prisma/schema.prisma`.

For å se/redigere data visuelt:
```bash
npx prisma studio
```

---

## 2. Clerk (autentisering)

**URL:** https://dashboard.clerk.com → Opprett gratis konto

### Opprett applikasjon
1. Klikk **Create application**
2. Navn: `SnartSolgt`
3. Velg innloggingsmetoder: **Email + Google** (anbefalt)
4. Klikk **Create application**

### Hent API-nøkler
Gå til **API Keys** i venstre meny:
- Kopier `Publishable key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Kopier `Secret key` → `CLERK_SECRET_KEY`

### Konfigurer redirect-URLer
Gå til **Paths** (under Configure):
```
Sign-in URL:          /sign-in
Sign-up URL:          /sign-up
After sign-in URL:    /dashboard
After sign-up URL:    /dashboard
```

### Sett opp webhook (kritisk!)
Gå til **Webhooks** → **Add Endpoint**:
- **URL:** `https://ditt-domene.vercel.app/api/webhooks/clerk`
  - Under utvikling: bruk [ngrok](https://ngrok.com) eller [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- **Events:** Huk av `user.created` og `user.updated`
- Klikk **Create** → kopier **Signing Secret** → `CLERK_WEBHOOK_SECRET`

Webhooken er det som oppretter brukere i databasen når noen registrerer seg.

### Sett brukerroller (publicMetadata)
Clerk bruker `publicMetadata.rolle` for å avgjøre hvilken rolle en bruker har.

**Mulige verdier:** `BOLIGEIER` | `MEGLER` | `FOTOGRAF` | `TAKSTMANN`

For å sette rolle på en bruker manuelt (inntil du lager en onboarding-flyt):
1. Gå til **Users** i Clerk Dashboard
2. Klikk på brukeren
3. Scroll ned til **Metadata** → **Public metadata**
4. Legg inn: `{ "rolle": "MEGLER" }`

---

## 3. Anthropic (AI-beskrivelser)

**URL:** https://console.anthropic.com

1. Opprett konto / logg inn
2. Gå til **API Keys** → **Create Key**
3. Kopier nøkkelen → `ANTHROPIC_API_KEY`

Brukes til å auto-generere boligbeskrivelser etter at fotografen har levert bilder.

---

## 4. Resend (e-post)

**URL:** https://resend.com → Gratis opp til 3 000 e-poster/mnd

1. Opprett konto
2. Gå til **API Keys** → **Create API Key**
3. Kopier → `RESEND_API_KEY`
4. Legg til og verifiser domenet `snartsolgt.no` under **Domains**
   - Du må legge til DNS-records hos din domeneregistrar (TXT + MX)
   - Inntil domenet er verifisert kan du sende fra `onboarding@resend.dev` (kun til din egen e-post)

---

## 5. UploadThing (bildeopplasting)

**URL:** https://uploadthing.com → Gratis opp til 2 GB

1. Opprett konto med GitHub
2. Klikk **Create a new app** → navn `snartsolgt`
3. Gå til **API Keys**
4. Kopier `Token` → `UPLOADTHING_TOKEN`

---

## 6. Vercel (hosting)

**URL:** https://vercel.com → Gratis for hobby/startups

### Koble til GitHub-repo
1. Gå til https://vercel.com/new
2. Velg **Import Git Repository**
3. Velg `egilandre-art/snartsolgt`
4. Framework: **Next.js** (detekteres automatisk)
5. Klikk **Deploy** (første deploy vil feile — det er OK, vi må legge inn env vars)

### Legg inn miljøvariabler
Gå til prosjektet → **Settings** → **Environment Variables** og legg inn alle:

```
DATABASE_URL          = postgresql://...?pgbouncer=true&connect_timeout=15
DIRECT_URL            = postgresql://...

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_...
CLERK_SECRET_KEY                  = sk_live_...
CLERK_WEBHOOK_SECRET              = whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL     = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL     = /sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /dashboard

ANTHROPIC_API_KEY = sk-ant-...

RESEND_API_KEY = re_...
EMAIL_FROM     = SnartSolgt <no-reply@snartsolgt.no>

UPLOADTHING_TOKEN = ...

NEXT_PUBLIC_APP_URL = https://snartsolgt.no
```

> **OBS:** Clerk har separate nøkler for development (`pk_test_`) og production (`pk_live_`). Bruk `pk_live_` på Vercel.

### Koble domene
Gå til **Settings** → **Domains** → legg til `snartsolgt.no`
Vercel viser deg hvilke DNS-records du må sette hos domeneregistraren.

### Oppdater Clerk webhook-URL
Etter at Vercel-domenet er oppe, gå tilbake til Clerk → Webhooks og oppdater URL til `https://snartsolgt.no/api/webhooks/clerk`.

### Redeploy
Gå til **Deployments** → klikk de tre prikkene på siste deploy → **Redeploy**.

---

## 7. Lokal utvikling etter oppsett

Fyll inn `.env.local` med alle verdiene over og kjør:

```bash
# Opprett tabeller i databasen
npx prisma db push

# Start dev-server (kjører på port 3001 for å unngå konflikt)
PORT=3001 npm run dev

# Åpne i nettleser
open http://localhost:3001
```

For å teste webhook lokalt trenger du en tunnel:
```bash
# Installer ngrok
brew install ngrok

# Eksponer port 3001
ngrok http 3001
# Bruk den genererte URL-en i Clerk webhook-oppsettet
```

---

## 8. Første bruker og admin

Etter at alt er oppe:
1. Gå til `/sign-up` og registrer deg
2. Gå til **Neon Console** → **SQL Editor** og kjør:
   ```sql
   UPDATE "Bruker" SET "isAdmin" = true WHERE email = 'din@epost.no';
   ```
3. Du har nå tilgang til `/admin`-sidene

---

## Oppsummering — sjekkliste

- [ ] Neon: Opprett DB, kopier `DATABASE_URL` og `DIRECT_URL`, kjør `npx prisma db push`
- [ ] Clerk: Opprett app, hent nøkler, konfigurer redirect-URLer, sett opp webhook
- [ ] Anthropic: Hent API-nøkkel
- [ ] Resend: Hent API-nøkkel, verifiser domene
- [ ] UploadThing: Hent token
- [ ] Vercel: Koble repo, legg inn alle env vars, koble domene `snartsolgt.no`
- [ ] Clerk webhook: Oppdater URL til produksjons-domenet
- [ ] Første bruker: Registrer deg og sett `isAdmin = true` i DB
