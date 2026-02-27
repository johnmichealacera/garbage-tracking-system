## Socorro Garbage Tracking System

Garbage collection tracking system for the Municipality of Socorro, Surigao del Norte. Tracks routes, pickups, and missed stops across 14 barangays (4–6 collection areas). Built with Next.js App Router, Tailwind v4 + shadcn/ui, Prisma, PostgreSQL and NextAuth.

### Tech stack

- **Frontend**: Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui, SWR/React Query
- **Backend**: Next.js route handlers + Prisma ORM
- **Database**: PostgreSQL (via Prisma + `@prisma/adapter-pg`)
- **Auth**: NextAuth (credentials provider + Prisma adapter)

### Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
# then edit .env to set DATABASE_URL and NEXTAUTH_SECRET
```

3. Apply the Prisma schema and seed Socorro data:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

For a fresh Socorro setup (clears existing data): `npm run db:reset` then `npm run db:seed`

4. Run the dev server:

```bash
npm run dev
```

### Main flows

- **Home**: `/` – Sign in (staff) or view public collection schedule.
- **Public schedule**: `/schedule` – No login. View collection routes and status by date.
- **Auth**: `/sign-in` – Log in with Socorro LGU credentials.
- **Dashboard**: `/dashboard` – KPIs for all roles.
- **Routes**: `/routes` – Create, view, edit routes. Filter by date and barangay.
- **Trucks**: `/trucks` – Manage collection trucks.
- **Areas**: `/areas` – Manage barangays (Socorro’s 14 barangays).
- **My Route**: `/my-route` – Drivers see today’s route, mark stops completed or missed.
- **Pickup history**: `/pickup-history` – Recent pickups (drivers see own only).
- **Reporting**: `/reporting` (admin) – Charts and barangay summary table.

### Seed accounts (after `npm run db:seed`)

| Role       | Email                     | Password   |
|-----------|---------------------------|------------|
| Admin     | admin@socorro.gov.ph      | password123 |
| Dispatcher| dispatcher@socorro.gov.ph | password123 |
| Driver 1  | driver1@socorro.gov.ph    | password123 |
| Driver 2  | driver2@socorro.gov.ph    | password123 |

Roles (`ADMIN`, `DISPATCHER`, `DRIVER`) are enforced in the API via NextAuth sessions and Prisma.

