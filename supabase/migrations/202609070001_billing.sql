alter table public.pro_user_settings
  add column if not exists stripe_customer_id text;

alter table public.pro_user_settings
  add column if not exists subscription_id text;

alter table public.pro_user_settings
  add column if not exists subscription_status text;

alter table public.pro_user_settings
  add column if not exists subscription_plan text;

alter table public.pro_user_settings
  add column if not exists subscription_current_period_end timestamptz;

create unique index if not exists pro_user_settings_stripe_customer_id_idx
  on public.pro_user_settings (stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists pro_user_settings_subscription_id_idx
  on public.pro_user_settings (subscription_id)
  where subscription_id is not null;