# TRUST THE PROCESS

Independent streetwear brand ecosystem — private business management and public e-commerce, backed by one shared data platform.

## Current implementation status

This repository contains the Phase 1 starter foundation. It is **not production-ready** and does not yet contain the complete V4 feature set.

- Next.js App Router + React + TypeScript.
- Official TRUST THE PROCESS design tokens.
- Supabase SSR clients using the current publishable-key convention (with legacy anon-key fallback).
- Owner login, logout and password-reset request scaffolding.
- Protected /admin route with verified JWT claims and an explicit owner-role check.
- Initial identity, roles, permissions and audit SQL migration, applied to the connected Supabase project.
- V4 feature-by-feature implementation register.

See [technical architecture](docs/architecture.md) and [feature completion register](docs/feature-register.md).

## Connected Supabase project

- Project: `trust-the-process`
- Region: `eu-central-1` (Frankfurt)
- Project ref: `sttuetxdvscafuufhgwt`
- Project URL: `https://sttuetxdvscafuufhgwt.supabase.co`

## Local development

Requirements: Node.js LTS and access to the owner-controlled Supabase project.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set these values in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL=https://sttuetxdvscafuufhgwt.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=` your project's publishable key from Supabase **Project Settings → API Keys**.
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

Do not commit `.env.local` or any secret/service-role key.

The migration `supabase/migrations/0001_identity_access_audit.sql` has already been applied to the connected project. For a fresh environment, apply it once through the Supabase SQL editor.

## Owner account bootstrap

1. In Supabase Dashboard → Authentication → Users, create the owner's login account.
2. Copy that account's Auth user UUID.
3. In the SQL editor, run the following after replacing the UUID:

```sql
insert into public.user_profiles (id, display_name)
values ('YOUR-AUTH-USER-UUID', 'Owner')
on conflict (id) do nothing;

insert into public.user_roles (user_id, role_id)
select 'YOUR-AUTH-USER-UUID', id
from public.roles
where code = 'owner'
on conflict (user_id, role_id) do nothing;
```

4. Set the Auth Site URL and allowed redirect URLs before testing password recovery.

## Security notes

- The admin gate checks a verified Supabase JWT and an explicit owner-role grant.
- The database migration enables RLS on all foundation tables.
- No client policy allows direct changes to role grants or audit logs.
- Never expose a Supabase secret/service-role key in browser code.
- A logged-in account without an owner grant must not access the private management area.
- Do not use real customer or financial data until all module policies and workflows have been reviewed and tested.

## Project phases

The full V4 scope is preserved in `docs/feature-register.md`. Modules are built incrementally and are not represented as working until their UI, backend, database, permissions and tests are connected.

No paid hosting, domain, messaging, payment, courier or AI integration has been purchased or enabled.
