-- 1. Create Integrations Table (for storing LINE and Email configs)
create table if not exists integrations (
  id uuid default gen_random_uuid() primary key,
  provider text not null, -- 'line', 'email_gas'
  config jsonb not null default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(provider)
);

-- Enable RLS for integrations
alter table integrations enable row level security;

-- Policies for integrations
drop policy if exists "Enable read access for authenticated users" on integrations;
create policy "Enable read access for authenticated users" on integrations for select using (auth.role() = 'authenticated');

drop policy if exists "Enable insert access for authenticated users" on integrations;
create policy "Enable insert access for authenticated users" on integrations for insert with check (auth.role() = 'authenticated');

drop policy if exists "Enable update access for authenticated users" on integrations;
create policy "Enable update access for authenticated users" on integrations for update using (auth.role() = 'authenticated');

-- 2. Add line_user_id to customers table (for LINE Integration)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'customers' and column_name = 'line_user_id') then
    alter table customers add column line_user_id text;
  end if;
end $$;
