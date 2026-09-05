create extension if not exists pgcrypto;

create table if not exists public.pro_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create table if not exists public.pro_priorities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day_id uuid not null references public.pro_days(id) on delete cascade,
  chain_id uuid not null default gen_random_uuid(),
  text text not null check (char_length(btrim(text)) between 1 and 500),
  completed boolean not null default false,
  position integer not null check (position >= 0 and position < 7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day_id, chain_id)
);

create table if not exists public.pro_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day_id uuid not null references public.pro_days(id) on delete cascade,
  chain_id uuid not null default gen_random_uuid(),
  text text not null check (char_length(btrim(text)) between 1 and 1000),
  completed boolean not null default false,
  position integer not null check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day_id, chain_id)
);

create table if not exists public.pro_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day_id uuid not null references public.pro_days(id) on delete cascade,
  content text not null default '',
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day_id, position)
);

create table if not exists public.pro_user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  theme text not null default 'system' check (theme in ('system', 'light', 'dark')),
  timezone text not null default 'UTC',
  email_reminders_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pro_days_user_date_idx on public.pro_days(user_id, date desc);
create index if not exists pro_priorities_day_position_idx on public.pro_priorities(day_id, position);
create index if not exists pro_priorities_chain_idx on public.pro_priorities(user_id, chain_id);
create index if not exists pro_tasks_day_position_idx on public.pro_tasks(day_id, position);
create index if not exists pro_tasks_chain_idx on public.pro_tasks(user_id, chain_id);
create index if not exists pro_notes_day_position_idx on public.pro_notes(day_id, position);

create or replace function public.pro_touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.pro_enforce_priority_limit()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  current_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.day_id::text, 0));

  select count(*) into current_count
  from public.pro_priorities
  where day_id = new.day_id;

  if current_count >= 7 then
    raise exception 'A day cannot contain more than 7 priorities' using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create or replace function public.pro_validate_child_owner()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  owner uuid;
begin
  select user_id into owner from public.pro_days where id = new.day_id;
  if owner is null or owner <> new.user_id then
    raise exception 'Child row owner must match day owner' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger pro_days_touch before update on public.pro_days for each row execute function public.pro_touch_updated_at();
create trigger pro_priorities_touch before update on public.pro_priorities for each row execute function public.pro_touch_updated_at();
create trigger pro_tasks_touch before update on public.pro_tasks for each row execute function public.pro_touch_updated_at();
create trigger pro_notes_touch before update on public.pro_notes for each row execute function public.pro_touch_updated_at();
create trigger pro_settings_touch before update on public.pro_user_settings for each row execute function public.pro_touch_updated_at();

create trigger pro_priorities_limit before insert on public.pro_priorities for each row execute function public.pro_enforce_priority_limit();
create trigger pro_priorities_owner before insert or update on public.pro_priorities for each row execute function public.pro_validate_child_owner();
create trigger pro_tasks_owner before insert or update on public.pro_tasks for each row execute function public.pro_validate_child_owner();
create trigger pro_notes_owner before insert or update on public.pro_notes for each row execute function public.pro_validate_child_owner();

alter table public.pro_days enable row level security;
alter table public.pro_priorities enable row level security;
alter table public.pro_tasks enable row level security;
alter table public.pro_notes enable row level security;
alter table public.pro_user_settings enable row level security;

create policy "pro_days_select_own" on public.pro_days for select using (auth.uid() = user_id);
create policy "pro_days_insert_own" on public.pro_days for insert with check (auth.uid() = user_id);
create policy "pro_days_update_own" on public.pro_days for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "pro_days_delete_own" on public.pro_days for delete using (auth.uid() = user_id);

create policy "pro_priorities_select_own" on public.pro_priorities for select using (auth.uid() = user_id);
create policy "pro_priorities_insert_own" on public.pro_priorities for insert with check (auth.uid() = user_id);
create policy "pro_priorities_update_own" on public.pro_priorities for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "pro_priorities_delete_own" on public.pro_priorities for delete using (auth.uid() = user_id);

create policy "pro_tasks_select_own" on public.pro_tasks for select using (auth.uid() = user_id);
create policy "pro_tasks_insert_own" on public.pro_tasks for insert with check (auth.uid() = user_id);
create policy "pro_tasks_update_own" on public.pro_tasks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "pro_tasks_delete_own" on public.pro_tasks for delete using (auth.uid() = user_id);

create policy "pro_notes_select_own" on public.pro_notes for select using (auth.uid() = user_id);
create policy "pro_notes_insert_own" on public.pro_notes for insert with check (auth.uid() = user_id);
create policy "pro_notes_update_own" on public.pro_notes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "pro_notes_delete_own" on public.pro_notes for delete using (auth.uid() = user_id);

create policy "pro_settings_select_own" on public.pro_user_settings for select using (auth.uid() = user_id);
create policy "pro_settings_insert_own" on public.pro_user_settings for insert with check (auth.uid() = user_id);
create policy "pro_settings_update_own" on public.pro_user_settings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "pro_settings_delete_own" on public.pro_user_settings for delete using (auth.uid() = user_id);

create or replace function public.pro_get_or_create_day(target_date date)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  result_day_id uuid;
  source_day_id uuid;
  was_inserted boolean := false;
begin
  if uid is null then
    raise exception 'Authentication required' using errcode = 'insufficient_privilege';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(uid::text || ':' || target_date::text, 0));

  select id into result_day_id from public.pro_days where user_id = uid and date = target_date;
  if result_day_id is not null then
    return result_day_id;
  end if;

  insert into public.pro_days(user_id, date)
  values (uid, target_date)
  returning id into result_day_id;
  was_inserted := true;

  if was_inserted then
    select id into source_day_id
    from public.pro_days
    where user_id = uid and date < target_date
    order by date desc
    limit 1;

    if source_day_id is not null then
      insert into public.pro_priorities(user_id, day_id, chain_id, text, completed, position)
      select uid, result_day_id, p.chain_id, p.text, false,
             row_number() over (order by p.position, p.created_at)::integer - 1
      from public.pro_priorities p
      where p.user_id = uid and p.day_id = source_day_id and p.completed = false
      order by p.position, p.created_at
      limit 7
      on conflict (user_id, day_id, chain_id) do nothing;

      insert into public.pro_tasks(user_id, day_id, chain_id, text, completed, position)
      select uid, result_day_id, t.chain_id, t.text, false,
             row_number() over (order by t.position, t.created_at)::integer - 1
      from public.pro_tasks t
      where t.user_id = uid and t.day_id = source_day_id and t.completed = false
      order by t.position, t.created_at
      on conflict (user_id, day_id, chain_id) do nothing;
    end if;
  end if;

  return result_day_id;
end;
$$;

grant execute on function public.pro_get_or_create_day(date) to authenticated;

create or replace function public.pro_set_priority_completed(priority_id uuid, is_completed boolean)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  target_chain uuid;
  target_date date;
begin
  select p.chain_id, d.date into target_chain, target_date
  from public.pro_priorities p
  join public.pro_days d on d.id = p.day_id
  where p.id = priority_id and p.user_id = uid;

  if target_chain is null then
    raise exception 'Priority not found' using errcode = 'no_data_found';
  end if;

  update public.pro_priorities
  set completed = is_completed
  where id = priority_id and user_id = uid;

  if is_completed then
    delete from public.pro_priorities p
    using public.pro_days d
    where p.day_id = d.id
      and p.user_id = uid
      and p.chain_id = target_chain
      and p.completed = false
      and d.date > target_date;

    with ranked as (
      select p.id, row_number() over (partition by p.day_id order by p.position, p.created_at)::integer - 1 as new_position
      from public.pro_priorities p
      join public.pro_days d on d.id = p.day_id
      where p.user_id = uid and d.date > target_date
    )
    update public.pro_priorities p
    set position = ranked.new_position
    from ranked
    where p.id = ranked.id and p.position <> ranked.new_position;
  end if;
end;
$$;

grant execute on function public.pro_set_priority_completed(uuid, boolean) to authenticated;
