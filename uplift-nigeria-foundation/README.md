# Uplift Nigeria Foundation: website + admin (v2)
Next.js 14 · TypeScript · Tailwind · PostgreSQL · Prisma · NextAuth (credentials) · S3-compatible storage

## Setup
1. `npm install`
2. Create a PostgreSQL database (Neon, Supabase, Railway or local) and copy its connection string.
3. `cp .env.example .env` and fill in DATABASE_URL, AUTH_SECRET (`npx auth secret`), NEXT_PUBLIC_SITE_URL, ADMIN_EMAIL, ADMIN_PASSWORD.
4. `npx prisma validate && npx prisma migrate deploy` (applies the included migrations; use this for local AND production). Only use `npx prisma migrate dev --name <change>` when you change the schema. If you previously created your own local migrations, delete the local database or run `npx prisma migrate resolve --applied 0001_init`.
5. `npm run seed`: creates the first admin (only if missing) and default settings/stats. Safe to re-run.
6. `npm run dev` → http://localhost:3000 · admin: /admin (log in with ADMIN_EMAIL / ADMIN_PASSWORD, then change it under Admin users).
7. Production build: `npm run build && npm start`. Type check: `npm run typecheck`.

## Roles
ADMIN: everything (settings, users, inbox, CSV export). EDITOR: programs, news, impact, media only. Enforced server-side in every action, page and the export route (`src/lib/authz.ts`).

## Image storage (Cloudflare R2 example)
Create a bucket, enable a public domain, create an API token with Object Read & Write. Set STORAGE_BUCKET, STORAGE_ACCESS_KEY_ID, STORAGE_SECRET_ACCESS_KEY, STORAGE_ENDPOINT, STORAGE_PUBLIC_URL. Uploads: JPG/PNG/WebP only, 5 MB max, file signature checked, random file names.

## Photos
Included: `hero.jpg` and `community.jpg` (stock-style photos supplied by the foundation; confirm you hold the licence). To replace, put photographs at `public/images/hero.jpg` and `public/images/community.jpg` (JPG files). Until then a plain pattern is shown. Replace `public/logo-mark.svg`, `public/logo-full.svg` and `src/app/icon.svg` with the official logo files when ready.

## Deploy to Vercel
Import the repo, add all env vars from `.env.example`, set the build command to `npm run build`. Run `npx prisma migrate deploy` once against the production database (from your machine with the production DATABASE_URL), then `npm run seed`. Migrations are never run automatically during the build.

## Production rate limiting (required for production)
Create a free Upstash Redis database and set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. Behaviour: with Upstash configured, limits are shared across all servers. If Upstash is missing or temporarily failing, the app automatically uses a per-instance in-memory limiter (limits still apply, but are not shared between serverless instances) and logs one warning in production. Limits: login 8 per 10 min per IP; each public form 5 per 10 min per IP. Identical resubmissions within 10 minutes are ignored as duplicates.

## Before launch
Have the Privacy Policy and Terms reviewed by a qualified professional. Confirm contact details in Admin → Settings.

## Production environment variables
Required: DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_SITE_URL, ADMIN_EMAIL + ADMIN_PASSWORD (first seed only). Off Vercel: AUTH_TRUST_HOST=true. Uploads: STORAGE_BUCKET, STORAGE_ACCESS_KEY_ID, STORAGE_SECRET_ACCESS_KEY, STORAGE_PUBLIC_URL (+ STORAGE_ENDPOINT for R2). Rate limiting (required in production): UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN.

## Verify the migration
The baseline migration was written by hand. Check it matches the schema: `npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma --shadow-database-url "$SHADOW_DATABASE_URL" --exit-code` (no output = identical).

## Images
Homepage photos are `public/images/hero.jpg` and `public/images/community.jpg`, served through the Next.js optimizer; if a file is missing a plain pattern shows instead. News, program and impact images come from Admin → Media. Set STORAGE_PUBLIC_URL before building so those images are optimized too. To use real foundation photography on the homepage, overwrite the two JPG files (≥1920 px wide recommended) and redeploy.
