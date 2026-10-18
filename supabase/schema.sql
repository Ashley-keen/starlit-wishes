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