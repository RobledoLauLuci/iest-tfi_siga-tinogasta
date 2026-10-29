-- =====================================================================
-- SIGA · Artes visuales de Tinogasta — Esquema de base de datos (Supabase / Postgres)
-- Ejecutar completo en Supabase → SQL Editor → New query → Run.
-- Es seguro volver a ejecutarlo (usa IF NOT EXISTS / DROP POLICY IF EXISTS).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. TABLAS
-- ---------------------------------------------------------------------

-- Perfiles: uno por cuenta (se crea automáticamente al registrarse).
-- Los datos de contacto (whatsapp, email_public, redes) son PÚBLICOS: cada persona
-- decide si los completa. El correo de la cuenta vive en auth.users y es privado.
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null default '',
  artistic_name text not null default '',
  bio           text not null default '',
  specialty     text not null default '',
  techniques    text[] not null default '{}',
  avatar_url    text not null default '',
  whatsapp      text not null default '',
  email_public  text not null default '',
  instagram     text not null default '',
  facebook      text not null default '',
  role          text not null default 'artist' check (role in ('artist','admin')),
  is_public     boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists public.works (
  id          uuid primary key default gen_random_uuid(),
  artist_id   uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  description text not null default '',
  category    text not null default 'Pintura',
  technique   text not null default '',
  materials   text not null default '',
  dimensions  text not null default '',
  year        int,
  for_sale    boolean not null default false,
  price       numeric(12,2),
  currency    text not null default 'ARS',
  stock       int not null default 1 check (stock >= 0),
  status      text not null default 'disponible' check (status in ('disponible','vendida','no_disponible')),
  images      text[] not null default '{}',
  created_at  timestamptz not null default now()
);
create index if not exists works_artist_idx on public.works(artist_id);

create table if not exists public.workshops (
  id              uuid primary key default gen_random_uuid(),
  teacher_id      uuid not null references public.profiles(id) on delete cascade,
  name            text not null,
  description     text not null default '',
  techniques      text[] not null default '{}',
  audience        text[] not null default '{}',   -- ninos, adolescentes, adultos, mayores
  modality        text not null default 'Presencial',
  location        text not null default '',
  schedule        text not null default '',
  price           numeric(12,2),
  spots           int check (spots is null or spots >= 0),
  start_date      date,
  end_date        date,
  requirements    text not null default '',
  enrollment_info text not null default '',
  contact         text not null default '',
  created_at      timestamptz not null default now()
);
create index if not exists workshops_teacher_idx on public.workshops(teacher_id);

create table if not exists public.workshop_photos (
  id              uuid primary key default gen_random_uuid(),
  workshop_id     uuid not null references public.workshops(id) on delete cascade,
  owner_id        uuid not null references public.profiles(id) on delete cascade,
  url             text not null,
  caption         text not null default '',
  technique       text not null default '',
  taken_on        date,
  minors_consent  boolean not null default false,  -- autorización para fotos identificables de menores
  created_at      timestamptz not null default now()
);

create table if not exists public.events (
  id             uuid primary key default gen_random_uuid(),
  organizer_id   uuid not null references public.profiles(id) on delete cascade,
  title          text not null,
  type           text not null default 'Exposición',
  category       text not null default 'Artes visuales',
  description    text not null default '',
  event_date     date not null,
  event_time     text not null default '',
  place          text not null default '',
  organizer_name text not null default '',
  contact        text not null default '',
  flyer_url      text not null default '',
  images         text[] not null default '{}',
  created_at     timestamptz not null default now()
);
create index if not exists events_date_idx on public.events(event_date);

create table if not exists public.groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text not null default '',
  image_url   text not null default '',
  activities  text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id   uuid not null references public.groups(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

-- Consultas de compradores / interesados. to_user_id NULL = consulta institucional.
create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  to_user_id  uuid references public.profiles(id) on delete cascade,
  kind        text not null default 'general',     -- obra, taller, evento, artista, institucional
  work_id     uuid,
  workshop_id uuid,
  event_id    uuid,
  subject     text not null default '',
  name        text not null,
  email       text not null,
  phone       text not null default '',
  message     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('obra','taller','evento','perfil','foto')),
  target_id   uuid not null,
  target_title text not null default '',
  reason      text not null,
  details     text not null default '',
  status      text not null default 'abierta' check (status in ('abierta','resuelta','descartada')),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2. FUNCIONES Y TRIGGERS
-- ---------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Crea el perfil automáticamente cuando alguien se registra.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Evita que una persona se asigne el rol de administrador a sí misma.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Solo la administración puede cambiar roles.';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_role on public.profiles;
create trigger protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Estadísticas reales de la comunidad sin exponer datos privados.
create or replace function public.community_counts()
returns table (registered bigint, active_public bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from public.profiles),
    (select count(*) from public.profiles p
       where p.is_public
         and (exists (select 1 from public.works w where w.artist_id = p.id)
           or exists (select 1 from public.workshops s where s.teacher_id = p.id)
           or exists (select 1 from public.events e where e.organizer_id = p.id)));
$$;
grant execute on function public.community_counts() to anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. SEGURIDAD A NIVEL DE FILA (Row Level Security)
-- ---------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.works           enable row level security;
alter table public.workshops       enable row level security;
alter table public.workshop_photos enable row level security;
alter table public.events          enable row level security;
alter table public.groups          enable row level security;
alter table public.group_members   enable row level security;
alter table public.inquiries       enable row level security;
alter table public.reports         enable row level security;

-- PROFILES
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using (is_public or id = auth.uid() or public.is_admin());
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- WORKS
drop policy if exists "works_select" on public.works;
create policy "works_select" on public.works for select using (true);
drop policy if exists "works_insert" on public.works;
create policy "works_insert" on public.works for insert
  with check (artist_id = auth.uid() or public.is_admin());
drop policy if exists "works_update" on public.works;
create policy "works_update" on public.works for update
  using (artist_id = auth.uid() or public.is_admin())
  with check (artist_id = auth.uid() or public.is_admin());
drop policy if exists "works_delete" on public.works;
create policy "works_delete" on public.works for delete
  using (artist_id = auth.uid() or public.is_admin());

-- WORKSHOPS
drop policy if exists "workshops_select" on public.workshops;
create policy "workshops_select" on public.workshops for select using (true);
drop policy if exists "workshops_insert" on public.workshops;
create policy "workshops_insert" on public.workshops for insert
  with check (teacher_id = auth.uid() or public.is_admin());
drop policy if exists "workshops_update" on public.workshops;
create policy "workshops_update" on public.workshops for update
  using (teacher_id = auth.uid() or public.is_admin())
  with check (teacher_id = auth.uid() or public.is_admin());
drop policy if exists "workshops_delete" on public.workshops;
create policy "workshops_delete" on public.workshops for delete
  using (teacher_id = auth.uid() or public.is_admin());

-- WORKSHOP_PHOTOS
drop policy if exists "wphotos_select" on public.workshop_photos;
create policy "wphotos_select" on public.workshop_photos for select using (true);
drop policy if exists "wphotos_insert" on public.workshop_photos;
create policy "wphotos_insert" on public.workshop_photos for insert
  with check (
    (owner_id = auth.uid() or public.is_admin())
    and exists (select 1 from public.workshops w
                where w.id = workshop_id and (w.teacher_id = auth.uid() or public.is_admin()))
  );
drop policy if exists "wphotos_update" on public.workshop_photos;
create policy "wphotos_update" on public.workshop_photos for update
  using (owner_id = auth.uid() or public.is_admin());
drop policy if exists "wphotos_delete" on public.workshop_photos;
create policy "wphotos_delete" on public.workshop_photos for delete
  using (owner_id = auth.uid() or public.is_admin());

-- EVENTS
drop policy if exists "events_select" on public.events;
create policy "events_select" on public.events for select using (true);
drop policy if exists "events_insert" on public.events;
create policy "events_insert" on public.events for insert
  with check (organizer_id = auth.uid() or public.is_admin());
drop policy if exists "events_update" on public.events;
create policy "events_update" on public.events for update
  using (organizer_id = auth.uid() or public.is_admin())
  with check (organizer_id = auth.uid() or public.is_admin());
drop policy if exists "events_delete" on public.events;
create policy "events_delete" on public.events for delete
  using (organizer_id = auth.uid() or public.is_admin());

-- GROUPS (solo la administración gestiona los grupos)
drop policy if exists "groups_select" on public.groups;
create policy "groups_select" on public.groups for select using (true);
drop policy if exists "groups_admin_write" on public.groups;
create policy "groups_admin_write" on public.groups for all
  using (public.is_admin()) with check (public.is_admin());

-- GROUP_MEMBERS (cada artista entra y sale de sus propios grupos)
drop policy if exists "gm_select" on public.group_members;
create policy "gm_select" on public.group_members for select using (true);
drop policy if exists "gm_insert" on public.group_members;
create policy "gm_insert" on public.group_members for insert
  with check (user_id = auth.uid() or public.is_admin());
drop policy if exists "gm_delete" on public.group_members;
create policy "gm_delete" on public.group_members for delete
  using (user_id = auth.uid() or public.is_admin());

-- INQUIRIES: cualquiera puede enviar; solo la persona destinataria (o admin) puede leer.
drop policy if exists "inq_insert" on public.inquiries;
create policy "inq_insert" on public.inquiries for insert
  with check (
    char_length(message) between 5 and 2000
    and char_length(name) between 1 and 120
    and char_length(email) between 5 and 200
  );
drop policy if exists "inq_select" on public.inquiries;
create policy "inq_select" on public.inquiries for select
  using (to_user_id = auth.uid() or public.is_admin());
drop policy if exists "inq_update" on public.inquiries;
create policy "inq_update" on public.inquiries for update
  using (to_user_id = auth.uid() or public.is_admin());
drop policy if exists "inq_delete" on public.inquiries;
create policy "inq_delete" on public.inquiries for delete
  using (to_user_id = auth.uid() or public.is_admin());

-- REPORTS: cualquiera puede denunciar; solo la administración los ve y gestiona.
drop policy if exists "rep_insert" on public.reports;
create policy "rep_insert" on public.reports for insert with check (true);
drop policy if exists "rep_admin" on public.reports;
create policy "rep_admin" on public.reports for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 4. ALMACENAMIENTO DE IMÁGENES (Storage)
-- ---------------------------------------------------------------------
-- Bucket público de lectura. Cada persona solo escribe dentro de la carpeta con su propio id:
-- la ruta es  <user_id>/<carpeta>/<archivo>
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('siga-images', 'siga-images', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "siga_images_read" on storage.objects;
create policy "siga_images_read" on storage.objects for select
  using (bucket_id = 'siga-images');

drop policy if exists "siga_images_insert" on storage.objects;
create policy "siga_images_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'siga-images' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "siga_images_update" on storage.objects;
create policy "siga_images_update" on storage.objects for update to authenticated
  using (bucket_id = 'siga-images' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "siga_images_delete" on storage.objects;
create policy "siga_images_delete" on storage.objects for delete to authenticated
  using (
    bucket_id = 'siga-images'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

-- ---------------------------------------------------------------------
-- 5. DATOS INICIALES: grupos (son categorías editables, no estadísticas)
-- ---------------------------------------------------------------------
insert into public.groups (name, description) values
  ('Pintura y dibujo', 'Artistas que trabajan con pincel, lápiz, tinta y color sobre papel, tela o muro.'),
  ('Escultura y cerámica', 'Modelado, talla, cerámica y trabajo en volumen con distintos materiales.'),
  ('Fotografía y arte digital', 'Miradas con cámara y pantalla: fotografía, ilustración digital y nuevos medios.'),
  ('Artesanos y técnicas mixtas', 'Oficios y combinaciones de técnicas que mezclan tradición y experimentación.'),
  ('Docentes y talleristas', 'Quienes comparten su saber en talleres, clases y espacios de formación.'),
  ('Colectivos independientes', 'Grupos autogestionados que producen y exponen en conjunto.')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------
-- 6. CÓMO CREAR LA PRIMERA PERSONA ADMINISTRADORA
-- ---------------------------------------------------------------------
-- 1) Registrate normalmente en el sitio con tu correo.
-- 2) Ejecutá esto reemplazando el correo (una sola vez):
--
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'TU_CORREO@ejemplo.com');
