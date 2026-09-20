-- Execute este arquivo no SQL Editor do Supabase.
create extension if not exists "pgcrypto";

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  mode text not null check (mode in ('Online', 'Presencial')),
  appointment_date date not null,
  appointment_time time not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint appointments_unique_slot unique (appointment_date, appointment_time)
);

create index if not exists appointments_date_idx on public.appointments (appointment_date);
create index if not exists appointments_email_idx on public.appointments (lower(email));

alter table public.appointments enable row level security;

drop policy if exists "Public can create appointment requests" on public.appointments;
create policy "Public can create appointment requests"
  on public.appointments for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Staff can view appointments" on public.appointments;
create policy "Staff can view appointments"
  on public.appointments for select
  to authenticated
  using ((select auth.jwt() ->> 'role') = 'staff');

drop policy if exists "Staff can update appointments" on public.appointments;
create policy "Staff can update appointments"
  on public.appointments for update
  to authenticated
  using ((select auth.jwt() ->> 'role') = 'staff')
  with check ((select auth.jwt() ->> 'role') = 'staff');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at
before update on public.appointments
for each row execute procedure public.set_updated_at();