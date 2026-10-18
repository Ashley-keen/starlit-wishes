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