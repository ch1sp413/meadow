# Meadow

Meadow is a production-oriented sanctuary management SaaS for animal care, people, donations, inventory, transport, documents, and daily operations.

The app is intentionally managed-first and portable-later:

- **App:** Next.js App Router, TypeScript, Tailwind, server actions
- **Auth and tenancy:** Supabase Auth, Postgres Row Level Security, sanctuary-scoped memberships
- **Data:** Supabase Postgres migrations committed in `supabase/migrations`
- **Storage:** private Supabase buckets with sanctuary-folder RLS policies
- **Hosting:** Vercel + Supabase first, Docker-compatible Next.js output for later self-hosting

## Local Development

1. Install dependencies.

   ```bash
   npm install
   ```

2. Start Supabase locally.

   ```bash
   npm run supabase:start
   npm run supabase:reset
   ```

3. Copy `.env.example` to `.env.local` and use the values printed by `supabase start`.

   ```bash
   cp .env.example .env.local
   ```

4. Create a local user in Supabase Studio, then attach that user to the seeded sanctuary.

   ```sql
   insert into public.sanctuary_members (sanctuary_id, user_id, role, display_name)
   values (
     '00000000-0000-4000-8000-000000000001',
     '<auth.users.id>',
     'owner',
     'Local Owner'
   );
   ```

5. Run Meadow.

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`.

## Production Deployment

1. Create a Supabase project in a UK/EU region.
2. Apply migrations with the Supabase CLI.
3. Configure Auth:
   - Disable open signup for invite-only onboarding.
   - Add the Vercel production and preview URLs to redirect allow-lists.
   - Configure email templates for magic links and invites.
4. Configure Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`
5. Deploy the Next.js app to Vercel.

## Security Model

Every sanctuary-owned table has a `sanctuary_id`. RLS policies use the current Supabase Auth user and `sanctuary_members` to decide access.

Default role intent:

- `owner`, `admin`: manage team, documents, people, and all sanctuary operations.
- `care_lead`: manage animals, enclosures, care, inventory, transport, and clinical-adjacent work.
- `vet`: manage animals, care tasks, inventory, and medical records.
- `volunteer`: manage assigned care tasks.
- `fundraising`: manage donor and donation records only.
- `viewer`: read non-restricted operational records.

Donor records and donations are restricted to owner/admin/fundraising roles.

## Verification

```bash
npm run typecheck
npm run build
npm run test:e2e
npm run supabase:test
```

The repository includes a smoke E2E test and pgTAP policy checks. Broader authenticated E2E coverage should be added once production invite flows and seeded test users are configured.

## Self-Hosting Path

The app is designed so durable state lives in Postgres and object storage. The committed `Dockerfile` builds the Next.js standalone output. A later self-hosted edition should add Docker Compose services for Postgres, S3-compatible storage, SMTP, and a migration runner.
