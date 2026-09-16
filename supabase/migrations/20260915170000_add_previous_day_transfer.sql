create or replace function public.pro_transfer_previous_day_content(
  source_day_id uuid,
  target_day_id uuid,
  transfer_priorities boolean default true,
  transfer_tasks boolean default true,
  transfer_notes boolean default false,
  replace_existing boolean default false
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
  priority_offset integer := 0;
  task_offset integer := 0;
begin
  if uid is null then
    raise exception 'Authentication required'
      using errcode = 'insufficient_privilege';
  end if;

  if source_day_id = target_day_id then
    raise exception 'Source and target days must be different'
      using errcode = 'check_violation';
  end if;

  select
    user_id,
    date
  into
    source_owner,
    source_date
  from public.pro_days
  where id = source_day_id;

  if source_owner is null
     or source_owner <> uid then
    raise exception 'Source day not found'
      using errcode = 'no_data_found';
  end if;

  select
    user_id,
    date
  into
    target_owner,
    target_date
  from public.pro_days
  where id = target_day_id;

  if target_owner is null
     or target_owner <> uid then
    raise exception 'Target day not found'
      using errcode = 'no_data_found';
  end if;

  /*
   * Manual transfer is intentionally restricted to
   * the immediately previous calendar day.
   */
  if target_date <> source_date + 1 then
    raise exception 'Source day must be the immediately previous day'
      using errcode = 'check_violation';
  end if;

  if not transfer_priorities
     and not transfer_tasks
     and not transfer_notes then
    raise exception 'Select at least one item to transfer'
      using errcode = 'check_violation';
  end if;

  /*
   * Replacement only affects the categories selected
   * for transfer.
   */
  if replace_existing
     and transfer_priorities then
    delete from public.pro_priorities
    where user_id = uid
      and day_id = target_day_id;
  end if;

  if replace_existing
     and transfer_tasks then
    delete from public.pro_tasks
    where user_id = uid
      and day_id = target_day_id;
  end if;

  if replace_existing
     and transfer_notes then
    delete from public.pro_notes
    where user_id = uid
      and day_id = target_day_id
      and position = 0;
  end if;

  /*
   * PRIORITIES
   *
   * Only incomplete priorities are transferable.
   *
   * A priority cannot be duplicated when its chain_id
   * already exists on the target day.
   *
   * Maximum of 7 priorities is enforced here.
   */
  if transfer_priorities then
    select coalesce(
      max(position) + 1,
      0
    )
    into priority_offset
    from public.pro_priorities
    where user_id = uid
      and day_id = target_day_id;

    if priority_offset < 7 then
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
        source_rows.chain_id,
        source_rows.text,
        false,
        priority_offset
          + (
            row_number() over (
              order by
                source_rows.position,
                source_rows.created_at
            ) - 1
          )::integer
      from (
        select
          p.chain_id,
          p.text,
          p.position,
          p.created_at
        from public.pro_priorities p
        where p.user_id = uid
          and p.day_id = source_day_id
          and p.completed = false
          and not exists (
            select 1
            from public.pro_priorities existing
            where existing.user_id = uid
              and existing.day_id = target_day_id
              and existing.chain_id = p.chain_id
          )
        order by
          p.position,
          p.created_at
        limit 7 - priority_offset
      ) source_rows;
    end if;
  end if;

  /*
   * TASKS
   *
   * Only incomplete tasks are transferable.
   *
   * Existing chain_id values are not duplicated.
   */
  if transfer_tasks then
    select coalesce(
      max(position) + 1,
      0
    )
    into task_offset
    from public.pro_tasks
    where user_id = uid
      and day_id = target_day_id;

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
      source_rows.chain_id,
      source_rows.text,
      false,
      task_offset
        + (
          row_number() over (
            order by
              source_rows.position,
              source_rows.created_at
          ) - 1
        )::integer
    from (
      select
        t.chain_id,
        t.text,
        t.position,
        t.created_at
      from public.pro_tasks t
      where t.user_id = uid
        and t.day_id = source_day_id
        and t.completed = false
        and not exists (
          select 1
          from public.pro_tasks existing
          where existing.user_id = uid
            and existing.day_id = target_day_id
            and existing.chain_id = t.chain_id
        )
      order by
        t.position,
        t.created_at
    ) source_rows;
  end if;

  /*
   * NOTES
   *
   * Notes are a single position-0 record.
   * Keep existing means update the existing note with
   * the previous day's note.
   *
   * Since there can only be one note record at position 0,
   * transferring a note naturally replaces that note.
   */
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
      0
    from public.pro_notes n
    where n.user_id = uid
      and n.day_id = source_day_id
      and n.position = 0
      and btrim(n.content) <> ''
    on conflict (
      user_id,
      day_id,
      position
    )
    do update
      set content = excluded.content;
  end if;
end;
$$;

grant execute on function public.pro_transfer_previous_day_content(
  uuid,
  uuid,
  boolean,
  boolean,
  boolean,
  boolean
) to authenticated;