-- Borhan_SK Portfolio database
-- Run once in Supabase Dashboard -> SQL Editor.
-- Uses only the browser-safe publishable key together with strict RLS.
-- Never put a secret/service_role key in the website.


-- A private allow-list. Create the owner user in Supabase Auth first,
-- then insert that user's UUID into this table using the SQL Editor.
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role = 'owner'),
  created_at timestamptz not null default now()
);

create or replace function public.is_site_owner()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.site_admins
    where user_id = (select auth.uid()) and role = 'owner'
  );
$$;
revoke all on function public.is_site_owner() from public;
grant execute on function public.is_site_owner() to anon, authenticated;

create table if not exists public.site_profile (
  id boolean primary key default true check (id = true),
  headline_fa text not null default '',
  headline_en text not null default '',
  bio_fa text not null default '',
  bio_en text not null default '',
  location_fa text not null default 'ایران · همکاری آنلاین',
  location_en text not null default 'Iran · Remote collaboration',
  focus_fa text not null default 'پروژه‌های وب و اتوماسیون',
  focus_en text not null default 'Web products & automation',
  skills_fa text not null default 'Python, Flask, JavaScript, HTML / CSS, Supabase, REST API, Git / GitHub, Automation',
  skills_en text not null default 'Python, Flask, JavaScript, HTML / CSS, Supabase, REST API, Git / GitHub, Automation',
  telegram_url text not null default '',
  linkedin_url text not null default '',
  github_url text not null default '',
  email text not null default '',
  resume_url text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.site_profile add column if not exists skills_fa text not null default 'Python, Flask, JavaScript, HTML / CSS, Supabase, REST API, Git / GitHub, Automation';
alter table public.site_profile add column if not exists skills_en text not null default 'Python, Flask, JavaScript, HTML / CSS, Supabase, REST API, Git / GitHub, Automation';
insert into public.site_profile (id) values (true) on conflict (id) do nothing;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title_fa text not null,
  title_en text not null,
  description_fa text not null,
  description_en text not null,
  icon text not null default '✦',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title_fa text not null,
  title_en text not null,
  summary_fa text not null,
  summary_en text not null,
  description_fa text not null default '',
  description_en text not null default '',
  category text not null default 'PROJECT',
  stack text[] not null default '{}',
  icon text not null default '✦',
  cover_url text not null default '',
  project_url text not null default '',
  repo_url text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique,
  client_name text not null check (char_length(client_name) between 2 and 100),
  email text not null check (char_length(email) between 5 and 160),
  telegram text not null default '',
  service_key text not null,
  budget_key text not null default 'unspecified',
  deadline_key text not null default 'flexible',
  title text not null check (char_length(title) between 3 and 140),
  description text not null check (char_length(description) between 20 and 5000),
  locale text not null default 'fa' check (locale in ('fa','en')),
  attachment_path text,
  status text not null default 'new' check (status in ('new','reviewing','quoted','in_progress','delivered','closed','cancelled')),
  quote text,
  admin_note text,
  delivery_message text,
  delivery_url text,
  delivery_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  kind text not null check (kind in ('review','suggestion','criticism')),
  message text not null check (char_length(message) between 8 and 1200),
  locale text not null default 'fa' check (locale in ('fa','en')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 5 and 160),
  subject text not null check (char_length(subject) between 2 and 160),
  message text not null check (char_length(message) between 10 and 3000),
  locale text not null default 'fa' check (locale in ('fa','en')),
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  owner_reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS is mandatory for every table exposed through the Data API.
alter table public.site_admins enable row level security;
alter table public.site_profile enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.orders enable row level security;
alter table public.feedback enable row level security;
alter table public.contact_messages enable row level security;

-- Re-runnable policy setup.
drop policy if exists "Owner can read own admin row" on public.site_admins;
create policy "Owner can read own admin row" on public.site_admins
for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Public can read site profile" on public.site_profile;
create policy "Public can read site profile" on public.site_profile
for select to anon, authenticated using (true);
drop policy if exists "Owner manages site profile" on public.site_profile;
create policy "Owner manages site profile" on public.site_profile
for all to authenticated using (public.is_site_owner()) with check (public.is_site_owner());

drop policy if exists "Public reads published services" on public.services;
create policy "Public reads published services" on public.services
for select to anon, authenticated using (is_published = true);
drop policy if exists "Owner manages services" on public.services;
create policy "Owner manages services" on public.services
for all to authenticated using (public.is_site_owner()) with check (public.is_site_owner());

drop policy if exists "Public reads published projects" on public.projects;
create policy "Public reads published projects" on public.projects
for select to anon, authenticated using (is_published = true);
drop policy if exists "Owner manages projects" on public.projects;
create policy "Owner manages projects" on public.projects
for all to authenticated using (public.is_site_owner()) with check (public.is_site_owner());

drop policy if exists "Public can submit orders" on public.orders;
create policy "Public can submit orders" on public.orders
for insert to anon, authenticated
with check (
  status = 'new' and quote is null and admin_note is null and
  delivery_message is null and delivery_url is null and delivery_path is null
);
drop policy if exists "Owner reads orders" on public.orders;
create policy "Owner reads orders" on public.orders
for select to authenticated using (public.is_site_owner());
drop policy if exists "Owner updates orders" on public.orders;
create policy "Owner updates orders" on public.orders
for update to authenticated using (public.is_site_owner()) with check (public.is_site_owner());
drop policy if exists "Owner deletes orders" on public.orders;
create policy "Owner deletes orders" on public.orders
for delete to authenticated using (public.is_site_owner());

drop policy if exists "Public can submit feedback" on public.feedback;
create policy "Public can submit feedback" on public.feedback
for insert to anon, authenticated with check (status = 'pending');
drop policy if exists "Public reads approved feedback" on public.feedback;
create policy "Public reads approved feedback" on public.feedback
for select to anon, authenticated using (status = 'approved');
drop policy if exists "Owner manages feedback" on public.feedback;
create policy "Owner manages feedback" on public.feedback
for all to authenticated using (public.is_site_owner()) with check (public.is_site_owner());

drop policy if exists "Public can send contact messages" on public.contact_messages;
create policy "Public can send contact messages" on public.contact_messages
for insert to anon, authenticated with check (status = 'new' and owner_reply is null);
drop policy if exists "Owner reads contact messages" on public.contact_messages;
create policy "Owner reads contact messages" on public.contact_messages
for select to authenticated using (public.is_site_owner());
drop policy if exists "Owner updates contact messages" on public.contact_messages;
create policy "Owner updates contact messages" on public.contact_messages
for update to authenticated using (public.is_site_owner()) with check (public.is_site_owner());
drop policy if exists "Owner deletes contact messages" on public.contact_messages;
create policy "Owner deletes contact messages" on public.contact_messages
for delete to authenticated using (public.is_site_owner());

-- Least-privilege table grants.
revoke all on public.site_admins, public.site_profile, public.services, public.projects,
  public.orders, public.feedback, public.contact_messages from anon, authenticated;
grant select on public.site_profile, public.services, public.projects, public.feedback to anon, authenticated;
grant insert on public.orders, public.feedback, public.contact_messages to anon, authenticated;
grant select on public.site_admins to authenticated;
grant select, insert, update, delete on public.site_profile, public.services, public.projects,
  public.orders, public.feedback, public.contact_messages to authenticated;

-- Private storage buckets. Customer attachments are private; only the owner can read them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('client-uploads','client-uploads',false,12582912,
   array['application/pdf','image/png','image/jpeg','image/webp','application/zip','application/x-zip-compressed','text/plain','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('owner-deliveries','owner-deliveries',false,52428800,
   array['application/pdf','image/png','image/jpeg','image/webp','application/zip','application/x-zip-compressed','text/plain','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

drop policy if exists "Visitors upload incoming attachments" on storage.objects;
create policy "Visitors upload incoming attachments" on storage.objects
for insert to anon, authenticated
with check (bucket_id = 'client-uploads' and (storage.foldername(name))[1] = 'incoming');
drop policy if exists "Owner reads customer attachments" on storage.objects;
create policy "Owner reads customer attachments" on storage.objects
for select to authenticated using (bucket_id = 'client-uploads' and public.is_site_owner());
drop policy if exists "Owner deletes customer attachments" on storage.objects;
create policy "Owner deletes customer attachments" on storage.objects
for delete to authenticated using (bucket_id = 'client-uploads' and public.is_site_owner());
drop policy if exists "Owner manages delivery files" on storage.objects;
create policy "Owner manages delivery files" on storage.objects
for all to authenticated using (bucket_id = 'owner-deliveries' and public.is_site_owner())
with check (bucket_id = 'owner-deliveries' and public.is_site_owner());

-- Optional starter services. Remove these rows or edit them from the owner dashboard.
insert into public.services (title_fa,title_en,description_fa,description_en,icon,sort_order,is_published)
select * from (values
  ('ربات و ابزار تلگرام','Telegram bots & tools','ربات‌های کاربردی، پنل مدیریت، گردش‌کار و اتصال به سرویس‌های دیگر.','Useful bots, admin panels, workflows, and integrations with other services.','⌘',1,true),
  ('اتوماسیون با پایتون','Python automation','حذف کارهای تکراری، پردازش داده و ساخت ابزارهای اختصاصی.','Eliminate repetitive work, process data, and build tailored utilities.','⚡',2,true),
  ('وب‌سایت و داشبورد','Websites & dashboards','وب‌سایت‌های واکنش‌گرا، پنل‌های مدیریتی و رابط‌های کاربری.','Responsive websites, management panels, and polished user interfaces.','▣',3,true),
  ('API و دیتابیس','APIs & databases','اتصال سرویس‌ها، طراحی ساختار داده و یکپارچه‌سازی سیستم‌ها.','Service integrations, data modeling, and system connections.','⌁',4,true)
) as v(title_fa,title_en,description_fa,description_en,icon,sort_order,is_published)
where not exists (select 1 from public.services);

-- After creating the owner user in Authentication -> Users, run this once with their UUID:
-- insert into public.site_admins (user_id, role) values ('YOUR_AUTH_USER_UUID', 'owner');

-- Basic anti-spam cooldown per email/name. This is a lightweight safeguard,
-- not a substitute for CAPTCHA or an edge rate limiter against distributed abuse.
create table if not exists public._submission_throttle (
  id bigserial primary key,
  action_key text not null,
  identity_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists submission_throttle_lookup_idx
  on public._submission_throttle(action_key, identity_hash, created_at desc);
alter table public._submission_throttle enable row level security;
revoke all on public._submission_throttle from public, anon, authenticated;

create or replace function public.check_public_submission_cooldown()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  raw_identity text;
  hashed_identity text;
  action_name text := TG_TABLE_NAME;
begin
  raw_identity := lower(trim(coalesce(to_jsonb(NEW)->>TG_ARGV[0], '')));
  if length(raw_identity) < 3 then
    raise exception 'Please provide a valid contact identity.';
  end if;
  hashed_identity := md5(action_name || ':' || raw_identity);
  if exists (
    select 1 from public._submission_throttle
    where action_key = action_name
      and identity_hash = hashed_identity
      and created_at > now() - interval '45 seconds'
  ) then
    raise exception 'Please wait before submitting another message.';
  end if;
  insert into public._submission_throttle(action_key, identity_hash)
  values (action_name, hashed_identity);
  delete from public._submission_throttle where created_at < now() - interval '7 days';
  return NEW;
end;
$$;
revoke all on function public.check_public_submission_cooldown() from public, anon, authenticated;

drop trigger if exists orders_submission_cooldown on public.orders;
create trigger orders_submission_cooldown before insert on public.orders
for each row execute function public.check_public_submission_cooldown('email');
drop trigger if exists contact_submission_cooldown on public.contact_messages;
create trigger contact_submission_cooldown before insert on public.contact_messages
for each row execute function public.check_public_submission_cooldown('email');
drop trigger if exists feedback_submission_cooldown on public.feedback;
create trigger feedback_submission_cooldown before insert on public.feedback
for each row execute function public.check_public_submission_cooldown('name');
