begin;

select plan(7);

select has_table('public', 'sanctuaries', 'sanctuaries table exists');
select has_table('public', 'sanctuary_members', 'sanctuary_members table exists');
select has_table('public', 'animals', 'animals table exists');
select policies_are('public', 'animals', array['members read animals', 'care and clinical roles manage animals']);
select policies_are('public', 'donations', array['fundraising roles read donations', 'fundraising roles manage donations']);
select policies_are('public', 'documents', array['members read documents', 'admins manage documents']);
select policies_are('public', 'activity_logs', array['members read activity logs', 'members create activity logs']);

select * from finish();
rollback;
