create table lists (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null default auth.uid() references auth.users(id),
    name text not null,
    created_at timestamptz not null default now ()
);

create table wishes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null default auth.uid() references auth.users(id),
    list_id uuid not null references lists(id) on delete cascade,
    name text not null,
    url text,
    price numeric(10,2),
    category text ,
    hearts int not null default 2 check (hearts between 1 and 3),
    got boolean not null default false,
    created_at timestamptz not null default now()
);

alter table lists enable row level security;
alter table wishes enable row level security;

create policy "Users manage their own lists" on lists for all
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own wishes" on wishes for all
    using (auth.uid() = user_id) with check (auth.uid() = user_id);






alter table lists add column share_id uuid unique;

create or replace function get_shared_list(p_share_id uuid)
returns json
language sql
security definer
set search_path = public
as $$
    select json_build_object(
        'name', l.name,
        'wishes', coalesce((
            select json_agg(json_build_object(
                'id', w.id, 'name', w.name, 'url', w.url, 'price', w.price,
                'category', w.category, 'hearts', w.hearts, 'got', w.got
            ) order by w.created_at desc)
            from wishes w where w.list_id = l.id
        ), '[]'::json)
    )
    from lists l
    where l.share_id = p_share_id;
$$;

grant execute on function get_shared_list(uuid) to anon, authenticated;


alter table wishes add column image text;

-- 1. every list gets a secret invite code
alter table lists add column invite_code uuid unique default gen_random_uuid();
-- 2. who has joined which list
create table list_members (
 list_id uuid not null references lists(id) on delete cascade,
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 email text,
 created_at timestamptz not null default now(),
 primary key (list_id, user_id)
);
alter table list_members enable row level security;
-- 3. helper: are you the owner or a member of this list?
create or replace function is_list_member(p_list_id uuid)
returns boolean
language sql security definer stable
set search_path = public
as $$
 select exists (select 1 from lists where id = p_list_id and user_id = auth.uid())
 or exists (select 1 from list_members
 where list_id = p_list_id and user_id = auth.uid());
$$;
-- 4. members can see lists they've joined (owners keep their old policy)
create policy "Members can view joined lists" on lists for select
 using (is_list_member(id));
-- 5. owners and members can manage the wishes on a list
drop policy "Users manage their own wishes" on wishes;
create policy "List members manage wishes" on wishes for all
 using (is_list_member(list_id)) with check (is_list_member(list_id));
-- 6. see who's in your lists; owner can remove anyone, you can remove yourself
create policy "See members of your lists" on list_members for select
 using (is_list_member(list_id));
create policy "Owner removes members or you leave" on list_members for delete
 using (user_id = auth.uid()
 or exists (select 1 from lists where id = list_id and user_id = auth.uid()));
-- 7. the only way to join: a valid invite code
create or replace function join_list(p_code uuid)
returns uuid
language plpgsql security definer
set search_path = public
as $$
declare v_list uuid;
begin
 if auth.uid() is null then raise exception 'Not logged in'; end if;
 select id into v_list from lists where invite_code = p_code;
 if v_list is null then raise exception 'Invite not found'; end if;
 insert into list_members (list_id, user_id, email)
 values (v_list, auth.uid(), auth.jwt() ->> 'email')
 on conflict do nothing;
 return v_list;
end;
$$;
grant execute on function is_list_member(uuid) to authenticated;
grant execute on function join_list(uuid) to authenticated;