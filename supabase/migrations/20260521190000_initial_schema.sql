create extension if not exists pgcrypto;
create extension if not exists citext;

do $$ begin
  create type public.member_role as enum (
    'owner',
    'admin',
    'care_lead',
    'vet',
    'volunteer',
    'fundraising',
    'viewer'
  );
exception
  when duplicate_object then null;
end $$;

create table public.sanctuaries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  region text not null default 'UK/EU',
  timezone text not null default 'Europe/London',
  created_at timestamptz not null default now()
);

create table public.sanctuary_members (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'viewer',
  display_name text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (sanctuary_id, user_id)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  email citext not null,
  role public.member_role not null default 'viewer',
  invited_by uuid references auth.users(id) on delete set null,
  accepted_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null default now() + interval '14 days',
  created_at timestamptz not null default now()
);

create table public.enclosures (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  name text not null,
  type text not null,
  capacity integer check (capacity is null or capacity >= 0),
  status text not null default 'available',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.animals (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  name text not null,
  species text not null,
  status text not null default 'resident',
  enclosure_name text,
  intake_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.care_tasks (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  title text not null,
  category text not null default 'other',
  assigned_to text,
  due_at timestamptz,
  status text not null default 'open',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.medical_records (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  summary text not null,
  animal_name text not null,
  record_type text not null default 'note',
  occurred_on date,
  clinician text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.people (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  name text not null,
  person_type text not null default 'volunteer',
  email citext,
  phone text,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.donors (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  name text not null,
  email citext,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  donor_name text not null,
  donation_type text not null default 'cash',
  amount numeric(12,2) check (amount is null or amount >= 0),
  received_on date,
  status text not null default 'recorded',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  name text not null,
  category text not null default 'other',
  quantity numeric(12,2) not null default 0,
  unit text,
  reorder_level numeric(12,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transports (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  title text not null,
  origin text,
  destination text,
  scheduled_at timestamptz,
  status text not null default 'planned',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  title text not null,
  document_type text not null default 'other',
  renewal_on date,
  status text not null default 'current',
  storage_path text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.animal_events (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  animal_id uuid references public.animals(id) on delete cascade,
  event_type text not null,
  title text not null,
  occurred_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  sanctuary_id uuid not null references public.sanctuaries(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index on public.sanctuary_members (user_id, active);
create index on public.sanctuary_members (sanctuary_id, role) where active;
create index on public.invitations (sanctuary_id, email);
create index on public.animals (sanctuary_id, status);
create index on public.care_tasks (sanctuary_id, due_at, status);
create index on public.medical_records (sanctuary_id, occurred_on desc);
create index on public.donations (sanctuary_id, received_on desc);
create index on public.activity_logs (sanctuary_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_enclosures_updated_at before update on public.enclosures for each row execute function public.set_updated_at();
create trigger set_animals_updated_at before update on public.animals for each row execute function public.set_updated_at();
create trigger set_care_tasks_updated_at before update on public.care_tasks for each row execute function public.set_updated_at();
create trigger set_medical_records_updated_at before update on public.medical_records for each row execute function public.set_updated_at();
create trigger set_people_updated_at before update on public.people for each row execute function public.set_updated_at();
create trigger set_donors_updated_at before update on public.donors for each row execute function public.set_updated_at();
create trigger set_donations_updated_at before update on public.donations for each row execute function public.set_updated_at();
create trigger set_inventory_items_updated_at before update on public.inventory_items for each row execute function public.set_updated_at();
create trigger set_transports_updated_at before update on public.transports for each row execute function public.set_updated_at();
create trigger set_documents_updated_at before update on public.documents for each row execute function public.set_updated_at();
create trigger set_animal_events_updated_at before update on public.animal_events for each row execute function public.set_updated_at();

create or replace function public.is_sanctuary_member(target_sanctuary_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.sanctuary_members
    where sanctuary_id = target_sanctuary_id
      and user_id = auth.uid()
      and active
  );
$$;

create or replace function public.has_sanctuary_role(target_sanctuary_id uuid, allowed_roles public.member_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.sanctuary_members
    where sanctuary_id = target_sanctuary_id
      and user_id = auth.uid()
      and active
      and role = any(allowed_roles)
  );
$$;

alter table public.sanctuaries enable row level security;
alter table public.sanctuary_members enable row level security;
alter table public.invitations enable row level security;
alter table public.enclosures enable row level security;
alter table public.animals enable row level security;
alter table public.care_tasks enable row level security;
alter table public.medical_records enable row level security;
alter table public.people enable row level security;
alter table public.donors enable row level security;
alter table public.donations enable row level security;
alter table public.inventory_items enable row level security;
alter table public.transports enable row level security;
alter table public.documents enable row level security;
alter table public.animal_events enable row level security;
alter table public.activity_logs enable row level security;

create policy "members can read their sanctuaries" on public.sanctuaries
  for select using (public.is_sanctuary_member(id));

create policy "members can read team" on public.sanctuary_members
  for select using (public.is_sanctuary_member(sanctuary_id));

create policy "owners and admins manage team" on public.sanctuary_members
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin']::public.member_role[]));

create policy "owners and admins manage invitations" on public.invitations
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin']::public.member_role[]));

create policy "members read enclosures" on public.enclosures
  for select using (public.is_sanctuary_member(sanctuary_id));
create policy "care leads manage enclosures" on public.enclosures
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead']::public.member_role[]));

create policy "members read animals" on public.animals
  for select using (public.is_sanctuary_member(sanctuary_id));
create policy "care and clinical roles manage animals" on public.animals
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead','vet']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead','vet']::public.member_role[]));

create policy "members read care tasks" on public.care_tasks
  for select using (public.is_sanctuary_member(sanctuary_id));
create policy "operations roles manage care tasks" on public.care_tasks
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead','vet','volunteer']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead','vet','volunteer']::public.member_role[]));

create policy "members read medical records" on public.medical_records
  for select using (public.is_sanctuary_member(sanctuary_id));
create policy "clinical roles manage medical records" on public.medical_records
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead','vet']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead','vet']::public.member_role[]));

create policy "members read people" on public.people
  for select using (public.is_sanctuary_member(sanctuary_id));
create policy "admins manage people" on public.people
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin']::public.member_role[]));

create policy "fundraising roles read donors" on public.donors
  for select using (public.has_sanctuary_role(sanctuary_id, array['owner','admin','fundraising']::public.member_role[]));
create policy "fundraising roles manage donors" on public.donors
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin','fundraising']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin','fundraising']::public.member_role[]));

create policy "fundraising roles read donations" on public.donations
  for select using (public.has_sanctuary_role(sanctuary_id, array['owner','admin','fundraising']::public.member_role[]));
create policy "fundraising roles manage donations" on public.donations
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin','fundraising']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin','fundraising']::public.member_role[]));

create policy "members read inventory" on public.inventory_items
  for select using (public.is_sanctuary_member(sanctuary_id));
create policy "care and clinical roles manage inventory" on public.inventory_items
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead','vet']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead','vet']::public.member_role[]));

create policy "members read transports" on public.transports
  for select using (public.is_sanctuary_member(sanctuary_id));
create policy "operations roles manage transports" on public.transports
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead']::public.member_role[]));

create policy "members read documents" on public.documents
  for select using (public.is_sanctuary_member(sanctuary_id));
create policy "admins manage documents" on public.documents
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin']::public.member_role[]));

create policy "members read animal events" on public.animal_events
  for select using (public.is_sanctuary_member(sanctuary_id));
create policy "care and clinical roles manage animal events" on public.animal_events
  for all using (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead','vet']::public.member_role[]))
  with check (public.has_sanctuary_role(sanctuary_id, array['owner','admin','care_lead','vet']::public.member_role[]));

create policy "members read activity logs" on public.activity_logs
  for select using (public.is_sanctuary_member(sanctuary_id));
create policy "members create activity logs" on public.activity_logs
  for insert with check (public.is_sanctuary_member(sanctuary_id) and actor_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('animal-photos', 'animal-photos', false, 26214400, array['image/png','image/jpeg','image/webp']),
  ('sanctuary-documents', 'sanctuary-documents', false, 26214400, array['application/pdf','image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;

create policy "members read sanctuary storage" on storage.objects
  for select using (
    bucket_id in ('animal-photos', 'sanctuary-documents')
    and public.is_sanctuary_member((storage.foldername(name))[1]::uuid)
  );

create policy "trusted roles write sanctuary storage" on storage.objects
  for insert with check (
    bucket_id in ('animal-photos', 'sanctuary-documents')
    and public.has_sanctuary_role((storage.foldername(name))[1]::uuid, array['owner','admin','care_lead','vet']::public.member_role[])
  );

create policy "trusted roles update sanctuary storage" on storage.objects
  for update using (
    bucket_id in ('animal-photos', 'sanctuary-documents')
    and public.has_sanctuary_role((storage.foldername(name))[1]::uuid, array['owner','admin','care_lead','vet']::public.member_role[])
  );
