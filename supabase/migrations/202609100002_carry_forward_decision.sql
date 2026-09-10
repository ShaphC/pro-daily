alter table public.pro_days
  add column if not exists carry_forward_decided boolean not null default false;

-- Days that already existed before this feature was introduced
-- should not suddenly show the carry-forward dialog.
update public.pro_days
set carry_forward_decided = true
where carry_forward_decided = false;

create or replace function public.pro_mark_carry_forward_decided(
  target_day_id uuid
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Authentication required'
      using errcode = 'insufficient_privilege';
  end if;

  update public.pro_days
  set carry_forward_decided = true
  where id = target_day_id
    and user_id = uid;

  if not found then
    raise exception 'Day not found'
      using errcode = 'no_data_found';
  end if;
end;
$$;

grant execute on function public.pro_mark_carry_forward_decided(uuid)
to authenticated;