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

- **Home**: `/` – Public landing page with modern LGU branding, polished CTA actions, and quick access to sign-in and schedule.
- **Public schedule**: `/schedule` – No login. View collection routes and status by date.
- **Auth**: `/sign-in` – Centered, modern sign-in card with refined public links.
- **Dashboard**: `/dashboard` – Personalized hero, KPI cards, recent activity, and top barangays.
- **Routes**: `/routes` – Filter by date/barangay, view progress bars and route status badges, and create routes.
- **Trucks**: `/trucks` – Fleet registration and status-aware table.
- **Areas**: `/areas` – Manage barangays with card-based listing and quick creation.
- **My Route**: `/my-route` – Driver-focused workflow with progress tracking and polished complete/missed dialogs.
- **Pickup history**: `/pickup-history` – Enhanced activity feed with route links, driver attribution, and volume indicators.
- **Reporting**: `/reporting` – Date-filtered KPIs, modernized charts, and barangay analytics table.

### UX enhancements (latest)

- Unified premium visual language across public and authenticated pages (ambient gradients, glassmorphism-style cards, consistent spacing/typography).
- Reusable dashboard UI primitives: shared page headers and status badges for consistent page hierarchy and state visibility.
- Improved readability and scannability through stronger information architecture, progress indicators, and richer empty/loading states.
- Responsive behavior improved for both desktop and mobile (including authenticated layout refinements).

### Seed accounts (after `npm run db:seed`)

| Role       | Email                     | Password   |
|-----------|---------------------------|------------|
| Admin     | admin@socorro.gov.ph      | password123 |
| Dispatcher| dispatcher@socorro.gov.ph | password123 |
| Driver 1  | driver1@socorro.gov.ph    | password123 |
| Driver 2  | driver2@socorro.gov.ph    | password123 |

Roles (`ADMIN`, `DISPATCHER`, `DRIVER`) are enforced in the API via NextAuth sessions and Prisma.

