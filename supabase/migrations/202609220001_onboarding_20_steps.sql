alter table public.pro_onboarding
  drop constraint if exists pro_onboarding_current_step_check;

alter table public.pro_onboarding
  add constraint pro_onboarding_current_step_check
  check (current_step between 1 and 20);