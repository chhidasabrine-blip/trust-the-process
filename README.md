# TRUST THE PROCESS

Independent streetwear brand ecosystem — private business management and public e-commerce, backed by one shared data platform.

## Current implementation status

This repository contains the Phase 1 starter foundation. It is **not production-ready** and does not yet contain the complete V4 feature set.

- Next.js App Router + React + TypeScript.
- Official TRUST THE PROCESS design tokens.
- Supabase SSR client setup.
- Owner login, logout and password-reset request scaffolding.
- Protected /admin route with an explicit owner-role check.
- Initial identity, roles, permissions and audit SQL migration.
- V4 feature-by-feature implementation register.

See [technical architecture](docs/architecture.md) and [feature completion register](docs/feature-register.md).

## Local development

Requirements: Node.js LTS and an owner-controlled Supabase project.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add the Supabase project URL and anon/publishable key to .env.local. Do not commit environment files or service-role keys.

Apply supabase/migrations/0001_identity_access_audit.sql in the Supabase SQL editor. Create the initial owner in Supabase Auth, then create their public.user_profiles row and assign the seeded owner role in public.user_roles. Read the SQL comments before doing this.

Configure the Supabase Auth site URL and allowed redirect URL for local and production before testing password recovery.

## Important security notes

- The admin gate checks for both a valid Supabase session and the explicit owner role.
- The database migration enables RLS and grants no client-side write policy for role grants or audit logs.
- Do not expose service-role credentials in browser code.
- A logged-in account without an owner grant must not access the private management area.
- Do not use real customer or financial data until database policies and workflows have been reviewed and tested.

## Project phases

The full V4 scope is preserved in docs/feature-register.md. Modules are built incrementally and are not represented as working until their UI, backend, database, permissions and tests are connected.

No paid hosting, domain, messaging, payment, courier or AI integration has been purchased or enabled.
