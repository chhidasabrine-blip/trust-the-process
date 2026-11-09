-- TRUST THE PROCESS — Phase 1 identity, access and audit foundation
-- Apply only to the intended Supabase project after reviewing the SQL.
create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text not null
);

create table if not exists public.user_roles (
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete restrict,
  granted_at timestamptz not null default now(),
  granted_by uuid references public.user_profiles(id) on delete set null,
  primary key (user_id, role_id)
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references public.user_profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_actor_created_idx on public.audit_logs(actor_user_id, created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);

insert into public.roles (code, name, description, is_system)
values ('owner', 'Owner', 'Full business ownership and administration', true)
on conflict (code) do nothing;

alter table public.user_profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.audit_logs enable row level security;

create policy "profile_select_self" on public.user_profiles
for select to authenticated using (id = (select auth.uid()));
create policy "profile_update_self" on public.user_profiles
for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "roles_read_authenticated" on public.roles
for select to authenticated using (true);
create policy "permissions_read_authenticated" on public.permissions
for select to authenticated using (true);
create policy "user_roles_read_self" on public.user_roles
for select to authenticated using (user_id = (select auth.uid()));
create policy "role_permissions_read_authenticated" on public.role_permissions
for select to authenticated using (true);

-- Audit data has no client policy: writes/reads are reserved for trusted server operations.
-- Owner bootstrap: create the owner user in Supabase Auth, then insert the matching
-- user_profiles row and user_roles grant in the Supabase SQL editor as project owner.
-- Never expose a service-role key in browser code or commit it.
