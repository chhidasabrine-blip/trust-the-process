# TRUST THE PROCESS — Technical architecture

## Product boundary
One centralized data platform powers two distinct surfaces:
- **Private management application:** owner-first, role-ready, protected server-side and at the database layer.
- **Public storefront:** customer-facing catalog, custom-order, pre-order and checkout experiences.

Both share PostgreSQL and storage policies. Public access never grants access to private operational records or internal creative assets.

## Proposed stack
| Layer | Choice | Reason |
|---|---|---|
| Web framework | Next.js App Router, React, TypeScript | Shared public/private application |
| Data | Supabase PostgreSQL | Relational integrity, transactions, SQL migrations and RLS |
| Authentication | Supabase Auth via @supabase/ssr | Server-managed sessions and password recovery |
| Files | Supabase Storage | Private design/source files and public product media |
| Validation | Zod | Shared input contracts |
| Styling | CSS design tokens and reusable components | Preserve official brand system |
| Hosting | To be selected with owner approval | No hosting account or paid plan assumed |
| Testing | TypeScript, ESLint, Vitest/Playwright in later setup | Static checks and workflow/browser tests |

This is the proposed baseline, not a claim that external services are connected. Supabase credentials, storage setup, domain and deployment provider remain owner-controlled dependencies.

## Security boundaries
1. Browser clients use only the Supabase publishable/anon key.
2. Never expose a service-role key to client code.
3. Server routes verify the authenticated user; protected routes refresh and validate the Supabase session.
4. PostgreSQL RLS is the final authorization boundary. UI hiding is never security.
5. Owner-only access is the initial policy. Future roles receive explicitly scoped permissions.
6. Internal design originals and customer personal data remain private by default.
7. Critical stock, checkout, returns and finance operations use transactions and idempotency controls.

## Phase 1 data foundation
The first migration establishes user profiles, role/permission primitives and an audit log. Later migrations add the complete normalized business schema in implementation-phase order, avoiding an untested monolithic schema while retaining every required entity in the feature register.

## External dependencies and costs
- Supabase project: needed for live auth/database/storage; free tier may be suitable for development but is not guaranteed to remain free.
- Hosting/domain: needed for public deployment; provider and cost require owner approval.
- Email delivery: password reset depends on Supabase Auth email configuration and its limits.
- Payments, courier APIs, WhatsApp and AI: future integrations; none is assumed connected and no paid service will be enabled without approval.

## Local setup
1. Install Node.js LTS.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add the Supabase project URL and anon key.
5. Apply SQL migrations from `supabase/migrations` in order.
6. Create the owner account in Supabase Auth, then link it to an owner profile using the migration instructions.
7. Run `npm run dev`.

Never commit `.env.local` or any secret key.
