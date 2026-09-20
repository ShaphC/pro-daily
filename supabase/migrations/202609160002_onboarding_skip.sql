alter table public.pro_onboarding
  add column if not exists skipped boolean not null default false;

create index if not exists pro_onboarding_status_idx
  on public.pro_onboarding(user_id, completed, skipped);