-- Local development seed for records that do not require auth users.
-- To attach a local user, create one in Supabase Studio, then insert a matching
-- sanctuary_members row with that auth.users.id.

insert into public.sanctuaries (id, name, slug, region, timezone)
values ('00000000-0000-4000-8000-000000000001', 'Willowbank Sanctuary', 'willowbank', 'UK/EU', 'Europe/London')
on conflict (slug) do nothing;

insert into public.enclosures (sanctuary_id, name, type, capacity, status, notes)
values
  ('00000000-0000-4000-8000-000000000001', 'Orchard Paddock', 'Paddock', 8, 'occupied', 'Morning checks through north gate.'),
  ('00000000-0000-4000-8000-000000000001', 'Quiet Barn', 'Recovery barn', 4, 'available', 'Low-stress space for post-treatment residents.')
on conflict do nothing;

insert into public.animals (sanctuary_id, name, species, status, enclosure_name, intake_date, notes)
values
  ('00000000-0000-4000-8000-000000000001', 'Hazel', 'Goat', 'resident', 'Orchard Paddock', '2025-09-12', 'Prefers soaked feed.'),
  ('00000000-0000-4000-8000-000000000001', 'Marlow', 'Donkey', 'rehab', 'Quiet Barn', '2026-01-18', 'Hoof review due monthly.')
on conflict do nothing;

insert into public.care_tasks (sanctuary_id, title, category, assigned_to, due_at, status)
values
  ('00000000-0000-4000-8000-000000000001', 'Morning feed round', 'feeding', 'Care team', now() + interval '2 hours', 'open'),
  ('00000000-0000-4000-8000-000000000001', 'Check Quiet Barn bedding', 'cleaning', 'Volunteer lead', now() + interval '5 hours', 'open')
on conflict do nothing;

insert into public.inventory_items (sanctuary_id, name, category, quantity, unit, reorder_level)
values
  ('00000000-0000-4000-8000-000000000001', 'Goat mix', 'feed', 18, 'kg', 20),
  ('00000000-0000-4000-8000-000000000001', 'Disinfectant', 'cleaning', 6, 'litres', 3)
on conflict do nothing;
