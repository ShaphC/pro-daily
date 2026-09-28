alter table public.pro_user_settings
add column if not exists app_trial_started_at timestamptz,
add column if not exists app_trial_end timestamptz;

alter table public.pro_user_settings
add constraint pro_user_settings_app_trial_dates_check
check (
  app_trial_started_at is null
  or app_trial_end is null
  or app_trial_end > app_trial_started_at
);