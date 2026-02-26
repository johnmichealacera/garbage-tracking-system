## Garbage Tracking System

Garbage collection tracking dashboard inspired by the UI of the `digital-profiling` app. It uses Next.js App Router, Tailwind v4 + shadcn/ui, Prisma, PostgreSQL and NextAuth.

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

3. Apply the Prisma schema to your database and generate the client:

```bash
npm run db:generate
npm run db:push   # or npm run db:migrate once you add migrations
```

4. Run the dev server:

```bash
npm run dev
```

### Main flows

- **Auth**: visit `/sign-in` to log in using a credentials account in the `User` table.
- **Dashboard**: `/dashboard` shows high-level pickups and volume metrics.
- **Routes**: `/routes` lists routes with filters by date and area.
- **Trucks**: `/trucks` manages collection trucks.
- **Driver “My Route”**: `/my-route` shows the logged-in driver their assigned route for today and lets them mark stops as completed.
- **Reporting**: `/reporting` (admin) shows pickups per day and per area.

Roles (`ADMIN`, `DISPATCHER`, `DRIVER`) are enforced in the API via NextAuth sessions and Prisma.

