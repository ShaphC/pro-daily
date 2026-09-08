alter table public.pro_user_settings
  add column if not exists billing_access_override boolean not null default false;

alter table public.pro_user_settings
  add column if not exists subscription_trial_end timestamptz;