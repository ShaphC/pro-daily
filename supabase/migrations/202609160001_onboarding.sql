create table if not exists public.pro_onboarding (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  current_step integer not null default 1 check (current_step between 1 and 19),
  completed boolean not null default false,
  name text,
  task_habits text,
  help_goals jsonb not null default '[]'::jsonb,
  additional_questions text,
  commitment text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pro_onboarding_user_idx
  on public.pro_onboarding(user_id);

create or replace function public.pro_touch_onboarding_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pro_onboarding_touch
before update on public.pro_onboarding
for each row
execute function public.pro_touch_onboarding_updated_at();

alter table public.pro_onboarding enable row level security;

create policy "pro_onboarding_select_own"
on public.pro_onboarding
for select
using (auth.uid() = user_id);

create policy "pro_onboarding_insert_own"
on public.pro_onboarding
for insert
with check (auth.uid() = user_id);

create policy "pro_onboarding_update_own"
on public.pro_onboarding
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "pro_onboarding_delete_own"
on public.pro_onboarding
for delete
using (auth.uid() = user_id);