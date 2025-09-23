# Multi-Tenant Notes App (Boilerplate)

This is a starter Next.js app with Prisma/Postgres implementing a multi-tenant notes application.

## Setup (local + Vercel Postgres)
1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your Vercel Postgres connection string.
2. Set `JWT_SECRET` in `.env`.
3. Install dependencies: `npm install`
4. Generate Prisma client: `npx prisma generate`
5. Run migrations: `npx prisma migrate dev --name init`
6. Seed DB: `npm run seed` (sets seed password from `SEED_PASSWORD` env or defaults to `password`)
7. Start dev server: `npm run dev`

## Test accounts (created by seed)
- admin@acme.test / password (Admin, tenant: Acme)
- user@acme.test / password (Member, tenant: Acme)
- admin@globex.test / password (Admin, tenant: Globex)
- user@globex.test / password (Member, tenant: Globex)

## Notes
- The app uses a shared-schema multi-tenant approach (each row has `tenantId`).
- Upgrade endpoint: `POST /api/tenants/:slug/upgrade` (Admin only).
- Health check: `/api/health`
