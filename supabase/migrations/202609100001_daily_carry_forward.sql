alter table public.pro_user_settings
  add column if not exists carry_forward_priorities boolean not null default true;

alter table public.pro_user_settings
  add column if not exists carry_forward_tasks boolean not null default true;

alter table public.pro_user_settings
  add column if not exists carry_forward_notes boolean not null default false;


create or replace function public.pro_get_or_create_day(target_date date)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  result_day_id uuid;
begin
  if uid is null then
    raise exception 'Authentication required' using errcode = 'insufficient_privilege';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(uid::text || ':' || target_date::text, 0)
  );

  select id
  into result_day_id
  from public.pro_days
  where user_id = uid
    and date = target_date;

  if result_day_id is not null then
    return result_day_id;
  end if;

  insert into public.pro_days(user_id, date)
  values (uid, target_date)
  returning id into result_day_id;

  return result_day_id;
end;
$$;

grant execute on function public.pro_get_or_create_day(date) to authenticated;


create or replace function public.pro_transfer_day_content(
  source_day_id uuid,
  target_day_id uuid,
  transfer_priorities boolean default true,
  transfer_tasks boolean default true,
  transfer_notes boolean default false
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  source_owner uuid;
  target_owner uuid;
  source_date date;
  target_date date;
begin
  if uid is null then
    raise exception 'Authentication required'
      using errcode = 'insufficient_privilege';
  end if;

  if source_day_id = target_day_id then
    raise exception 'Source and target days must be different'
      using errcode = 'check_violation';
  end if;

  select user_id, date
  into source_owner, source_date
  from public.pro_days
  where id = source_day_id;

  if source_owner is null or source_owner <> uid then
    raise exception 'Source day not found'
      using errcode = 'no_data_found';
  end if;

  select user_id, date
  into target_owner, target_date
  from public.pro_days
  where id = target_day_id;

  if target_owner is null or target_owner <> uid then
    raise exception 'Target day not found'
      using errcode = 'no_data_found';
  end if;

  if target_date <= source_date then
    raise exception 'Target day must be after source day'
      using errcode = 'check_violation';
  end if;

  if not transfer_priorities
     and not transfer_tasks
     and not transfer_notes then
    return;
  end if;

  if transfer_priorities then
    insert into public.pro_priorities(
      user_id,
      day_id,
      chain_id,
      text,
      completed,
      position
    )
    select
      uid,
      target_day_id,
      p.chain_id,
      p.text,
      false,
      row_number() over (
        order by p.position, p.created_at
      )::integer - 1
    from public.pro_priorities p
    where p.user_id = uid
      and p.day_id = source_day_id
      and p.completed = false
    order by p.position, p.created_at
    limit 7
    on conflict (user_id, day_id, chain_id) do nothing;
  end if;

  if transfer_tasks then
    insert into public.pro_tasks(
      user_id,
      day_id,
      chain_id,
      text,
      completed,
      position
    )
    select
      uid,
      target_day_id,
      t.chain_id,
      t.text,
      false,
      row_number() over (
        order by t.position, t.created_at
      )::integer - 1
    from public.pro_tasks t
    where t.user_id = uid
      and t.day_id = source_day_id
      and t.completed = false
    order by t.position, t.created_at
    on conflict (user_id, day_id, chain_id) do nothing;
  end if;

  if transfer_notes then
    insert into public.pro_notes(
      user_id,
      day_id,
      content,
      position
    )
    select
      uid,
      target_day_id,
      n.content,
      n.position
    from public.pro_notes n
    where n.user_id = uid
      and n.day_id = source_day_id
      and n.position = 0
      and btrim(n.content) <> ''
    on conflict (user_id, day_id, position)
    do update set
      content = excluded.content;
  end if;
end;
$$;

grant execute on function public.pro_transfer_day_content(
  uuid,
  uuid,
  boolean,
  boolean,
  boolean
) to authenticated;