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
| Hosting | Vercel connection pending owner authorization | Production deployment target; not yet connected |
| Testing | TypeScript, ESLint, Playwright in later setup | Static checks and workflow/browser tests |

## Connected backend
- Supabase project: `trust-the-process`
- Region: Frankfurt (`eu-central-1`)
- Project ref: `sttuetxdvscafuufhgwt`
- The Phase 1 identity/access/audit migration has been applied.
- Foundation tables and RLS enablement have been verified through the Supabase project tools.

## Security boundaries
1. Browser clients use only the Supabase publishable/anon key.
2. Never expose a Supabase secret/service-role key to client code.
3. Protected routes validate signed JWT claims before reading owner-role grants.
4. PostgreSQL RLS is the final authorization boundary. UI hiding is never security.
5. Owner-only access is the initial policy. Future roles receive explicitly scoped permissions.
6. Internal design originals and customer personal data remain private by default.
7. Critical stock, checkout, returns and finance operations use transactions and idempotency controls.

## Phase 1 data foundation
The first migration establishes user profiles, role/permission primitives and an audit log. It has been applied to the connected project. Later migrations add the complete normalized business schema in implementation-phase order, avoiding an untested monolithic schema while retaining every required entity in the feature register.

## External dependencies and costs
- Supabase project: connected; initial project creation quoted at $0/month. Usage and future plan changes may incur charges.
- Hosting/domain: needed for public deployment; provider connection and any paid plan require owner authorization.
- Email delivery: password reset depends on Supabase Auth email configuration and its limits.
- Payments, courier APIs, WhatsApp and AI: future integrations; none is assumed connected and no paid service will be enabled without approval.

## Local setup
1. Install Node.js LTS.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_SITE_URL`.
5. The Phase 1 migration is already applied to the connected project. For a fresh environment, apply SQL migrations from `supabase/migrations` in order.
6. Create the owner account in Supabase Auth, then link it to an owner profile using the README bootstrap instructions.
7. Run `npm run dev`.

Never commit `.env.local` or any secret key.
